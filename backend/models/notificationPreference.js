const mongoose = require("mongoose");

const notificationPreferenceSchema = new mongoose.Schema(
	{
		userId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			index: true,
			required: true,
			unique: true,
		},
		enabled: { type: Boolean, default: true },
	},
	{ timestamps: true }
);

module.exports = mongoose.model(
	"NotificationPreference",
	notificationPreferenceSchema
);
