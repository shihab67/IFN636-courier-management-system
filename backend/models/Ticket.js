const mongoose = require("mongoose");

const ticketSchema = new mongoose.Schema(
	{
		title: { type: String, required: true, trim: true },
		description: { type: String, required: true },
		category: {
			type: String,
			enum: ["DELIVERY", "BILLING", "TECH", "GENERAL"],
			default: "GENERAL",
		},
		priority: {
			type: String,
			enum: ["LOW", "MEDIUM", "HIGH", "URGENT"],
			default: "MEDIUM",
		},
		status: {
			type: String,
			enum: [
				"OPEN",
				"ASSIGNED",
				"IN_PROGRESS",
				"REQUEST_INFO",
				"RESOLVED",
				"CLOSED",
			],
			default: "OPEN",
		},
		createdBy: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},
		assignedTo: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			default: null,
		},
	},
	{ timestamps: true }
);

module.exports = mongoose.model("Ticket", ticketSchema);
