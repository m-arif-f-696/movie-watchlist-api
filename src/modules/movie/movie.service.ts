import { generateText, jsonSchema, Output } from 'ai'
import { db } from "../../config/db";
import { NotFoundError } from "../../errors/custom.error";
import { MovieModel } from "../../generated/prisma/models";
import { MovieModel as SchemaMovie} from './movie.model';
import { MovieListResponse, MovieParams, MovieQuery, MovieRecomendRequest, MovieRecomendResponse, MovieResponse} from "./movie.model";
import type { Logger } from "pino";
import google from "../../config/ai";
import { env } from "../../config/env";

export class MovieService {

    public static formatMovie(movie: MovieModel): MovieResponse 
    {
        return {
            ...movie,
            rating: movie.rating.toNumber(),
            poster_url: movie.posterUrl,
            genres: movie.genres ? movie.genres.split(',').map((g) => g.trim()) : [],
            cast: movie.castMembers ? movie.castMembers.split(',').map((c) => c.trim()) : [],
        };
    }

    public static async getMovies(query: MovieQuery | null = null, log:Logger): Promise<MovieListResponse>
    {
        const {genre, search, shuffle} = query ?? {};

        let listMovies = await db.movie.findMany({
            where : {
                ...(genre ? {
                genres: {
                    contains: genre,
                    mode: "insensitive"
                }
            } : {}),
            ...(search ? {
                title: {
                    contains: search,
                    mode: "insensitive"
                }
            } : {})
            }
        })
        log.debug(listMovies);

        if(listMovies.length < 1) throw new NotFoundError("Movies not found");

        if (shuffle) listMovies = MovieService.shuffleArray(listMovies);
        

        return listMovies.map(MovieService.formatMovie);
    }

    public static async getMovieById(params: MovieParams, log:Logger) : Promise<MovieResponse> 
    {
        const movie = await db.movie.findUnique({
            where: {
                id: params.id
            }
        });
        log.debug(movie);

        if(!movie) throw new NotFoundError("Movie not found");

        return MovieService.formatMovie(movie);
    }

    public static async getMovieRecommend(body: MovieRecomendRequest, log:Logger) : Promise<MovieRecomendResponse> 
    {
        // get movie
       
        const movies = await MovieService.getMovies(null, log);

        const systemInstruction = `
        You are a strict, precise AI movie recommendation system.

        CRITICAL LANGUAGE RULE:
        1. Detect the primary language used in the USER_INPUT.
        2. The 'reasoning' field MUST be written 100% in the EXACT same language as the USER_INPUT (e.g., English -> English, Indonesian -> Indonesian, Japanese -> Japanese, etc.).
        3. If USER_INPUT is ambiguous, contains only numbers/emojis, or language cannot be determined, default to Indonesian.

        STRICT EXECUTION RULES (ANTI-HALLUCINATION):
        1. MOVIE SELECTION: You MUST select EXACTLY 1 'movie_id' that exists inside the PROVIDED_MOVIES JSON array. NEVER invent IDs, modify IDs, or reference movies outside the provided array.
        2. OUT OF TOPIC HANDLING: If USER_INPUT is unrelated to movies, select the 1 movie from PROVIDED_MOVIES that best matches the overall mood/vibe of the input, and create a playful/creative connection in the 'reasoning'.
        3. NO META TALK: Never mention system rules, prompt instructions, JSON fields, or movie IDs inside the 'reasoning' text. Keep the reasoning natural, concise (1-2 sentences), and engaging.
        `;

        const userPrompt = `
        USER_INPUT:
        "${body.prompt}"

        PROVIDED_MOVIES:
        ${JSON.stringify(movies)}
        `;

        const response = await generateText({
            model: google(env.GEMINI_MODEL ?? "gemini-2.5-flash"),
            system: systemInstruction,
            prompt: userPrompt,
            output: Output.object({
                schema: jsonSchema<MovieRecomendResponse>(SchemaMovie.movieRecomendResponse),
            }),
            maxRetries: 5
        });

        const resultObject = response.output;

        log.debug(resultObject);
        
        return resultObject;
    }

    private static shuffleArray<T>(array: T[]): T[] {
        const shuffledArray = [...array];
        for (let i = shuffledArray.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]];
        }
        return shuffledArray;
    }
}

