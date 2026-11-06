import Elysia, { t } from "elysia";
import { loggerPlugin } from "../../config/logger";
import { ErrorModel, ValidationErrorModel } from "../../errors/error.model";
import { authGuard } from "../auth/auth.guard";
import { WatchlistService } from "./watchlist.service";
import { WatchlistModel } from "./watchlist.model";


export const watchlist = new Elysia({prefix: '/watchlist'})
.use(loggerPlugin)
.use(authGuard)
.get('/', async({userId,log }) => {
    const response = await WatchlistService.getWatchlist(userId, log);
    return response;
}, {
    response:{
        200: WatchlistModel.watchlistResponse,
        401: ErrorModel,
        404: ErrorModel,
        500: ErrorModel
    },
    detail:{
        summary: "Get All Watchlist",
        description:"Endpoint Used to Get All Watchlist.",
        tags: ["Watchlist"],
        security: [
            {
                bearerAuth: []
            }
        ]
    }
})
.post('/', async({userId ,body, log, set }) => {
    const response = await WatchlistService.createWatchlist(userId, body, log);
    set.status = 201;
    return response;
}, {
    body: WatchlistModel.watchlistCreateRequest,
    response:{
        201: WatchlistModel.watchlistCreateResponse,
        401: ErrorModel,
        404: ErrorModel,
        409: ErrorModel,
        422: ValidationErrorModel,
        500: ErrorModel
    },
    detail:{
        summary: "Create Watchlist",
        description:"Endpoint Used to Create Watchlist.",
        tags: ["Watchlist"],
        security: [
            {
                bearerAuth: []
            }
        ]
    }
})

.delete('/:movieId', async({params,userId,log }) => {
    const response = await WatchlistService.deleteWatchlist(userId, params, log);
    return response;
}, {
    params: WatchlistModel.watchlistDeleteParams,
    response:{
        200: WatchlistModel.watchlistDeleteResponse,
        401: ErrorModel,
        404: ErrorModel,
        500: ErrorModel
    },
    detail:{
        summary: "Delete Watchlist",
        description:"Endpoint Used to Delete Watchlist.",
        tags: ["Watchlist"],
        security: [
            {
                bearerAuth: []
            }
        ]
    }
})