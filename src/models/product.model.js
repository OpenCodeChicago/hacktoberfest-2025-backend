import mongoose from 'mongoose';

const usageTipsSchema = new mongoose.Schema({
  when: { type: String },
  blend: { type: String },
  pairWith: { type: String }
}, { _id: false });

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  category: { type: String },
  flavors: { type: [String] },
  sale: { type: Number, default: 0 },
  sizes: { type: [String] },
  new: { type: Boolean, default: false },
  goals: { type: [String] },
  collections: { type: [String], default: [] },
  description: { type: String },
  shortDescription: { type: String },
  longDescription: { type: String },
  usageTips: { type: usageTipsSchema },
  quality: { type: [String] },
  image: { type: String },
  rating: { type: Number, default: 4.7 },
  reviewsCount: { type: Number, default: 0 }
},
{
  timestamps: true,
  versionKey: false,
});

const Product = mongoose.model('Product', productSchema);

export default Product;
