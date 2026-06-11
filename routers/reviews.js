import express from "express";
import { index, show, create } from "../controllers/reviews.js";
import { validateId } from "../middlewares/products.js";
import { validateStartRating, validateReviewBody } from "../middlewares/reviews.js";

const router = express.Router();

router.get("/", validateStartRating, index);
router.get("/:id", validateId, show);
router.post("/", validateReviewBody, create);

export default router;