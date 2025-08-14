const express = require("express");
const {
	users,
	user,
	createUser,
	updateUser,
	deactivateUser,
	myProfile,
} = require("../controllers/userController");
const { protect } = require("../middleware/authMiddleware");
const hasAccess = require("../middleware/hasAccessMiddleware");
const router = express.Router();

router.get("/", protect, hasAccess("Admin"), users);
router.get("/:id", protect, hasAccess("Admin"), user);
router.post("/", protect, hasAccess("Admin"), createUser);
router.patch("/:id", protect, hasAccess("Admin"), updateUser);
router.post("/:id", protect, hasAccess("Admin"), deactivateUser);
router.get("/me/profile", protect, myProfile);

module.exports = router;
