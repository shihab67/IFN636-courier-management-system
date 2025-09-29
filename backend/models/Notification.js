const mongoose = require("mongoose");
const notificationSchema = new mongoose.Schema(
	{
		userId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},
		ticketId: { type: mongoose.Schema.Types.ObjectId, ref: "Ticket" },
		type: { type: String, required: true }, // e.g., TICKET_CREATED
		payload: { type: Object, default: {} },
		isRead: { type: Boolean, default: false },
	},
	{ timestamps: true }
);
module.exports = mongoose.model("Notification", notificationSchema);
