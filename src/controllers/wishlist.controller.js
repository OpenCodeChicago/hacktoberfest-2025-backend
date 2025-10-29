import mongoose from 'mongoose';
import Wishlist from '../models/wishlist.model.js';
import Product from '../models/product.model.js';
import HttpException from '../utils/exceptions/http.exception.js';

const getUserIdFromReq = (req) => {
  return req?.user?.userId || req?.user?.id || req?.user?._id;
};

const getWishlist = async (req, res, next) => {
  try {
    const userId = getUserIdFromReq(req);
    if (!userId) return next(new HttpException(401, 'Unauthorized'));

    const wishlist = await Wishlist.findOne({ userId })
      .populate('products.productId', 'name price image rating reviewsCount category collections')
      .lean();

    if (!wishlist || !wishlist.products || wishlist.products.length === 0) {
      return res.status(200).json({
        success: true,
        message: 'Wishlist is empty',
        data: { products: [], totalItems: 0 },
      });
    }

    const products = wishlist.products.map(item => ({
      ...item.productId,
      addedAt: item.addedAt,
    }));

    return res.status(200).json({
      success: true,
      message: 'Wishlist retrieved successfully',
      data: { products, totalItems: products.length },
    });
  } catch (error) {
    console.error('Error fetching wishlist:', error);
    next(new HttpException(500, 'Internal server error while fetching wishlist'));
  }
};

const addToWishlist = async (req, res, next) => {
  try {
    const userId = getUserIdFromReq(req);
    const { productId } = req.body;
    if (!userId) return next(new HttpException(401, 'Unauthorized'));
    if (!productId || !mongoose.Types.ObjectId.isValid(productId)) {
      return next(new HttpException(400, 'Invalid product ID'));
    }

    const product = await Product.findById(productId).lean();
    if (!product) return next(new HttpException(404, 'Product not found'));

    // Atomic: only push if productId not already present
    const update = {
      $push: { products: { productId: mongoose.Types.ObjectId(productId), addedAt: new Date() } },
      $setOnInsert: { userId: mongoose.Types.ObjectId(userId) },
    };

    const result = await Wishlist.updateOne(
      { userId: mongoose.Types.ObjectId(userId), 'products.productId': { $ne: mongoose.Types.ObjectId(productId) } },
      update,
      { upsert: true }
    );

    if (result.matchedCount === 0 && result.upsertedCount === 0 && result.modifiedCount === 0) {
      // nothing changed -> already exists
      return next(new HttpException(409, 'Product already in wishlist'));
    }

    const updated = await Wishlist.findOne({ userId })
      .populate('products.productId', 'name price image rating reviewsCount category collections')
      .lean();

    const products = (updated?.products || []).map(i => ({ ...i.productId, addedAt: i.addedAt }));

    return res.status(201).json({
      success: true,
      message: 'Product added to wishlist successfully',
      data: { products, totalItems: products.length },
    });
  } catch (error) {
    console.error('Error adding to wishlist:', error);
    next(new HttpException(500, 'Internal server error while adding to wishlist'));
  }
};

const removeFromWishlist = async (req, res, next) => {
  try {
    const userId = getUserIdFromReq(req);
    const { productId } = req.params;
    if (!userId) return next(new HttpException(401, 'Unauthorized'));
    if (!productId || !mongoose.Types.ObjectId.isValid(productId)) {
      return next(new HttpException(400, 'Invalid product ID'));
    }

    const updated = await Wishlist.findOneAndUpdate(
      { userId: mongoose.Types.ObjectId(userId) },
      { $pull: { products: { productId: mongoose.Types.ObjectId(productId) } } },
      { new: true }
    ).populate('products.productId', 'name price image rating reviewsCount category collections').lean();

    if (!updated) {
      return next(new HttpException(404, 'Wishlist not found'));
    }

    if (!updated.products || updated.products.length === 0) {
      // wishlist empty -> delete doc if exists
      await Wishlist.findByIdAndDelete(updated._id).catch(() => {});
      return res.status(200).json({
        success: true,
        message: 'Product removed. Wishlist is now empty.',
        data: { products: [], totalItems: 0 },
      });
    }

    const products = updated.products.map(i => ({ ...i.productId, addedAt: i.addedAt }));
    return res.status(200).json({
      success: true,
      message: 'Product removed from wishlist successfully',
      data: { products, totalItems: products.length },
    });
  } catch (error) {
    console.error('Error removing from wishlist:', error);
    next(new HttpException(500, 'Internal server error while removing from wishlist'));
  }
};

const clearWishlist = async (req, res, next) => {
  try {
    const userId = getUserIdFromReq(req);
    if (!userId) return next(new HttpException(401, 'Unauthorized'));

    await Wishlist.findOneAndDelete({ userId });

    return res.status(200).json({
      success: true,
      message: 'Wishlist cleared successfully',
      data: { products: [], totalItems: 0 },
    });
  } catch (error) {
    console.error('Error clearing wishlist:', error);
    next(new HttpException(500, 'Internal server error while clearing wishlist'));
  }
};

export { getWishlist, addToWishlist, removeFromWishlist, clearWishlist };
