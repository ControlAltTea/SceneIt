/*
  Warnings:

  - The primary key for the `Rating` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `review` on the `Rating` table. All the data in the column will be lost.
  - You are about to drop the column `score` on the `Rating` table. All the data in the column will be lost.
  - You are about to drop the `Review` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[userUsername,mediaTmdbId]` on the table `Rating` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[userUsername,playlistId]` on the table `Rating` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `rating` to the `Rating` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "public"."Rating" DROP CONSTRAINT "Rating_mediaTmdbId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Rating" DROP CONSTRAINT "Rating_userUsername_fkey";

-- DropForeignKey
ALTER TABLE "public"."Review" DROP CONSTRAINT "Review_mediaTmdbId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Review" DROP CONSTRAINT "Review_playlistId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Review" DROP CONSTRAINT "Review_userUsername_fkey";

-- AlterTable
ALTER TABLE "public"."Rating" DROP CONSTRAINT "Rating_pkey",
DROP COLUMN "review",
DROP COLUMN "score",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD COLUMN     "playlistId" INTEGER,
ADD COLUMN     "rating" INTEGER NOT NULL,
ALTER COLUMN "mediaTmdbId" DROP NOT NULL,
ALTER COLUMN "updatedAt" DROP DEFAULT,
ADD CONSTRAINT "Rating_pkey" PRIMARY KEY ("id");

-- DropTable
DROP TABLE "public"."Review";

-- CreateIndex
CREATE INDEX "Rating_mediaTmdbId_idx" ON "public"."Rating"("mediaTmdbId");

-- CreateIndex
CREATE INDEX "Rating_playlistId_idx" ON "public"."Rating"("playlistId");

-- CreateIndex
CREATE UNIQUE INDEX "Rating_userUsername_mediaTmdbId_key" ON "public"."Rating"("userUsername", "mediaTmdbId");

-- CreateIndex
CREATE UNIQUE INDEX "Rating_userUsername_playlistId_key" ON "public"."Rating"("userUsername", "playlistId");

-- AddForeignKey
ALTER TABLE "public"."Rating" ADD CONSTRAINT "Rating_userUsername_fkey" FOREIGN KEY ("userUsername") REFERENCES "public"."User"("username") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Rating" ADD CONSTRAINT "Rating_playlistId_fkey" FOREIGN KEY ("playlistId") REFERENCES "public"."Playlist"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Rating" ADD CONSTRAINT "Rating_mediaTmdbId_fkey" FOREIGN KEY ("mediaTmdbId") REFERENCES "public"."Media"("tmdbId") ON DELETE SET NULL ON UPDATE CASCADE;
