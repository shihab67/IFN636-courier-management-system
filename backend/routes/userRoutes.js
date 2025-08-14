const express = require("express");
const {
	users,
	user,
	createUser,
	updateUser,
	deleteUser,
} = require("../controllers/userController");
const { protect } = require("../middleware/authMiddleware");
const hasAccess = require("../middleware/hasAccessMiddleware");
const router = express.Router();

router.get("/", protect, hasAccess("Admin"), users);
router.get("/:id", protect, hasAccess("Admin"), user);
router.post("/", protect, hasAccess("Admin"), createUser);
router.patch("/:id", protect, hasAccess("Admin"), updateUser);
router.delete("/:id", protect, hasAccess("Admin"), deleteUser);

module.exports = router;
