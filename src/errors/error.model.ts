import { t } from "elysia";

// Dipakai untuk 400, 401, 403, 404, 409, 500
export const ErrorModel = t.Object({
    message: t.String({ examples: ["Request not found", "Internal server error", "Access denied", "Bad request data"] })
});

// Dipakai untuk 422 (validasi body/query/params)
export const ValidationErrorModel = t.Object({
    message: t.String({
        examples: ["password: Property 'password' is missing"]
    }),
    errors: t.Array(
        t.Object({
            field: t.String({ examples: ["password"] }),
            message: t.String({ examples: ["Property 'password' is missing"] })
        })
    )
});