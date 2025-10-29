import express from 'express';
import { getCart, addToCart, updateCartItem, removeFromCart } from '../controllers/cart.controller.js';
import { authenticateToken } from '../middleware/auth.middleware.js';

const router = express.Router();

// All cart routes require authentication
router.use(authenticateToken);
// GET /api/cart
router.get('/', getCart);

// POST /api/cart
router.post('/', addToCart);

// PUT /api/cart/:productId
router.put('/:productId', updateCartItem);

// DELETE /api/cart/:productId
router.delete('/:productId', removeFromCart);

export default router;


