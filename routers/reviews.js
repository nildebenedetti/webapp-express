import express from "express";
import { index, show, showFeaturedReviews, create, destroy } from "../controllers/reviews.js";
import { validateId } from "../middlewares/validateId.js";
import { validateStartRating, validateReviewBody } from "../middlewares/reviews.js";

const router = express.Router();

router.get("/", [ validateStartRating, index ]);
router.get("/:id", [ validateId, show ]);
router.get("/featured/:id", [ validateId, showFeaturedReviews ]);
router.post("/", [ validateReviewBody, create ]);
router.delete("/:id", [ validateId, destroy])


export default router;