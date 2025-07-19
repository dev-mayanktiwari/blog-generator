/*
  Warnings:

  - The `registerType` column on the `User` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "RegisterType" AS ENUM ('EMAIL', 'GOOGLE');

-- CreateEnum
CREATE TYPE "ContentType" AS ENUM ('informative', 'tutorial', 'opinion', 'summary', 'narrative');

-- CreateEnum
CREATE TYPE "Tone" AS ENUM ('conversational', 'professional', 'formal', 'casual', 'engaging', 'persuasive', 'expository', 'neutral');

-- AlterTable
ALTER TABLE "Post" ADD COLUMN     "contentType" TEXT NOT NULL DEFAULT 'informative',
ADD COLUMN     "generatedImage" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "registerType",
ADD COLUMN     "registerType" "RegisterType" NOT NULL DEFAULT 'EMAIL';

-- DropEnum
DROP TYPE "registerType";
