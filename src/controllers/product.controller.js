import mongoose from "mongoose";
import Product from "../models/product.model.js";
import HttpException from "../utils/exceptions/http.exception.js";

/**
 * Get all products from the database
 * @route GET /api/products
 * @returns {Array} products - Array of product objects or empty array if no products
 */
const getAllProducts = async (req, res) => {
  try {
    // Fetch all products from the database
    const products = await Product.find({});
    
    // Return products array (will be empty array if no products found)
    res.status(200).json(products);
  } catch (error) {
    // Handle any database errors
    console.error('Error fetching products:', error);
    throw new HttpException(500, "Internal server error while fetching products");
  }
};

const getProductById = async(req,res)=>{
    //fetches ID from request parameters
    const id = req.params.id;
    if(!mongoose.Types.ObjectId.isValid(id)){
        //checks for validity of the id
        throw new HttpException(400, "Invalid ID format");
    }
    // fetches the product details if id is valid & exists
    const product = await Product.findById(id);
    if(!product){
        //sends 404 error if product not found
        throw new HttpException(404, "Product not found");
    }
    return res.json(product);
}

export {getAllProducts, getProductById}
