const express = require("express"); // imports Express lib to create and manage routes, middleware, HTTP server logic
const bcrypt = require("bcrypt"); // bcrypt is used to hash and compare passwords securely
const jwt = require("jsonwebtoken"); // create, verify and decodeJSON Web Tokens, stateless way to authenticate users
const { PrismaClient } = require("@prisma/client"); // imports the Prisma Client class

const router = express.Router();
const prisma = new PrismaClient(); // instantiate Prisma Client

// Register a new user
router.post("/register", async (req, res) => {
	const { email, password, name } = req.body;

	if (!email || !password || !name) {
		return res.status(400).json({ error: "All fields are required" });
	}

	if (name.trim() === "") {
		return res.status(400).json({ error: "Name cannot be empty" });
	}

	try {
		// Check if user already exists
		const existingUser = await prisma.user.findUnique({ where: { email } });
		if (existingUser) {
			return res.status(400).json({ error: "Email is already registered" });
		}

		// Hash password
		const hashedPassword = await bcrypt.hash(password, 10);

		// Create new user
		const newUser = await prisma.user.create({
			data: {
				email,
				password: hashedPassword,
				name,
			},
		});

		res
			.status(201)
			.json({ message: "User registered successfully", user: newUser });
	} catch (error) {
		res
			.status(500)
			.json({ error: "Internal server error", details: error.message });
	}
});

// Login user
router.post("/login", async (req, res) => {
	const { email, password } = req.body;

	try {
		const user = await prisma.user.findUnique({ where: { email } });
		if (!user || !(await bcrypt.compare(password, user.password))) {
			return res.status(401).json({ error: "Invalid email or password" });
		}

		const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
			expiresIn: "7d",
		});
		res.cookie("token", token, { httpOnly: true });

		res.json({ message: "Login successful", user });
	} catch (error) {
		res.status(400).json({ error: "Error logging in", details: error.message });
	}
});

// Verify Logged-In User
router.get("/me", async (req, res) => {
	try {
		const token = req.cookies.token; // Read token from cookies sent by the client
		const decoded = jwt.verify(token, process.env.JWT_SECRET); // Verify token using the secret key
		const user = await prisma.user.findUnique({ where: { id: decoded.id } }); // Fetch user details from the database
		res.json(user); // Send the user object as response
	} catch (error) {
		res.status(401).json({ error: "Unauthorized" }); // if token is invalid
	}
});

// Logout user
router.post("/logout", (req, res) => {
	res.clearCookie("token");
	res.json({ message: "Logout successful" });
});

module.exports = router;
