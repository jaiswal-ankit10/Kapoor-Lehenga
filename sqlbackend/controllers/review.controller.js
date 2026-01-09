import prisma from "../config/prisma.js";
import { ApiError } from "../utils/api-error.js";
import { ApiResponse } from "../utils/api-response.js";
import { asyncHandler } from "../utils/async-handler.js";
import { uploadToCloudinary } from "../utils/uploadToCloudinary.js";

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

// Create review
export const createReview = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const { rating, comment } = req.body;
  const { productId } = req.params;

  if (!rating || !comment) {
    throw new ApiError(400, "rating and comment are required");
  }

  const numericRating = Number(rating);
  if (numericRating < 1 || numericRating > 5) {
    throw new ApiError(400, "rating should be between 1 and 5");
  }

  // Prevent duplicate review
  const existingReview = await prisma.review.findFirst({
    where: { productId, userId },
  });
  if (existingReview) {
    throw new ApiError(400, "You have already reviewed this product");
  }

  // Image upload
  let imageUrls = [];
  if (req.files?.length) {
    imageUrls = await Promise.all(
      req.files.map((file) => uploadWithRetry(file.buffer))
    );
  }

  // Verified purchase
  const hasPurchased = await prisma.orderItem.findFirst({
    where: {
      productId,
      order: {
        userId,
        paymentStatus: "COMPLETE",
        status: "DELIVERED",
        isCancelled: false,
        isReturned: false,
      },
    },
  });

  // console.log("Review productId:", productId);

  // Create review
  const review = await prisma.review.create({
    data: {
      rating: numericRating,
      comment,
      images: imageUrls,
      productId,
      userId,
      isVerifiedPurchase: Boolean(hasPurchased),
    },
  });

  //Recalculate rating & total reviews
  const ratingStats = await prisma.review.aggregate({
    where: { productId },
    _avg: { rating: true },
    _count: { rating: true },
  });

  await prisma.product.update({
    where: { id: productId },
    data: {
      ratings: ratingStats._avg.rating || 0,
      totalReviews: ratingStats._count.rating,
    },
  });

  res
    .status(201)
    .json(new ApiResponse(201, review, "Review created successfully"));
});

export const deleteReview = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;
  const userRole = req.user.role;

  const review = await prisma.review.findUnique({
    where: { id },
  });

  if (!review) {
    throw new ApiError(404, "Review not found");
  }
  if (review.userId !== userId && userRole !== "ADMIN") {
    throw new ApiError(403, "You are not allowed to delete this review");
  }

  const productId = review.productId;

  await prisma.$transaction(async (tx) => {
    await tx.review.delete({ where: { id } });

    const ratingStats = await tx.review.aggregate({
      where: { productId },
      _avg: { rating: true },
      _count: { rating: true },
    });

    await tx.product.update({
      where: { id: productId },
      data: {
        ratings: ratingStats._avg.rating || 0,
        totalReviews: ratingStats._count.rating,
      },
    });
  });

  res.status(200).json(new ApiResponse(200, [], "Review Deleted Successfully"));
});

export const getAllReviews = asyncHandler(async (req, res) => {
  const { productId } = req.params;

  const reviews = await prisma.review.findMany({
    where: { productId },
    orderBy: { createdAt: "desc" },
    include: {
      user: {
        select: {
          id: true,
          fullName: true,
        },
      },
    },
  });

  // console.log("Reviews Data: ", reviews);

  res
    .status(200)
    .json(new ApiResponse(200, reviews, "Reviews fetched successfully"));
});

export const getAllReviewsAdmin = asyncHandler(async (req, res) => {
  const userRole = req.user.role;

  if (userRole !== "ADMIN") {
    throw new ApiError(401, "Only Admin can get all reviews");
  }

  const reviews = await prisma.review.findMany({
    include: {
      user: {
        select: {
          id: true,
          fullName: true,
        },
      },
      product: {
        select: {
          id: true,
          title: true,
        },
      },
    },
  });

  res
    .status(200)
    .json(new ApiResponse(200, reviews, "Reviews fetched successfully"));
});
