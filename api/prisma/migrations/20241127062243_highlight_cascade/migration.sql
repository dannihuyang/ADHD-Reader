-- DropForeignKey
ALTER TABLE "Highlight" DROP CONSTRAINT "Highlight_documentId_fkey";

-- AddForeignKey
ALTER TABLE "Highlight" ADD CONSTRAINT "Highlight_documentId_fkey" FOREIGN KEY ("documentId") REFERENCES "Document"("id") ON DELETE CASCADE ON UPDATE CASCADE;
