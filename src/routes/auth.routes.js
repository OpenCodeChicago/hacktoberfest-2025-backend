import express from 'express';
import {
  googleAuth,
  googleCallback,
  getProfile,
  logout,
  refreshToken,
  confirmGoogleLink
} from '../controllers/auth.controller.js';
// use centralized middleware that validates tokenVersion and expiry
import { authenticateToken } from '../middleware/auth.middleware.js';

const router = express.Router();

// Google OAuth routes
router.get('/google', googleAuth);
router.get('/google/callback', googleCallback);

// Protected routes (require JWT authentication)
router.get('/profile', authenticateToken, getProfile);
router.post('/logout', authenticateToken, logout);
router.post('/refresh', authenticateToken, refreshToken);

// add route to confirm link (no auth required)
router.post('/confirm-google-link', confirmGoogleLink);

export default router;
