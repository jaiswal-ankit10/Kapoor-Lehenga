import { Router } from "express";
import {
  addToCart,
  clearCart,
  getCart,
  removeCartItem,
  updateCartItem,
} from "../controllers/cart.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/add").post(verifyJWT, addToCart);
router.route("/update").put(verifyJWT, updateCartItem);
router.route("/remove").delete(verifyJWT, removeCartItem);
router.route("/").get(verifyJWT, getCart);
router.route("/clear").delete(verifyJWT, clearCart);

export default router;
