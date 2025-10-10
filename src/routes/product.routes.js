import express from 'express';
import { getAllProducts, getProductById, getHighlyRecommendedProducts } from '../controllers/product.controller.js';

const router = express.Router();

// Fetch all products
router.get('/', getAllProducts);

// Fetch product by ID
router.get('/:id', getProductById);

router.get('/recommended/:id', getHighlyRecommendedProducts);

export default router
