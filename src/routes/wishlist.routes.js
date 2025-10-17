import express from 'express';
import {
  getWishlist,
  addToWishlist,
  removeFromWishlist,
  clearWishlist,
} from '../controllers/wishlist.controller.js';
import { authenticateToken } from '../middleware/auth.middleware.js';

const router = express.Router();

// All wishlist routes require authentication
router.use(authenticateToken);

// GET /api/wishlist - Get user's wishlist
router.get('/', getWishlist);

// POST /api/wishlist - Add product to wishlist
router.post('/', addToWishlist);

// DELETE /api/wishlist/:productId - Remove specific product from wishlist
router.delete('/:productId', removeFromWishlist);

// DELETE /api/wishlist - Clear entire wishlist
router.delete('/', clearWishlist);

export default router;
