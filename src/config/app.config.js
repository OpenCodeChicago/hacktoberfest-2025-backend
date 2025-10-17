/**
 * Environment configuration for rate limiting and CORS
 */

export const config = {
  // Rate limiting configuration
  rateLimit: {
    // General API rate limits
    general: {
      windowMs: 60 * 1000, // 1 minute
      max: process.env.NODE_ENV === 'production' ? 50 : 100, // 50 in prod, 100 in dev
    },
    // Authentication rate limits (stricter)
    auth: {
      windowMs: 15 * 60 * 1000, // 15 minutes
      max: 5, // 5 attempts per 15 minutes
    },
    // Strict rate limits for sensitive operations
    strict: {
      windowMs: 60 * 1000, // 1 minute
      max: 10, // 10 requests per minute
    },
    // Speed limiter configuration
    speedLimit: {
      windowMs: 15 * 60 * 1000, // 15 minutes
      delayAfter: 20, // Allow 20 requests per 15 minutes at full speed
      delayMs: 500, // Add 500ms delay per request after delayAfter
      maxDelayMs: 20000, // Maximum delay of 20 seconds
    },
  },

  // CORS configuration
  cors: {
    // Allowed origins
    allowedOrigins: [
      'http://localhost:3000', // React dev server
      'http://localhost:3001', // Alternative React port
      'http://localhost:5173', // Vite dev server
      'http://localhost:8080', // Vue dev server
      'http://127.0.0.1:3000', // Localhost alternative
      'http://127.0.0.1:5173', // Vite localhost alternative
      // Add production domains here
      // 'https://yourdomain.com',
      // 'https://www.yourdomain.com',
    ],
    // Additional CORS settings
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: [
      'Origin',
      'X-Requested-With',
      'Content-Type',
      'Accept',
      'Authorization',
      'Cache-Control',
      'Pragma',
    ],
    exposedHeaders: [
      'X-Total-Count',
      'X-Page-Count',
      'X-Current-Page',
    ],
  },

  // Security configuration
  security: {
    // Content Security Policy
    csp: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        scriptSrc: ["'self'"],
        imgSrc: ["'self'", "data:", "https:"],
      },
    },
    // HSTS configuration
    hsts: {
      maxAge: 31536000, // 1 year
      includeSubDomains: true,
      preload: true,
    },
  },

  // Request size limits
  requestLimits: {
    json: '10mb',
    urlencoded: '10mb',
  },
};

export default config;
