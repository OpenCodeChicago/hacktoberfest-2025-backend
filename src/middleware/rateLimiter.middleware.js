import rateLimit from 'express-rate-limit';
import slowDown from 'express-slow-down';

/**
 * Rate limiting configuration
 * - 50 requests per minute per IP
 * - Burst up to 100 requests for development
 * - Progressive delays for repeated requests
 */

// General API rate limiter
export const generalRateLimit = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: process.env.NODE_ENV === 'production' ? 50 : 100, // 50 in prod, 100 in dev
  message: {
    success: false,
    message: 'Too many requests from this IP, please try again later.',
    retryAfter: '1 minute',
  },
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  handler: (req, res) => {
    res.status(429).json({
      success: false,
      message: 'Too many requests from this IP, please try again later.',
      retryAfter: '1 minute',
    });
  },
});

// Stricter rate limiter for auth endpoints
export const authRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 attempts per 15 minutes
  message: {
    success: false,
    message: 'Too many authentication attempts, please try again later.',
    retryAfter: '15 minutes',
  },
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    res.status(429).json({
      success: false,
      message: 'Too many authentication attempts, please try again later.',
      retryAfter: '15 minutes',
    });
  },
});

// Progressive slowdown for repeated requests
export const speedLimiter = slowDown({
  windowMs: 15 * 60 * 1000, // 15 minutes
  delayAfter: 20, // Allow 20 requests per 15 minutes at full speed
  delayMs: 500, // Add 500ms delay per request after delayAfter
  maxDelayMs: 20000, // Maximum delay of 20 seconds
});

// Very strict rate limiter for sensitive operations
export const strictRateLimit = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 10, // 10 requests per minute
  message: {
    success: false,
    message: 'Rate limit exceeded for this operation.',
    retryAfter: '1 minute',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

export default {
  generalRateLimit,
  authRateLimit,
  speedLimiter,
  strictRateLimit,
};
