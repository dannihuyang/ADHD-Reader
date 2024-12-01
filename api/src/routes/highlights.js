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
                startIndex: true,
                endIndex: true,
                text: true,
                categoryId: true,
                category: {
                    select: {
                        name: true,
                        color: true
                    }
                }
            },
            orderBy: {
                startIndex: 'asc'  // Order highlights by their position in text
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
    const { categoryId } = req.params;

    try {
        // Fetch category and its document
        const category = await prisma.category.findUnique({
            where: {
                id: categoryId,
                document: {
                    userId: req.user.id
                }
            },
            include: {
                document: true
            }
        });

        if (!category) {
            return res.status(404).json({ error: "Category not found or unauthorized" });
        }

        // First delete any existing highlights for this category
        await prisma.highlight.deleteMany({
            where: {
                categoryId: category.id
            }
        });

        // Generate highlights using OpenAI for this specific category
        const generatedHighlights = await generateHighlights(
            category.document.content,
            [category] // Pass only this category
        );

        // Create the highlights in the database
        const createdHighlights = await Promise.all(
            (generatedHighlights.categoryHighlights[category.id] || []).map(highlight =>
                prisma.highlight.create({
                    data: {
                        startIndex: highlight.startIndex,
                        endIndex: highlight.endIndex,
                        text: highlight.text,
                        categoryId: category.id
                    },
                    include: {
                        category: {
                            select: {
                                name: true,
                                color: true
                            }
                        }
                    }
                })
            )
        );

        res.json({
            category: {
                id: category.id,
                name: category.name,
                color: category.color
            },
            highlights: createdHighlights
        });

    } catch (error) {
        console.error("Error generating highlights:", error);
        res.status(500).json({ 
            error: "Error generating highlights",
            details: error.message 
        });
    }
});

module.exports = router;
