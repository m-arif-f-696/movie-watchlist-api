// seed.ts
const defaultPassword = "password";

// Hash menggunakan Argon2id bawaan Bun (default)
const hashedPassword = await Bun.password.hash(defaultPassword);

export const userSeed = `
INSERT INTO users (id, email, username, password, created_at, updated_at) VALUES
(1, 'alex.j@example.com', 'alexj', '${hashedPassword}', NOW(), NOW()),
(2, 'sarah.m@example.com', 'sarahm', '${hashedPassword}', NOW(), NOW()),
(3, 'budi.santoso@example.com', 'budisan', '${hashedPassword}', NOW(), NOW()),
(4, 'citra.dewi@example.com', 'citradewi', '${hashedPassword}', NOW(), NOW()),
(5, 'film.geek@example.com', 'filmgeek', '${hashedPassword}', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;
`;