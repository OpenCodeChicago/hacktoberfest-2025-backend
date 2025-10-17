// seed.js
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { faker } from '@faker-js/faker';
import Product from './src/models/product.model.js'; // adjust path as needed

dotenv.config();

const MONGO_URI = process.env.MONGODB_URI;

// --- Helper data pools ---
const categories = ['Protein', 'Supplements', 'Performance', 'Vitamins', 'Snacks'];
const goals = ['Muscle Gain', 'Recovery', 'Energy', 'Detox', 'Immunity', 'Focus', 'Weight Loss'];
const qualities = ['Gluten-Free', 'Vegan', 'Non-GMO', 'Sugar-Free', 'Organic', 'Keto-Friendly'];
const collections = ['Best Sellers', 'New Arrivals', 'Athlete Favorites', 'Daily Wellness'];
const sizes = ['250g', '500g', '1kg', '2kg', '60 capsules', '120 capsules'];
const flavors = ['Vanilla', 'Chocolate', 'Berry', 'Mint', 'Citrus', 'Strawberry', 'Unflavored'];

// --- Function to generate a single fake product ---
const generateProduct = () => {
  const category = faker.helpers.arrayElement(categories);

  return {
    name: faker.commerce.productName(),
    price: Number(faker.commerce.price({ min: 10, max: 60, dec: 2 })),
    category,
    flavors: faker.helpers.arrayElements(flavors, faker.number.int({ min: 1, max: 3 })),
    sale: faker.number.int({ min: 0, max: 30 }),
    sizes: faker.helpers.arrayElements(sizes, faker.number.int({ min: 1, max: 2 })),
    new: faker.datatype.boolean(),
    goals: faker.helpers.arrayElements(goals, faker.number.int({ min: 1, max: 3 })),
    collections: faker.helpers.arrayElements(collections, faker.number.int({ min: 0, max: 2 })),
    description: faker.commerce.productDescription(),
    shortDescription: faker.lorem.sentence(),
    longDescription: faker.lorem.paragraphs(2),
    usageTips: {
      when: faker.helpers.arrayElement([
        'Morning', 'Pre-workout', 'Post-workout', 'Before meals', 'Anytime during the day'
      ]),
      blend: faker.helpers.arrayElement([
        'Mix with water', 'Blend with milk', 'Shake well before drinking', 'Add to smoothies'
      ]),
      pairWith: faker.helpers.arrayElement([
        'Goes great with oats', 'Pair with a banana', 'Take with a protein bar', 'Enjoy with breakfast'
      ])
    },
    quality: faker.helpers.arrayElements(qualities, faker.number.int({ min: 2, max: 4 })),
    image: faker.image.urlPicsumPhotos({ width: 640, height: 480 }),
    rating: faker.number.float({ min: 4, max: 5, precision: 0.1 }),
    reviewsCount: faker.number.int({ min: 10, max: 500 }),
  };
};

// --- Seed Function ---
async function seedProducts(count = 50) {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('✅ Connected to MongoDB');

    await Product.deleteMany({});
    console.log('🧹 Cleared existing products');

    const products = Array.from({ length: count }, generateProduct);
    await Product.insertMany(products);

    console.log(`🌱 Successfully inserted ${count} fake products!`);
    process.exit(0);
  } catch (err) {
    console.error('❌ Error seeding data:', err);
    process.exit(1);
  }
}

// --- Run Seeder ---
seedProducts(50); // change number here to seed more products

