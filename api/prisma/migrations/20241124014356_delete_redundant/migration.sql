/*
  Warnings:

  - You are about to drop the column `description` on the `Document` table. All the data in the column will be lost.
  - You are about to drop the column `isPublic` on the `Document` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Document" DROP COLUMN "description",
DROP COLUMN "isPublic";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "updatedAt";
