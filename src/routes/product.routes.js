import express from 'express';
import { getAllProducts, getProductById, getProductBySortCategory } from '../controllers/product.controller.js';

const router = express.Router();

// Fetch all products
router.get('/', getAllProducts);

//Fetch product according to sort category (must come before /:id to avoid conflicts)
router.get('/sort/:sort', getProductBySortCategory);

// Fetch recommended products (must come before /:id to avoid conflicts)
router.get('/recommended/:id', (req, res) => {
  // For now, return empty array - can be implemented later
  res.json({ products: [], total: 0 });
});

// Fetch product by ID
router.get('/:id',getProductById);

export default router