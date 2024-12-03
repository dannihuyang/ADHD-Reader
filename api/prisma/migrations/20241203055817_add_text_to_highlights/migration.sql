/*
  Warnings:

  - You are about to drop the column `endAnchor` on the `Highlight` table. All the data in the column will be lost.
  - You are about to drop the column `length` on the `Highlight` table. All the data in the column will be lost.
  - You are about to drop the column `offset` on the `Highlight` table. All the data in the column will be lost.
  - You are about to drop the column `startAnchor` on the `Highlight` table. All the data in the column will be lost.
  - Added the required column `text` to the `Highlight` table without a default value. This is not possible if the table is not empty.

*/
-- First make the column nullable
ALTER TABLE "Highlight" ADD COLUMN "text" TEXT;

-- Update existing rows with a default value
UPDATE "Highlight" SET "text" = '';

-- Then make it required
ALTER TABLE "Highlight" ALTER COLUMN "text" SET NOT NULL;
