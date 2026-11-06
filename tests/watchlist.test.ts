import { describe, test, expect, beforeAll, afterAll } from "bun:test";
import { request, getAuthToken, db } from "./helpers/setup";

// ---------------------------------------------------------------------------
// WATCHLIST MODULE TESTS
// ---------------------------------------------------------------------------

const WATCHLIST_USER = {
  email: "watchlist_test@test.com",
  username: "watchlist_tester",
  password: "password123",
};

let authToken: string;
let validMovieId: number;
let userId: number;

beforeAll(async () => {
  // Get a valid movie ID from the seeded data
  const moviesRes = await request("GET", "/api/movies");
  validMovieId = moviesRes.body[0]?.id;

  // Register & login to get auth token
  authToken = await getAuthToken(WATCHLIST_USER);

  // Retrieve the user id for cleanup
  const user = await db.user.findUnique({
    where: { email: WATCHLIST_USER.email },
  });
  userId = user!.id;
});

afterAll(async () => {
  // Clean up watchlists, then user
  await db.watchlist.deleteMany({ where: { userId } });
  await db.user.deleteMany({ where: { email: WATCHLIST_USER.email } });
});

// ===========================
// GET WATCHLIST
// ===========================

describe("Watchlist - Get", () => {
  test("WCH-GET-002: Get watchlist empty (404)", async () => {
    // Fresh user has no watchlist items yet
    const res = await request("GET", "/api/watchlist", {
      headers: { Authorization: `Bearer ${authToken}` },
    });

    expect(res.status).toBe(404);
    expect(res.body.message).toBeDefined();
  });

  test("WCH-GET-003: Get watchlist no token (401)", async () => {
    const res = await request("GET", "/api/watchlist");

    expect(res.status).toBe(401);
    expect(res.body.message).toBeDefined();
  });

  test("WCH-GET-004: Get watchlist invalid token (401)", async () => {
    const res = await request("GET", "/api/watchlist", {
      headers: { Authorization: "Bearer invalid.token.here" },
    });

    expect(res.status).toBe(401);
    expect(res.body.message).toBeDefined();
  });
});

// ===========================
// ADD TO WATCHLIST
// ===========================

describe("Watchlist - Add", () => {
  afterAll(async () => {
    // Clean up watchlist entries created in these tests
    await db.watchlist.deleteMany({ where: { userId } });
  });

  test("WCH-ADD-001: Add to watchlist (201)", async () => {
    const res = await request("POST", "/api/watchlist", {
      headers: { Authorization: `Bearer ${authToken}` },
      body: { movieId: validMovieId },
    });

    expect(res.status).toBe(201);
    expect(res.body.id).toBeNumber();
    expect(res.body.movie_id).toBe(validMovieId);
    expect(res.body.created_at).toBeString();
  });

  test("WCH-ADD-002: Add duplicate (409)", async () => {
    // Same movie was already added in WCH-ADD-001
    const res = await request("POST", "/api/watchlist", {
      headers: { Authorization: `Bearer ${authToken}` },
      body: { movieId: validMovieId },
    });

    expect(res.status).toBe(409);
    expect(res.body.message).toBe("Movie already exists in watchlist");
  });

  test("WCH-ADD-003: Add non-existent movie (404)", async () => {
    const res = await request("POST", "/api/watchlist", {
      headers: { Authorization: `Bearer ${authToken}` },
      body: { movieId: 999999 },
    });

    expect(res.status).toBe(404);
    expect(res.body.message).toBe("Movie not found");
  });

  test("WCH-ADD-004: Add invalid payload (422)", async () => {
    const res = await request("POST", "/api/watchlist", {
      headers: { Authorization: `Bearer ${authToken}` },
      body: { movieId: "not-a-number" },
    });

    expect(res.status).toBe(422);
    expect(res.body.message).toBeDefined();
    expect(res.body.errors).toBeArray();
  });

  test("WCH-ADD-005: Add no token (401)", async () => {
    const res = await request("POST", "/api/watchlist", {
      body: { movieId: validMovieId },
    });

    expect(res.status).toBe(401);
    expect(res.body.message).toBeDefined();
  });
});

// ===========================
// GET WATCHLIST WITH DATA (after adds)
// ===========================

describe("Watchlist - Get with data", () => {
  beforeAll(async () => {
    // Ensure there's an item in the watchlist
    await db.watchlist.deleteMany({ where: { userId } });
    await db.watchlist.create({
      data: { userId, movieId: validMovieId },
    });
  });

  afterAll(async () => {
    await db.watchlist.deleteMany({ where: { userId } });
  });

  test("WCH-GET-001: Get watchlist with data (200)", async () => {
    const res = await request("GET", "/api/watchlist", {
      headers: { Authorization: `Bearer ${authToken}` },
    });

    expect(res.status).toBe(200);
    expect(res.body).toBeArray();
    expect(res.body.length).toBeGreaterThan(0);

    const item = res.body[0];
    expect(item.id).toBeNumber();
    expect(item.movie_id).toBe(validMovieId);
    expect(item.created_at).toBeString();
    expect(item.movie).toBeDefined();
    expect(item.movie.id).toBe(validMovieId);
    expect(item.movie.title).toBeString();
  });
});

// ===========================
// DELETE WATCHLIST
// ===========================

describe("Watchlist - Delete", () => {
  beforeAll(async () => {
    // Ensure there's an item to delete
    await db.watchlist.deleteMany({ where: { userId } });
    await db.watchlist.create({
      data: { userId, movieId: validMovieId },
    });
  });

  afterAll(async () => {
    await db.watchlist.deleteMany({ where: { userId } });
  });

  test("WCH-DEL-001: Delete watchlist success (200)", async () => {
    const res = await request("DELETE", `/api/watchlist/${validMovieId}`, {
      headers: { Authorization: `Bearer ${authToken}` },
    });

    expect(res.status).toBe(200);
    expect(res.body.message).toBeDefined();
  });

  test("WCH-DEL-002: Delete not in watchlist (404)", async () => {
    // Already deleted in previous test
    const res = await request("DELETE", `/api/watchlist/${validMovieId}`, {
      headers: { Authorization: `Bearer ${authToken}` },
    });

    expect(res.status).toBe(404);
    expect(res.body.message).toBe("Watchlist not found");
  });

  test("WCH-DEL-003: Delete movie not exist (404)", async () => {
    const res = await request("DELETE", "/api/watchlist/999999", {
      headers: { Authorization: `Bearer ${authToken}` },
    });

    expect(res.status).toBe(404);
    expect(res.body.message).toBe("Movie not found");
  });

  test("WCH-DEL-004: Delete no token (401)", async () => {
    const res = await request("DELETE", `/api/watchlist/${validMovieId}`);

    expect(res.status).toBe(401);
    expect(res.body.message).toBeDefined();
  });

  test("WCH-DEL-005: Delete non-numeric param (422)", async () => {
    const res = await request("DELETE", "/api/watchlist/abc", {
      headers: { Authorization: `Bearer ${authToken}` },
    });

    expect(res.status).toBe(422);
    expect(res.body.message).toBeDefined();
  });
});
