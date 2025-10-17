import mongoose from 'mongoose';

const wishlistSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true,
  },
  products: [{
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true,
    },
    addedAt: {
      type: Date,
      default: Date.now,
    },
  }],
}, {
  timestamps: true,
  versionKey: false,
});

// Index for efficient queries
wishlistSchema.index({ userId: 1 });
wishlistSchema.index({ 'products.productId': 1 });

// Prevent duplicate products in wishlist
wishlistSchema.pre('save', function(next) {
  if (this.isModified('products')) {
    const productIds = this.products.map(item => item.productId.toString());
    const uniqueProductIds = [...new Set(productIds)];
    
    if (productIds.length !== uniqueProductIds.length) {
      // Remove duplicates, keeping the first occurrence
      const seen = new Set();
      this.products = this.products.filter(item => {
        const id = item.productId.toString();
        if (seen.has(id)) {
          return false;
        }
        seen.add(id);
        return true;
      });
    }
  }
  next();
});

const Wishlist = mongoose.model('Wishlist', wishlistSchema);

export default Wishlist;
