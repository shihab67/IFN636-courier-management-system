
const express = require('express');
const {
	registerUser,
	loginUser,
	updateUserProfile,
	getProfile,
	updateUserPassword,
} = require("../controllers/authController");
const { protect } = require('../middleware/authMiddleware');
const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/profile', protect, getProfile);
router.patch('/profile', protect, updateUserProfile);
router.patch("/update-password", protect, updateUserPassword);

module.exports = router;
