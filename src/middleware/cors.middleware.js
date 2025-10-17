import cors from 'cors';
import helmet from 'helmet';

/**
 * CORS configuration for frontend integration
 * Handles preflight requests and allows specific origins
 */

// Allowed origins for CORS
const allowedOrigins = [
  'http://localhost:3000', // React dev server
  'http://localhost:3001', // Alternative React port
  'http://localhost:5173', // Vite dev server
  'http://localhost:8080', // Vue dev server
  'http://127.0.0.1:3000', // Localhost alternative
  'http://127.0.0.1:5173', // Vite localhost alternative
  // Add production domains here
  // 'https://yourdomain.com',
  // 'https://www.yourdomain.com',
];

// CORS options
const corsOptions = {
  origin: (origin, callback) => {
    // Allow requests with no origin (mobile apps, Postman, etc.)
    if (!origin) return callback(null, true);
    
    // Check if origin is in allowed list
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      // In development, allow any localhost origin
      if (process.env.NODE_ENV !== 'production' && origin.includes('localhost')) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    }
  },
  credentials: true, // Allow cookies and authorization headers
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
  optionsSuccessStatus: 200, // Some legacy browsers choke on 204
  preflightContinue: false, // Pass the CORS preflight response to the next handler
};

// Security headers configuration
export const securityHeaders = helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
  crossOriginEmbedderPolicy: false, // Disable for API compatibility
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true,
  },
});

// CORS middleware
export const corsMiddleware = cors(corsOptions);

// CORS error handler
export const corsErrorHandler = (err, req, res, next) => {
  if (err.message === 'Not allowed by CORS') {
    res.status(403).json({
      success: false,
      message: 'CORS policy violation: Origin not allowed',
      origin: req.headers.origin,
    });
  } else {
    next(err);
  }
};

export default {
  corsMiddleware,
  securityHeaders,
  corsErrorHandler,
  corsOptions,
};
