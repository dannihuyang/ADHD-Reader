/*
  Warnings:

  - You are about to drop the column `createdAt` on the `Highlight` table. All the data in the column will be lost.
  - You are about to drop the column `endIndex` on the `Highlight` table. All the data in the column will be lost.
  - You are about to drop the column `startIndex` on the `Highlight` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `Highlight` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Highlight" DROP COLUMN "createdAt",
DROP COLUMN "endIndex",
DROP COLUMN "startIndex",
DROP COLUMN "updatedAt",
ADD COLUMN     "endAnchor" TEXT,
ADD COLUMN     "length" INTEGER,
ADD COLUMN     "offset" INTEGER,
ADD COLUMN     "startAnchor" TEXT;
