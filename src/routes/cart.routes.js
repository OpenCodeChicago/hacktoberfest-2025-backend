import express from 'express';
import { getCart, addToCart, updateCartItem, removeFromCart } from '../controllers/cart.controller.js';
import { authenticateToken } from '../middleware/auth.middleware.js';

const router = express.Router();

// Authenticated routes - use req.user.id instead of path param
router.get('/', authenticateToken, getCart);
router.post('/', authenticateToken, addToCart);
router.put('/', authenticateToken, updateCartItem);
router.delete('/:productId', authenticateToken, removeFromCart);

export default router;
