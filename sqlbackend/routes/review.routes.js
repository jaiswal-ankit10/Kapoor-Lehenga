import express from "express";
import { uploadMultipleImages } from "../middlewares/upload.middleware.js";
import { verifyJWT, verifyRoles } from "../middlewares/auth.middleware.js";
import {
  createReview,
  deleteReview,
  getAllReviews,
  getAllReviewsAdmin,
} from "../controllers/review.controller.js";

const router = express.Router();

router.get("/", verifyJWT, verifyRoles("ADMIN"), getAllReviewsAdmin);
router.post("/:productId", verifyJWT, uploadMultipleImages, createReview);
router.get("/:productId", getAllReviews);
router.delete("/delete/:id", verifyJWT, deleteReview);

export default router;
