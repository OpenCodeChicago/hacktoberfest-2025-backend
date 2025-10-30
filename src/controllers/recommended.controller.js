import mongoose from "mongoose";
// Use canonical Product model to avoid duplicate model registration
import Product from "../models/product.model.js";

const CACHE_TTL_MS = 60 * 1000; // cache recommendations for 60s (tunable)
const cache = new Map(); // simple in-memory cache: key -> { ts, data }

const getFromCache = (key) => {
  const entry = cache.get(key);
  if (!entry) return null;
  if (Date.now() - entry.ts > CACHE_TTL_MS) {
    cache.delete(key);
    return null;
  }
  return entry.data;
};

const setCache = (key, data) => {
  cache.set(key, { ts: Date.now(), data });
};

export const getRecommendedProducts = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid product ID", products: [] });
    }

    // Check cache first
    const cacheKey = `recommend:${id}`;
    const cached = getFromCache(cacheKey);
    if (cached) {
      return res.status(200).json({ products: cached, cached: true });
    }

    const product = await Product.findById(id).lean();
    if (!product) {
      return res.status(404).json({ message: "Product not found", products: [] });
    }

    const conditions = [];
    if (product.category) conditions.push({ category: product.category });
    if (Array.isArray(product.goals) && product.goals.length) conditions.push({ goals: { $in: product.goals } });
    if (Array.isArray(product.collections) && product.collections.length) conditions.push({ collections: { $in: product.collections } });

    if (conditions.length === 0) {
      return res.status(200).json({ products: [] });
    }

    // Aggregate: exclude original product, match any condition, random sample, project only safe fields
    const pipeline = [
      {
        $match: {
          _id: { $ne: mongoose.Types.ObjectId(id) },
          $or: conditions
        }
      },
      { $sample: { size: 6 } },
      {
        $project: {
          _id: 1,
          name: 1,
          price: 1,
          image: 1,
          rating: 1,
          reviewsCount: 1,
          category: 1,
          collections: 1
        }
      }
    ];

    const recommended = await Product.aggregate(pipeline);

    // cache result briefly
    setCache(cacheKey, recommended);

    return res.status(200).json({ products: recommended, cached: false });
  } catch (error) {
    console.error("Error fetching recommended products:", error);
    return res.status(500).json({ message: "Server error" });
  }
};
