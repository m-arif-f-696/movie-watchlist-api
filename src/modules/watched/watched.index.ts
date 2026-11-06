import Elysia, { t } from "elysia";
import { loggerPlugin } from "../../config/logger";
import { ErrorModel, ValidationErrorModel } from "../../errors/error.model";
import { authGuard } from "../auth/auth.guard";
import { WatchedService } from "./watched.service";
import { WatchedModel } from "./watched.model";


export const watched = new Elysia({prefix: '/watched'})
.use(loggerPlugin)
.use(authGuard)
.get('/', async({userId,log }) => {
    const response = await WatchedService.getWatchedList(userId, log);
    return response;
}, {
    response:{
        200: WatchedModel.watchedListRespones,
        401: ErrorModel,
        404: ErrorModel,
        500: ErrorModel
    },
    detail:{
        summary: "Get All Watched",
        description:"Endpoint Used to Get All Watched.",
        tags: ["Watched"],
        security: [
            {
                bearerAuth: []
            }
        ]
    }
})
.post('/', async({userId ,body, log, set }) => {
    const response = await WatchedService.addToWatchedList(userId, body, log);
    set.status = 201;
    return response;
}, {
    body: WatchedModel.watchedCreateRequest,
    response:{
        201: WatchedModel.watchedCreateResponse,
        401: ErrorModel,
        404: ErrorModel,
        409: ErrorModel,
        422: ValidationErrorModel,
        500: ErrorModel
    },
    detail:{
        summary: "Add to Watched",
        description:"Endpoint Used to Add to Watched.",
        tags: ["Watched"],
        security: [
            {
                bearerAuth: []
            }
        ]
    }
})
