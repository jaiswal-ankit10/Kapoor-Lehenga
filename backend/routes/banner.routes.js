import { Router } from "express";
import { uploadSingleImage } from "../middlewares/upload.middleware.js";
import { verifyJWT, verifyRoles } from "../middlewares/auth.middleware.js";
import {
  createBanner,
  getActiveBanners,
  getBanners,
  removeBanner,
  updateBanner,
} from "../controllers/banner.controller.js";

const router = Router();

router.route("/").get(getBanners);
router.route("/active").get(getActiveBanners);
router
  .route("/create")
  .post(verifyJWT, verifyRoles("admin"), uploadSingleImage, createBanner);
router
  .route("/remove/:id")
  .delete(verifyJWT, verifyRoles("admin"), removeBanner);
router
  .route("/update/:id")
  .put(verifyJWT, verifyRoles("admin"), uploadSingleImage, updateBanner);
export default router;
