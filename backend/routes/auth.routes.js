import { Router } from "express";
import {
  login,
  logout,
  registerUser,
  sendOtp,
  verfiyOtp,
} from "../controllers/auth.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

// unsecured routes
router.route("/register").post(registerUser);
router.route("/login").post(login);
router.route("/send-otp").post(sendOtp);
router.route("/verify-otp").post(verfiyOtp);

// secured routes
router.route("/logout").post(verifyJWT, logout);

export default router;
