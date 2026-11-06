export const reviewSeed = `
INSERT INTO reviews (id, user_id, movie_id, rating, review, created_at, updated_at) VALUES
(1, 1, 1, 5, 'Konsep mimpi di dalam mimpi yang sangat jenius dari Nolan. Visual dan alur cerita luar biasa!', NOW(), NOW()),
(2, 1, 3, 5, 'Performa Heath Ledger sebagai Joker tidak ada tandingannya. Masterpiece film superhero.', NOW(), NOW()),
(3, 1, 16, 4, 'Visual distopia yang sangat memukau dan sinematografi yang luar biasa indah.', NOW(), NOW()),
(4, 2, 2, 5, 'Plot twist-nya membuat syok! Kritik sosial yang disajikan dengan alur yang sangat menarik.', NOW(), NOW()),
(5, 2, 6, 5, 'Dunia imajinasi Studio Ghibli selalu berhasil menyentuh perasaan. Klasik dan indah.', NOW(), NOW()),
(6, 3, 8, 5, 'Film sci-fi terbaik sepanjang masa. Ide tentang simulasi realitas sangat melompati zamannya.', NOW(), NOW()),
(7, 3, 14, 4, 'Alur alur waktu terbalik yang bikin otak berputar keras tapi sangat memuaskan.', NOW(), NOW()),
(8, 4, 7, 5, 'Ketegangan dan intensitas antara murid dan guru musik yang sangat memicu adrenalin!', NOW(), NOW()),
(9, 4, 11, 5, 'Ending yang sangat tidak terduga. Akting Brad Pitt dan Edward Norton sangat solid.', NOW(), NOW()),
(10, 5, 10, 5, 'Standar tertinggi untuk film bergenre drama kejahatan mafia. Alur ceritanya sempurna.', NOW(), NOW()),
(11, 5, 19, 5, 'Akting Cillian Murphy dan pengadeganan sejarah pembuatan bom atom yang sangat epik.', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;
`;