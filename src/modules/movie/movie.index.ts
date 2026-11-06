import Elysia, { t } from "elysia";
import { jwtPlugin } from "../../config/jwt";
import { loggerPlugin } from "../../config/logger";
import { ErrorModel, ValidationErrorModel } from "../../errors/error.model";
import { MovieModel } from "./movie.model";
import { MovieService } from "./movie.service";

export const movie = new Elysia({prefix: '/movies'})
.use(loggerPlugin)
.get('/', async({query,log }) => {
    const response = await MovieService.getMovies(query, log);
    return response;
}, {
    query: MovieModel.movieQuery,
    response:{
        200: MovieModel.movieListResponse,
        409: ErrorModel,
        500: ErrorModel
    },
    detail:{
        summary: "Get All Movies",
        description:"Endpoint Used to Get All Movies.",
        tags: ["Movies"],
    }
})

.get('/:id', async({params,log }) => {
    const response = await MovieService.getMovieById(params, log);
    return response;
}, {
    params: MovieModel.movieParams,
    response:{
        200: MovieModel.movieResponse,
        409: ErrorModel,
        500: ErrorModel
    },
    detail:{
        summary: "Get Movie By Id",
        description:"Endpoint Used to Get Movie By Id.",
        tags: ["Movies"],
    }
})

.post('/recommend', async({body,log}) => {
    const response = await MovieService.getMovieRecommend(body, log);
    return response;
}, {
    body: MovieModel.movieRecomendRequest,
    response:{
        200: MovieModel.movieRecomendResponse,
        422: ValidationErrorModel,
        500: ErrorModel
    },
    detail:{
        summary: "Get Movie Recomendation",
        description:"Endpoint Used to Get Movie Recomendation.",
        tags: ["Movies"],
    }
})