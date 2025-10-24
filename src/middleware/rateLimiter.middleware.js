import rateLimit from 'express-rate-limit';
import slowDown from 'express-slow-down';

// General API rate limiter
export const generalRateLimit = (requests,time) => {
  return rateLimit({
    windowMs: time*60*1000, // in minutes
    max: requests, 
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
    handler: (req, res) => {
      res.status(429).json({
            success: false,
            message: 'Too many requests from this IP, please try again later.',
            retryAfter: `${time} minute${time>1 ? 's':''}`,
          });
    }
  })
};

// Progressive slowdown for repeated requests
export const speedLimiter = slowDown({
  windowMs: 15 * 60 * 1000, // 15 minutes
  delayAfter: 20, // Allow 20 requests per 15 minutes at full speed
  delayMs: 500, // Add 500ms delay per request after delayAfter
  maxDelayMs: 20000, // Maximum delay of 20 seconds
});

