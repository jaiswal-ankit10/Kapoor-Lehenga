import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import connectDb from "./config/dbConnect.js";

const app = express();

//middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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
app.use("/api/v1/auth", authRegister);
app.use("/api/v1/cart", cartRoutes);
app.use("/api/v1/products", productRoutes);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
