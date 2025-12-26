import { Router } from "express";
import { verifyJWT, verifyRoles } from "../middlewares/auth.middleware.js";
import {
  applyCoupon,
  createCoupon,
  deleteCoupon,
  fetchCoupons,
  updateCoupon,
} from "../controllers/coupon.controller.js";
import { updateAddress } from "../controllers/address.controller.js";

const router = Router();

router.route("/").get(verifyJWT, fetchCoupons);
router.route("/create").post(verifyJWT, verifyRoles("admin"), createCoupon);
router.route("/apply").post(verifyJWT, applyCoupon);
router.route("/update/:id").put(verifyJWT, verifyRoles("admin"), updateCoupon);
router
  .route("/delete/:id")
  .delete(verifyJWT, verifyRoles("admin"), deleteCoupon);

export default router;
