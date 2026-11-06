import { t } from "elysia";
import { movieModel } from "../movie/movie.model";

export const watchedWithMovie = t.Object({
    id: t.Number(),
    rating: t.Number(),
    review: t.String(),
    created_at: t.String({format: "date-time" }),
    movie: movieModel
})

export const WatchedModel = {
    watchedListRespones: t.Array(watchedWithMovie),
    watchedCreateRequest: t.Object({
        movieId: t.Number({ examples: [1] }),
        rating: t.Number({ examples: [5], minimum: 1, maximum: 5 }),
        review: t.String({ examples: ["The movie was great!"] }),
    }),
    
    watchedCreateResponse: t.Object({
        id: t.Number(),
        movieId: t.Number(),
        rating: t.Number(),
        review: t.String(),
        created_at: t.String({ format: "date-time" }),
    })
};

export type WatchedListResponse = typeof WatchedModel.watchedListRespones.static;
export type WatchedCreateRequest = typeof WatchedModel.watchedCreateRequest.static;
export type WatchedCreateResponse = typeof WatchedModel.watchedCreateResponse.static;