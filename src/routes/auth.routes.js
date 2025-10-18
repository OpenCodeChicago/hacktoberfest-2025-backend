import express from 'express';
import {
  googleAuth,
  googleCallback,
  getProfile,
  logout,
  refreshToken,
} from '../controllers/auth.controller.js';
import { loginUser } from "../controllers/userLogin/Login.controller.js";
import { signup, verifyOtp } from '../controllers/userLogin/signup.controller.js';
// use centralized middleware that validates tokenVersion and expiry
import { authenticateToken } from '../middleware/auth.middleware.js';
import { authRateLimit } from '../middleware/rateLimiter.middleware.js';
import { validateLogin, validateSignup } from '../config/Auth-inputValidator.js';

const router = express.Router();

// Google OAuth routes
router.get('/google', googleAuth);
router.get('/google/callback', googleCallback);

// Protected routes (require JWT authentication)
router.get('/profile', authenticateToken, getProfile);
router.post('/logout', authenticateToken, logout);
router.post('/refresh', authenticateToken, refreshToken);

// add route to confirm link (no auth required)
//router.post('/confirm-google-link', confirmGoogleLink);

router.post("/login", validateLogin, loginUser);
router.post("/signup", validateSignup, signup);
router.post("/verify-otp", verifyOtp);


export default router;

