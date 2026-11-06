import { env } from "./config/env";
import { Elysia } from "elysia";
import openapi from "@elysia/openapi";
import { openapiConfig } from "./config/openapi";
import {auth} from './modules/auth/auth.index'
import { errorHandler } from "./errors/error.handler";
import { loggerPlugin } from "./config/logger";
import { movie } from "./modules/movie/movie.index";
import { watchlist } from "./modules/watchlist/watchlist.index";
import { watched } from "./modules/watched/watched.index";
import { corsConfig } from "./config/cors";


export const app = new Elysia({prefix: "/api"})
.use(corsConfig)
.use(errorHandler)
.use(loggerPlugin)
.use(openapi(openapiConfig))
.use(auth)
.use(movie)
.use(watchlist)
.use(watched)

if (env.NODE_ENV === "development") {
  app.listen(env.PORT ?? 8000);
}

export default app


console.log(
  `🦊 Elysia is running at http://localhost:${env.PORT}`
);
console.log('Api docs at ', `http://localhost:${env.PORT}/api/docs`)
