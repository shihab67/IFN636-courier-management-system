const hasAccessMiddleware = (allowedRoles) => {
	return (req, res, next) => {
		try {
			if (!req.user || !req.user.role) {
				return res
					.status(401)
					.json({ message: "Unauthorized: No user info" });
			}

			// Convert to array if a single role string is passed
			if (typeof allowedRoles === "string") {
				allowedRoles = [allowedRoles];
			}

			if (!allowedRoles.includes(req.user.role.name)) {
				return res
					.status(403)
					.json({ message: "Forbidden: You don't have access" });
			}

			next();
		} catch (error) {
			console.error(error);
			res.status(500).json({ message: "Server error" });
		}
	};
};

module.exports = hasAccessMiddleware;
