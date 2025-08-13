const mongoose = require("mongoose");

const roleSchema = new mongoose.Schema(
	{
		name: {
			type: String,
			required: true,
			trim: true,
		},
		description: {
			type: String,
			default: null,
		},
		status: {
			type: Boolean,
			default: true,
		},
		can_delete: {
			type: Boolean,
			default: true,
		},
	},
	{
		timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
	}
);

module.exports = mongoose.model("Role", roleSchema);
