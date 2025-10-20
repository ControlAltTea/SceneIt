/*
  Warnings:

  - You are about to drop the column `tmbId` on the `Show` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[tmdbId]` on the table `Show` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "public"."Show_tmbId_key";

-- AlterTable
ALTER TABLE "public"."Show" DROP COLUMN "tmbId",
ADD COLUMN     "tmdbId" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Show_tmdbId_key" ON "public"."Show"("tmdbId");
