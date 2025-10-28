import { Router } from "express";
import { getRecommendedProducts } from "../controllers/recommended.controller.js";

const recommendedRouter = Router()

recommendedRouter.get("/:id/recommended", getRecommendedProducts); 

export default recommendedRouter;
