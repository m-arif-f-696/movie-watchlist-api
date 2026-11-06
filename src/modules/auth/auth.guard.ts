import Elysia from "elysia";
import { jwtPlugin } from "../../config/jwt";
import { UnauthorizedError } from "../../errors/custom.error";

export const authGuard = new Elysia({ name: "auth-guard" })
  .use(jwtPlugin)
  .derive({ as: "scoped" }, async ({ jwt, headers }) => {
    const header = headers.authorization;
    if (!header?.startsWith("Bearer ")) {
      throw new UnauthorizedError("Token not found");
    }

    const payload = await jwt.verify(header.slice(7));
    if (!payload || !payload.sub) {
      throw new UnauthorizedError("Invalid token or expired token");
    }
    return { userId: Number(payload.sub) };
});