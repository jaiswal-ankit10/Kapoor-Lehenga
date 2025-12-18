import { ApiError } from "../utils/api-error.js";
import { asyncHandler } from "../utils/async-handler.js";
import { Product } from "../models/product.model.js";
import { Order } from "../models/order.model.js";
import crypto from "crypto";
import { ApiResponse } from "../utils/api-response.js";
import mongoose from "mongoose";

export const createOrder = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const { items, shippingAddress, paymentMethod, paymentStatus } = req.body;

  if (!items || items.length === 0) {
    throw new ApiError(400, "Order Items are required");
  }

  let totalAmount = 0;
  let totalItems = 0;

  for (const item of items) {
    const product = await Product.findById(item.product);
    if (!product) {
      throw new ApiError(404, "Product not found");
    }
    totalAmount += product.discountedPrice * item.quantity;
    totalItems += item.quantity;
  }

  const order = await Order.create({
    orderId: crypto.randomUUID(),
    user: userId,
    items,
    totalAmount,
    totalItems,
    shippingAddress,
    paymentMethod,
    paymentStatus,
  });
  return res
    .status(200)
    .json(new ApiResponse(200, order, "Order placed successfully"));
});

export const getMyOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ user: req.user.id })
    .sort({ createdAt: -1 })
    .populate("items.product", "title images");

  return res
    .status(200)
    .json(new ApiResponse(200, orders, "Order fetched Successfully"));
});

export const getOrderById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!id) {
    throw new ApiError(400, "Order id is required");
  }

  let order;

  if (mongoose.Types.ObjectId.isValid(id)) {
    order = await Order.findById(id)
      .populate("items.product", "title images price discountedPrice")
      .populate("shippingAddress")
      .populate("user", "email");
  }

  if (!order) {
    order = await Order.findOne({ orderId: id })
      .populate("items.product", "title images price discountedPrice")
      .populate("shippingAddress")
      .populate("user", "email fullName");
  }

  if (!order) {
    throw new ApiError(404, "Order not found");
  }

  if (req.user.role !== "admin" && order.user._id.toString() !== req.user.id) {
    throw new ApiError(403, "Unauthorized access");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, order, "Order fetched successfully"));
});

export const getAllOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find()
    .sort({ createdAt: -1 })
    .populate("items.product", "title images price discountedPrice")
    .populate("shippingAddress")
    .populate("user", "email fullName");

  if (!orders) {
    throw new ApiError(404, "Orders not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, orders, "Orders fetched successfully"));
});

export const updateOrderStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;
  const { id } = req.params;
  let order;
  if (mongoose.Types.ObjectId.isValid(id)) {
    order = await Order.findById(id);
  }
  if (!order) {
    order = await Order.findOne({ orderId: id })
      .populate("items.product", "title images price discountedPrice")
      .populate("shippingAddress")
      .populate("user", "email");
  }

  if (!order) {
    throw new ApiError(404, "Order not found");
  }

  order.status = status;
  await order.save();
  return res
    .status(200)
    .json(new ApiResponse(200, order, "Order status updated"));
});
export const cancelOrder = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);
  if (!order) {
    throw new ApiError(404, "Order not found");
  }

  if (order.user.toString() !== req.user.id) {
    throw new ApiError(403, "Unauthorized Access");
  }
  if (order.status === "Delivered") {
    throw new ApiError(400, "Delivered order cannot be cancelled");
  }

  order.status = "Cancelled";
  order.isCancelled = true;
  await order.save();
  return res
    .status(200)
    .json(new ApiResponse(200, order, "Order cancelled updated"));
});

export const returnOrder = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);
  if (!order) {
    throw new ApiError(404, "Order not found");
  }

  if (order.user.toString() !== req.user.id) {
    throw new ApiError(403, "Unauthorized Access");
  }

  order.status = "Returned";
  order.isReturned = true;
  await order.save();
  return res
    .status(200)
    .json(new ApiResponse(200, order, "Order returned updated"));
});

export const getReturnedOrder = asyncHandler(async (req, res) => {
  console.log("REQ USER ID:", req.user.id);

  const returnOrders = await Order.find({
    user: req.user.id,
    isReturned: true,
  })
    .populate("user", "fullName email")
    .populate("items.product", "images title price");

  console.log("Returned Orders:", returnOrders);

  return res
    .status(200)
    .json(
      new ApiResponse(200, returnOrders, "Returned orders fetched successfully")
    );
});
