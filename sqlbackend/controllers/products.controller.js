import prisma from "../config/prisma.js";
import { uploadToCloudinary } from "../utils/uploadToCloudinary.js";

/* ---------- Cloudinary retry ---------- */
const uploadWithRetry = async (buffer, retries = 1) => {
  try {
    return await uploadToCloudinary(buffer);
  } catch (err) {
    if (err.http_code === 499 && retries > 0) {
      return uploadWithRetry(buffer, retries - 1);
    }
    throw err;
  }
};

/* ================= CREATE PRODUCT ================= */
export const createProduct = async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        message: "At least one image is required",
      });
    }

    const imageUrls = await Promise.all(
      req.files.map((file) => uploadWithRetry(file.buffer))
    );

    let {
      title,
      description,
      longDescription,
      price,
      discount,
      stock,
      category,
      brand,
      color,
      additionalDetails,
    } = req.body;

    if (typeof additionalDetails === "string") {
      try {
        additionalDetails = JSON.parse(additionalDetails);
      } catch {
        additionalDetails = [];
      }
    }

    const priceNum = Number(price);
    if (isNaN(priceNum)) {
      return res.status(400).json({ success: false, message: "Invalid price" });
    }

    const discountNum = Number(discount) || 0;
    const discountedPrice =
      discountNum > 0 ? priceNum - (priceNum * discountNum) / 100 : priceNum;

    const product = await prisma.product.create({
      data: {
        title,
        description,
        longDescription,
        price: priceNum,
        discount: discountNum,
        discountedPrice,
        stock: Number(stock) || 0,
        category: category.toLowerCase(),
        brand: brand || "Generic",
        color: color ? color.split(",").map((c) => c.trim()) : [],
        thumbnail: imageUrls[0],
        images: imageUrls,

        additionalDetails: {
          create: (additionalDetails || []).map((d) => ({
            title: d.title,
            value: d.value,
          })),
        },
      },
      include: {
        additionalDetails: true,
      },
    });

    return res.status(201).json({
      success: true,
      message: "Product created successfully",
      product,
    });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Product creation failed" });
  }
};

/* ================= GET ALL PRODUCTS ================= */
export const getAllProducts = async (req, res) => {
  try {
    const {
      search,
      category,
      sort,
      page = 1,
      limit = 10,
      color,
      maxPrice,
      discount,
    } = req.query;

    const where = {
      isDeleted: false,
    };

    if (search) {
      where.title = { contains: search, mode: "insensitive" };
    }

    if (category) {
      where.category = { contains: category.toLowerCase() };
    }

    if (color) {
      const colors = Array.isArray(color) ? color : color.split(",");
      where.color = { hasSome: colors };
    }

    if (maxPrice) {
      where.price = { lte: Number(maxPrice) };
    }

    if (discount) {
      where.discount = { gte: Number(discount) };
    }

    let orderBy = {};
    if (sort === "price_asc") orderBy = { price: "asc" };
    if (sort === "price_desc") orderBy = { price: "desc" };
    if (sort === "newest") orderBy = { createdAt: "desc" };

    const skip = (page - 1) * limit;

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        orderBy,
        skip,
        take: Number(limit),
      }),
      prisma.product.count({ where }),
    ]);

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

/* ================= GET PRODUCT BY ID ================= */
export const getProductById = async (req, res) => {
  try {
    const product = await prisma.product.findUnique({
      where: { id: req.params.id },
      include: { additionalDetails: true },
    });

    if (!product || product.isDeleted) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
    }

    res.status(200).json({ success: true, product });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/* ================= UPDATE PRODUCT ================= */
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

    const product = await prisma.product.update({
      where: { id: req.params.id },
      data: updateData,
    });

    res.status(200).json({
      success: true,
      message: "Product updated",
      product,
    });
  } catch (error) {
    res.status(404).json({ success: false, message: "Product not found" });
  }
};

/* ================= DELETE PRODUCT (SOFT) ================= */
export const deleteProduct = async (req, res) => {
  try {
    await prisma.product.update({
      where: { id: req.params.id },
      data: { isDeleted: true },
    });

    res.status(200).json({ success: true, message: "Product deleted" });
  } catch (error) {
    res.status(404).json({ success: false, message: "Product not found" });
  }
};

/* ================= NEW PRODUCTS ================= */
export const getNewProducts = async (req, res) => {
  const last24Hours = new Date(Date.now() - 24 * 60 * 60 * 1000);

  const products = await prisma.product.findMany({
    where: {
      createdAt: { gte: last24Hours },
      isDeleted: false,
    },
    orderBy: { createdAt: "desc" },
  });

  res.json({ success: true, products });
};

/* ================= CATEGORIES ================= */
export const getProductCategories = async (req, res) => {
  const categories = await prisma.product.findMany({
    where: { isDeleted: false },
    distinct: ["category"],
    select: { category: true },
  });

  res.status(200).json({
    success: true,
    categories: categories.map((c) => c.category),
  });
};

/* ================= COLORS ================= */
export const getProductColors = async (req, res) => {
  const products = await prisma.product.findMany({
    where: { isDeleted: false },
    select: { color: true },
  });

  const colors = [...new Set(products.flatMap((p) => p.color || []))];

  res.status(200).json({ success: true, colors });
};
