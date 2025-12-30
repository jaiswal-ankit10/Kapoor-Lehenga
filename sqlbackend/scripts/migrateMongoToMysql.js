import mongoose from "mongoose";
import "dotenv/config";
import prisma from "../config/prisma.js";

// Mongo models
import User from "../../backend/models/user.model.js";
import { Product } from "../../backend/models/product.model.js";

// ID maps (CRITICAL)
const userIdMap = new Map();
const productIdMap = new Map();

/* ================= CONNECT MONGO ================= */
await mongoose.connect(process.env.MONGO_URI);
console.log("✅ MongoDB connected");

/* ================= USERS ================= */
const migrateUsers = async () => {
  const users = await User.find({}).select("+password");

  for (const u of users) {
    const created = await prisma.user.create({
      data: {
        fullName: u.fullName || null,
        email: u.email,
        mobile: u.mobile || null,
        password: u.password || null,
        otp: u.otp || null,
        otpExpireTime: u.otpExpireTime || null,
        role: u.role === "admin" ? "ADMIN" : "CUSTOMER",
        profileImage: u.profileImage || null,
        authProvider: u.authProvider === "google" ? "GOOGLE" : "LOCAL",
        googleId: u.googleId || null,
        createdAt: u.createdAt,
        updatedAt: u.updatedAt,
      },
    });

    userIdMap.set(u._id.toString(), created.id);
  }

  console.log(`✅ Users migrated: ${users.length}`);
};

/* ================= PRODUCTS ================= */
const migrateProducts = async () => {
  const products = await Product.find({});

  for (const p of products) {
    const discountedPrice =
      p.discount > 0 ? p.price - (p.price * p.discount) / 100 : p.price;

    const created = await prisma.product.create({
      data: {
        title: p.title,
        description: p.description,
        longDescription: p.longDescription || null,
        thumbnail: p.thumbnail || null,
        images: p.images,
        price: p.price,
        discount: p.discount,
        discountedPrice,
        stock: p.stock,
        category: p.category,
        brand: p.brand,
        color: p.color,
        ratings: p.ratings,
        totalReviews: p.totalReviews,
        isDeleted: p.isDeleted,
        createdAt: p.createdAt,
        updatedAt: p.updatedAt,

        additionalDetails: {
          create: p.additionalDetails.map((d) => ({
            title: d.title,
            value: d.value,
          })),
        },
      },
    });

    productIdMap.set(p._id.toString(), created.id);
  }

  console.log(`✅ Products migrated: ${products.length}`);
};

/* ================= RUN ================= */
(async () => {
  try {
    await migrateUsers();
    await migrateProducts();

    console.log("🎉 Mongo → MySQL migration completed");
    process.exit(0);
  } catch (err) {
    console.error("❌ Migration failed", err);
    process.exit(1);
  }
})();
