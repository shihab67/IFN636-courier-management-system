const express = require("express");
const { protect } = require("../middleware/authMiddleware");
const hasAccess = require("../middleware/hasAccessMiddleware");
const router = express.Router();
const c = require("../controllers/ticketController");
const ensureTicketParticipant = require("../middleware/ensureTicketParticipant");

router.post("/", protect, hasAccess("Customer"), c.create);
router.get("/", protect, c.list);
router.get("/:id", protect, ensureTicketParticipant, c.get);
router.put("/:id", protect, ensureTicketParticipant, c.update);

router.patch("/:id/transition", protect, hasAccess("Admin"), c.transition);
router.get("/:id/comments", protect, c.getComments);
router.post("/:id/comments", protect, ensureTicketParticipant, c.comment);

router.get("/me/notifications", protect, c.notifications);

module.exports = router;