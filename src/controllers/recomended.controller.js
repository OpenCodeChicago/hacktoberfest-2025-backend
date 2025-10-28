import mongoose from "mongoose";
import Product from "../models/Product.js";

export const getRecommendedProducts = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid product ID" });
    }

    // Find the main product
    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    const conditions = [{ category: product.category }];
    if (product.goals && product.goals.length > 0) {
      conditions.push({ goals: { $in: product.goals } });
    }
    if (product.collections && product.collections.length > 0) {
      conditions.push({ collections: { $in: product.collections } });
    }

    const recommended = await Product.aggregate([
      {
        $match: {
          _id: { $ne: product._id },
          $or: conditions
        },
      },
      { $sample: { size: 6 } }, 
    ]);

    res.status(200).json(recommended);

  } catch (error) {
    console.error("Error fetching recommended products:", error);
    res.status(500).json({ message: "Server error" });
  }
};
