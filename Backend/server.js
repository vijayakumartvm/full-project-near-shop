import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Frontend and admin connections
const allowedOrigins = [
    "http://localhost:5173",
    "http://localhost:5174",
    "http://127.0.0.1:5173",
    "http://127.0.0.1:5174",
    process.env.FRONTEND_URL,
    process.env.ADMIN_URL,
].filter(Boolean);

// Middleware
app.use(
    cors({
        origin: (origin, callback) => {
            if (!origin || allowedOrigins.includes(origin)) {
                return callback(null, true);
            }

            return callback(new Error("CORS: Origin not allowed"));
        },
        credentials: true,
    })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Authentication APIs
app.use("/api/auth", authRoutes);

// Welcome API
app.get("/", (req, res) => {
    res.json({
        success: true,
        message: "Welcome to NearShop Backend API",
    });
});

// Health check
app.get("/api/health", (req, res) => {
    res.json({
        success: true,
        message: "NearShop backend is running",
        database: "Connected",
    });
});

// Start backend after MongoDB connects
const startServer = async() => {
    try {
        await connectDB();

        app.listen(PORT, () => {
            console.log(`NearShop server running on port ${PORT}`);
        });
    } catch (error) {
        console.error("Unable to start NearShop backend:", error.message);
        process.exit(1);
    }
};

startServer();
startServer();