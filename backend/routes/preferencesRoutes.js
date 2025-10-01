const express = require("express");
const { protect } = require("../middleware/authMiddleware");
const hasAccess = require("../middleware/hasAccessMiddleware");
const router = express.Router();
const c = require("../controllers/preferencesController");

router.get("/me/notification-preferences", protect, hasAccess("Customer"), c.getMine);
router.put("/me/notification-preferences", protect, hasAccess("Customer"), c.updateMine);

module.exports = router;