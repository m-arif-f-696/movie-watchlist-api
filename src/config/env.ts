import { t } from "elysia";
import { Value } from "@sinclair/typebox/value";

const envSchema = t.Object({
  DATABASE_URL: t.String({ minLength: 1, error: "DATABASE_URL wajib diisi di .env" }),
  JWT_SECRET: t.Optional(t.String({ default: "super-secret-key-default" })),
  NODE_ENV: t.Optional(
    t.Union(
      [
        t.Literal("development"),
        t.Literal("production"),
        t.Literal("test")
      ],
      { default: "development" }
    )
  ),
  PORT: t.Optional(t.Numeric({ default: 3000 })),
  GEMINI_API_KEY: t.String({ minLength: 1, error: "GEMINI_API_KEY wajib diisi di .env" }),
  GEMINI_MODEL: t.Optional(t.String({ default: "gemini-2.5-flash" })),
  CORS_ORIGIN: t.Optional(t.String({ default: "*" })),
});

function parseEnv(): typeof envSchema.static {
  const rawEnv = {
    PORT: process.env.PORT,
    NODE_ENV: process.env.NODE_ENV,
    DATABASE_URL: process.env.DATABASE_URL,
    JWT_SECRET: process.env.JWT_SECRET,
    GEMINI_API_KEY: process.env.GEMINI_API_KEY,
    GEMINI_MODEL: process.env.GEMINI_MODEL,
    CORS_ORIGIN: process.env.CORS_ORIGIN,
  };

  // Cek apakah env sesuai dengan skema `t`
  if (!Value.Check(envSchema, rawEnv)) {
    // Ambil detail error jika validasi gagal
    const errors = [...Value.Errors(envSchema, rawEnv)];
    console.error('Invalid / Missing Environment Variables:');
    errors.forEach((err) => {
      console.error(`  - ${err.path.slice(1)}: ${err.message}`);
    });
    
    // Matikan aplikasi langsung agar tidak running dalam keadaan krisis
    process.exit(1);
  }

  // Cast tipe data (misal STRING "3000" otomatis jadi NUMBER 3000)
  return Value.Cast(envSchema, rawEnv);
}

export const env: Readonly<typeof envSchema.static> = parseEnv();