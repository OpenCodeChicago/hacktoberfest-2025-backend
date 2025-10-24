import express from 'express';
import {
  googleAuth,
  googleCallback,
  getProfile,
  logout,
  refreshToken,
  //confirmGoogleLink,
  login,
  signUp
} from '../controllers/auth.controller.js';
// use centralized middleware that validates tokenVersion and expiry
import { authenticateToken } from '../middleware/auth.middleware.js';
import { generalRateLimit } from '../middleware/rateLimiter.middleware.js';

const router = express.Router();

// MAX 2 requests from the same IP in a span of 1 Minute
const loginRateLimit = generalRateLimit(2,1);

// MAX 3 requests from the same IP in a span of 1 Hour
const registerRateLimit = generalRateLimit(3,60);

//Passport-local routes
//login
router.post('/login',loginRateLimit, login);
//register
router.post('/signup',registerRateLimit, signUp);

// Google OAuth routes
router.get('/google', googleAuth);
router.get('/google/callback', googleCallback);

// Protected routes (require JWT authentication)
router.get('/profile', generalRateLimit(60,1), authenticateToken, getProfile);
router.post('/logout', generalRateLimit(10,1), authenticateToken, logout);
router.post('/refresh', generalRateLimit(5,1), authenticateToken, refreshToken);

// add route to confirm link (no auth required)
//router.post('/confirm-google-link', confirmGoogleLink);

export default router;
