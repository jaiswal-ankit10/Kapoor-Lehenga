import express from "express";
import {
  createAddress,
  getAllAddress,
  updateAddress,
  deleteAddress,
  setDefaultAddress,
} from "../controllers/address.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/addresses", verifyJWT, createAddress);
router.get("/addresses", verifyJWT, getAllAddress);
router.put("/addresses/:id", verifyJWT, updateAddress);
router.delete("/addresses/:id", verifyJWT, deleteAddress);
router.put("/addresses/:id/default", verifyJWT, setDefaultAddress);

export default router;
