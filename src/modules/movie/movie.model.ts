import { t } from "elysia";

export const movieModel = t.Object({
    id: t.Number(),
    title: t.String(),
    year: t.Number(),
    director: t.String(),
    genres: t.Array(t.String()),
    rating: t.Number(),
    duration: t.String(),
    synopsis: t.String(),
    poster_url: t.String(),
    cast: t.Array(t.String())
})

export const MovieModel = {
    movieQuery: t.Object({
        genre: t.Optional(t.String({ examples: "Sci-Fi" })),
        search: t.Optional(t.String({ examples: "Inception" }))
    }),
    movieParams: t.Object({
        id: t.Integer({ examples: 1 })
    }),
    movieResponse: movieModel,
    movieListResponse: t.Array(movieModel),

    movieRecomendRequest: t.Object({
        prompt: t.String({ examples: "I want watch a movie that is romantic and have a good ending" })
    }),

    movieRecomendResponse: t.Object({
        movie_id: t.Number({ examples: 1 }),
        reasoning: t.String({ examples: "Because you liked Interstellar and The Martian, you might like this movie." }),
    })
};

export type MovieListResponse = typeof MovieModel.movieListResponse.static;
export type MovieResponse = typeof MovieModel.movieResponse.static;
export type MovieQuery = typeof MovieModel.movieQuery.static;
export type MovieParams = typeof MovieModel.movieParams.static;
export type MovieRecomendRequest = typeof MovieModel.movieRecomendRequest.static;
export type MovieRecomendResponse = typeof MovieModel.movieRecomendResponse.static;
