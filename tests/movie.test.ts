import { describe, test, expect, beforeAll, afterAll } from "bun:test";
import { request, db } from "./helpers/setup";

// ---------------------------------------------------------------------------
// MOVIE MODULE TESTS
// ---------------------------------------------------------------------------
// These tests assume there are movies already seeded in the database.
// If the DB is empty all "success" tests will return 404 from the service.
// ---------------------------------------------------------------------------

describe("Movie - Get All Movies", () => {
  test("MOV-GET-001: Get all movies (200)", async () => {
    const res = await request("GET", "/api/movies");

    expect(res.status).toBe(200);
    expect(res.body).toBeArray();
    expect(res.body.length).toBeGreaterThan(0);

    // Verify shape of first movie
    const movie = res.body[0];
    expect(movie.id).toBeNumber();
    expect(movie.title).toBeString();
    expect(movie.year).toBeNumber();
    expect(movie.director).toBeString();
    expect(movie.genres).toBeArray();
    expect(movie.rating).toBeNumber();
    expect(movie.duration).toBeString();
    expect(movie.synopsis).toBeString();
    expect(movie.poster_url).toBeString();
    expect(movie.cast).toBeArray();
  });

  test("MOV-GET-002: Search movies by title (200)", async () => {
    // First get all movies to pick a valid title substring
    const allRes = await request("GET", "/api/movies");
    const firstTitle: string = allRes.body[0]?.title ?? "";
    const searchTerm = firstTitle.substring(0, 3); // first 3 chars

    const res = await request("GET", "/api/movies", {
      query: { search: searchTerm },
    });

    expect(res.status).toBe(200);
    expect(res.body).toBeArray();
    expect(res.body.length).toBeGreaterThan(0);
    // Every returned movie title should contain the search term (case-insensitive)
    for (const movie of res.body) {
      expect(movie.title.toLowerCase()).toContain(searchTerm.toLowerCase());
    }
  });

  test("MOV-GET-003: Filter by genre (200)", async () => {
    // First get all movies to pick a valid genre
    const allRes = await request("GET", "/api/movies");
    const firstGenre: string = allRes.body[0]?.genres?.[0] ?? "";

    const res = await request("GET", "/api/movies", {
      query: { genre: firstGenre },
    });

    expect(res.status).toBe(200);
    expect(res.body).toBeArray();
    expect(res.body.length).toBeGreaterThan(0);
  });

  test("MOV-GET-004: Combo search+genre (200)", async () => {
    // Get all movies first to find valid params
    const allRes = await request("GET", "/api/movies");
    const movie = allRes.body[0];
    const searchTerm = movie?.title?.substring(0, 3) ?? "";
    const genre = movie?.genres?.[0] ?? "";

    const res = await request("GET", "/api/movies", {
      query: { search: searchTerm, genre },
    });

    expect(res.status).toBe(200);
    expect(res.body).toBeArray();
    expect(res.body.length).toBeGreaterThan(0);
  });

  test("MOV-GET-005: Movies not found (404)", async () => {
    const res = await request("GET", "/api/movies", {
      query: { search: "zzznonexistentmoviezzz" },
    });

    expect(res.status).toBe(404);
    expect(res.body.message).toBe("Movies not found");
  });
});

describe("Movie - Get Movie By Id", () => {
  let validMovieId: number;

  beforeAll(async () => {
    // Grab a valid movie ID from the database
    const allRes = await request("GET", "/api/movies");
    validMovieId = allRes.body[0]?.id;
  });

  test("MOV-BYID-001: Get movie by valid ID (200)", async () => {
    const res = await request("GET", `/api/movies/${validMovieId}`);

    expect(res.status).toBe(200);
    expect(res.body.id).toBe(validMovieId);
    expect(res.body.title).toBeString();
    expect(res.body.year).toBeNumber();
    expect(res.body.director).toBeString();
    expect(res.body.genres).toBeArray();
    expect(res.body.rating).toBeNumber();
    expect(res.body.duration).toBeString();
    expect(res.body.synopsis).toBeString();
    expect(res.body.poster_url).toBeString();
    expect(res.body.cast).toBeArray();
  });

  test("MOV-BYID-002: Get movie ID not found (404)", async () => {
    const res = await request("GET", "/api/movies/999999");

    expect(res.status).toBe(404);
    expect(res.body.message).toBe("Movie not found");
  });

  test("MOV-BYID-003: Get movie non-numeric ID (422)", async () => {
    const res = await request("GET", "/api/movies/abc");

    expect(res.status).toBe(422);
    expect(res.body.message).toBeDefined();
  });
});
