-- CreateTable
CREATE TABLE "movies" (
    "id" SERIAL NOT NULL,
    "title" VARCHAR(255) NOT NULL,
    "year" INTEGER NOT NULL,
    "director" VARCHAR(255) NOT NULL,
    "genres" TEXT NOT NULL,
    "rating" DECIMAL(3,1) NOT NULL,
    "duration" VARCHAR(50) NOT NULL,
    "synopsis" TEXT NOT NULL,
    "poster_url" TEXT NOT NULL,
    "cast_members" TEXT NOT NULL,

    CONSTRAINT "movies_pkey" PRIMARY KEY ("id")
);
