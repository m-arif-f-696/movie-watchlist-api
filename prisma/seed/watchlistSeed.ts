export const watchlistSeed = `
INSERT INTO watchlists (id, user_id, movie_id, created_at, updated_at) VALUES
(1, 1, 4, NOW(), NOW()),   -- Alex -> Interstellar
(2, 1, 12, NOW(), NOW()),  -- Alex -> Alien
(3, 1, 18, NOW(), NOW()),  -- Alex -> Dune
(4, 2, 2, NOW(), NOW()),   -- Sarah -> Parasite
(5, 2, 6, NOW(), NOW()),   -- Sarah -> Spirited Away
(6, 2, 13, NOW(), NOW()),  -- Sarah -> WALL-E
(7, 3, 1, NOW(), NOW()),   -- Budi -> Inception
(8, 3, 3, NOW(), NOW()),   -- Budi -> The Dark Knight
(9, 3, 8, NOW(), NOW()),   -- Budi -> The Matrix
(10, 4, 7, NOW(), NOW()),  -- Citra -> Whiplash
(11, 4, 15, NOW(), NOW()), -- Citra -> Joker
(12, 5, 5, NOW(), NOW()),  -- FilmGeek -> Pulp Fiction
(13, 5, 10, NOW(), NOW()), -- FilmGeek -> The Godfather
(14, 5, 17, NOW(), NOW()), -- FilmGeek -> The Shawshank Redemption
(15, 5, 20, NOW(), NOW())  -- FilmGeek -> Goodfellas
ON CONFLICT (id) DO NOTHING;
`;