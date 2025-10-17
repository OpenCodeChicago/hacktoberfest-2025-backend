import express from 'express';
import passport from './config/passport.config.js';
import productRoutes from './routes/product.routes.js';
import cartRoutes from './routes/cart.routes.js';
import collectionRoutes from './routes/collection.routes.js';
import wishlistRoutes from './routes/wishlist.routes.js';
import testRoutes from './routes/test.routes.js';
import testSecurityRoutes from './routes/test-security.routes.js';
import authRoutes from './routes/auth.routes.js';
import errorHandler from './middleware/error-handler.middleware.js';
import notFound from './middleware/notFound.middleware.js';
import { corsMiddleware, securityHeaders, corsErrorHandler } from './middleware/cors.middleware.js';
import { generalRateLimit, authRateLimit, speedLimiter, strictRateLimit } from './middleware/rateLimiter.middleware.js';
const app = express();

// Security middleware (must be first)
app.use(securityHeaders);

// CORS middleware
app.use(corsMiddleware);

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Rate limiting middleware
app.use(generalRateLimit);
app.use(speedLimiter);

// Initialize Passport
app.use(passport.initialize());

app.get('/',(req,res)=>{
    res.send("Welcome to Homepage");
})

// Routes with specific rate limiting
app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/collections', collectionRoutes);
app.use('/api/wishlist', wishlistRoutes);
app.use('/api/test', testRoutes);
app.use('/api/test-security', testSecurityRoutes);

// Auth routes with stricter rate limiting
app.use('/auth', authRateLimit, authRoutes);

// CORS error handler
app.use(corsErrorHandler);

// Middleware for not found 404
app.use(notFound);

// Global error handler (should be last)
app.use(errorHandler);

export default app

