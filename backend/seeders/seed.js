import dotenv from "dotenv";
import asyncHandler from "express-async-handler";
import mongoose from "mongoose";
dotenv.config();

import connectDB from "../config/db.js";
import Role from "../models/Role.js";
import User from "../models/User.js";

const seedData = asyncHandler(async () => {
	await connectDB();

	// Seed roles if not exists
	const rolesToSeed = [
		{
			name: "Admin",
			description: "Full access",
			status: true,
			can_delete: false,
		},
		{
			name: "Courier",
			description: "Handles deliveries",
			status: true,
			can_delete: false,
		},
		{
			name: "Customer",
			description: "Places orders",
			status: true,
			can_delete: false,
		},
	];

	for (const roleData of rolesToSeed) {
		const existingRole = await Role.findOne({ name: roleData.name });
		if (!existingRole) {
			await Role.create(roleData);
			console.log(`Role created: ${roleData.name}`);
		} else {
			console.log(`Role exists: ${roleData.name}`);
		}
	}

	const adminRole = await Role.findOne({ name: "Admin" });
	const courierRole = await Role.findOne({ name: "Courier" });
	const customerRole = await Role.findOne({ name: "Customer" });

	//Seed users if does not exist
	const password = "adminpass";
	const usersToSeed = [
		{
			name: "Super Admin",
			email: "admin@gmail.com",
			password: password,
			role: adminRole._id,
		},
		{
			name: "Courier 1",
			email: "courier1@gmail.com",
			password: password,
			role: courierRole._id,
		},
		{
			name: "Courier 2",
			email: "courier2@gmail.com",
			password: password,
			role: courierRole._id,
		},
		{
			name: "Courier 3",
			email: "courier3@gmail.com",
			password: password,
			role: courierRole._id,
		},
		{
			name: "Customer 1",
			email: "customer1@gmail.com",
			password: password,
			role: customerRole._id,
		},
		{
			name: "Customer 2",
			email: "customer2@gmail.com",
			password: password,
			role: customerRole._id,
		},
		{
			name: "Customer 3",
			email: "customer3@gmail.com",
			password: password,
			role: customerRole._id,
		},
	];

	for (const userData of usersToSeed) {
		const existingUser = await User.findOne({ email: userData.email });
		if (!existingUser) {
			await User.create(userData);
			console.log(`User created: ${userData.name}`);
		} else {
			console.log(`User exists: ${userData.name}`);
		}
	}

	console.log("Seed data inserted successfully!");

	// Close connection
	await mongoose.connection.close();
});

// Run seeder with error handling
seedData().catch((err) => {
	console.error("Seeding failed:", err);
	process.exit(1);
});
