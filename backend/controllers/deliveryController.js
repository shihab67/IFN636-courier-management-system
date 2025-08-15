const asyncHandler = require("express-async-handler");
const Delivery = require("../models/Delivery");

const getAllDeliveries = asyncHandler(async (req, res) => {
	try {
		let deliveries;

		if (req.user.role.name === "Customer") {
			deliveries = Delivery.find({ customerId: req.user.id });
		} else if (req.user.role.name === "Courier") {
			deliveries = Delivery.find({ courierId: req.user.id });
		} else {
			deliveries = Delivery.find();
		}

		deliveries = await deliveries
			.populate("customerId", "name email phone") // only return these fields
			.populate("courierId", "name email phone");

		res.json({
			success: true,
			data: deliveries,
		});
	} catch (error) {
		res.status(500).json({ success: false, message: error.message });
	}
});

const getDelivery = asyncHandler(async (req, res) => {
	try {
		const delivery = await Delivery.findById(req.params.id)
			.populate("customerId", "name email phone")
			.populate("courierId", "name email phone");
		res.json({
			success: true,
			data: delivery,
		});
	} catch (error) {
		res.status(500).json({ success: false, message: error.message });
	}
});

const createDelivery = asyncHandler(async (req, res) => {
	try {
		const {
			packageDescription,
			weight,
			price,
			pickupAddress,
			deliveryAddress,
		} = req.body;
		await Delivery.create({
			customerId: req.user.id,
			packageDescription,
			weight,
			price,
			pickupAddress,
			deliveryAddress,
		});
		res.json({
			success: true,
			message: "Delivery created successfully",
		});
	} catch (error) {
		res.status(500).json({ success: false, message: error.message });
	}
});

const updateDelivery = asyncHandler(async (req, res) => {
	try {
		const { status, deliveryManId } = req.body; // pick only allowed fields

		const delivery = await Delivery.findByIdAndUpdate(
			req.params.id,
			{ status, courierId: deliveryManId },
			{ new: true }
		);

		if (!delivery) {
			return res.status(404).json({
				success: false,
				message: "Delivery not found",
			});
		}

		res.json({
			success: true,
			message: "Delivery updated successfully",
			data: delivery,
		});
	} catch (error) {
		res.status(500).json({ success: false, message: error.message });
	}
});

module.exports = {
	getAllDeliveries,
	getDelivery,
	createDelivery,
	updateDelivery,
};
