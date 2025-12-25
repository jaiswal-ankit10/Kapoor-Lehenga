import express from "express";
import {
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  getProductCategories,
} from "../controllers/products.controller.js";

const router = express.Router();

router.get("/", getAllProducts);
router.get("/categories", getProductCategories);
router.get("/:id", getProductById);

// router.put("/:id", updateProduct);
// router.delete("/:id", deleteProduct);

export default router;
