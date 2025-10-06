import User from "../models/user.model.js";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";



const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: "7d", // Token valid for 7 days
  });
};
 const createUser = async (req, res) => {
  try {
    const { name, email, password, type, phone, address } = req.body;

    // Validate required fields
    if (!name || !email || !password || !type) {
      return res.status(400).json({ message: "Name, email, password, and type are required" });
    }

    // Validate user type
    if (!["buyer", "seller"].includes(type)) {
      return res.status(400).json({ message: "Invalid user type" });
    }

    // Check if email or phone already exists
    const existingUser = await User.findOne({ $or: [{ email }, { phone }] });
    if (existingUser) {
      return res.status(400).json({ message: "User with this email or phone already exists" });
    }

    // Create user
    const user = await User.create({
      name,
      email,
      password,
      type,
      phone: phone || "",   // optional
      address: address || "", // optional
    });

    // Generate token
    const token = generateToken(user._id);

    // Send response with token in cookie
    res
      .cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      })
      .status(201)
      .json({
        message: "User registered successfully",
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          type: user.type,
          phone: user.phone,
          address: user.address,
        },
      });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const getUserById = async (req, res) => {
  try {
    const { userId } = req.params;
    if (!mongoose.isValidObjectId(userId)) {
      return res.status(400).json({ message: "Invalid user ID." });
    }

    // Validate if userId is provided
    if (!userId) {
      return res.status(400).json({ message: "User ID is required" });
    }

    // Fetch user by ID (exclude password)
    const user = await User.findById(userId).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      message: "User fetched successfully",
      user,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// ------------------- LOGIN -------------------
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    // Check password
    const isMatch = await user.matchPassword(password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    // Generate token
    const token = generateToken(user._id);

    // Send token in HTTP-only cookie
    res
      .cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production", // Only over HTTPS in production
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      })
      .status(200)
      .json({
        message: "Logged in successfully",
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          type: user.type,
        },
      });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ------------------- LOGOUT -------------------
const logout = (req, res) => {
  res
    .cookie("token", "", {
      httpOnly: true,
      expires: new Date(0), // Expire immediately
    })
    .status(200)
    .json({ message: "Logged out successfully" });
};


export{
	createUser,
	 getUserById,
	 login,
	 logout
	 }