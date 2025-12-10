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
