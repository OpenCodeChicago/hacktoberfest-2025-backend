import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  category: { type: String, required: true, trim: true },
  goals: [{ type: String, trim: true }],
  collections: [{ type: String, trim: true }],
  rating: { type: Number, default: 0, min: 0, max: 5 },
  price: { type: Number, required: true, min: 0 },
  description: { type: String, trim: true },
  image: { type: String, trim: true },
}, { timestamps: true });

const RecommendedProduct = mongoose.model("RecommendedProduct", productSchema);
export default RecommendedProduct;
