import express from "express";
import {
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  getProductCategories,
  getProductColors,
} from "../controllers/products.controller.js";

const router = express.Router();

router.get("/", getAllProducts);
router.get("/categories", getProductCategories);
router.get("/colors", getProductColors);
router.get("/:id", getProductById);

// router.put("/:id", updateProduct);
// router.delete("/:id", deleteProduct);

export default router;
