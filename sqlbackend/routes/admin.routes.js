import express from "express";
import {
  getAllUsers,
  createUser,
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
  getProductById,
} from "../controllers/products.controller.js";
import { verifyJWT, verifyRoles } from "../middlewares/auth.middleware.js";

import {
  getAllOrders,
  updateOrderStatus,
} from "../controllers/order.controller.js";
import { uploadMultipleImages } from "../middlewares/upload.middleware.js";

const router = express.Router();

// User Management
router.post("/users", verifyJWT, verifyRoles("ADMIN"), createUser);
router.get("/users", verifyJWT, verifyRoles("ADMIN"), getAllUsers);
router.get("/users/:id", verifyJWT, verifyRoles("ADMIN"), getUserById);
router.delete("/users/:id", verifyJWT, verifyRoles("ADMIN"), deleteUser);
router.put("/users/:id/role", verifyJWT, verifyRoles("ADMIN"), updateUserRole);

// Product Management
router.get("/products", verifyJWT, verifyRoles("ADMIN"), getAllProducts);
router.post(
  "/products",
  verifyJWT,
  verifyRoles("ADMIN"),
  uploadMultipleImages,
  createProduct
);
router.put(
  "/products/:id",
  verifyJWT,
  verifyRoles("ADMIN"),
  uploadMultipleImages,
  updateProduct
);
router.delete("/products/:id", verifyJWT, verifyRoles("ADMIN"), deleteProduct);
router.get("/products/:id", verifyJWT, verifyRoles("ADMIN"), getProductById);

// Dashboard
router.get("/dashboard", verifyJWT, verifyRoles("ADMIN"), getDashboardStats);

//Orders
router.get("/orders", verifyJWT, verifyRoles("ADMIN"), getAllOrders);
router.put(
  "/orders/:id/status",
  verifyJWT,
  verifyRoles("ADMIN"),
  updateOrderStatus
);

export default router;
