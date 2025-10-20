/*
  Warnings:

  - The values [watching,completed,planned,dropped,removed] on the enum `WatchStatus` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `userId` on the `Playlist` table. All the data in the column will be lost.
  - The `genre` column on the `Show` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the `Favorite` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[tmbId]` on the table `Show` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `ownerId` to the `Playlist` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "public"."Genre" AS ENUM ('ACTION', 'COMEDY', 'DRAMA', 'FANTASY', 'HORROR', 'ROMANCE', 'SCIFI', 'THRILLER', 'ANIMATION');

-- AlterEnum
BEGIN;
CREATE TYPE "public"."WatchStatus_new" AS ENUM ('WATCHING', 'COMPLETED', 'PLANNED', 'DROPPED', 'REMOVED');
ALTER TABLE "public"."Watchlist" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "public"."Watchlist" ALTER COLUMN "status" TYPE "public"."WatchStatus_new" USING ("status"::text::"public"."WatchStatus_new");
ALTER TYPE "public"."WatchStatus" RENAME TO "WatchStatus_old";
ALTER TYPE "public"."WatchStatus_new" RENAME TO "WatchStatus";
DROP TYPE "public"."WatchStatus_old";
ALTER TABLE "public"."Watchlist" ALTER COLUMN "status" SET DEFAULT 'PLANNED';
COMMIT;

-- DropForeignKey
ALTER TABLE "public"."Favorite" DROP CONSTRAINT "Favorite_showId_fkey";

-- AlterTable
ALTER TABLE "public"."Playlist" DROP COLUMN "userId",
ADD COLUMN     "isFavorite" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "isPublic" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "ownerId" TEXT NOT NULL,
ALTER COLUMN "updatedAt" DROP DEFAULT;

-- AlterTable
ALTER TABLE "public"."Show" ADD COLUMN     "tmbId" TEXT,
DROP COLUMN "genre",
ADD COLUMN     "genre" "public"."Genre"[];

-- AlterTable
ALTER TABLE "public"."Watchlist" ALTER COLUMN "status" SET DEFAULT 'PLANNED';

-- DropTable
DROP TABLE "public"."Favorite";

-- CreateTable
CREATE TABLE "public"."User" (
    "id" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "public"."User"("username");

-- CreateIndex
CREATE UNIQUE INDEX "Show_tmbId_key" ON "public"."Show"("tmbId");

-- AddForeignKey
ALTER TABLE "public"."Playlist" ADD CONSTRAINT "Playlist_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
