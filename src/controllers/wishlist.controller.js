import Wishlist from '../models/wishlist.model.js';
import Product from '../models/product.model.js';
import HttpException from '../utils/exceptions/http.exception.js';
import mongoose from 'mongoose';

/**
 * GET /api/wishlist
 * Get user's wishlist with populated product details
 */
const getWishlist = async (req, res, next) => {
  try {
    const userId = req.user.id; // Assuming JWT middleware sets req.user

    const wishlist = await Wishlist.findOne({ userId })
      .populate('products.productId', 'name price image rating reviewsCount category collection')
      .lean();

    if (!wishlist) {
      return res.status(200).json({
        success: true,
        message: 'Wishlist is empty',
        data: {
          products: [],
          totalItems: 0,
        },
      });
    }

    // Transform the data to match expected format
    const products = wishlist.products.map(item => ({
      ...item.productId,
      addedAt: item.addedAt,
    }));

    return res.status(200).json({
      success: true,
      message: 'Wishlist retrieved successfully',
      data: {
        products,
        totalItems: products.length,
      },
    });
  } catch (error) {
    console.error('Error fetching wishlist:', error);
    next(new HttpException(500, 'Internal server error while fetching wishlist'));
  }
};

/**
 * POST /api/wishlist
 * Add product to user's wishlist
 */
const addToWishlist = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { productId } = req.body;

    // Validate productId
    if (!productId) {
      return next(new HttpException(400, 'Product ID is required'));
    }

    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return next(new HttpException(400, 'Invalid product ID format'));
    }

    // Check if product exists
    const product = await Product.findById(productId);
    if (!product) {
      return next(new HttpException(404, 'Product not found'));
    }

    // Find or create wishlist
    let wishlist = await Wishlist.findOne({ userId });

    if (!wishlist) {
      // Create new wishlist
      wishlist = new Wishlist({
        userId,
        products: [{ productId, addedAt: new Date() }],
      });
    } else {
      // Check if product already exists in wishlist
      const existingProduct = wishlist.products.find(
        item => item.productId.toString() === productId
      );

      if (existingProduct) {
        return next(new HttpException(409, 'Product already in wishlist'));
      }

      // Add product to existing wishlist
      wishlist.products.push({ productId, addedAt: new Date() });
    }

    await wishlist.save();

    // Populate and return updated wishlist
    const updatedWishlist = await Wishlist.findById(wishlist._id)
      .populate('products.productId', 'name price image rating reviewsCount category collection')
      .lean();

    const products = updatedWishlist.products.map(item => ({
      ...item.productId,
      addedAt: item.addedAt,
    }));

    return res.status(201).json({
      success: true,
      message: 'Product added to wishlist successfully',
      data: {
        products,
        totalItems: products.length,
      },
    });
  } catch (error) {
    console.error('Error adding to wishlist:', error);
    next(new HttpException(500, 'Internal server error while adding to wishlist'));
  }
};

/**
 * DELETE /api/wishlist/:productId
 * Remove product from user's wishlist
 */
const removeFromWishlist = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { productId } = req.params;

    // Validate productId
    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return next(new HttpException(400, 'Invalid product ID format'));
    }

    // Find wishlist
    const wishlist = await Wishlist.findOne({ userId });

    if (!wishlist) {
      return next(new HttpException(404, 'Wishlist not found'));
    }

    // Check if product exists in wishlist
    const productIndex = wishlist.products.findIndex(
      item => item.productId.toString() === productId
    );

    if (productIndex === -1) {
      return next(new HttpException(404, 'Product not found in wishlist'));
    }

    // Remove product from wishlist
    wishlist.products.splice(productIndex, 1);
    await wishlist.save();

    // If wishlist is empty, delete it
    if (wishlist.products.length === 0) {
      await Wishlist.findByIdAndDelete(wishlist._id);
      return res.status(200).json({
        success: true,
        message: 'Product removed from wishlist successfully',
        data: {
          products: [],
          totalItems: 0,
        },
      });
    }

    // Populate and return updated wishlist
    const updatedWishlist = await Wishlist.findById(wishlist._id)
      .populate('products.productId', 'name price image rating reviewsCount category collection')
      .lean();

    const products = updatedWishlist.products.map(item => ({
      ...item.productId,
      addedAt: item.addedAt,
    }));

    return res.status(200).json({
      success: true,
      message: 'Product removed from wishlist successfully',
      data: {
        products,
        totalItems: products.length,
      },
    });
  } catch (error) {
    console.error('Error removing from wishlist:', error);
    next(new HttpException(500, 'Internal server error while removing from wishlist'));
  }
};

/**
 * DELETE /api/wishlist
 * Clear entire wishlist
 */
const clearWishlist = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const wishlist = await Wishlist.findOneAndDelete({ userId });

    if (!wishlist) {
      return res.status(200).json({
        success: true,
        message: 'Wishlist is already empty',
        data: {
          products: [],
          totalItems: 0,
        },
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Wishlist cleared successfully',
      data: {
        products: [],
        totalItems: 0,
      },
    });
  } catch (error) {
    console.error('Error clearing wishlist:', error);
    next(new HttpException(500, 'Internal server error while clearing wishlist'));
  }
};

export {
  getWishlist,
  addToWishlist,
  removeFromWishlist,
  clearWishlist,
};
