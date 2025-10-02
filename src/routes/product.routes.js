import express from 'express';
import { getAllProducts, getProductById } from '../controllers/product.controller.js';

const router = express.Router();

// Fetch all products
router.get('/', getAllProducts);

// Fetch product by ID
router.get('/:id',getProductById);

export default router