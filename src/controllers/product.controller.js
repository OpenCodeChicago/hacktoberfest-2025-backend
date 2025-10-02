import mongoose from 'mongoose';
import Product from '../models/product.model.js';

/**
 * @route GET /api/products
 * @query {string} category - Filter by product category
 * @query {string} goals - Filter by product goals (comma-separated for multiple)
 * @query {number} minPrice - Minimum price filter
 * @query {number} maxPrice - Maximum price filter
 * @query {string} search - Search keyword in product name or description
 * @returns {Array} products - Array of filtered product objects or empty array if no products match
 */
const getAllProducts = async (req, res) => {
  try {
    const { category, goals, minPrice, maxPrice, search } = req.query;

    const filter = {};

    if (category) {
      filter.category = new RegExp(`^${category}$`, 'i');
    }

    if (goals) {
      const goalsList = goals.split(',').map((goal) => goal.trim());
      filter.goals = { $in: goalsList.map((goal) => new RegExp(goal, 'i')) };
    }

    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) {
        const min = parseFloat(minPrice);
        if (!isNaN(min)) {
          filter.price.$gte = min;
        }
      }
      if (maxPrice) {
        const max = parseFloat(maxPrice);
        if (!isNaN(max)) {
          filter.price.$lte = max;
        }
      }
    }

    if (search) {
      const searchRegex = new RegExp(search, 'i');
      filter.$or = [
        { name: searchRegex },
        { description: searchRegex },
        { shortDescription: searchRegex },
        { longDescription: searchRegex },
      ];
    }

    const products = await Product.find(filter);

    res.status(200).json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({
      message: 'Internal server error while fetching products',
      error: error.message,
    });
  }
};

const getProductById = async (req, res) => {
  const id = req.params.id;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: 'Invalid ID format' });
  }
  const product = await Product.findById(id);
  if (!product) {
    return res.status(404).json({ message: 'Product not found' });
  }
  return res.json(product);
};

export { getAllProducts, getProductById };
