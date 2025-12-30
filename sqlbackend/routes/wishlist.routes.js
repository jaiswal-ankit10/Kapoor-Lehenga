import { Router } from "express";
import {
  addToWishlist,
  removeFromWishlist,
  getWishlist,
  clearWishlist,
} from "../controllers/wishlist.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.post("/add", verifyJWT, addToWishlist);
router.delete("/:productId", verifyJWT, removeFromWishlist);

router.get("/", verifyJWT, getWishlist);
router.delete("/clear", verifyJWT, clearWishlist);

export default router;
