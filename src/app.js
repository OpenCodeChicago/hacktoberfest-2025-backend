import express from 'express';
import cors from 'cors';
import passport from './config/passport.config.js';
import productRoutes from './routes/product.routes.js';
import cartRoutes from './routes/cart.routes.js';
import collectionRoutes from './routes/collection.routes.js';
import authRoutes from './routes/auth.routes.js';
import errorHandler from './middleware/error-handler.middleware.js';
import notFound from './middleware/notFound.middleware.js'
const app = express();
app.use(cors());
app.use(express.json());

// Initialize Passport
app.use(passport.initialize());

app.get('/',(req,res)=>{
    res.send("Welcome to Homepage");
})

// Routes
app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/collections', collectionRoutes);
app.use('/auth', authRoutes);

// Middleware for not found 404
app.use(notFound);
// Global error handler (should be last)
app.use(errorHandler);

export default app

