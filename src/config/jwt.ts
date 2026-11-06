import { jwt } from "@elysia/jwt";
import { env } from "./env";
import type { Prettify } from "elysia/types";

export const jwtPlugin = jwt({
  name: 'jwt',
  secret: env.JWT_SECRET!,
  exp: '1h',
});

export type JWT = Prettify<typeof jwtPlugin.decorator.jwt>
