import { Product } from "../models/product.model.js";

export const createProduct = async (req, res) => {
  try {
    const product = await Product.create(req.body);
    res
      .status(201)
      .json({ success: true, message: "Product created", product });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
export const getAllProducts = async (req, res) => {
  try {
    const { search, category, sort, page = 1, limit = 10 } = req.query;

    const query = {
      isDeleted: false,
    };

    if (search) {
      query.name = { $regex: search, $options: "i" };
    }

    if (category) {
      query.category = category;
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
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });

    if (!product)
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });

    res
      .status(200)
      .json({ success: true, message: "Product updated", product });
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
