const express = require("express");
const { PrismaClient } = require("@prisma/client");
const router = express.Router();
const prisma = new PrismaClient();
const requireAuth = require("../middleware/auth");

// Create sentences for a document
router.post("/:documentId", requireAuth, async (req, res) => {
    const { documentId } = req.params;

    try {
        // Get document and verify ownership
        const document = await prisma.document.findFirst({
            where: {
                id: documentId,
                userId: req.user.id // for security
            }
        });

        if (!document) {
            return res.status(404).json({
                error: "Document not found or unauthorized"
            });
        }

        const sentences = await prisma.sentence.createMany({
            data: content.split(/[.!?]+\s/).map((text, index) => ({
                text: text.trim(),
                index,
                userId: req.user.id,
                documentId
            }))
        });

        res.status(201).json(sentences);
    } catch (error) {
        res.status(400).json({
            error: "Error creating sentences",
            details: error.message
        });
    }
});

module.exports = router;