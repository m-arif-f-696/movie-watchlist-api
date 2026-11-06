import cors from "@elysia/cors";
import { env } from "./env"

const allowedOrigins = env.CORS_ORIGIN ? env.CORS_ORIGIN.split(",").map((origin) => origin.trim()) : "*";

export const corsConfig = cors({
  origin: allowedOrigins,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
});