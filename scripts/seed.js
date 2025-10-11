// scripts/seed.js
import mongoose from "mongoose";
import "dotenv/config";
import Product from "../src/models/product.model.js";
import { readFile } from "fs/promises";
import path from "path";

if (!process.env.MONGODB_URI) {
  console.error("❌ MONGODB_URI is missing. Please create a .env file based on .env.example and set your MongoDB connection string.");
  process.exit(1);
}

async function getSeedProducts() {
  const filePath = path.resolve("scripts/db/products.json");
  try {
    const data = await readFile(filePath, "utf-8");
    return JSON.parse(data);
  } catch (err) {
    console.error("❌ Failed to read products.json", err);
    process.exit(1);
  }
}

const seedDB = async()=>{
  try{
    // Connect to MongoDB using the same logic as server.js
    console.log("Connecting to MongoDB for seeding...");
    await mongoose.connect(process.env.MONGODB_URI);
    console.log(`Connected to MongoDB: ${mongoose.connection.name}`);
    
    console.log(`Seeding data to database ${mongoose.connection.name}`);
    const seedProducts = await getSeedProducts();
    await Product.deleteMany();
    await Product.insertMany(seedProducts);
    console.log("Seeding complete.");
    
    // Close connection and exit
    await mongoose.connection.close();
    console.log("Database connection closed");
    process.exit(0);
  }catch (err) {
    console.error("Error seeding DB:", err);
    process.exit(1);
  }
}

seedDB();