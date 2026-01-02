import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import helmet from "helmet";
import { errorHandler } from "./middlewares/error.middleware.js";
import dns from "dns";
import morgan from "morgan";
import "dotenv/config";

console.log(process.env.PRISMA_DATABASE_URL);

dns.setDefaultResultOrder("ipv4first");

process.on("unhandledRejection", (reason, promise) => {
  console.error("Unhandled Rejection:", reason);
});

process.on("uncaughtException", (error) => {
  console.error("Uncaught Exception:", error);
});

const app = express();

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);
//middlewares
app.use(helmet());
app.use(express.json());
app.use(morgan("dev"));
app.use(express.urlencoded({ extended: true }));
// app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use(cookieParser());
app.use(
  cors({
    origin: process.env.CORS_ORIGIN?.split(",") || "http://localhost:5173",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "HEAD", "OPTIONS"],
  })
);

dotenv.config();

const port = process.env.PORT || 5000;

// routes
import authRegister from "./routes/auth.routes.js";
import cartRoutes from "./routes/cart.routes.js";
import productRoutes from "./routes/products.routes.js";
import wishlistRoutes from "./routes/wishlist.routes.js";
import adminRoutes from "./routes/admin.routes.js";
import orderRoutes from "./routes/order.routes.js";
import addressRoutes from "./routes/address.routes.js";
import bannerRoutes from "./routes/banner.routes.js";
import couponRoutes from "./routes/coupon.routes.js";
import categoryRoutes from "./routes/category.routes.js";

app.use("/api/v1/admin", adminRoutes);
app.use("/api/v1/auth", authRegister);
app.use("/api/v1/cart", cartRoutes);
app.use("/api/v1/products", productRoutes);
app.use("/api/v1/wishlist", wishlistRoutes);
app.use("/api/v1", orderRoutes);
app.use("/api/v1", addressRoutes);
app.use("/api/v1/banners", bannerRoutes);
app.use("/api/v1/coupons", couponRoutes);
app.use("/api/v1/categories", categoryRoutes);

app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`,
  });
});

app.use(errorHandler);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
