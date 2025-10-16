-- CreateEnum
CREATE TYPE "public"."WatchStatus" AS ENUM ('watching', 'completed', 'planned', 'dropped', 'removed');

-- CreateTable
CREATE TABLE "public"."Show" (
    "id" BIGSERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "genre" TEXT,
    "description" TEXT,
    "posterUrl" TEXT,
    "producer" TEXT,
    "releaseYear" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Show_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Episode" (
    "id" BIGSERIAL NOT NULL,
    "showId" BIGINT NOT NULL,
    "seasonNumber" INTEGER NOT NULL DEFAULT 1,
    "episodeNumber" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "airDate" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Episode_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Rating" (
    "id" BIGSERIAL NOT NULL,
    "userId" TEXT NOT NULL,
    "showId" BIGINT NOT NULL,
    "score" INTEGER NOT NULL,
    "review" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Rating_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Watchlist" (
    "id" BIGSERIAL NOT NULL,
    "userId" TEXT NOT NULL,
    "showId" BIGINT NOT NULL,
    "status" "public"."WatchStatus" NOT NULL DEFAULT 'planned',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Watchlist_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Favorite" (
    "id" BIGSERIAL NOT NULL,
    "userId" TEXT NOT NULL,
    "showId" BIGINT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Favorite_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Playlist" (
    "id" BIGSERIAL NOT NULL,
    "userId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Playlist_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."PlaylistShow" (
    "id" BIGSERIAL NOT NULL,
    "playlistId" BIGINT NOT NULL,
    "showId" BIGINT NOT NULL,

    CONSTRAINT "PlaylistShow_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Episode_showId_seasonNumber_episodeNumber_key" ON "public"."Episode"("showId", "seasonNumber", "episodeNumber");

-- CreateIndex
CREATE UNIQUE INDEX "Rating_userId_showId_key" ON "public"."Rating"("userId", "showId");

-- CreateIndex
CREATE UNIQUE INDEX "Watchlist_userId_showId_key" ON "public"."Watchlist"("userId", "showId");

-- CreateIndex
CREATE UNIQUE INDEX "Favorite_userId_showId_key" ON "public"."Favorite"("userId", "showId");

-- CreateIndex
CREATE UNIQUE INDEX "PlaylistShow_playlistId_showId_key" ON "public"."PlaylistShow"("playlistId", "showId");

-- AddForeignKey
ALTER TABLE "public"."Episode" ADD CONSTRAINT "Episode_showId_fkey" FOREIGN KEY ("showId") REFERENCES "public"."Show"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Rating" ADD CONSTRAINT "Rating_showId_fkey" FOREIGN KEY ("showId") REFERENCES "public"."Show"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Watchlist" ADD CONSTRAINT "Watchlist_showId_fkey" FOREIGN KEY ("showId") REFERENCES "public"."Show"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Favorite" ADD CONSTRAINT "Favorite_showId_fkey" FOREIGN KEY ("showId") REFERENCES "public"."Show"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."PlaylistShow" ADD CONSTRAINT "PlaylistShow_playlistId_fkey" FOREIGN KEY ("playlistId") REFERENCES "public"."Playlist"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."PlaylistShow" ADD CONSTRAINT "PlaylistShow_showId_fkey" FOREIGN KEY ("showId") REFERENCES "public"."Show"("id") ON DELETE CASCADE ON UPDATE CASCADE;
