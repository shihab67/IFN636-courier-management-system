const asyncHandler = require("express-async-handler");
const Role = require("../models/Role");
const User = require("../models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const generateToken = (id) => {
	return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "30d" });
};

const registerUser = async (req, res) => {
	const { name, email, password } = req.body;
	try {
		const userExists = await User.findOne({ email });
		if (userExists)
			return res
				.status(400)
				.json({ success: false, message: "User already exists!" });

		const customerRole = await Role.findOne({ name: "Customer" });
		const courierRole = await Role.findOne({ name: "Courier" });
		await User.create({
			name,
			email,
			password,
			role:
				req.body?.role && req.body.role === "Courier"
					? courierRole._id
					: customerRole._id,
		});

		res.status(201).json({
			success: true,
			message: "Account created successfully!",
		});
	} catch (error) {
		res.status(500).json({ success: false, message: error.message });
	}
};

const loginUser = async (req, res) => {
	const { email, password } = req.body;
	try {
		const user = await User.findOne({ email }).populate("role");
		if (user && (await bcrypt.compare(password, user.password))) {
			res.json({
				success: true,
				message: "Login successful",
				data: {
					id: user.id,
					name: user.name,
					email: user.email,
					role: user.role?.name,
					token: generateToken(user.id),
				},
			});
		} else {
			res.status(401).json({
				success: false,
				message: "Invalid email or password",
			});
		}
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};

const getProfile = async (req, res) => {
	try {
		const user = await User.findById(req.user.id);
		if (!user) {
			return res.status(404).json({ message: "User not found" });
		}

		res.status(200).json({
			name: user.name,
			email: user.email,
			university: user.university,
			address: user.address,
		});
	} catch (error) {
		res.status(500).json({ message: "Server error", error: error.message });
	}
};

const updateUserProfile = async (req, res) => {
	try {
		const user = await User.findById(req.user.id);
		if (!user) return res.status(404).json({ message: "User not found" });

		const { name, email, university, address } = req.body;
		user.name = name || user.name;
		user.email = email || user.email;
		user.university = university || user.university;
		user.address = address || user.address;

		const updatedUser = await user.save();
		res.json({
			id: updatedUser.id,
			name: updatedUser.name,
			email: updatedUser.email,
			university: updatedUser.university,
			address: updatedUser.address,
			token: generateToken(updatedUser.id),
		});
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};

const updateUserPassword = asyncHandler(async (req, res) => {
	try {
		const { currentPassword, password } = req.body;
		const user = await User.findById(req.user.id);
		if (!user) {
			return res
				.status(404)
				.json({ success: false, message: "User not found" });
		}

		const isMatch = await bcrypt.compare(currentPassword, user.password);
		if (!isMatch) {
			return res.status(400).json({
				success: false,
				message: "Current password is incorrect",
			});
		}
		user.password = password;
		await user.save();
		res.json({ success: true, message: "Password updated successfully" });
	} catch (error) {
		console.log(error);
		res.status(500).json({ success: false, message: error.message });
	}
});

module.exports = {
	registerUser,
	loginUser,
	updateUserProfile,
	getProfile,
	updateUserPassword,
};
