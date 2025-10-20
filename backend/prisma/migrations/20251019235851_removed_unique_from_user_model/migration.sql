/*
  Warnings:

  - A unique constraint covering the columns `[showId]` on the table `PlaylistShow` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "public"."User_password_key";

-- CreateIndex
CREATE UNIQUE INDEX "PlaylistShow_showId_key" ON "public"."PlaylistShow"("showId");
