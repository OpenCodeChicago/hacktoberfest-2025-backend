import Product from "../models/product.model.js";
import HttpException from "../utils/exceptions/http.exception.js";
import { tokenize, buildLookaheadRegex } from "../utils/regex.util.js";

// GET /api/collections/:name
export const getCollectionProducts = async (req, res, next) => {
  try {
    const name = (req.params?.name || "").toString().trim();
    if (!name) {
      return res.status(200).json({ collections: name, products: [] });
    }

    // try exact slug match first (fast, indexable if you add normalizedCollections)
    const slug = name.toLowerCase();
    let products = await Product.find({ collections: slug });
    if (products && products.length) {
      return res.status(200).json({ collections: name, products });
    }

    // fallback: tokenize and build safe lookahead regex
    const tokens = tokenize(name);
    // safety limits
    if (tokens.length === 0) {
      return res.status(200).json({ collections: name, products: [] });
    }
    if (tokens.length > 6 || tokens.some(t => t.length > 40)) {
      return res.status(400).json({ collections: name, products: [], message: "Query too complex" });
    }

    const pattern = buildLookaheadRegex(tokens);

    products = await Product.find({
      collections: { $elemMatch: { $regex: pattern } },
    });

    return res.status(200).json({ collections: name, products });
  } catch (err) {
    console.error('Collection controller error (getCollectionProducts):', err);
    next(new HttpException(500, "Failed to fetch collections products"));
  }
}