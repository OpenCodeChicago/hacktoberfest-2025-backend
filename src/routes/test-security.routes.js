import express from 'express';
import { strictRateLimit } from '../middleware/rateLimiter.middleware.js';

const router = express.Router();

/**
 * GET /api/test/rate-limit
 * Test endpoint to verify rate limiting is working
 * Uses strict rate limiting (10 requests per minute)
 */
router.get('/rate-limit', strictRateLimit, (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Rate limit test endpoint - this should be limited to 10 requests per minute',
    timestamp: new Date().toISOString(),
    ip: req.ip,
    userAgent: req.get('User-Agent'),
  });
});

/**
 * GET /api/test/cors
 * Test endpoint to verify CORS is working
 */
router.get('/cors', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'CORS test endpoint',
    origin: req.headers.origin,
    method: req.method,
    headers: {
      'Access-Control-Allow-Origin': res.get('Access-Control-Allow-Origin'),
      'Access-Control-Allow-Methods': res.get('Access-Control-Allow-Methods'),
      'Access-Control-Allow-Headers': res.get('Access-Control-Allow-Headers'),
    },
  });
});

/**
 * OPTIONS /api/test/cors
 * Test CORS preflight request
 */
router.options('/cors', (req, res) => {
  res.status(200).end();
});

/**
 * GET /api/test/security-headers
 * Test endpoint to verify security headers
 */
router.get('/security-headers', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Security headers test endpoint',
    headers: {
      'X-Content-Type-Options': res.get('X-Content-Type-Options'),
      'X-Frame-Options': res.get('X-Frame-Options'),
      'X-XSS-Protection': res.get('X-XSS-Protection'),
      'Strict-Transport-Security': res.get('Strict-Transport-Security'),
    },
  });
});

export default router;
