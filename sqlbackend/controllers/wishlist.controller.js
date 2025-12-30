import prisma from "../config/prisma.js";
import { ApiError } from "../utils/api-error.js";
import { asyncHandler } from "../utils/async-handler.js";

/* ================= ADD TO WISHLIST ================= */
export const addToWishlist = asyncHandler(async (req, res) => {
  const { productId } = req.body;
  const userId = req.user.id;

  if (!productId) throw new ApiError(400, "Product ID is required");

  // Ensure wishlist exists
  const wishlist = await prisma.wishlist.upsert({
    where: { userId },
    create: { userId },
    update: {},
  });

  // Check if already exists
  const exists = await prisma.wishlistItem.findFirst({
    where: {
      wishlistId: wishlist.id,
      productId,
    },
  });

  if (exists) {
    return res.status(200).json({
      success: true,
      message: "Already in wishlist",
      wishlist,
    });
  }

  await prisma.wishlistItem.create({
    data: {
      wishlistId: wishlist.id,
      productId,
    },
  });

  const updatedWishlist = await prisma.wishlist.findUnique({
    where: { id: wishlist.id },
    include: {
      items: { include: { product: true } },
    },
  });

  res.status(200).json({
    success: true,
    message: "Added to wishlist",
    wishlist: updatedWishlist,
  });
});

/* ================= REMOVE FROM WISHLIST ================= */
export const removeFromWishlist = asyncHandler(async (req, res) => {
  const { productId } = req.body;
  const userId = req.user.id;

  const wishlist = await prisma.wishlist.findUnique({
    where: { userId },
  });
  if (!wishlist) throw new ApiError(404, "Wishlist not found");

  const item = await prisma.wishlistItem.findFirst({
    where: {
      wishlistId: wishlist.id,
      productId,
    },
  });

  if (!item) {
    return res.status(200).json({
      success: true,
      message: "Item not in wishlist",
      wishlist,
    });
  }

  await prisma.wishlistItem.delete({
    where: { id: item.id },
  });

  const updatedWishlist = await prisma.wishlist.findUnique({
    where: { id: wishlist.id },
    include: {
      items: { include: { product: true } },
    },
  });

  res.status(200).json({
    success: true,
    message: "Removed from wishlist",
    wishlist: updatedWishlist,
  });
});

/* ================= GET WISHLIST ================= */
export const getWishlist = asyncHandler(async (req, res) => {
  const userId = req.user.id;

  const wishlist = await prisma.wishlist.findUnique({
    where: { userId },
    include: {
      items: {
        include: {
          product: true,
        },
      },
    },
  });

  res.status(200).json({
    success: true,
    wishlist: wishlist || null,
  });
});

/* ================= CLEAR WISHLIST ================= */
export const clearWishlist = asyncHandler(async (req, res) => {
  const userId = req.user.id;

  const wishlist = await prisma.wishlist.findUnique({
    where: { userId },
  });
  if (!wishlist) throw new ApiError(404, "Wishlist not found");

  await prisma.wishlistItem.deleteMany({
    where: { wishlistId: wishlist.id },
  });

  res.status(200).json({
    success: true,
    message: "Wishlist cleared",
  });
});
