# Test Case Specification - Movie Watchlist API

Dokumentasi rancangan test case untuk seluruh endpoint API Movie Watchlist berdasarkan modul yang ada di `src/modules` (`auth`, `movie`, `watchlist`, `watched`).

Base URL: `http://localhost:8000/api`

---

## 1. Authentication Module (`/api/auth`)

### 1.1 `POST /api/auth/register`
Mendaftarkan user baru ke dalam sistem.

| ID | Skenario Pengujian | Input / Payload | Expected Status | Expected Response / Behavior |
|---|---|---|---|---|
| **AUTH-REG-001** | Registrasi berhasil dengan data valid | `{ "email": "user@example.com", "username": "user123", "password": "password123" }` | `201 Created` | Mengembalikan object `{ "message": "User created successfully", "user": { "id": number, "username": string, "email": string } }` dan password ter-hash di DB |
| **AUTH-REG-002** | Registrasi gagal karena email sudah terdaftar | `{ "email": "user@example.com", "username": "othername", "password": "password123" }` (email duplicate) | `409 Conflict` | Mengembalikan pesan error conflict (`Email is already registered`) |
| **AUTH-REG-003** | Registrasi gagal karena format email tidak valid | `{ "email": "invalid-email", "username": "user123", "password": "password123" }` | `422 Unprocessable Content` | Validasi error skema Elysia TypeBox |
| **AUTH-REG-004** | Registrasi gagal karena password kurang dari 8 karakter | `{ "email": "user2@example.com", "username": "user123", "password": "123" }` | `422 Unprocessable Content` | Validasi error skema (min length 8) |
| **AUTH-REG-005** | Registrasi gagal jika field required kosong / missing | `{ "email": "user3@example.com" }` | `422 Unprocessable Content` | Validasi error field `username` & `password` wajib diisi |

---

### 1.2 `POST /api/auth/login`
Melakukan login dan mendapatkan JWT access token.

| ID | Skenario Pengujian | Input / Payload | Expected Status | Expected Response / Behavior |
|---|---|---|---|---|
| **AUTH-LOG-001** | Login berhasil dengan kredensial valid | `{ "email": "user@example.com", "password": "password123" }` | `200 OK` | Mengembalikan `{ "token": "<JWT_STRING>", "user": { "id": number, "username": string, "email": string } }` |
| **AUTH-LOG-002** | Login gagal karena email tidak terdaftar | `{ "email": "notfound@example.com", "password": "password123" }` | `401 Unauthorized` | Pesan error `Invalid credentials` |
| **AUTH-LOG-003** | Login gagal karena password salah | `{ "email": "user@example.com", "password": "wrongpassword" }` | `401 Unauthorized` | Pesan error `Invalid credentials` |
| **AUTH-LOG-004** | Login gagal dengan format email tidak valid | `{ "email": "notanemail", "password": "password123" }` | `422 Unprocessable Content` | Validasi format email error |
| **AUTH-LOG-005** | Login gagal tanpa body / body kosong | `{}` | `422 Unprocessable Content` | Validasi error parameter wajib |

---

## 2. Movies Module (`/api/movies`)

### 2.1 `GET /api/movies`
Mengambil daftar film dengan opsi filter search query dan genre.

| ID | Skenario Pengujian | Parameter Query | Expected Status | Expected Response / Behavior |
|---|---|---|---|---|
| **MOV-GET-001** | Ambil semua daftar film tanpa query filter | *(None)* | `200 OK` | Mengembalikan array list movie lengkap dengan properti `genres` (array) dan `cast` (array) |
| **MOV-GET-002** | Filter film berdasarkan keyword pencarian judul | `?search=Inception` | `200 OK` | Mengembalikan array film yang judulnya mengandung kata "Inception" (case-insensitive) |
| **MOV-GET-003** | Filter film berdasarkan genre | `?genre=Sci-Fi` | `200 OK` | Mengembalikan array film yang memiliki genre "Sci-Fi" |
| **MOV-GET-004** | Filter film kombinasi search & genre | `?search=Dark&genre=Action` | `200 OK` | Mengembalikan array film yang match kedua kriteria |
| **MOV-GET-005** | Film tidak ditemukan berdasarkan filter | `?search=NonExistentMovie999` | `404 Not Found` | Mengembalikan error `Movies not found` |

---

### 2.2 `GET /api/movies/:id`
Mengambil detail film spesifik berdasarkan ID.

| ID | Skenario Pengujian | Path Param | Expected Status | Expected Response / Behavior |
|---|---|---|---|---|
| **MOV-BYID-001** | Ambil detail film dengan ID yang valid dan ada | `/api/movies/1` | `200 OK` | Mengembalikan object film lengkap dengan `genres`, `cast`, rating (number), dsb. |
| **MOV-BYID-002** | Ambil film dengan ID yang tidak terdaftar | `/api/movies/99999` | `404 Not Found` | Mengembalikan error `Movie not found` |
| **MOV-BYID-003** | Ambil film dengan format parameter ID bukan angka | `/api/movies/abc` | `422 Unprocessable Content` | Validasi error parameter `id` harus berupa integer |

---

## 3. Watchlist Module (`/api/watchlist`)
*Semua endpoint watchlist diproteksi oleh `authGuard` (memerlukan header `Authorization: Bearer <TOKEN>`).*

### 3.1 `GET /api/watchlist`
Melihat daftar film yang disimpan dalam watchlist user yang sedang login.

| ID | Skenario Pengujian | Header & Auth | Expected Status | Expected Response / Behavior |
|---|---|---|---|---|
| **WCH-GET-001** | Ambil watchlist user yang memiliki data | Bearer Token valid (User punya watchlist) | `200 OK` | Mengembalikan array item watchlist beserta relasi detail objek `movie` |
| **WCH-GET-002** | Ambil watchlist saat user belum punya daftar watchlist | Bearer Token valid (Watchlist kosong) | `404 Not Found` | Mengembalikan error `Your watchlist is empty` |
| **WCH-GET-003** | Ambil watchlist tanpa menyertakan Authorization token | Tidak ada header Authorization | `401 Unauthorized` | Mengembalikan error `Token not found` |
| **WCH-GET-004** | Ambil watchlist dengan format token rusak / kedaluwarsa | `Bearer invalid_token_123` | `401 Unauthorized` | Mengembalikan error `Invalid token or expired token` |

---

### 3.2 `POST /api/watchlist`
Menambahkan film ke dalam daftar watchlist user.

| ID | Skenario Pengujian | Payload & Auth | Expected Status | Expected Response / Behavior |
|---|---|---|---|---|
| **WCH-ADD-001** | Menambahkan film baru yang valid ke watchlist | Token valid, `{ "movieId": 1 }` | `201 Created` | Mengembalikan `{ "id": number, "movie_id": 1, "created_at": string }` |
| **WCH-ADD-002** | Gagal jika film sudah ada di watchlist user (duplikat) | Token valid, `{ "movieId": 1 }` (sudah pernah ditambahkan) | `409 Conflict` | Mengembalikan error `Movie already exists in watchlist` |
| **WCH-ADD-003** | Gagal menambahkan film yang tidak ada di DB | Token valid, `{ "movieId": 99999 }` | `404 Not Found` | Mengembalikan error `Movie not found` |
| **WCH-ADD-004** | Gagal jika payload tidak valid / kosong | Token valid, `{}` atau `{ "movieId": "abc" }` | `422 Unprocessable Content` | Validasi error tipe data `movieId` wajib number |
| **WCH-ADD-005** | Request tanpa token Authorization | Header kosong, `{ "movieId": 1 }` | `401 Unauthorized` | Mengembalikan error `Token not found` |

---

### 3.3 `DELETE /api/watchlist/:id`
Menghapus film dari watchlist user.
*(Catatan: implementasi service saat ini menggunakan parameter `params.movieId` / `id` sebagai referensi movie).*

| ID | Skenario Pengujian | Path & Auth | Expected Status | Expected Response / Behavior |
|---|---|---|---|---|
| **WCH-DEL-001** | Berhasil menghapus film dari watchlist | Token valid, `/api/watchlist/1` (film ada di watchlist user) | `200 OK` | Mengembalikan `{ "message": "Success Delete Watchlist" }` dan data terhapus di database |
| **WCH-DEL-002** | Gagal menghapus film yang tidak ada di daftar watchlist user | Token valid, `/api/watchlist/2` (tidak ada di watchlist) | `404 Not Found` | Mengembalikan error `Watchlist not found` |
| **WCH-DEL-003** | Gagal menghapus jika Movie ID tidak ada di tabel movie | Token valid, `/api/watchlist/99999` | `404 Not Found` | Mengembalikan error `Movie not found` |
| **WCH-DEL-004** | Gagal menghapus tanpa token Authorization | Tanpa token, `/api/watchlist/1` | `401 Unauthorized` | Mengembalikan error `Token not found` |
| **WCH-DEL-005** | Parameter ID bukan numerik | Token valid, `/api/watchlist/abc` | `422 Unprocessable Content` | Validasi error parameter non-numerik |

---

## 4. Watched & Review Module (`/api/watched`)
*Semua endpoint watched diproteksi oleh `authGuard` (memerlukan header `Authorization: Bearer <TOKEN>`).*

### 4.1 `GET /api/watched`
Mengambil daftar film yang telah ditonton beserta review & rating dari user yang sedang login.

| ID | Skenario Pengujian | Header & Auth | Expected Status | Expected Response / Behavior |
|---|---|---|---|---|
| **WTD-GET-001** | Ambil daftar watched saat user memiliki riwayat review | Token valid (User punya riwayat review) | `200 OK` | Mengembalikan array watched item (`id`, `rating`, `review`, `created_at`, `movie`) |
| **WTD-GET-002** | Ambil daftar watched saat user belum pernah mereview film | Token valid (Riwayat kosong) | `404 Not Found` | Mengembalikan error `Watched list is empty` |
| **WTD-GET-003** | Ambil daftar watched tanpa token | Tanpa header Authorization | `401 Unauthorized` | Mengembalikan error `Token not found` |
| **WTD-GET-004** | Ambil daftar watched dengan token kedaluwarsa/salah | `Bearer invalid_token` | `401 Unauthorized` | Mengembalikan error `Invalid token or expired token` |

---

### 4.2 `POST /api/watched`
Menambahkan film ke riwayat sudah ditonton dengan rating (1-5) dan review ulasan.

| ID | Skenario Pengujian | Payload & Auth | Expected Status | Expected Response / Behavior |
|---|---|---|---|---|
| **WTD-ADD-001** | Berhasil menambahkan film ke daftar watched | Token valid, `{ "movieId": 1, "rating": 5, "review": "Film ini sangat bagus!" }` | `201 Created` | Mengembalikan `{ "id": number, "movieId": 1, "rating": 5, "review": string, "created_at": string }` |
| **WTD-ADD-002** | Gagal jika film sudah pernah direview / ditonton | Token valid, `{ "movieId": 1, "rating": 4, "review": "Nonton lagi" }` (sudah ada) | `409 Conflict` | Mengembalikan error `Movie is already in watched list` |
| **WTD-ADD-003** | Gagal jika Movie ID tidak ditemukan di DB | Token valid, `{ "movieId": 99999, "rating": 5, "review": "Bagus" }` | `404 Not Found` | Mengembalikan error `Movie not found` |
| **WTD-ADD-004** | Gagal validasi jika rating di luar batas minimum/maksimum (< 1 atau > 5) | Token valid, `{ "movieId": 1, "rating": 6, "review": "Keren" }` | `422 Unprocessable Content` | Validasi error batas rating skema TypeBox |
| **WTD-ADD-005** | Gagal validasi jika field review / movieId kosong | Token valid, `{ "movieId": 1 }` | `422 Unprocessable Content` | Validasi error field required missing |
| **WTD-ADD-006** | Request tanpa token Authorization | Tanpa token, `{ "movieId": 1, "rating": 5, "review": "Ok" }` | `401 Unauthorized` | Mengembalikan error `Token not found` |

---

## 5. Ringkasan Kode Status HTTP (HTTP Status Code Matrix)

| Kode | Keterangan | Modul Terkait |
|---|---|---|
| **200 OK** | Permintaan berhasil diproses | `auth/login`, `movies`, `movies/:id`, `watchlist` (GET, DELETE), `watched` (GET) |
| **201 Created** | Data baru berhasil dibuat | `auth/register`, `watchlist` (POST), `watched` (POST) |
| **401 Unauthorized** | Tidak ada token, token kedaluwarsa, atau kredensial login salah | `auth/login`, seluruh endpoint `watchlist` & `watched` |
| **404 Not Found** | Data tidak ditemukan (Film, Watchlist kosong/tidak ada, Review kosong) | `movies`, `movies/:id`, `watchlist`, `watched` |
| **409 Conflict** | Duplikasi data (Email sudah ada, movie sudah ada di watchlist/watched) | `auth/register`, `watchlist` (POST), `watched` (POST) |
| **422 Unprocessable Content** | Validasi input gagal (Email format, min length, tipe data, range rating) | Seluruh endpoint dengan input body/param/query |
| **500 Internal Server Error** | Kesalahan server tidak terduga | Seluruh endpoint |

