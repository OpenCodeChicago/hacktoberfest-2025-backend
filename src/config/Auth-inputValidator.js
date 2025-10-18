import { body, validationResult } from "express-validator";

// Validation middleware
export const validateSignup = [
  body("name").notEmpty().withMessage("Name is required"),
  body("email").isEmail().withMessage("Valid email is required"),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long"),

  (req, res, next) => {
 // Check what is coming in

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log("❌ Validation failed! Sending response with errors.");
      return res.status(400).json({ errors: errors.array() });
    }

    console.log("✅ Validation passed, moving to next middleware/controller");
    next();
  },
];

export const validateLogin = [
  body("email").isEmail().withMessage("Valid email is required"),
  body("password").notEmpty().withMessage("Password is required"),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];
