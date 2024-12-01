// highlights.js
const express = require("express");
const { PrismaClient } = require("@prisma/client");
const router = express.Router();
const prisma = new PrismaClient();
const requireAuth = require("../middleware/auth");

// Get all highlights for a document
router.get(
	"/documents/:documentId/highlights",
	requireAuth,
	async (req, res) => {
		const { documentId } = req.params;
		try {
			const highlights = await prisma.highlight.findMany({
				where: { documentId },
				orderBy: { startIndex: "asc" },
			});
			res.json(highlights);
		} catch (error) {
			res.status(500).json({ error: "Error fetching highlights" });
		}
	}
);

// Create a new highlight
router.post(
	"/documents/:documentId/highlights",
	requireAuth,
	async (req, res) => {
		const { documentId } = req.params;
		const { startIndex, endIndex, category } = req.body;

		try {
			// Check for overlapping highlights
			const existingHighlight = await prisma.highlight.findFirst({
				where: {
					documentId,
					OR: [
						{
							AND: [
								{ startIndex: { lte: startIndex } },
								{ endIndex: { gte: startIndex } },
							],
						},
						{
							AND: [
								{ startIndex: { lte: endIndex } },
								{ endIndex: { gte: endIndex } },
							],
						},
					],
				},
			});

			if (existingHighlight) {
				return res.status(400).json({ error: "Overlapping highlight exists" });
			}

			const highlight = await prisma.highlight.create({
				data: {
					startIndex,
					endIndex,
					category,
					documentId,
				},
			});
			res.status(201).json(highlight);
		} catch (error) {
			res.status(400).json({ error: "Error creating highlight" });
		}
	}
);

// Update highlight category or read status
router.put("/highlights/:id", requireAuth, async (req, res) => {
	const { id } = req.params;
	const { category, isRead } = req.body;

	try {
		const highlight = await prisma.highlight.update({
			where: { id },
			data: {
				...(category && { category }),
				...(isRead !== undefined && { isRead }),
			},
		});
		res.json(highlight);
	} catch (error) {
		res.status(400).json({ error: "Error updating highlight" });
	}
});

// Delete a highlight
router.delete("/highlights/:id", requireAuth, async (req, res) => {
	const { id } = req.params;
	try {
		await prisma.highlight.delete({
			where: { id },
		});
		res.json({ message: "Highlight deleted" });
	} catch (error) {
		res.status(400).json({ error: "Error deleting highlight" });
	}
});

module.exports = router;
