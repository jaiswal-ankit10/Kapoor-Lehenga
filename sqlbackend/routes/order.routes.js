import express from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import {
  cancelOrder,
  createOrder,
  getMyOrders,
  getOrderById,
  getReturnedOrder,
  returnOrder,
} from "../controllers/order.controller.js";
const router = express.Router();

router.route("/orders").post(verifyJWT, createOrder);
router.route("/orders/my").get(verifyJWT, getMyOrders);
router.route("/orders/returned").get(verifyJWT, getReturnedOrder);
router.route("/orders/:id").get(verifyJWT, getOrderById);
router.route("/orders/:id/cancel").put(verifyJWT, cancelOrder);
router.route("/orders/:id/return").put(verifyJWT, returnOrder);

export default router;
