// middleware/authMiddleware.js
import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

const auth = async (req, res, next) => {
  let token;

  if (req.cookies?.token) {
    try {
      token = req.cookies.token;
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.id).select("-password");
      next();
    } catch (error) {
      return res.status(401).json({ message: "Not authorized" });
    }
  } else {
    return res.status(401).json({ message: "No token, not authorized" });
  }
};

export { auth };