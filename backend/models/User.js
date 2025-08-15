const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema({
	name: { type: String, required: true, trim: true },
	email: {
		type: String,
		required: true,
		unique: true,
		lowercase: true,
		trim: true,
	},
	password: { type: String, required: true },
	phone_number: { type: String, trim: true, default: null },
	address: { type: String, trim: true, default: null },
	role: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "Role",
		required: true,
	},
	status: {
		type: Boolean,
		default: true,
	},
});

userSchema.pre("save", async function (next) {
	if (!this.isModified("password")) return next();
	const salt = await bcrypt.genSalt(10);
	this.password = await bcrypt.hash(this.password, salt);
});

module.exports = mongoose.model("User", userSchema);
