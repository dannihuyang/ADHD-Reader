/*
  Warnings:

  - You are about to drop the column `endAnchor` on the `Highlight` table. All the data in the column will be lost.
  - You are about to drop the column `length` on the `Highlight` table. All the data in the column will be lost.
  - You are about to drop the column `offset` on the `Highlight` table. All the data in the column will be lost.
  - You are about to drop the column `startAnchor` on the `Highlight` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Highlight" DROP COLUMN "endAnchor",
DROP COLUMN "length",
DROP COLUMN "offset",
DROP COLUMN "startAnchor";
