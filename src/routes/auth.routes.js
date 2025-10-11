import express from 'express';
import {
  googleAuth,
  googleCallback,
  getProfile,
  logout,
  refreshToken
} from '../controllers/auth.controller.js';
import { verifyJWT } from '../config/passport.config.js';

const router = express.Router();

// Google OAuth routes
router.get('/google', googleAuth);
router.get('/google/callback', googleCallback);

// Protected routes (require JWT authentication)
router.get('/profile', verifyJWT, getProfile);
router.post('/logout', verifyJWT, logout);
router.post('/refresh', verifyJWT, refreshToken);

export default router;
