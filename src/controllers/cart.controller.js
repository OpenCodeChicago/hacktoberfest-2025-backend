import mongoose from 'mongoose';
import Cart from '../models/cart.model.js';
import Product from '../models/product.model.js';
import HttpException from '../utils/exceptions/http.exception.js';

// Helper to get or create a cart for a user
async function findOrCreateCart(userId) {
  let cart = await Cart.findOne({ userId });
  if (!cart) {
    cart = await Cart.create({ userId, items: [] });
  }
  return cart;
}

// GET /api/cart/:userId
export const getCart = async (req, res, next) => {
  try {
    const { userId } = req.params;
    if (!userId || typeof userId !== 'string') {
      return next(new HttpException(400, 'Invalid or missing userId'));
    }

    const cart = await Cart.findOne({ userId }).populate('items.productId');
    return res.status(200).json({
      success: true,
      data: cart ? cart.items : [],
    });
  } catch (err) {
    console.error('Cart controller error (getCart):', err);
    next(new HttpException(500, 'Failed to fetch cart'));
  }
}

// POST /api/cart/:userId  { productId, quantity? }
export const addToCart = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const { productId, quantity } = req.body || {};

    if (!userId || typeof userId !== 'string') {
      return next(new HttpException(400, 'Invalid or missing userId'));
    }
    if (!productId || !mongoose.Types.ObjectId.isValid(productId)) {
      return next(new HttpException(400, 'Invalid or missing productId'));
    }
    const qty = Number(quantity) || 1;
    if (qty < 1) {
      return next(new HttpException(400, 'Quantity must be at least 1'));
    }

    const product = await Product.findById(productId);
    if (!product) {
      return next(new HttpException(404, 'Product not found'));
    }

    const cart = await findOrCreateCart(userId);

    const existing = cart.items.find((it) => it.productId.toString() === productId);
    if (existing) {
      existing.quantity += qty;
    } else {
      cart.items.push({ productId, quantity: qty });
    }

    await cart.save();
    await cart.populate('items.productId');

    return res.status(200).json({ success: true, data: cart.items });
  } catch (err) {
    console.error('Cart controller error (addToCart):', err);
    next(new HttpException(500, 'Failed to add to cart'));
  }
}

// PUT /api/cart/:userId  { productId, quantity }
export const updateCartItem = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const { productId, quantity } = req.body || {};

    if (!userId || typeof userId !== 'string') {
      return next(new HttpException(400, 'Invalid or missing userId'));
    }
    if (!productId || !mongoose.Types.ObjectId.isValid(productId)) {
      return next(new HttpException(400, 'Invalid or missing productId'));
    }
    const qty = Number(quantity);
    if (!Number.isFinite(qty) || qty < 1) {
      return next(new HttpException(400, 'Quantity must be a positive number'));
    }

    const product = await Product.findById(productId);
    if (!product) {
      return next(new HttpException(404, 'Product not found'));
    }

    const cart = await findOrCreateCart(userId);
    const existing = cart.items.find((it) => it.productId.toString() === productId);
    if (!existing) {
      return next(new HttpException(404, 'Product not in cart'));
    }

    existing.quantity = qty;
    await cart.save();
    await cart.populate('items.productId');

    return res.status(200).json({ success: true, data: cart.items });
  } catch (err) {
    console.error('Cart controller error (updateCartItem):', err);
    next(new HttpException(500, 'Failed to update cart item'));
  }
}

// DELETE /api/cart/:userId/:productId
export const removeFromCart = async (req, res, next) => {
  try {
    const { userId, productId } = req.params;
    if (!userId || typeof userId !== 'string') {
      return next(new HttpException(400, 'Invalid or missing userId'));
    }
    if (!productId || !mongoose.Types.ObjectId.isValid(productId)) {
      return next(new HttpException(400, 'Invalid or missing productId'));
    }

    const cart = await findOrCreateCart(userId);
    const prevLength = cart.items.length;
    cart.items = cart.items.filter((it) => it.productId.toString() !== productId);
    if (cart.items.length === prevLength) {
      return next(new HttpException(404, 'Product not in cart'));
    }

    await cart.save();
    await cart.populate('items.productId');

    return res.status(200).json({ success: true, data: cart.items });
  } catch (err) {
    console.error('Cart controller error (removeFromCart):', err);
    next(new HttpException(500, 'Failed to remove from cart'));
  }
}


