import { Router } from "express";
import {
  googleAuthController,
  login,
  logout,
  registerUser,
  sendOtp,
  verifyOtp,
} from "../controllers/auth.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

// unsecured routes
router.route("/register").post(registerUser);
router.route("/login").post(login);
router.route("/send-otp").post(sendOtp);
router.route("/verify-otp").post(verifyOtp);
router.route("/google").post(googleAuthController);

// secured routes
router.route("/logout").post(verifyJWT, logout);

export default router;
