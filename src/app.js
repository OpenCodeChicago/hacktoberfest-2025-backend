import express from 'express';
import cors from 'cors';
import productRoutes from './routes/product.routes.js';
import dbConnection from '../scripts/dbConfig.js';
import errorHandler from './middleware/error-handler.middleware.js';
import notFound from './middleware/notFound.middleware.js'
import userRoutes from './routes/user.routes.js';
import cookieParser from 'cookie-parser';
const app = express();

dbConnection();
app.use(cors());
app.use(express.json());
app.use(cookieParser());

app.get('/',(req,res)=>{
    res.send("Welcome to Homepage");
})

// Routes
app.use('/api/products', productRoutes);
app.use('/api/user', userRoutes);

// Middleware
app.use(errorHandler);
//Middleware for not found 404
app.use(notFound);

export default app

