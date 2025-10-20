/*
  Warnings:

  - You are about to drop the column `genre` on the `Show` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[name,ownerId]` on the table `Playlist` will be added. If there are existing duplicate values, this will fail.
  - Changed the type of `tmdbId` on the `Show` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "public"."Playlist" ALTER COLUMN "updatedAt" SET DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "public"."Show" DROP COLUMN "genre",
ADD COLUMN     "genres" "public"."Genre"[],
DROP COLUMN "tmdbId",
ADD COLUMN     "tmdbId" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Playlist_name_ownerId_key" ON "public"."Playlist"("name", "ownerId");

-- CreateIndex
CREATE UNIQUE INDEX "Show_tmdbId_key" ON "public"."Show"("tmdbId");
