import Elysia from "elysia";
import { AppError } from "./custom.error";
import { logger } from "@bogeychan/elysia-logger";
import { loggerConfig } from "../config/logger";

export const errorHandler = new Elysia({name : "error-handler"})
.use(logger(loggerConfig))
.onError({as: "global"},({code,set, error, log}) => {
    // 1. Tangkap Custom App Error yang dilempar oleh Service Layer
    if (error instanceof AppError) {
      log?.warn(error)
      set.status = error.statusCode;
      return {
        message: error.message,
      };
    }

    // 2. Tangkap Error Validasi bawaan TypeBox (t) dari Request Body/Params/Query
    if (code === 'VALIDATION') {
      log?.warn(error)
      set.status = 422;

      const errors = error.all.map((e) => ({
        field: e.path.replace(/^\//, ""),
        message: e.summary ?? e.message,
      }));
      const first = errors[0];
      return {
        message: first
          ? `${first.field}: ${first.message}`
          : "Invalid request data",
        errors,
      };
    }

    // 3. Tangkap Route 404 (Endpoint Not Found)
    if (code === 'NOT_FOUND') {
      set.status = 404;
      return {
        message: "Endpoint not found",
      };
    }

    // 4. Fallback Internal Server Error (500)
    log?.error(error)
    set.status = 500;
    return {
      message: 'Internal server error',
    };
})