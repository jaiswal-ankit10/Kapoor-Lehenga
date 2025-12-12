import express from "express";
import {
  getAllUsers,
  deleteUser,
  updateUserRole,
  getDashboardStats,
  getUserById,
} from "../controllers/admin.controller.js";

import {
  getAllProducts,
  createProduct,
  updateProduct,
  deleteProduct,
} from "../controllers/products.controller.js";
import { verifyJWT, verifyRoles } from "../middlewares/auth.middleware.js";

const router = express.Router();

// User Management
router.get("/users", verifyJWT, verifyRoles("admin"), getAllUsers);
router.get("/users/:id", verifyJWT, verifyRoles("admin"), getUserById);
router.delete("/users/:id", verifyJWT, verifyRoles("admin"), deleteUser);
router.put("/users/:id/role", verifyJWT, verifyRoles("admin"), updateUserRole);

// Product Management
router.get("/products", verifyJWT, verifyRoles("admin"), getAllProducts);
router.post("/products", verifyJWT, verifyRoles("admin"), createProduct);
router.put("/products/:id", verifyJWT, verifyRoles("admin"), updateProduct);
router.delete("/products/:id", verifyJWT, verifyRoles("admin"), deleteProduct);

// Dashboard
router.get("/dashboard", verifyJWT, verifyRoles("admin"), getDashboardStats);

export default router;
