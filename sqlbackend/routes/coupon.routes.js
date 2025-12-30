import { Router } from "express";
import { verifyJWT, verifyRoles } from "../middlewares/auth.middleware.js";
import {
  applyCoupon,
  createCoupon,
  deleteCoupon,
  fetchCoupons,
  updateCoupon,
} from "../controllers/coupon.controller.js";

const router = Router();

router.route("/").get(verifyJWT, fetchCoupons);
router.route("/create").post(verifyJWT, verifyRoles("ADMIN"), createCoupon);
router.route("/apply").post(verifyJWT, applyCoupon);
router.route("/update/:id").put(verifyJWT, verifyRoles("ADMIN"), updateCoupon);
router
  .route("/delete/:id")
  .delete(verifyJWT, verifyRoles("ADMIN"), deleteCoupon);

export default router;
