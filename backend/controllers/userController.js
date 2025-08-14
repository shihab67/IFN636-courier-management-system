const asyncHandler = require("express-async-handler");
const User = require("../models/User");
const Role = require("../models/Role");

const users = asyncHandler(async (req, res) => {
	try {
		const users = await User.find()
			.select("-password")
			.populate("role")
			.sort({
				_id: -1,
			});
		res.json({
			success: true,
			data: users,
		});
	} catch (error) {
		res.status(500).json({ success: false, message: error.message });
	}
});

const user = asyncHandler(async (req, res) => {
	try {
		const user = await User.findById(req.params.id)
			.select("-password")
			.populate("role");
		res.json({
			success: true,
			data: user,
		});
	} catch (error) {
		res.status(500).json({ success: false, message: error.message });
	}
});

const createUser = asyncHandler(async (req, res) => {
	try {
		const { name, email, password, role } = req.body;
		const findRole = await Role.findOne({ name: role });

		if (!findRole) {
			return res.status(400).json({
				success: false,
				message: "Role not found",
			});
		}
		const user = await User.create({
			name,
			email,
			password,
			role: findRole._id,
		});
		res.status(201).json({
			success: true,
			message: "User created successfully",
		});
	} catch (error) {
		res.status(500).json({ success: false, message: error.message });
	}
});

const updateUser = asyncHandler(async (req, res) => {
	try {
		const user = await User.findById(req.params.id);
		if (!user) {
			return res.status(404).json({
				success: false,
				message: "User not found",
			});
		}

		const checkIfEmailExists = await User.findOne({
			email: req.body.email,
			_id: { $ne: req.params.id },
		});

		if (checkIfEmailExists) {
			return res.status(400).json({
				success: false,
				message: "Email already in use by another user",
			});
		}
		const { name, email, password, role, status } = req.body;
		const findRole = await Role.findOne({ name: role });
		user.name = name || user.name;
		user.email = email || user.email;
		user.password = password || user.password;
		user.role = findRole._id;
		user.status = status || user.status;
		const updatedUser = await user.save();
		res.json({
			success: true,
			message: "User updated successfully",
		});
	} catch (error) {
		res.status(500).json({ success: false, message: error.message });
	}
});

const deleteUser = asyncHandler(async (req, res) => {
	try {
		const user = await User.findById(req.params.id);
		if (!user) {
			return res.status(404).json({
				success: false,
				message: "User not found",
			});
		}
		await user.remove();
		res.json({
			success: true,
			message: "User deleted successfully",
		});
	} catch (error) {
		res.status(500).json({ success: false, message: error.message });
	}
});

module.exports = { users, user, createUser, updateUser, deleteUser };
