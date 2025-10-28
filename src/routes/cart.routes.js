import express from 'express';
import { getCart, addToCart, updateCartItem, removeFromCart } from '../controllers/cart.controller.js';

const router = express.Router();

// GET /api/cart/:userId
router.get('/:userId', getCart);

// POST /api/cart/:userId
router.post('/:userId', addToCart);

// PUT /api/cart/:userId
router.put('/:userId', updateCartItem);

// DELETE /api/cart/:userId/:productId
router.delete('/:userId/:productId', removeFromCart);

export default router;


