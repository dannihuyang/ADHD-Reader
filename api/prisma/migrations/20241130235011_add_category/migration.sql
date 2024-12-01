/*
  Warnings:

  - You are about to drop the column `category` on the `Highlight` table. All the data in the column will be lost.
  - You are about to drop the column `documentId` on the `Highlight` table. All the data in the column will be lost.
  - You are about to drop the column `endIndex` on the `Highlight` table. All the data in the column will be lost.
  - You are about to drop the column `isRead` on the `Highlight` table. All the data in the column will be lost.
  - You are about to drop the column `startIndex` on the `Highlight` table. All the data in the column will be lost.
  - You are about to drop the `Settings` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `categoryId` to the `Highlight` table without a default value. This is not possible if the table is not empty.
  - Added the required column `sentenceId` to the `Highlight` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Highlight" DROP CONSTRAINT "Highlight_documentId_fkey";

-- DropForeignKey
ALTER TABLE "Settings" DROP CONSTRAINT "Settings_userId_fkey";

-- AlterTable
ALTER TABLE "Highlight" DROP COLUMN "category",
DROP COLUMN "documentId",
DROP COLUMN "endIndex",
DROP COLUMN "isRead",
DROP COLUMN "startIndex",
ADD COLUMN     "categoryId" TEXT NOT NULL,
ADD COLUMN     "sentenceId" TEXT NOT NULL;

-- DropTable
DROP TABLE "Settings";

-- CreateTable
CREATE TABLE "Sentence" (
    "id" TEXT NOT NULL,
    "sequence" TEXT NOT NULL,
    "index" INTEGER NOT NULL,
    "documentId" TEXT NOT NULL,

    CONSTRAINT "Sentence_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Category" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "color" TEXT,
    "documentId" TEXT NOT NULL,

    CONSTRAINT "Category_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Sentence_documentId_sequence_key" ON "Sentence"("documentId", "sequence");

-- CreateIndex
CREATE UNIQUE INDEX "Category_documentId_name_key" ON "Category"("documentId", "name");

-- AddForeignKey
ALTER TABLE "Sentence" ADD CONSTRAINT "Sentence_documentId_fkey" FOREIGN KEY ("documentId") REFERENCES "Document"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Category" ADD CONSTRAINT "Category_documentId_fkey" FOREIGN KEY ("documentId") REFERENCES "Document"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Highlight" ADD CONSTRAINT "Highlight_sentenceId_fkey" FOREIGN KEY ("sentenceId") REFERENCES "Sentence"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Highlight" ADD CONSTRAINT "Highlight_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE CASCADE ON UPDATE CASCADE;
