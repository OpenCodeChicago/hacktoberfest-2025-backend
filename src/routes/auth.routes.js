import express from 'express';
import { loginUser } from "../controllers/userLogin/Login.controller.js";
import { signup, verifyOtp } from '../controllers/userLogin/signup.controller.js';

const router = express.Router();

router.post("/login", loginUser);
router.post("/signup", signup);
router.post("/verify-otp", verifyOtp);

export default router; 