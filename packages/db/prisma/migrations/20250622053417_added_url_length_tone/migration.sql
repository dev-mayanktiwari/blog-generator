/*
  Warnings:

  - Added the required column `length` to the `Post` table without a default value. This is not possible if the table is not empty.
  - Added the required column `tone` to the `Post` table without a default value. This is not possible if the table is not empty.
  - Added the required column `videoUrl` to the `Post` table without a default value. This is not possible if the table is not empty.
  - Made the column `content` on table `Post` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Post" ADD COLUMN     "length" TEXT NOT NULL,
ADD COLUMN     "tone" TEXT NOT NULL,
ADD COLUMN     "videoUrl" TEXT NOT NULL,
ALTER COLUMN "content" SET NOT NULL;
