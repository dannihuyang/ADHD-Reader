const express = require("express");
const router = express.Router();
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const requireAuth = require("../middleware/auth");
const { CATEGORY_COLORS } = require("../config/constants");

// Get all categories for a document, assuming the documentId is in the request params
router.get("/:documentId", requireAuth, async (req, res) => {
	const { documentId } = req.params; // access the documentId from the request params
    if (!documentId) {
        return res.status(400).json({ error: "Document ID is required" });
	}
	try {
        const categories = await prisma.category.findMany({
            where: { 
                documentId,
                document: {
                    userId: req.user.id  // Check ownership through document relation
                }
            }
        });
        res.json(categories);
    } catch (error) {
        res.status(500).json({ error: "Error fetching categories" });
    }
});

// Update category
router.put("/:categoryId", requireAuth, async (req, res) => {
    const { categoryId } = req.params;
    const { name, color } = req.body;

    try {
        // First check if the name already exists for this document
        const existingCategory = await prisma.category.findFirst({
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

        if (!existingCategory) {
            return res.status(404).json({ error: "Category not found" });
        }

        // Check for duplicate name in the same document
        const duplicateCategory = await prisma.category.findFirst({
            where: {
                documentId: existingCategory.documentId,
                name: name,
                id: { not: categoryId } // Exclude current category
            }
        });

        if (duplicateCategory) {
            return res.status(400).json({
                error: "Category name already exists in this document",
                details: "Please choose a different name"
            });
        }

        // If no duplicate, proceed with update
        const category = await prisma.category.update({
            where: { id: categoryId },
            data: { name, color }
        });

        res.json(category);
    } catch (error) {
        console.error("Error updating category:", error);
        res.status(400).json({ 
            error: "Failed to update category",
            details: error.message 
        });
    }
});


module.exports = router;

