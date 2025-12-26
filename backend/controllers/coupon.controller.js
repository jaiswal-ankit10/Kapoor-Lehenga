import { Coupon, CouponUsage } from "../models/coupon.model.js";
import { ApiError } from "../utils/api-error.js";
import { ApiResponse } from "../utils/api-response.js";
import { asyncHandler } from "../utils/async-handler.js";

//validations
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

  const usage = await CouponUsage.findOne({
    coupon: coupon._id,
    user: user._id,
  });
  if (usage && usage.usedCount >= coupon.usagePerUser) {
    throw new Error("You have already used this coupon");
  }

  return true;
};

export const calculateDiscount = (coupon, cartTotal) => {
  let discount = 0;
  if (coupon.discountType === "percentage") {
    discount = (cartTotal * coupon.discountValue) / 100;
  }
  if (coupon.discountType === "flat") {
    discount = coupon.discountValue;
  }

  //   for prevention of over discount
  discount = Math.min(discount, cartTotal);

  return Math.round(discount);
};

//controllers
export const createCoupon = asyncHandler(async (req, res) => {
  const {
    code,
    title,
    discountType,
    discountValue,
    startDate,
    expiryDate,
    minPurchaseAmount,
    usageLimit,
    usagePerUser,
    forNewUser,
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
  const existingCoupon = await Coupon.findOne({ code: normalizedCode });
  if (existingCoupon) {
    throw new ApiError(400, "Coupon code already exists");
  }
  if (new Date(startDate) > new Date(expiryDate)) {
    throw new ApiError(400, "Expiry date must be after start date");
  }
  if (discountType === "percentage" && discountValue > 100) {
    throw new ApiError(400, "Percentage discount cannot exceed 100%");
  }
  if (discountValue <= 0) {
    throw new ApiError(400, "Discount value must be greater than 0");
  }

  const coupon = await Coupon.create({
    code: normalizedCode,
    title,
    discountType,
    discountValue,
    startDate,
    expiryDate,
    minPurchaseAmount,
    usageLimit,
    usagePerUser,
    forNewUser,
  });
  return res
    .status(201)
    .json(new ApiResponse(201, coupon, "Coupon created successfully"));
});

export const applyCoupon = asyncHandler(async (req, res) => {
  const { code, cartItems, cartTotal } = req.body;
  if (!code || !cartItems || !cartTotal) {
    throw new ApiError(400, "Something is missing");
  }

  const coupon = await Coupon.findOne({ code });
  if (!coupon) {
    throw new ApiError(400, "Invalid Coupon code");
  }

  await validateCoupon({
    coupon,
    user: req.user,
    cartItems,
    cartTotal,
  });

  const discount = calculateDiscount(coupon, cartTotal);
  const data = {
    discount,
    finalAmount: cartTotal - discount,
    coupon: coupon.code,
  };
  res
    .status(200)
    .json(new ApiResponse(200, data, "Coupon Applied Successfully"));
});

export const fetchCoupons = asyncHandler(async (req, res) => {
  const coupons = await Coupon.find();
  if (!coupons) {
    throw new ApiError(400, "Coupon not found");
  }
  return res
    .status(200)
    .json(new ApiResponse(200, coupons, "Coupon Fetched successfully"));
});

export const updateCoupon = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const coupon = await Coupon.findById(id);
  if (!coupon) {
    throw new ApiError(400, "Coupon not found");
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

    const existing = await Coupon.findOne({
      code: normalizedCode,
      _id: { $ne: id },
    });

    if (existing) {
      throw new ApiError(400, "Coupon code already exists");
    }

    coupon.code = normalizedCode;
  }
  if (new Date(startDate) > new Date(expiryDate)) {
    throw new ApiError(400, "Expiry date must be after start date");
  }
  if (discountType === "percentage" && discountValue > 100) {
    throw new ApiError(400, "Percentage discount cannot exceed 100%");
  }
  if (discountValue <= 0) {
    throw new ApiError(400, "Discount value must be greater than 0");
  }

  if (title !== undefined) coupon.title = title;
  if (discountType !== undefined) coupon.discountType = discountType;
  if (discountValue !== undefined) coupon.discountValue = discountValue;
  if (minPurchaseAmount !== undefined)
    coupon.minPurchaseAmount = minPurchaseAmount;
  if (startDate !== undefined) coupon.startDate = startDate;
  if (expiryDate !== undefined) coupon.expiryDate = expiryDate;
  if (usageLimit !== undefined) coupon.usageLimit = usageLimit;
  if (usagePerUser !== undefined) coupon.usagePerUser = usagePerUser;
  if (forNewUser !== undefined) coupon.forNewUser = forNewUser;
  if (isActive !== undefined) coupon.isActive = isActive;
  await coupon.save();

  return res
    .status(200)
    .json(new ApiResponse(200, coupon, "Coupon updated successfully"));
});
export const deleteCoupon = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const coupon = await Coupon.findById(id);
  if (!coupon) {
    throw new ApiError(400, "Coupon not found");
  }
  await coupon.deleteOne();
  return res
    .status(200)
    .json(new ApiResponse(200, null, "Coupon removed successfully"));
});
