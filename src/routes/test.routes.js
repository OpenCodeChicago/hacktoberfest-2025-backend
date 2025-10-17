import express from 'express';
import { generateTestToken } from '../utils/auth.util.js';

const router = express.Router();

/**
 * GET /api/test/token
 * Generate a test JWT token for development/testing
 * This endpoint should be removed in production
 */
router.get('/token', (req, res) => {
  try {
    const token = generateTestToken();
    
    res.status(200).json({
      success: true,
      message: 'Test token generated successfully',
      data: {
        token,
        expiresIn: '24h',
        note: 'Use this token in Authorization header as: Bearer <token>',
      },
    });
  } catch (error) {
    console.error('Error generating test token:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to generate test token',
    });
  }
});

export default router;
