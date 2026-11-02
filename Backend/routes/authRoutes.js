import express from "express";
import {
    registerUser,
    loginUser,
} from "../controllers/authController.js";

const router = express.Router();

// Customer and seller registration
router.post("/register", registerUser);

// Customer, seller and admin login
router.post("/login", loginUser);

export default router;