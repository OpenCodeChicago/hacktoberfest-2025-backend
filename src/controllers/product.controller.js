import mongoose from "mongoose";
import Product from "../models/product.model.js";
import HttpException from "../utils/exceptions/http.exception.js";

// make user text safe for RegExp
function escapeRegex(text = "") {
  return text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/**
 * GET /api/products
 * Optional query params:
 *  - category  (e.g. "Protein")
 *  - goals     (single or CSV, e.g. "Weight Loss" or "Weight Loss,Energy")
 *  - minPrice  (number)
 *  - maxPrice  (number)
 *  - search    (keyword in name/description)
 */
const getAllProducts = async (req, res, next) => {
  try {
    const category = req.query.category;
    const goals = req.query.goals;
    const minPrice = req.query.minPrice;
    const maxPrice = req.query.maxPrice;
    const search = req.query.search;

    // Pagination
    let page = Number(req.query.page) || 1;
    let limit = Number(req.query.limit) || 10;
    if (page < 1 || isNaN(page)) page = 1;
    if (limit < 1 || isNaN(limit)) limit = 10;

    // build the MongoDB filter step by step
    const filter = {};

    // 1) category — exact match, ignore case
    if (category && category.trim() !== "") {
      const safe = escapeRegex(category.trim());
      filter.category = { $regex: `^${safe}$`, $options: "i" };
    }

    // 2) goals — match ANY of the given goals (OR semantics)
    if (goals && goals.length > 0) {
      let goalsArray;
      if (Array.isArray(goals)) {
        goalsArray = goals;
      } else {
        goalsArray = goals.split(",").map((g) => g.trim()).filter(Boolean);
      }
      if (goalsArray.length > 0) {
        filter.goals = { $in: goalsArray };
      }
    }

    // 3) price range
    let min, max;
    if (minPrice !== undefined) {
      const n = Number(minPrice);
      if (isNaN(n)) return res.status(400).json({ error: "minPrice must be a number" });
      min = n;
    }
    if (maxPrice !== undefined) {
      const n = Number(maxPrice);
      if (isNaN(n)) return res.status(400).json({ error: "maxPrice must be a number" });
      max = n;
    }
    if (min !== undefined && max !== undefined && min > max) {
      return res.status(400).json({ error: "minPrice cannot be greater than maxPrice" });
    }
    if (min !== undefined || max !== undefined) {
      filter.price = {};
      if (min !== undefined) filter.price.$gte = min;
      if (max !== undefined) filter.price.$lte = max;
    }

    // 4) search — keyword in name/description (case-insensitive)
    if (search && search.trim() !== "") {
      const safeSearch = escapeRegex(search.trim());
      const pattern = new RegExp(safeSearch, "i");
      filter.$or = [
        { name: pattern },
        { description: pattern },
        { shortDescription: pattern },
        { longDescription: pattern },
      ];
    }

    // Pagination logic
    const total = await Product.countDocuments(filter);
    const pages = Math.ceil(total / limit) || 1;
    if (page > pages) page = pages;
    const products = await Product.find(filter)
      .skip((page - 1) * limit)
      .limit(limit);

    return res.status(200).json({
      products,
      page,
      pages,
      total
    });
  } catch (error) {
    // Handle any database errors
    console.error('Error fetching products:', error);
    return next(new HttpException(500, 'Internal server error while fetching products'));
  }
};

const getProductById = async (req, res, next) => {
    //fetches ID from request parameters
    const id = req.params.id;
    if(!mongoose.Types.ObjectId.isValid(id)){
        //checks for validity of the id
        return next(new HttpException(400, "Invalid ID format"));
    }
    // fetches the product details if id is valid & exists
    const product = await Product.findById(id);
    if(!product){
        //sends 404 error if product not found
        return next(new HttpException(404, "Product not found"));
    }
    return res.json(product);
}

const getProductBySortCategory = async (req, res, next) => {
  const sort = req.params.sort;
  const sortOptions = {
    best_selling: { sale: -1 }, // Default
    a_z: { name: 1 },
    z_a: { name: -1 },
    price_asc: { price: 1 },
    price_desc: { price: -1 },
    rating_asc: { rating: 1 },
    rating_desc: { rating: -1 },
  };
  sort=typeof sort=="string" && sortOptions[sort]?sortOptions[sort]:sortOptions['best_selling'];
  const products=(await Product.find()).sort(sort);
  if(!products)
    return next(new HttpException(404, "No products found"));
  return res.json(products);
}

export {getAllProducts, getProductById, getProductBySortCategory};
