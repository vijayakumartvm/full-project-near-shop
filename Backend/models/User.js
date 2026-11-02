import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },

    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
    },

    password: {
        type: String,
        required: true,
        minlength: 8,
        select: false,
    },

    phone: {
        type: String,
        default: "",
    },

    role: {
        type: String,
        enum: ["customer", "seller", "admin"],
        default: "customer",
    },

    isActive: {
        type: Boolean,
        default: true,
    },

    isEmailVerified: {
        type: Boolean,
        default: false,
    },
}, { timestamps: true });

const User = mongoose.model("User", userSchema);

export default User;