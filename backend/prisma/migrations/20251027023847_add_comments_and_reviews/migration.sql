-- CreateTable
CREATE TABLE "public"."Comment" (
    "id" SERIAL NOT NULL,
    "content" TEXT NOT NULL,
    "userUsername" TEXT NOT NULL,
    "mediaTmdbId" INTEGER,
    "playlistId" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Comment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Review" (
    "id" SERIAL NOT NULL,
    "rating" INTEGER NOT NULL,
    "reviewText" TEXT,
    "userUsername" TEXT NOT NULL,
    "mediaTmdbId" INTEGER,
    "playlistId" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Review_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Comment_mediaTmdbId_idx" ON "public"."Comment"("mediaTmdbId");

-- CreateIndex
CREATE INDEX "Comment_playlistId_idx" ON "public"."Comment"("playlistId");

-- CreateIndex
CREATE INDEX "Review_mediaTmdbId_idx" ON "public"."Review"("mediaTmdbId");

-- CreateIndex
CREATE INDEX "Review_playlistId_idx" ON "public"."Review"("playlistId");

-- AddForeignKey
ALTER TABLE "public"."Comment" ADD CONSTRAINT "Comment_userUsername_fkey" FOREIGN KEY ("userUsername") REFERENCES "public"."User"("username") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Comment" ADD CONSTRAINT "Comment_mediaTmdbId_fkey" FOREIGN KEY ("mediaTmdbId") REFERENCES "public"."Media"("tmdbId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Comment" ADD CONSTRAINT "Comment_playlistId_fkey" FOREIGN KEY ("playlistId") REFERENCES "public"."Playlist"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Review" ADD CONSTRAINT "Review_userUsername_fkey" FOREIGN KEY ("userUsername") REFERENCES "public"."User"("username") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Review" ADD CONSTRAINT "Review_mediaTmdbId_fkey" FOREIGN KEY ("mediaTmdbId") REFERENCES "public"."Media"("tmdbId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Review" ADD CONSTRAINT "Review_playlistId_fkey" FOREIGN KEY ("playlistId") REFERENCES "public"."Playlist"("id") ON DELETE CASCADE ON UPDATE CASCADE;
