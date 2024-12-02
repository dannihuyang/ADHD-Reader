const express = require("express");
const { PrismaClient } = require("@prisma/client");
const router = express.Router();
const prisma = new PrismaClient();
const requireAuth = require("../middleware/auth"); // ensure only authenticated users can access routes
const { generateCategories, generateTitle } = require("../utils/openai"); // import processDocumentWithAI function

// Get documents for logged in user
router.get("/", requireAuth, async (req, res) => {
	try {
		const documents = await prisma.document.findMany({
			where: { userId: req.user.id },
		});
		res.json(documents);
	} catch (error) {
		res
			.status(500)
			.json({ error: "Error fetching documents", details: error.message });
	}
});

// Create a new document with AI-generated tile and categories
router.post("/", requireAuth, async (req, res) => {
	const { content, title: userTitle, autoGenerateCategories, categories } = req.body;
	const userId = req.user.id;

	try {
		// Generate title if needed
		const title = userTitle?.trim() || await generateTitle(content);
		
		// Create document with either AI or manual categories
		const document = await prisma.document.create({
			data: {
				title,
				content,
				userId,
				categories: {
					create: autoGenerateCategories
						? await generateCategories(content)  // AI generates categories
						: categories.map(cat => ({          // Use manual categories
							name: cat.name || "Untitled Category",
							color: cat.color
						}))
				}
			},
			include: {
				categories: true
			}
		});

		res.status(201).json({ document });

	} catch (error) {
		console.error("Error creating document:", error);
		res.status(400).json({
			error: "Error creating document",
			details: error.message
		});
	}
});

// Get a specific document
router.get("/:id", requireAuth, async (req, res) => {
	const { id } = req.params;
	try {
		const document = await prisma.document.findUnique({
			where: { id },
			include: {
				categories: true,
			},

		});
		if (!document) {
			return res.status(404).json({ error: "Document not found" });
		}
		res.json(document);
	} catch (error) {
		res.status(500).json({ error: "Error fetching document" });
	}
});

// Update a document
router.put("/:id", requireAuth, async (req, res) => {
	const { id } = req.params;
	const { title, content, isPublic } = req.body;

	try {
		const updatedDocument = await prisma.document.update({
			where: { id },
			data: { title, content, isPublic },
		});

		res.json({ message: "Document updated", updatedDocument });
	} catch (error) {
		res
			.status(400)
			.json({ error: "Error updating document", details: error.message });
	}
});

// Delete a document
router.delete("/:id", requireAuth, async (req, res) => {
	const { id } = req.params;

	try {
		// First check if document exists
		const document = await prisma.document.findUnique({
			where: { id },
		});

		if (!document) {
			console.log("Document not found with ID:", id); // Debug log
			return res.status(404).json({ error: "Document not found" });
		}

		// Check if user owns the document
		if (document.userId !== req.user.id) {
			console.log("Unauthorized deletion attempt"); // Debug log
			return res.status(403).json({ error: "Unauthorized" });
		}

		await prisma.document.delete({ where: { id } });
		res.json({ message: "Document deleted" });
	} catch (error) {
		console.error("Delete error:", error); // Debug log
		res.status(400).json({
			error: "Error deleting document",
			details: error.message,
			code: error.code, // Include Prisma error code if available
		});
	}
});

module.exports = router;
