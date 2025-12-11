import mongoose from "mongoose";
import dotenv from "dotenv";
import { Product } from "./models/product.model.js";
import { productList } from "./dummyData/productList.js"; // ensure correct path

dotenv.config(); // loads .env

const seedProducts = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB Connected Successfully");

    // Delete old products (optional)
    // await Product.deleteMany({});
    // console.log("🗑 Previous Products Removed");

    // Format products before inserting
    const formattedProducts = productList.map((p) => {
      const price = Number(p.price);
      const discount = Number(p.discount);

      return {
        title: p.title,
        description: p.description,
        price,
        discount,
        discountedPrice: price - (price * discount) / 100,
        images: p.images,
        stock: p.stock || 10,
        category: p.category,
        brand: p.brand || "Generic",
        color: p.color || [],
        ratings: p.ratings || 0,
        totalReviews: p.totalReviews || 0,
        reviews: [],
      };
    });

    await Product.insertMany(formattedProducts);
    console.log("Dummy Product Data Inserted Successfully");

    process.exit();
  } catch (error) {
    console.log("Error seeding products:", error);
    process.exit(1);
  }
};

seedProducts();
