/*
  Warnings:

  - You are about to drop the column `sentenceId` on the `Highlight` table. All the data in the column will be lost.
  - You are about to drop the `Sentence` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `endIndex` to the `Highlight` table without a default value. This is not possible if the table is not empty.
  - Added the required column `startIndex` to the `Highlight` table without a default value. This is not possible if the table is not empty.
  - Added the required column `text` to the `Highlight` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Highlight` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Highlight" DROP CONSTRAINT "Highlight_categoryId_fkey";

-- DropForeignKey
ALTER TABLE "Highlight" DROP CONSTRAINT "Highlight_sentenceId_fkey";

-- DropForeignKey
ALTER TABLE "Sentence" DROP CONSTRAINT "Sentence_documentId_fkey";

-- AlterTable
ALTER TABLE "Highlight" DROP COLUMN "sentenceId",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "endIndex" INTEGER NOT NULL,
ADD COLUMN     "startIndex" INTEGER NOT NULL,
ADD COLUMN     "text" TEXT NOT NULL,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- DropTable
DROP TABLE "Sentence";

-- AddForeignKey
ALTER TABLE "Highlight" ADD CONSTRAINT "Highlight_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
