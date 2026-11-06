import { t } from "elysia";
import { movieModel } from "../movie/movie.model";

export const watchlistItem = t.Object({
    id: t.Number(),
    movie_id: t.Number(),
    created_at: t.String({ format: "date-time" }),
    movie: movieModel
})

export const WatchlistModel = {
    watchlistResponse: t.Array(watchlistItem),

    watchlistCreateRequest: t.Object({
        movieId: t.Number({ examples: [1] })
    }),

    watchlistCreateResponse: t.Object({
        id: t.Number(),
        movie_id: t.Number(),
        created_at: t.String({ format: "date-time" })
    }),

    watchlistDeleteParams: t.Object({
        movieId: t.Numeric()
    }),

    watchlistDeleteResponse: t.Object({
        message: t.String({ examples: ["Watchlist deleted successfully"] })
    })
};

export type WatchListResponse = typeof WatchlistModel.watchlistResponse.static;
export type WatchListCreateRequest = typeof WatchlistModel.watchlistCreateRequest.static;
export type WatchListCreateResponse = typeof WatchlistModel.watchlistCreateResponse.static;
export type WatchListDeleteParams = typeof WatchlistModel.watchlistDeleteParams.static;
export type WatchListDeleteResponse = typeof WatchlistModel.watchlistDeleteResponse.static;