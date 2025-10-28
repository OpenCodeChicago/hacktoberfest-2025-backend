import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: { type: String, required: true },
  goals: [{ type: String }],
  collections: [{ type: String }],
  rating: { type: Number, default: 0 },
  price: { type: Number },
  description: { type: String },
  image: { type: String },
}, { timestamps: true });

const Product = mongoose.model("Product", productSchema);
export default Product;
