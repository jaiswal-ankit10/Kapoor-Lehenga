import { Wishlist } from "../models/wishlist.model.js";
import { ApiError } from "../utils/api-error.js";
import { asyncHandler } from "../utils/async-handler.js";

export const addToWishlist = asyncHandler(async (req, res, next) => {
  const { productId } = req.body;
  const userId = req.user.id;

  if (!productId) throw new ApiError(400, "Product ID is required");

  let wishlist = await Wishlist.findOne({ user: userId });

  if (!wishlist) {
    wishlist = new Wishlist({ user: userId, items: [{ product: productId }] });
  } else {
    const exists = wishlist.items.find(
      (item) => item.product.toString() === productId
    );
    if (exists) {
      return res.status(200).json({
        success: true,
        message: "Already in wishlist",
        wishlist,
      });
    }
    wishlist.items.push({ product: productId });
  }

  await wishlist.save();

  res.status(200).json({
    success: true,
    message: "Added to wishlist",
    wishlist,
  });
});

export const removeFromWishlist = asyncHandler(async (req, res, next) => {
  const { productId } = req.body;
  const userId = req.user.id;

  let wishlist = await Wishlist.findOne({ user: userId });
  if (!wishlist) throw new ApiError(404, "Wishlist not found");

  wishlist.items = wishlist.items.filter(
    (item) => item.product.toString() !== productId
  );

  await wishlist.save();

  res.status(200).json({
    success: true,
    message: "Removed from wishlist",
    wishlist,
  });
});

export const getWishlist = asyncHandler(async (req, res, next) => {
  const userId = req.user.id;

  const wishlist = await Wishlist.findOne({ user: userId }).populate(
    "items.product"
  );

  res.status(200).json({
    success: true,
    wishlist,
  });
});

export const clearWishlist = asyncHandler(async (req, res, next) => {
  const userId = req.user.id;

  const wishlist = await Wishlist.findOne({ user: userId });
  if (!wishlist) throw new ApiError(404, "Wishlist not found");

  wishlist.items = [];
  await wishlist.save();

  res.status(200).json({
    success: true,
    message: "Wishlist cleared",
  });
});
