import { Product } from "../models/product.model.js";
import { uploadToCloudinary } from "../utils/uploadToCloudinary.js";

const uploadWithRetry = async (buffer, retries = 1) => {
  try {
    return await uploadToCloudinary(buffer);
  } catch (err) {
    console.error("Cloudinary upload failed:", err.message);
    if (err.http_code === 499 && retries > 0) {
      console.warn("Retrying Cloudinary upload...");
      return uploadWithRetry(buffer, retries - 1);
    }
    throw err;
  }
};

export const createProduct = async (req, res) => {
  try {
    console.log("FILES:", req.files);
    console.log("BODY:", req.body);

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        message: "At least one image is required",
      });
    }

    const imageUrls = await Promise.all(
      req.files.map((file) => uploadWithRetry(file.buffer))
    );

    const {
      title,
      description,
      price,
      discount,
      stock,
      category,
      brand,
      color,
    } = req.body;

    const priceNum = Number(price);
    if (isNaN(priceNum)) {
      return res.status(400).json({
        success: false,
        message: "Invalid price",
      });
    }
    const discountNum = Number(discount) || 0;
    const discountedPrice =
      discountNum > 0 ? priceNum - (priceNum * discountNum) / 100 : priceNum;

    const product = await Product.create({
      title,
      description,
      price: priceNum,
      discount: discountNum,
      discountedPrice,
      stock: Number(stock) || 0,
      category,
      brand: brand || "Generic",
      color: color ? color.split(",").map((c) => c.trim()) : [],
      thumbnail: imageUrls[0] || "",
      images: imageUrls,
    });

    return res.status(201).json({
      success: true,
      message: "Product created successfully",
      product,
    });
  } catch (error) {
    console.error("Create product error:", error);
    return res.status(500).json({
      success: false,
      message: "Product creation failed",
    });
  }
};
export const getAllProducts = async (req, res) => {
  try {
    const { search, category, sort, page = 1, limit = 10 } = req.query;

    const query = {
      isDeleted: false,
    };

    if (search) {
      query.title = { $regex: search, $options: "i" };
    }

    if (query.category) {
      query.category = { $regex: query.category, $options: "i" };
    }

    let mongooseQuery = Product.find(query);

    // Sorting
    if (sort === "price_asc") mongooseQuery = mongooseQuery.sort({ price: 1 });
    if (sort === "price_desc")
      mongooseQuery = mongooseQuery.sort({ price: -1 });
    if (sort === "newest")
      mongooseQuery = mongooseQuery.sort({ createdAt: -1 });

    // Pagination
    const skip = (page - 1) * limit;
    mongooseQuery = mongooseQuery.skip(skip).limit(parseInt(limit));

    const products = await mongooseQuery;

    const total = await Product.countDocuments(query);

    res.status(200).json({
      success: true,
      total,
      page: Number(page),
      pages: Math.ceil(total / limit),
      products,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product || product.isDeleted)
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });

    res.status(200).json({ success: true, product });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
export const updateProduct = async (req, res) => {
  try {
    let updateData = { ...req.body };

    if (req.files && req.files.length > 0) {
      const imageUrls = await Promise.all(
        req.files.map((file) => uploadWithRetry(file.buffer))
      );

      updateData.images = imageUrls;
      updateData.thumbnail = imageUrls[0];
    }

    const product = await Product.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!product) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
    }

    res.status(200).json({
      success: true,
      message: "Product updated",
      product,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product)
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });

    product.isDeleted = true;
    await product.save();

    res.status(200).json({ success: true, message: "Product deleted" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
export const getNewProducts = async (req, res) => {
  const last24Hours = new Date(Date.now() - 24 * 60 * 60 * 1000);

  const products = await Product.find({
    createdAt: { $gte: last24Hours },
  }).sort({ createdAt: -1 });

  res.json({ success: true, products });
};
