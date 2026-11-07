# 🎬 Movie Watchlist API

RESTful API untuk manajemen katalog film, watchlist pribadi pengguna, serta pencatatan film yang telah ditonton beserta review & rating. Dibangun menggunakan **Bun**, **ElysiaJS**, dan **Prisma ORM** dengan database **PostgreSQL**.

---

## 📌 Fitur Utama

- **Authentication & Authorization**: Register dan Login dengan hashing password aman (Bun Password API) dan token JWT (Bearer Token).
- **Movie Catalog**: Jelajahi katalog film, pencarian judul (`search`), filter berdasarkan `genre`, dan lihat detail film lengkap.
- **Watchlist Management**: Simpan film incaran ke daftar tontonan pribadi pengguna.
- **Watched & Reviews**: Tandai film yang telah ditonton lengkap dengan rating (1-5) dan review ulasan.
- **Interactive Documentation**: Swagger / OpenAPI UI interaktif bawaan.
- **Validation & Error Handling**: Validasi skema ketat menggunakan TypeBox (`t`) dan format error terstandarisasi.

---

## 📋 Prasyarat (Prerequisites)

Pastikan lingkungan lokal Anda telah terpasang:

1. **[Bun](https://bun.sh/)** (v1.1+ atau v1.2+)
   ```bash
   curl -fsSL https://bun.sh/install | bash
   ```
2. **PostgreSQL Database** (Lokal via Docker/Postgres service atau Cloud seperti Supabase, Neon, Prisma Postgres).
3. **Google Gemini API Key** (Dibutuhkan untuk konfigurasi environment).

---

## ⚙️ Variabel Lingkungan (Environment Variables)

Salin template variabel lingkungan atau buat file `.env` di root project:

```bash
cp .env.example .env
```

Sesuaikan nilai-nilai berikut di dalam file `.env`:

```env
# Port aplikasi server
PORT=8000

# Environment mode: development | production
NODE_ENV=development

# URL koneksi database PostgreSQL
DATABASE_URL="postgre-pool"

# Secret key untuk penandatanganan JWT Token
JWT_SECRET="ganti-dengan-secret-key-yang-aman"

# CORS
CORS_ORIGIN="http://localhost:3000,http://127.0.0.1:3000,https://myfrontend.com""

# API Key Google Gemini AI
GEMINI_API_KEY="AIzaSy..."

# Model Gemini
GEMINI_MODEL="gemini-2.5-flash"
```

---

## 🚀 Instalasi & Setup Database

### 1. Install Dependensi

```bash
bun install
```

### 2. Migrasi Database (Prisma Migration)

Jalankan migrasi untuk membuat tabel-tabel (`movies`, `users`, `watchlists`, `reviews`) di database Anda:

```bash
bunx prisma migrate dev
```

Jika menggunakan database existing dan ingin langsung sinkronisasi schema:

```bash
bunx prisma db push
```

### 3. Generate Prisma Client

```bash
bunx prisma generate
```

### 4. Database Seeding

Jalankan seeder untuk mengisi data awal film, sample user, watchlist, dan review:

```bash
bun run db:seed
```

---

## 🏃 Menjalankan Aplikasi

### Mode Pengembangan (Development)

Menjalankan server dengan _hot-reload_:

```bash
bun run dev
```

Server akan aktif di:

- **API Base URL**: `http://localhost:8000/api`
- **Swagger API Documentation**: `http://localhost:8000/api/docs`

---

## 🧪 Menjalankan Pengujian (Testing)

Pengujian API menggunakan _test runner_ bawaan Bun:

```bash
# Menjalankan seluruh test suite
bun test

# Menjalankan pengujian per modul
bun test tests/auth.test.ts
bun test tests/movie.test.ts
bun test tests/watchlist.test.ts
bun test tests/watched.test.ts
```

Spesifikasi skenario pengujian lengkap dapat dilihat pada [test-case.md](./test-case.md).

---

## 📚 Ringkasan Endpoint API

Semua endpoint diawali dengan prefix `/api`.

### 0. API Documentation (`/api/docs`)

| Method | Endpoint    | Deskripsi                                 | Auth   |
| :----- | :---------- | :---------------------------------------- | :----- |
| GET    | `/api/docs` | Membuka dokumentasi interaktif OpenAPI UI | Publik |

### 1. Auth (`/api/auth`)

| Method | Endpoint             | Deskripsi                              | Auth   |
| ------ | -------------------- | -------------------------------------- | ------ |
| `POST` | `/api/auth/register` | Mendaftarkan akun user baru            | Publik |
| `POST` | `/api/auth/login`    | Login dan mendapatkan Bearer JWT token | Publik |

### 2. Movies (`/api/movies`)

| Method | Endpoint          | Deskripsi                                               | Auth   |
| ------ | ----------------- | ------------------------------------------------------- | ------ |
| `GET`  | `/api/movies`     | Ambil daftar film (Query: `search`, `genre`, `shuffle`) | Publik |
| `GET`  | `/api/movies/:id` | Ambil detail film berdasarkan ID                        | Publik |

### 3. Watchlist (`/api/watchlist`)

| Method   | Endpoint                  | Deskripsi                            | Auth         |
| -------- | ------------------------- | ------------------------------------ | ------------ |
| `GET`    | `/api/watchlist`          | Ambil daftar watchlist user login    | Bearer Token |
| `POST`   | `/api/watchlist`          | Tambah film ke watchlist (`movieId`) | Bearer Token |
| `DELETE` | `/api/watchlist/:movieId` | Hapus film dari watchlist            | Bearer Token |

### 4. Watched & Review (`/api/watched`)

| Method | Endpoint       | Deskripsi                                              | Auth         |
| ------ | -------------- | ------------------------------------------------------ | ------------ |
| `GET`  | `/api/watched` | Ambil riwayat film yang sudah ditonton                 | Bearer Token |
| `POST` | `/api/watched` | Tambah film ke riwayat (`movieId`, `rating`, `review`) | Bearer Token |

---

## 📁 Struktur Direktori

```text
movie-watchlist/
├── prisma/
│   ├── migrations/       # Riwayat migrasi SQL Prisma
│   ├── seed/             # Dataset dummy (movies, users, dsb.)
│   ├── schema.prisma     # Definisi skema database Prisma
│   └── seed.ts           # Runner script untuk database seeding
├── src/
│   ├── config/           # Konfigurasi env, jwt, db, logger, openapi
│   ├── errors/           # Custom error class dan global error handler
│   ├── modules/
│   │   ├── auth/         # Module autentikasi & JWT guard
│   │   ├── movie/        # Module katalog film
│   │   ├── watchlist/    # Module watchlist pengguna
│   │   └── watched/      # Module riwayat tonton & review
│   └── index.ts          # Entry point aplikasi Elysia
├── tests/                # Test suite per modul (bun test)
├── .env.example          # Contoh variabel environment
├── package.json          # Script dan dependensi project
├── README.md             # Dokumentasi utama proyek
└── test-case.md          # Dokumentasi spesifikasi test case
```
