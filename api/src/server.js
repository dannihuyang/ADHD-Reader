// Entry point for backend server
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const documentsRoutes = require("./routes/documents");
const authRoutes = require("./routes/auth");
const highlightsRoutes = require("./routes/highlights");
const categoriesRoutes = require("./routes/categories");
const sentencesRoutes = require("./routes/sentences");
const app = express();

// Middleware
app.use(
	cors({
		origin: "http://localhost:5173", // Frontend URL
		credentials: true, // Allow cookies to be sent/received
	})
);
app.use(express.json()); // parses JSON data in the request body
app.use(cookieParser()); // parses cookies in the request headers

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/documents", documentsRoutes);
app.use("/api/highlights", highlightsRoutes);
app.use("/api/categories", categoriesRoutes);
app.use("/api/sentences", sentencesRoutes);

// Start the server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
	console.log(`Server is running on http://localhost:${PORT}`);
});

// Root route
app.get("/", (req, res) => {
	res.send("API is running");
});

// Ping route
app.get("/ping", (req, res) => {
	res.json({ message: "pong" });
});
