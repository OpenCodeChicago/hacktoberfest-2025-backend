import jwt from "jsonwebtoken";
import User from "../../models/User.js";
import { sendEmail } from "../../utils/exceptions/mailer.js";
import { htmlTemplate } from "../../utils/exceptions/gmailTemplate/htmltemplate.js";
import crypto from "crypto";

// Helper: Generate JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
};


export const signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ message: "Name, email, and password are required" });
    }
    console.log(name, email, password)
    // Check for existing user
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    //  Remove bcrypt.hash — schema pre('save') will hash automatically
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    //  Hash OTP before saving (recommended)
    const hashedOtp = crypto.createHash("sha256").update(otp).digest("hex");

    const user = new User({
      name,
      email,
      password,
      otp: hashedOtp,
      otpExpiry: new Date(Date.now() + 5 * 60 * 1000),
    })
    await user.save();
  
    // Send email with the **plain OTP** (not hashed)
    await sendEmail({
      to: email,
      subject: "Your Hacktober OTP Code",
      html: htmlTemplate(name, otp),
    });

    res.status(201).json({
      message: "Signup successful! OTP sent to email.",
      email: user.email,
    });
  } catch (error) {
    console.error("Signup error:", error);
    res.status(500).json({ message: "Server error during signup" });
  }
};

// @desc Verify OTP
// @route POST /api/verify-otp
// @access Public
export const verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    if (user.isVerified)
      return res.status(400).json({ message: "User already verified" });

    //  Compare hashed OTPs instead of plain strings
    const hashedOtp = crypto.createHash("sha256").update(otp).digest("hex");

    if (user.otp !== hashedOtp)
      return res.status(400).json({ message: "Invalid OTP" });

    if (user.otpExpiry < new Date())
      return res.status(400).json({ message: "OTP expired" });

    // OTP valid → verify user
    user.isVerified = true;
    user.otp = undefined;
    user.otpExpiry = undefined;
    await user.save();

    // Generate JWT
    const token = generateToken(user._id);

    res.json({
      message: "OTP verified successfully! You are now logged in.",
      token,
      user: { id: user._id, name: user.name, email: user.email },
    });
  } catch (error) {
    console.error("OTP verification error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
