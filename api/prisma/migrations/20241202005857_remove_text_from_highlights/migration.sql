/*
  Warnings:

  - You are about to drop the column `text` on the `Highlight` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Highlight" DROP CONSTRAINT "Highlight_categoryId_fkey";

-- AlterTable
ALTER TABLE "Highlight" DROP COLUMN "text";

-- AddForeignKey
ALTER TABLE "Highlight" ADD CONSTRAINT "Highlight_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE CASCADE ON UPDATE CASCADE;
