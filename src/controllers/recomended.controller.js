import mongoose from "mongoose";
import Product from "../models/Product.js";

export const getRecommendedProducts = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid product ID" });
    }

    // Findingg the main product
    const product = await Product.findById(id);
    if (!product) return res.status(404).json({ message: "Product not found" });

    //finding  6 recomended products out there 
    const recommended = await Product.aggregate([
      {
        $match: {
          _id: { $ne: product._id },
          $or: [
            { category: product.category },
            { goals: { $in: product.goals || [] } },
            { collections: { $in: product.collections || [] } },
          ],
        },
      },
      { $sample: { size: 6 } }, // randomize
    ]);

    res.status(200).json(recommended);
  } catch (error) {
    console.error("Error fetching recommended products:", error);
    res.status(500).json({ message: "Server error" });
  }
};
