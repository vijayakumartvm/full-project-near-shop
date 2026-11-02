import mongoose from "mongoose";

const connectDB = async() => {
    try {
        if (!process.env.MONGO_URI) {
            throw new Error("MONGO_URI is missing from .env");
        }

        await mongoose.connect(process.env.MONGO_URI);

        console.log(
            `MongoDB Connected Successfully: ${mongoose.connection.host}`
        );

        return mongoose.connection;
    } catch (error) {
        console.error("MongoDB Connection Failed:", error.message);
        throw error;
    }
};

export default connectDB;