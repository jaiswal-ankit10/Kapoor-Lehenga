import { Router } from "express";

import { verifyJWT } from "../middlewares/auth.middleware.js";
import { createProduct } from "../controllers/products.controller.js";

const router = Router();

router.route("/create").post(verifyJWT, createProduct);
// router.route("/update").put(verifyJWT, updateCartItem);
// router.route("/remove").delete(verifyJWT, removeCartItem);
// router.route("/").get(verifyJWT, getCart);
// router.route("/clear").delete(verifyJWT, clearCart);

export default router;
