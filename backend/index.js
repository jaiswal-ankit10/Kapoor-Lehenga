import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import connectDb from "./config/dbConnect.js";
import path from "path";
import { asyncHandler } from "./utils/async-handler.js";
import { fileURLToPath } from "url";

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
//middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use(cookieParser());
app.use(
  cors({
    origin: process.env.CORS_ORIGIN?.split(",") || "http://localhost:5173",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
  })
);

dotenv.config({
  path: "./.env",
});

const port = process.env.PORT || 8000;
connectDb();

//routes
import authRegister from "./routes/auth.routes.js";
import cartRoutes from "./routes/cart.routes.js";
import productRoutes from "./routes/products.routes.js";
import wishlistRoutes from "./routes/wishlist.routes.js";
import adminRoutes from "./routes/admin.routes.js";

app.use("/api/v1/admin", adminRoutes);
app.use("/api/v1/auth", authRegister);
app.use("/api/v1/cart", cartRoutes);
app.use("/api/v1/products", productRoutes);
app.use("/api/v1/wishlist", wishlistRoutes);

app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`,
  });
});

app.use((err, req, res, next) => {
  console.error("GLOBAL ERROR HANDLER =>", err);

  const statusCode = err.statusCode || 500;

  return res.status(statusCode).json({
    success: false,
    message: err.message || "Something went wrong",
  });
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
