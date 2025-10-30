import { Router } from "express";
import { getRecommendedProducts } from "../controllers/recommended.controller.js";
import { authenticateToken } from "../middleware/auth.middleware.js";
import { generalRateLimit } from "../middleware/rateLimiter.middleware.js";

const recommendedRouter = Router();

// GET /api/products/:id/recommendations
// require authentication and apply rate limit (60 requests / 1 minute per IP)
recommendedRouter.get('/:id/recommendations',
  authenticateToken,
  generalRateLimit(60, 1),
  getRecommendedProducts
);

export default recommendedRouter;
