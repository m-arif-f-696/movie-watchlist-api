
import { db } from "../../config/db";
import { ConflictError, NotFoundError } from "../../errors/custom.error";
import { MovieService } from "../movie/movie.service";
import { WatchListCreateRequest, WatchListCreateResponse, WatchListDeleteParams, WatchListDeleteResponse, WatchListResponse } from "./watchlist.model";
import {Logger} from "pino"

export class WatchlistService{
    public static async getWatchlist(userId: Number, log: Logger) : Promise<WatchListResponse>
    {
        const movieWatchList = await db.watchlist.findMany({
            where: {
                userId: Number(userId),
            },
            include: {
                movie : true
            }
        })

        if(movieWatchList.length < 1) throw new NotFoundError(`Your watchlist is empty`)    

        log.debug('Success Get Watchlist')
        return movieWatchList.map(item => ({
            id: item.id,
            movie_id: item.movieId,
            created_at: item.createdAt.toISOString(),
            movie: MovieService.formatMovie(item.movie)
        }));
    }
    public static async createWatchlist(userId: Number, body: WatchListCreateRequest, log: Logger ) : Promise<WatchListCreateResponse>
    {
        // check movie exist
        log.debug(`Check movie exist for user ${userId} and movie id ${body.movieId}`)
        await MovieService.getMovieById({ id: body.movieId }, log);
        
        // check watchlist duplicate
        log.debug(`Check watchlist duplicate for user ${userId} and movie id ${body.movieId}`)

        const existingWatchlist = await db.watchlist.findUnique({
            where: {
                userId_movieId: {
                    userId: Number(userId),
                    movieId: Number(body.movieId)
                }
            }
        })
        if (existingWatchlist) throw new ConflictError("Movie already exists in watchlist")

        const movieWatchList = await db.watchlist.create({
            data: {
                userId: Number(userId),
                movieId: Number(body.movieId)
            }
        })
        log.debug(`Success Create Watchlist for user ${userId} and movie id ${body.movieId}`)

        return {
            id: movieWatchList.id,
            movie_id: movieWatchList.movieId,
            created_at: movieWatchList.createdAt.toISOString(),
        };
    }
    public static async deleteWatchlist(userId: Number, params: WatchListDeleteParams, log: Logger ) : Promise<WatchListDeleteResponse>
    {
        //chekck movie exist
        log.debug(`Check movie exist for user ${userId} and movie id ${params.movieId}`)
        await MovieService.getMovieById({ id: params.movieId }, log);


        //check watchlist if not exist
        log.debug(`Check watchlist for user ${userId} and movie id ${params.movieId}`)
        const existingWatchlist = await db.watchlist.findUnique({
            where: {
                userId_movieId: {
                    userId: Number(userId),
                    movieId: Number(params.movieId)
                }
            }
        })
        if (!existingWatchlist) throw new NotFoundError("Watchlist not found")
        

        await db.watchlist.delete({
            where: {
                userId_movieId : {
                    userId: Number(userId),
                    movieId: Number(params.movieId)
                }
            }
        })

        return {
            message: "Success Delete Watchlist"
        };
    }
}