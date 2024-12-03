// highlights.js
const express = require("express");
const router = express.Router();
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const requireAuth = require("../middleware/auth");
const { generateHighlights } = require("../utils/openai");

// GET highlights for a category
router.get("/:categoryId", requireAuth, async (req, res) => {
    try {
        // First verify the category belongs to the user
        const category = await prisma.category.findUnique({
            where: {
                id: req.params.categoryId,
                document: {
                    userId: req.user.id
                }
            },
            include: {
                document: true
            }
        });

        if (!category) {
            return res.status(404).json({ 
                error: "Category not found or unauthorized" 
            });
        }

        // Then get all highlights for this category
        const highlights = await prisma.highlight.findMany({
            where: {
                categoryId: req.params.categoryId
            },
            select: {
                id: true,
                text: true,
                categoryId: true,
                category: {
                    select: {
                        name: true,
                        color: true
                    }
                }
            }
        });

        res.json({
            category: {
                id: category.id,
                name: category.name,
                color: category.color,
                documentId: category.documentId
            },
            highlights: highlights
        });

    } catch (error) {
        console.error("Error fetching highlights:", error);
        res.status(500).json({ 
            error: "Error fetching highlights",
            details: error.message 
        });
    }
});

// Generate highlights for a specific category using OpenAI
router.post("/generate/:categoryId", requireAuth, async (req, res) => {
    try {
        const { categoryId } = req.params;
        
        const category = await prisma.category.findUnique({
            where: { id: categoryId },
            include: { document: true }
        });

        if (!category || !category.document) {
            return res.status(404).json({ error: 'Category or document not found' });
        }

        // Generate highlights with semantic anchors
        const result = await generateHighlights(category.document.content, [category]);

        // Store highlights using transaction
        await prisma.$transaction([
            prisma.highlight.deleteMany({
                where: {
                    categoryId: categoryId
                }
            }),
            prisma.highlight.createMany({
                data: result.highlights.map(highlight => ({
                    text: highlight.text,
                    categoryId: categoryId
                }))
            })
        ]);

        res.json({ 
            category,
            highlights: result.highlights
        });

    } catch (error) {
        console.error('Error generating highlights:', error);
        res.status(500).json({ error: 'Failed to generate highlights' });
    }
});


module.exports = router;
