import dotenv from "dotenv";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";

import connectDB from "../config/db.js";
import User from "../models/User.js";

dotenv.config();

const createAdmin = async() => {
    try {
        const { ADMIN_NAME, ADMIN_EMAIL, ADMIN_PASSWORD } = process.env;

        if (!ADMIN_NAME || !ADMIN_EMAIL || !ADMIN_PASSWORD) {
            throw new Error("Admin credentials are missing in .env");
        }

        if (ADMIN_PASSWORD.length < 12) {
            throw new Error("Admin password must be at least 12 characters");
        }

        await connectDB();

        const email = ADMIN_EMAIL.trim().toLowerCase();

        const existingUser = await User.findOne({ email });

        if (existingUser) {
            if (existingUser.role === "admin") {
                console.log("Admin account already exists.");
                return;
            }

            throw new Error("This email already belongs to another user");
        }

        const hashedPassword = await bcrypt.hash(ADMIN_PASSWORD, 12);

        const admin = await User.create({
            name: ADMIN_NAME.trim(),
            email,
            password: hashedPassword,
            role: "admin",
            isActive: true,
            isEmailVerified: false
        });

        console.log("NearShop Admin created successfully!");
        console.log("Admin ID:", admin._id);
        console.log("Admin Email:", admin.email);
        console.log("Admin Role:", admin.role);

    } catch (error) {
        console.error("Admin creation failed:", error.message);
        process.exitCode = 1;
    } finally {
        await mongoose.disconnect();
        console.log("MongoDB connection closed.");
    }
};

createAdmin();