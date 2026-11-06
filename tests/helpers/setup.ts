import { Elysia } from "elysia";
import { auth } from "../../src/modules/auth/auth.index";
import { movie } from "../../src/modules/movie/movie.index";
import { watchlist } from "../../src/modules/watchlist/watchlist.index";
import { watched } from "../../src/modules/watched/watched.index";
import { errorHandler } from "../../src/errors/error.handler";
import { loggerPlugin } from "../../src/config/logger";
import { db } from "../../src/config/db";

// ---------------------------------------------------------------------------
// App instance (mirrors src/index.ts but does NOT call .listen())
// ---------------------------------------------------------------------------
export const app = new Elysia({ prefix: "/api" })
  .use(errorHandler)
  .use(loggerPlugin)
  .use(auth)
  .use(movie)
  .use(watchlist)
  .use(watched);

// ---------------------------------------------------------------------------
// Generic request helper
// ---------------------------------------------------------------------------
const BASE_URL = "http://localhost";

type RequestOptions = {
  body?: unknown;
  headers?: Record<string, string>;
  query?: Record<string, string>;
};

export async function request(
  method: string,
  path: string,
  options: RequestOptions = {},
) {
  let url = `${BASE_URL}${path}`;
  if (options.query) {
    const params = new URLSearchParams(options.query);
    url += `?${params.toString()}`;
  }

  const init: RequestInit = {
    method,
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
  };

  if (options.body) {
    init.body = JSON.stringify(options.body);
  }

  const response = await app.handle(new Request(url, init));
  const json = await response.json();
  return { status: response.status, body: json };
}

// ---------------------------------------------------------------------------
// Auth helpers
// ---------------------------------------------------------------------------
export async function registerUser(data: {
  email: string;
  username: string;
  password: string;
}) {
  return request("POST", "/api/auth/register", { body: data });
}

export async function loginUser(data: { email: string; password: string }) {
  return request("POST", "/api/auth/login", { body: data });
}

export async function getAuthToken(
  userData = {
    email: "testuser@test.com",
    username: "testuser",
    password: "password123",
  },
): Promise<string> {
  await registerUser(userData);
  const res = await loginUser({
    email: userData.email,
    password: userData.password,
  });
  return res.body.token;
}

// ---------------------------------------------------------------------------
// DB cleanup helper
// ---------------------------------------------------------------------------
export { db };
