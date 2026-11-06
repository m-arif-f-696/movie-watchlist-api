import { describe, test, expect, beforeAll, afterAll } from "bun:test";
import { request, getAuthToken, db } from "./helpers/setup";

// ---------------------------------------------------------------------------
// WATCHED & REVIEW MODULE TESTS
// ---------------------------------------------------------------------------

const WATCHED_USER = {
  email: "watched_test@test.com",
  username: "watched_tester",
  password: "password123",
};

let authToken: string;
let validMovieId: number;
let userId: number;

beforeAll(async () => {
  // Ambil movie ID yang valid dari data movie
  const moviesRes = await request("GET", "/api/movies");
  if (Array.isArray(moviesRes.body) && moviesRes.body.length > 0) {
    validMovieId = moviesRes.body[0].id;
  } else {
    // Fallback jika database belum ada movie ter-seed
    const createdMovie = await db.movie.create({
      data: {
        title: "Watched Test Movie",
        year: 2024,
        director: "Test Director",
        genres: "Action, Sci-Fi",
        rating: 8.5,
        duration: "120 min",
        synopsis: "Test synopsis",
        posterUrl: "https://example.com/poster.jpg",
        castMembers: "Actor One, Actor Two",
      },
    });
    validMovieId = createdMovie.id;
  }

  // Register & login user untuk token autentikasi
  authToken = await getAuthToken(WATCHED_USER);

  // Ambil userId untuk keperluan pembersihan data
  const user = await db.user.findUnique({
    where: { email: WATCHED_USER.email },
  });
  userId = user!.id;
});

afterAll(async () => {
  // Bersihkan data review lalu user
  await db.review.deleteMany({ where: { userId } });
  await db.user.deleteMany({ where: { email: WATCHED_USER.email } });
});

// ===========================
// GET WATCHED LIST
// ===========================

describe("Watched - Get", () => {
  test("WTD-GET-002: Get watched empty (404)", async () => {
    // Pastikan user belum memiliki riwayat review
    await db.review.deleteMany({ where: { userId } });

    const res = await request("GET", "/api/watched", {
      headers: { Authorization: `Bearer ${authToken}` },
    });

    expect(res.status).toBe(404);
    expect(res.body.message).toBe("Watched list is empty");
  });

  test("WTD-GET-003: Get watched no token (401)", async () => {
    const res = await request("GET", "/api/watched");

    expect(res.status).toBe(401);
    expect(res.body.message).toBeDefined();
  });

  test("WTD-GET-004: Get watched invalid token (401)", async () => {
    const res = await request("GET", "/api/watched", {
      headers: { Authorization: "Bearer invalid_token_123" },
    });

    expect(res.status).toBe(401);
    expect(res.body.message).toBeDefined();
  });

  test("WTD-GET-001: Get watched with data (200)", async () => {
    // Buat data review terlebih dahulu
    await db.review.deleteMany({ where: { userId } });
    await db.review.create({
      data: {
        userId,
        movieId: validMovieId,
        rating: 5,
        review: "Film ini sangat bagus!",
      },
    });

    const res = await request("GET", "/api/watched", {
      headers: { Authorization: `Bearer ${authToken}` },
    });

    expect(res.status).toBe(200);
    expect(res.body).toBeArray();
    expect(res.body.length).toBeGreaterThan(0);

    const item = res.body[0];
    expect(item.id).toBeNumber();
    expect(item.rating).toBe(5);
    expect(item.review).toBe("Film ini sangat bagus!");
    expect(item.created_at).toBeString();
    expect(item.movie).toBeDefined();
    expect(item.movie.id).toBe(validMovieId);
    expect(item.movie.title).toBeString();
  });
});

// ===========================
// ADD TO WATCHED LIST
// ===========================

describe("Watched - Add", () => {
  afterAll(async () => {
    await db.review.deleteMany({ where: { userId } });
  });

  test("WTD-ADD-001: Add to watched (201)", async () => {
    // Pastikan belum ada review untuk movie ini
    await db.review.deleteMany({ where: { userId, movieId: validMovieId } });

    const res = await request("POST", "/api/watched", {
      headers: { Authorization: `Bearer ${authToken}` },
      body: {
        movieId: validMovieId,
        rating: 5,
        review: "Film ini sangat bagus!",
      },
    });

    expect(res.status).toBe(201);
    expect(res.body.id).toBeNumber();
    expect(res.body.movieId).toBe(validMovieId);
    expect(res.body.rating).toBe(5);
    expect(res.body.review).toBe("Film ini sangat bagus!");
    expect(res.body.created_at).toBeString();
  });

  test("WTD-ADD-002: Add duplicate (409)", async () => {
    // Film sudah ditambahkan di WTD-ADD-001
    const res = await request("POST", "/api/watched", {
      headers: { Authorization: `Bearer ${authToken}` },
      body: {
        movieId: validMovieId,
        rating: 4,
        review: "Nonton lagi",
      },
    });

    expect(res.status).toBe(409);
    expect(res.body.message).toBe("Movie is already in watched list");
  });

  test("WTD-ADD-003: Add movie not found (404)", async () => {
    const res = await request("POST", "/api/watched", {
      headers: { Authorization: `Bearer ${authToken}` },
      body: {
        movieId: 999999,
        rating: 5,
        review: "Bagus",
      },
    });

    expect(res.status).toBe(404);
    expect(res.body.message).toBe("Movie not found");
  });

  test("WTD-ADD-004: Add invalid rating range (422)", async () => {
    // Rating > 5 (maksimum 5)
    const resHigh = await request("POST", "/api/watched", {
      headers: { Authorization: `Bearer ${authToken}` },
      body: {
        movieId: validMovieId,
        rating: 6,
        review: "Keren",
      },
    });

    expect(resHigh.status).toBe(422);
    expect(resHigh.body.message).toBeDefined();

    // Rating < 1 (minimum 1)
    const resLow = await request("POST", "/api/watched", {
      headers: { Authorization: `Bearer ${authToken}` },
      body: {
        movieId: validMovieId,
        rating: 0,
        review: "Buruk",
      },
    });

    expect(resLow.status).toBe(422);
    expect(resLow.body.message).toBeDefined();
  });

  test("WTD-ADD-005: Add missing fields (422)", async () => {
    const res = await request("POST", "/api/watched", {
      headers: { Authorization: `Bearer ${authToken}` },
      body: {
        movieId: validMovieId,
      },
    });

    expect(res.status).toBe(422);
    expect(res.body.message).toBeDefined();
    expect(res.body.errors).toBeArray();
  });

  test("WTD-ADD-006: Add no token (401)", async () => {
    const res = await request("POST", "/api/watched", {
      body: {
        movieId: validMovieId,
        rating: 5,
        review: "Ok",
      },
    });

    expect(res.status).toBe(401);
    expect(res.body.message).toBeDefined();
  });
});

