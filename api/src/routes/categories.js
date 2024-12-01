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

// Update a category (name/color only)
router.put("/:id", requireAuth, async (req, res) => {
    const { name, color } = req.body;

    // Validate color
    const allowedColors = Object.values(CATEGORY_COLORS);
    if (color && !allowedColors.includes(color)) {
        return res.status(400).json({ 
            error: "Invalid color",
            details: `Color must be one of: ${allowedColors.join(', ')}`
        });
    }
    try {
        const category = await prisma.category.update({
            where: {
                id: req.params.id,
                document: {
                    userId: req.user.id  // Verify ownership through document
                }
            },
            data: {
                name,
                color
            }
        });
        res.json(category);
    } catch (error) {
        console.error("Error details:", error);
        res.status(400).json({ 
            error: "Error updating category",
            details: error.message 
        });
    }
});


module.exports = router;

