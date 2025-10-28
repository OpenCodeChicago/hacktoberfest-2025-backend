import { Router } from "express";
import { getRecomendedProducts } from "../controllers/recomended.controller.js";

const recomendedRouter = Router()

recomendedRouter.get("/:id/recommended", getRecomendedProducts); 

export default recomendedRouter;
