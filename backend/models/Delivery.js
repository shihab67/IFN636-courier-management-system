const mongoose = require("mongoose");

const deliverySchema = new mongoose.Schema(
	{
		customerId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},
		courierId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			default: null,
		},
		pickupAddress: { type: String, required: true },
		deliveryAddress: { type: String, required: true },
		packageDescription: { type: String, required: true },
		weight: { type: Number, required: true }, // in kg
		price: { type: Number, required: true },
		status: {
			type: String,
			enum: ["Pending", "In Transit", "Out For Delivery", "Delivered", "Cancelled"],
			default: "Pending",
		},
	},
	{
		timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
	}
);

module.exports = mongoose.model("Delivery", deliverySchema);
