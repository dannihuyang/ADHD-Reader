// Middleware to process requests before they reach the route handler
// Generalize token-checking logic for protecting any route
// Check if user are logged in (via token cookie)
// Parse incoming data
// Returns errors if someone tries to access protects routes without logging in

const jwt = require("jsonwebtoken");

const requireAuth = (req, res, next) => {
	const token = req.cookies?.token || req.headers.authorization?.split(" ")[1];

	if (!token) {
		console.log("No token found");
		return res.status(401).json({ error: "Unauthorized" });
	}

	try {
		const decoded = jwt.verify(token, process.env.JWT_SECRET);
		req.user = { id: decoded.id };
		next();
	} catch (error) {
		console.log(error);
		return res.status(401).json({ error: "Invalid or expired token" });
	}
};

module.exports = requireAuth;
