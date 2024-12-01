/*
  Warnings:

  - You are about to drop the `Paragraph` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ReadingSession` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `SessionEvent` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Paragraph" DROP CONSTRAINT "Paragraph_documentId_fkey";

-- DropForeignKey
ALTER TABLE "Paragraph" DROP CONSTRAINT "Paragraph_sessionId_fkey";

-- DropForeignKey
ALTER TABLE "ReadingSession" DROP CONSTRAINT "ReadingSession_documentId_fkey";

-- DropForeignKey
ALTER TABLE "ReadingSession" DROP CONSTRAINT "ReadingSession_userId_fkey";

-- DropForeignKey
ALTER TABLE "SessionEvent" DROP CONSTRAINT "SessionEvent_sessionId_fkey";

-- AlterTable
ALTER TABLE "Document" ALTER COLUMN "title" DROP NOT NULL;

-- DropTable
DROP TABLE "Paragraph";

-- DropTable
DROP TABLE "ReadingSession";

-- DropTable
DROP TABLE "SessionEvent";

-- CreateTable
CREATE TABLE "Highlight" (
    "id" TEXT NOT NULL,
    "startIndex" INTEGER NOT NULL,
    "endIndex" INTEGER NOT NULL,
    "category" TEXT NOT NULL,
    "isRead" BOOLEAN NOT NULL DEFAULT false,
    "documentId" TEXT NOT NULL,

    CONSTRAINT "Highlight_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Highlight" ADD CONSTRAINT "Highlight_documentId_fkey" FOREIGN KEY ("documentId") REFERENCES "Document"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
