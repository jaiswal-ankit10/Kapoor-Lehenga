import express from "express";
import {
  createCategory,
  getAllCategories,
  updateCategory,
  deleteCategory,
  createSubCategory,
  getSubCategoriesByCategory,
  updateSubCategory,
  deleteSubCategory,
} from "../controllers/category.controller.js";
import { verifyJWT, verifyRoles } from "../middlewares/auth.middleware.js";

const router = express.Router();

/* Category */
router.post("/", verifyJWT, verifyRoles("ADMIN"), createCategory);
router.get("/", getAllCategories);
router.put("/:id", verifyJWT, verifyRoles("ADMIN"), updateCategory);
router.delete("/:id", verifyJWT, verifyRoles("ADMIN"), deleteCategory);

/* SubCategory */
router.post(
  "/:categoryId/subcategories",
  verifyJWT,
  verifyRoles("ADMIN"),
  createSubCategory
);
router.get("/:categoryId/subcategories", getSubCategoriesByCategory);
router.put(
  "/subcategories/:id",
  verifyJWT,
  verifyRoles("ADMIN"),
  updateSubCategory
);
router.delete(
  "/subcategories/:id",
  verifyJWT,
  verifyRoles("ADMIN"),
  deleteSubCategory
);

export default router;
