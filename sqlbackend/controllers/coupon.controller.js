import prisma from "../config/prisma.js";
import { ApiError } from "../utils/api-error.js";
import { ApiResponse } from "../utils/api-response.js";
import { asyncHandler } from "../utils/async-handler.js";

/* ================= VALIDATE COUPON ================= */
export const validateCoupon = async ({
  coupon,
  user,
  cartItems,
  cartTotal,
}) => {
  const now = new Date();

  if (!coupon.isActive) {
    throw new ApiError(400, "Coupon is inactive");
  }

  if (coupon.startDate > now || coupon.expiryDate < now) {
    throw new ApiError(400, "Coupon is expired or not yet active");
  }

  if (cartTotal < coupon.minPurchaseAmount) {
    throw new ApiError(
      400,
      `Minimum purchase of ₹${coupon.minPurchaseAmount} required`
    );
  }

  if (coupon.usageLimit > 0 && coupon.usedCount >= coupon.usageLimit) {
    throw new ApiError(400, "Coupon usage limit reached");
  }

  if (coupon.forNewUser && user.orderCount > 0) {
    throw new ApiError(400, "Coupon valid only for new users");
  }

  const usage = await prisma.couponUsage.findUnique({
    where: {
      couponId_userId: {
        couponId: coupon.id,
        userId: user.id,
      },
    },
  });

  if (usage && usage.usedCount >= coupon.usagePerUser) {
    throw new ApiError(400, "You have already used this coupon");
  }

  return true;
};

/* ================= CALCULATE DISCOUNT ================= */
export const calculateDiscount = (coupon, cartTotal) => {
  let discount = 0;

  if (coupon.discountType === "PERCENTAGE") {
    discount = (cartTotal * coupon.discountValue) / 100;
  }

  if (coupon.discountType === "FLAT") {
    discount = coupon.discountValue;
  }

  discount = Math.min(discount, cartTotal);
  return Math.round(discount);
};

/* ================= CREATE COUPON ================= */
export const createCoupon = asyncHandler(async (req, res) => {
  const {
    code,
    title,
    discountType,
    discountValue,
    startDate,
    expiryDate,
    minPurchaseAmount = 0,
    usageLimit = 0,
    usagePerUser = 1,
    forNewUser = false,
  } = req.body;

  if (
    !code ||
    !title ||
    !discountType ||
    !discountValue ||
    !startDate ||
    !expiryDate
  ) {
    throw new ApiError(400, "Required coupon fields are missing");
  }

  const normalizedCode = code.trim().toUpperCase();
  const numericDiscountValue = Number(discountValue);
  const numericMinPurchase = Number(minPurchaseAmount) || 0;
  const numericUsageLimit = Number(usageLimit) || 0;
  const numericUsagePerUser = Number(usagePerUser) || 1;
  const existingCoupon = await prisma.coupon.findUnique({
    where: { code: normalizedCode },
  });

  if (existingCoupon) {
    throw new ApiError(400, "Coupon code already exists");
  }

  if (new Date(startDate) > new Date(expiryDate)) {
    throw new ApiError(400, "Expiry date must be after start date");
  }

  if (discountType === "PERCENTAGE" && discountValue > 100) {
    throw new ApiError(400, "Percentage discount cannot exceed 100%");
  }

  if (discountValue <= 0) {
    throw new ApiError(400, "Discount value must be greater than 0");
  }

  const coupon = await prisma.coupon.create({
    data: {
      code: code.trim().toUpperCase(),
      title,
      discountType,
      discountValue: numericDiscountValue,
      startDate: new Date(startDate),
      expiryDate: new Date(expiryDate),
      minPurchaseAmount: numericMinPurchase,
      usageLimit: numericUsageLimit,
      usagePerUser: numericUsagePerUser,
      forNewUser,
    },
  });

  return res
    .status(201)
    .json(new ApiResponse(201, coupon, "Coupon created successfully"));
});

/* ================= APPLY COUPON ================= */
export const applyCoupon = asyncHandler(async (req, res) => {
  const { code, cartItems, cartTotal } = req.body;

  if (!code || !cartItems || !cartTotal) {
    throw new ApiError(400, "Something is missing");
  }

  const coupon = await prisma.coupon.findUnique({
    where: { code: code.toUpperCase() },
  });

  if (!coupon) {
    throw new ApiError(400, "Invalid coupon code");
  }

  await validateCoupon({
    coupon,
    user: req.user,
    cartItems,
    cartTotal,
  });

  const discount = calculateDiscount(coupon, cartTotal);

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        discount,
        finalAmount: cartTotal - discount,
        coupon: coupon.code,
      },
      "Coupon applied successfully"
    )
  );
});

/* ================= FETCH COUPONS ================= */
export const fetchCoupons = asyncHandler(async (req, res) => {
  const coupons = await prisma.coupon.findMany({
    orderBy: { createdAt: "desc" },
  });

  return res
    .status(200)
    .json(new ApiResponse(200, coupons, "Coupons fetched successfully"));
});

/* ================= UPDATE COUPON ================= */
export const updateCoupon = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const coupon = await prisma.coupon.findUnique({ where: { id } });
  if (!coupon) {
    throw new ApiError(404, "Coupon not found");
  }

  const {
    code,
    title,
    discountType,
    discountValue,
    minPurchaseAmount,
    startDate,
    expiryDate,
    usageLimit,
    usagePerUser,
    forNewUser,
    isActive,
  } = req.body;

  if (code) {
    const normalizedCode = code.trim().toUpperCase();

    const existing = await prisma.coupon.findFirst({
      where: {
        code: normalizedCode,
        NOT: { id },
      },
    });

    if (existing) {
      throw new ApiError(400, "Coupon code already exists");
    }
  }
  const numericDiscountValue = Number(discountValue);
  const numericMinPurchase = Number(minPurchaseAmount) || 0;
  const numericUsageLimit = Number(usageLimit) || 0;
  const numericUsagePerUser = Number(usagePerUser) || 1;

  if (startDate && expiryDate && new Date(startDate) > new Date(expiryDate)) {
    throw new ApiError(400, "Expiry date must be after start date");
  }

  if (discountType === "PERCENTAGE" && discountValue > 100) {
    throw new ApiError(400, "Percentage discount cannot exceed 100%");
  }

  if (discountValue !== undefined && discountValue <= 0) {
    throw new ApiError(400, "Discount value must be greater than 0");
  }

  const updatedCoupon = await prisma.coupon.update({
    where: { id },
    data: {
      code: code ? code.trim().toUpperCase() : undefined,
      title,
      discountType,
      discountValue: numericDiscountValue,
      startDate: new Date(startDate),
      expiryDate: new Date(expiryDate),
      minPurchaseAmount: numericMinPurchase,
      usageLimit: numericUsageLimit,
      usagePerUser: numericUsagePerUser,
      forNewUser,
      isActive,
    },
  });

  return res
    .status(200)
    .json(new ApiResponse(200, updatedCoupon, "Coupon updated successfully"));
});

/* ================= DELETE COUPON ================= */
export const deleteCoupon = asyncHandler(async (req, res) => {
  const { id } = req.params;

  await prisma.coupon.delete({
    where: { id },
  });

  return res
    .status(200)
    .json(new ApiResponse(200, null, "Coupon removed successfully"));
});
