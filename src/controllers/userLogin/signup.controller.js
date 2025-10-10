import jwt from "jsonwebtoken";
import User from "../../models/User.model.js";
import { sendEmail } from "../../utils/exceptions/mailer.js";
import bcrypt from "bcryptjs";
import { htmlTemplate } from "../../utils/exceptions/gmailTemplate/htmltemplate.js";
// Helper: Generate JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
};

// @desc Register new user
// @route POST /api/signup
// @access Public
export const signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      otp,
      otpExpiry: Date.now() + 5 * 60 * 1000, // 5 minutes
    });

    await sendEmail({
      to: email,
      subject: "Your Hacktober OTP Code",
      html: htmlTemplate(name, otp),
    });

    res.status(201).json({ message: "Signup successful! OTP sent to email.", email: user.email });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

export const verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    if (user.isVerified) return res.status(400).json({ message: "User already verified" });
    if (user.otp !== otp) return res.status(400).json({ message: "Invalid OTP" });
    if (user.otpExpiry < Date.now()) return res.status(400).json({ message: "OTP expired" });

    // OTP is valid → verify user
    user.isVerified = true;
    user.otp = null;
    user.otpExpiry = null;
    await user.save();

    // Generate JWT for auto-login
    const token = generateToken(user._id)

    res.json({
      message: "OTP verified successfully! You are now logged in.",
      token,
      user: { id: user._id, name: user.name, email: user.email },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
