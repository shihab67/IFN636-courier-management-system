const express = require("express");
const {
	getAllDeliveries,
	getDelivery,
	createDelivery,
	updateDelivery,
} = require("../controllers/deliveryController");
const { protect } = require("../middleware/authMiddleware");
const hasAccess = require("../middleware/hasAccessMiddleware");
const router = express.Router();

router.get(
	"/",
	protect,
	hasAccess(["Admin", "Courier", "Customer"]),
	getAllDeliveries
);

router.post("/", protect, hasAccess(["Customer"]), createDelivery);

router.get(
	"/:id",
	protect,
	hasAccess(["Admin", "Courier", "Customer"]),
	getDelivery
);

router.patch("/:id", protect, hasAccess(["Admin", "Courier"]), updateDelivery);

module.exports = router;
