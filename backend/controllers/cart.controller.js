import { asyncHandler } from "../utils/async-handler.js";
import { ApiError } from "../utils/api-error.js";
import { Cart } from "../models/cart.model.js";

// ADD TO CART
export const addToCart = asyncHandler(async (req, res, next) => {
  const { productId, price, quantity = 1 } = req.body;
  const userId = req.user.id;

  let cart = await Cart.findOne({ user: userId });

  if (!cart) {
    cart = new Cart({ user: userId, items: [] });
  }

  const existingItem = cart.items.find(
    (item) => item.product.toString() === productId
  );

  if (existingItem) {
    existingItem.quantity += quantity;
  } else {
    cart.items.push({ product: productId, quantity, price });
  }

  await cart.save();

  res.status(200).json({
    success: true,
    message: "Item added to cart",
    cart,
  });
});

// UPDATE ITEM
export const updateCartItem = asyncHandler(async (req, res, next) => {
  const { productId, quantity } = req.body;
  const userId = req.user.id;

  let cart = await Cart.findOne({ user: userId });
  if (!cart) throw new ApiError(404, "Cart not found");

  const item = cart.items.find((item) => item.product.toString() === productId);
  if (!item) throw new ApiError(404, "Item not found in cart");

  if (quantity <= 0) {
    cart.items = cart.items.filter(
      (item) => item.product.toString() !== productId
    );
  } else {
    item.quantity = quantity;
  }

  await cart.save();

  res.status(200).json({
    success: true,
    message: "Cart updated",
    cart,
  });
});

// REMOVE ITEM
export const removeCartItem = asyncHandler(async (req, res, next) => {
  const { productId } = req.body;
  const userId = req.user.id;

  let cart = await Cart.findOne({ user: userId });
  if (!cart) throw new ApiError(404, "Cart not found");

  cart.items = cart.items.filter(
    (item) => item.product.toString() !== productId
  );

  await cart.save();

  res.status(200).json({
    success: true,
    message: "Item removed",
    cart,
  });
});

// GET CART
export const getCart = asyncHandler(async (req, res, next) => {
  const userId = req.user.id;

  const cart = await Cart.findOne({ user: userId }).populate("items.product");
  if (!cart) {
    return res.status(200).json({ success: true, cart: null });
  }

  res.status(200).json({
    success: true,
    cart,
  });
});

// CLEAR CART
export const clearCart = asyncHandler(async (req, res, next) => {
  const userId = req.user.id;

  let cart = await Cart.findOne({ user: userId });
  if (!cart) throw new ApiError(404, "Cart not found");

  cart.items = [];
  await cart.save();

  res.status(200).json({
    success: true,
    message: "Cart cleared",
    cart,
  });
});
