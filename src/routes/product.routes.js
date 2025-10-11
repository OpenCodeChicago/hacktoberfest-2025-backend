import express from 'express';
import { getAllProducts, getProductById, getProductBySortCategory } from '../controllers/product.controller.js';

const router = express.Router();

// Fetch all products
router.get('/', getAllProducts);

// Fetch product by ID
router.get('/:id',getProductById);

//Fetch product accoridng to sort category
router.get('/:sort', getProductBySortCategory);

export default router