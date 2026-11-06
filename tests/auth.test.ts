import { describe, test, expect, beforeAll, afterAll } from "bun:test";
import { request, registerUser, loginUser, db } from "./helpers/setup";

// ---------------------------------------------------------------------------
// AUTH MODULE TESTS
// ---------------------------------------------------------------------------

const TEST_USER = {
  email: "auth_test_register@test.com",
  username: "auth_test_user",
  password: "password123",
};

const LOGIN_USER = {
  email: "auth_test_login@test.com",
  username: "auth_test_login_user",
  password: "password123",
};

afterAll(async () => {
  // Clean up test users
  await db.user.deleteMany({
    where: {
      email: { in: [TEST_USER.email, LOGIN_USER.email] },
    },
  });
});

// ===========================
// REGISTER TESTS
// ===========================

describe("Auth - Register", () => {
  afterAll(async () => {
    await db.user.deleteMany({
      where: { email: TEST_USER.email },
    });
  });

  test("AUTH-REG-001: Register success", async () => {
    const res = await registerUser(TEST_USER);

    expect(res.status).toBe(201);
    expect(res.body.message).toBe("User created successfully");
    expect(res.body.user).toBeDefined();
    expect(res.body.user.email).toBe(TEST_USER.email);
    expect(res.body.user.username).toBe(TEST_USER.username);
    expect(res.body.user.id).toBeNumber();
  });

  test("AUTH-REG-002: Register duplicate email (409)", async () => {
    // First registration already happened in AUTH-REG-001
    const res = await registerUser(TEST_USER);

    expect(res.status).toBe(409);
    expect(res.body.message).toBe("Email is already registered");
  });

  test("AUTH-REG-003: Register invalid email format (422)", async () => {
    const res = await registerUser({
      email: "not-an-email",
      username: "testuser2",
      password: "password123",
    });

    expect(res.status).toBe(422);
    expect(res.body.message).toBeDefined();
    expect(res.body.errors).toBeArray();
  });

  test("AUTH-REG-004: Register password too short (422)", async () => {
    const res = await registerUser({
      email: "auth_test_short@test.com",
      username: "testuser3",
      password: "short",
    });

    expect(res.status).toBe(422);
    expect(res.body.message).toBeDefined();
    expect(res.body.errors).toBeArray();
  });

  test("AUTH-REG-005: Register missing fields (422)", async () => {
    const res = await request("POST", "/api/auth/register", {
      body: {},
    });

    expect(res.status).toBe(422);
    expect(res.body.message).toBeDefined();
    expect(res.body.errors).toBeArray();
  });
});

// ===========================
// LOGIN TESTS
// ===========================

describe("Auth - Login", () => {
  beforeAll(async () => {
    // Register a user to test login against
    await registerUser(LOGIN_USER);
  });

  afterAll(async () => {
    await db.user.deleteMany({
      where: { email: LOGIN_USER.email },
    });
  });

  test("AUTH-LOG-001: Login success (200)", async () => {
    const res = await loginUser({
      email: LOGIN_USER.email,
      password: LOGIN_USER.password,
    });

    expect(res.status).toBe(200);
    expect(res.body.token).toBeString();
    expect(res.body.token.length).toBeGreaterThan(0);
    expect(res.body.user).toBeDefined();
    expect(res.body.user.email).toBe(LOGIN_USER.email);
    expect(res.body.user.username).toBe(LOGIN_USER.username);
    expect(res.body.user.id).toBeNumber();
  });

  test("AUTH-LOG-002: Login email not found (401)", async () => {
    const res = await loginUser({
      email: "nonexistent@test.com",
      password: "password123",
    });

    expect(res.status).toBe(401);
    expect(res.body.message).toBe("Invalid credentials");
  });

  test("AUTH-LOG-003: Login wrong password (401)", async () => {
    const res = await loginUser({
      email: LOGIN_USER.email,
      password: "wrongpassword",
    });

    expect(res.status).toBe(401);
    expect(res.body.message).toBe("Invalid credentials");
  });

  test("AUTH-LOG-004: Login invalid email format (422)", async () => {
    const res = await loginUser({
      email: "not-an-email",
      password: "password123",
    });

    expect(res.status).toBe(422);
    expect(res.body.message).toBeDefined();
    expect(res.body.errors).toBeArray();
  });

  test("AUTH-LOG-005: Login empty body (422)", async () => {
    const res = await request("POST", "/api/auth/login", {
      body: {},
    });

    expect(res.status).toBe(422);
    expect(res.body.message).toBeDefined();
    expect(res.body.errors).toBeArray();
  });
});
