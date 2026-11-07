import { PrismaClient } from "../generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";
import { attachDatabasePool } from "@vercel/functions";
import { env } from "./env";

const pool = new Pool({
  connectionString: env.DATABASE_URL, // URL yang lewat pool Prisma
  max: 3,
});

attachDatabasePool(pool);

export const db = new PrismaClient({ adapter: new PrismaPg(pool) });