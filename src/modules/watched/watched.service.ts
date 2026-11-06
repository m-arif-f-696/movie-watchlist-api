import { db } from "../../config/db";
import { ConflictError, NotFoundError } from "../../errors/custom.error";
import { MovieService } from "../movie/movie.service";
import { WatchedCreateRequest, WatchedCreateResponse, WatchedListResponse } from "./watched.model";
import { Logger } from "pino";


export class WatchedService {
    public static async getWatchedList (userId: Number, log: Logger): Promise<WatchedListResponse>
    {
        const watchedList = await db.review.findMany({
            where: {
                userId: Number(userId)
            },
            include: {
                movie: true
            }
        });

        if (watchedList.length === 0) throw new NotFoundError("Watched list is empty");
        
        log.info("Watched list fetched successfully");
        return watchedList.map((watched) =>({
            id: watched.id,
            rating: watched.rating,
            review: watched.review,
            created_at: watched.createdAt.toISOString(),
            movie: MovieService.formatMovie(watched.movie)
        }));
    }

    public static async addToWatchedList (userId: Number, body: WatchedCreateRequest , log: Logger): Promise<WatchedCreateResponse>
    {
        const {movieId,rating,review} = body

        // check movie exist
        log.debug(`Check movie exist for user ${userId} and movie id ${movieId}`)
        await MovieService.getMovieById({ id: movieId }, log);

        // check if movie is already in watched list
        log.debug(`Check watched list for user ${userId} and movie id ${movieId}`)
        const watchedExist = await db.review.findFirst({
            where: {
                userId: Number(userId),
                movieId: Number(movieId)
            }
        });

        if (watchedExist) throw new ConflictError("Movie is already in watched list");

        // add movie to watched list
        const watched = await db.review.create({
            data: {
                userId: Number(userId),
                movieId: Number(movieId),
                rating: Number(rating),
                review: review
            }
        });

        log.info("Watched list added successfully");
        return {
            id: watched.id,
            movieId: watched.movieId,
            rating: watched.rating,
            review: watched.review,
            created_at: watched.createdAt.toISOString(),
        };
    }
}