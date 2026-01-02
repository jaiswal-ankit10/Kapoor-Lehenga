import prisma from "../config/prisma.js";
import { uploadToCloudinary } from "../utils/uploadToCloudinary.js";

/*  Cloudinary retry  */
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

/*  CREATE PRODUCT  */
export const createProduct = async (req, res) => {
  try {
    /*  Validate images  */
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        message: "At least one image is required",
      });
    }

    /*  Upload images  */
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
      brand,
      color,
      subCategoryId,
      additionalDetails,
    } = req.body;

    if (!subCategoryId) {
      return res.status(400).json({
        success: false,
        message: "SubCategory is required",
      });
    }

    /*  Parse additional details  */
    let parsedDetails = [];
    if (typeof additionalDetails === "string") {
      parsedDetails = JSON.parse(additionalDetails || "[]");
    }

    const cleanDetails = parsedDetails.filter((d) => d?.title && d?.value);

    /*  Numbers  */
    const priceNum = Number(price);
    const discountNum = Number(discount) || 0;

    const discountedPrice =
      discountNum > 0
        ? Math.round(priceNum - (priceNum * discountNum) / 100)
        : priceNum;

    /*  Colors  */
    const parsedColor = Array.isArray(color)
      ? color
      : typeof color === "string"
      ? color.split(",").map((c) => c.trim())
      : [];

    /*  Create Product  */
    const product = await prisma.product.create({
      data: {
        title,
        description,
        longDescription,
        price: priceNum,
        discount: discountNum,
        discountedPrice,
        stock: Number(stock) || 0,
        brand: brand || "Generic",
        color: parsedColor,

        thumbnail: imageUrls[0],
        images: imageUrls,

        subCategory: {
          connect: { id: subCategoryId },
        },

        additionalDetails: {
          create: cleanDetails,
        },
      },
      include: {
        additionalDetails: true,
        subCategory: {
          include: { category: true },
        },
      },
    });

    res.status(201).json({
      success: true,
      message: "Product created successfully",
      product,
    });
  } catch (error) {
    console.error("Product Creation Error:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/*  GET ALL PRODUCTS  */
export const getAllProducts = async (req, res) => {
  try {
    const {
      search,
      subCategory,
      sort,
      page = 1,
      limit = 20,
      color,
      maxPrice,
      discount,
    } = req.query;

    const where = {
      isDeleted: false,
    };

    /*  SEARCH  */
    if (search) {
      where.OR = [
        {
          title: {
            contains: search,
          },
        },
        {
          description: {
            contains: search,
          },
        },
        {
          subCategory: {
            name: {
              contains: search,
            },
          },
        },
        {
          subCategory: {
            category: {
              name: {
                contains: search,
              },
            },
          },
        },
      ];
    }

    /*  SUBCATEGORY FILTER   */
    if (subCategory) {
      where.subCategory = {
        name: {
          contains: subCategory, //  NOT equals
        },
      };
    }

    /*  COLOR FILTER  */
    if (color) {
      const colors = Array.isArray(color) ? color : color.split(",");
      where.color = { hasSome: colors };
    }

    /*  PRICE FILTER  */
    if (maxPrice) {
      where.price = { lte: Number(maxPrice) };
    }

    /*  DISCOUNT FILTER  */
    if (discount) {
      where.discount = { gte: Number(discount) };
    }

    /*  SORT  */
    let orderBy = { createdAt: "desc" };
    if (sort === "price_asc") orderBy = { price: "asc" };
    if (sort === "price_desc") orderBy = { price: "desc" };

    const skip = (Number(page) - 1) * Number(limit);

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        include: {
          subCategory: {
            include: { category: true },
          },
        },
        orderBy,
        skip,
        take: Number(limit),
      }),
      prisma.product.count({
        where, //  SAME WHERE, NOW VALID
      }),
    ]);

    res.status(200).json({
      success: true,
      total,
      page: Number(page),
      pages: Math.ceil(total / limit),
      products,
    });
  } catch (error) {
    console.error("GET PRODUCTS ERROR:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/*  GET PRODUCT BY ID  */
export const getProductById = async (req, res) => {
  try {
    const product = await prisma.product.findUnique({
      where: { id: req.params.id },
      include: {
        additionalDetails: true,
        subCategory: {
          include: { category: true },
        },
      },
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

/*  UPDATE PRODUCT  */
export const updateProduct = async (req, res) => {
  try {
    let updateData = {};
    const {
      title,
      description,
      longDescription,
      price,
      discount,
      stock,
      brand,
      color,
      subCategoryId,
      additionalDetails,
    } = req.body;

    if (title) updateData.title = title;
    if (description) updateData.description = description;
    if (longDescription) updateData.longDescription = longDescription;
    if (price) updateData.price = Number(price);
    if (discount) updateData.discount = Number(discount);
    if (stock) updateData.stock = Number(stock);
    if (brand) updateData.brand = brand;

    if (color) {
      updateData.color = Array.isArray(color)
        ? color
        : color.split(",").map((c) => c.trim());
    }

    if (subCategoryId) {
      updateData.subCategory = {
        connect: { id: subCategoryId },
      };
    }

    if (req.files && req.files.length > 0) {
      const imageUrls = await Promise.all(
        req.files.map((file) => uploadWithRetry(file.buffer))
      );

      updateData.images = imageUrls;
      updateData.thumbnail = imageUrls[0];
    }

    if (additionalDetails) {
      await prisma.productAdditionalDetail.deleteMany({
        where: { productId: req.params.id },
      });

      updateData.additionalDetails = {
        create: JSON.parse(additionalDetails),
      };
    }

    const product = await prisma.product.update({
      where: { id: req.params.id },
      data: updateData,
      include: {
        additionalDetails: true,
        subCategory: { include: { category: true } },
      },
    });

    res.status(200).json({
      success: true,
      message: "Product updated successfully",
      product,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/*  DELETE PRODUCT (SOFT)  */
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

/*  NEW PRODUCTS  */
export const getNewProducts = async (req, res) => {
  const last24Hours = new Date(Date.now() - 24 * 60 * 60 * 1000);

  const products = await prisma.product.findMany({
    where: {
      createdAt: { gte: last24Hours },
      isDeleted: false,
    },
    include: {
      subCategory: { include: { category: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  res.json({ success: true, products });
};

/*  REAL CATEGORIES  */
export const getProductCategories = async (req, res) => {
  const categories = await prisma.category.findMany({
    include: {
      subCategories: true,
    },
  });

  res.status(200).json({
    success: true,
    categories,
  });
};

/*  COLORS  */
export const getProductColors = async (req, res) => {
  const products = await prisma.product.findMany({
    where: { isDeleted: false },
    select: { color: true },
  });

  const colors = [...new Set(products.flatMap((p) => p.color || []))];

  res.status(200).json({ success: true, colors });
};
export const getSearchSuggestions = async (req, res) => {
  try {
    const { search } = req.query;

    if (!search) {
      return res.json({ success: true, suggestions: [] });
    }

    const suggestions = await prisma.product.findMany({
      where: {
        isDeleted: false,
        OR: [
          { title: { startsWith: search } },
          {
            subCategory: {
              name: { startsWith: search },
            },
          },
          {
            subCategory: {
              category: {
                name: { startsWith: search },
              },
            },
          },
        ],
      },
      select: {
        id: true,
        title: true,
        subCategory: {
          select: {
            name: true,
            category: { select: { name: true } },
          },
        },
      },
      take: 8,
    });

    res.json({
      success: true,
      suggestions,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
