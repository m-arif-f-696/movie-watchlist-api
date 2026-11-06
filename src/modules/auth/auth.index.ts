import Elysia, { t } from "elysia";
import { jwtPlugin } from "../../config/jwt";
import { AuthModel } from "./auth.model";
import { AuthService } from "./auth.service";
import { loggerPlugin } from "../../config/logger";
import { ErrorModel, ValidationErrorModel } from "../../errors/error.model";

export const auth = new Elysia({prefix: '/auth'})
.use(jwtPlugin)
.use(loggerPlugin)
.post('/login', async({body, jwt, log}) => {
    const response = await AuthService.login(body, jwt, log);
    return response;
},{
    body: AuthModel.loginRequest,
    response: {
        200: AuthModel.loginResponse,
        401: ErrorModel,
        422: ValidationErrorModel,
        500: ErrorModel
    },
    detail : {
        summary: 'Login User',
        description: 'Get JWT Token for authentication',
        tags: ['Auth'],
    }
})   
.post('/register', async({body,set, log}) => {
    const response = await AuthService.register(body, log);
    set.status = 201;
    return response;
}, {
    body: AuthModel.registerRequest,
    response: {
        201: AuthModel.registerResponse,
        409: ErrorModel,
        422: ValidationErrorModel,
        500: ErrorModel
    },
    detail : {
        summary: 'Register User',
        description: 'Register a new user',
        tags: ['Auth'],
    }
})