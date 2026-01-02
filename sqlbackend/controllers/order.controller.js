import prisma from "../config/prisma.js";
import { ApiError } from "../utils/api-error.js";
import { ApiResponse } from "../utils/api-response.js";
import { asyncHandler } from "../utils/async-handler.js";
import crypto from "crypto";

/*  CREATE ORDER  */
export const createOrder = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const { items, shippingAddress, paymentMethod, paymentStatus } = req.body;

  if (!items || items.length === 0) {
    throw new ApiError(400, "Order Items are required");
  }

  const productIds = items
    .map((i) => i.productId)
    .filter((id) => id !== undefined && id !== null); // Safety check;

  const products = await prisma.product.findMany({
    where: { id: { in: productIds } },
  });

  if (products.length !== items.length) {
    throw new ApiError(404, "One or more products not found");
  }

  let totalAmount = 0;
  let totalItems = 0;

  const orderItemsData = items.map((item) => {
    const product = products.find((p) => p.id === item.productId);
    totalAmount += product.discountedPrice * item.quantity;
    totalItems += item.quantity;

    return {
      productId: product.id,
      title: product.title,
      price: product.discountedPrice,
      quantity: item.quantity,
    };
  });

  const order = await prisma.$transaction(async (tx) => {
    const createdOrder = await tx.order.create({
      data: {
        orderId: crypto.randomUUID(),
        userId,
        totalAmount,
        status: "PENDING",
        paymentMethod,
        paymentStatus,
      },
    });

    await tx.orderItem.createMany({
      data: orderItemsData.map((i) => ({
        ...i,
        orderId: createdOrder.id,
      })),
    });

    if (shippingAddress) {
      await tx.shippingAddress.create({
        data: {
          ...shippingAddress,
          orderId: createdOrder.id,
        },
      });
    }

    return createdOrder;
  });

  return res
    .status(200)
    .json(new ApiResponse(200, order, "Order placed successfully"));
});

/*  MY ORDERS  */
export const getMyOrders = asyncHandler(async (req, res) => {
  const orders = await prisma.order.findMany({
    where: { userId: req.user.id },
    orderBy: { createdAt: "desc" },
    include: {
      items: {
        include: {
          product: {
            select: { title: true, images: true },
          },
        },
      },
    },
  });

  return res
    .status(200)
    .json(new ApiResponse(200, orders, "Order fetched Successfully"));
});

/*  GET ORDER BY ID  */
export const getOrderById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!id) throw new ApiError(400, "Order id is required");

  const order = await prisma.order.findFirst({
    where: {
      OR: [{ id }, { orderId: id }],
    },
    include: {
      items: {
        include: {
          product: {
            select: {
              title: true,
              images: true,
              price: true,
              discountedPrice: true,
            },
          },
        },
      },
      shippingAddress: true,
      user: {
        select: {
          email: true,
          fullName: true,
        },
      },
    },
  });

  if (!order) throw new ApiError(404, "Order not found");

  if (req.user.role !== "ADMIN" && order.userId !== req.user.id) {
    throw new ApiError(403, "Unauthorized access");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, order, "Order fetched successfully"));
});

/*  ADMIN: ALL ORDERS  */
export const getAllOrders = asyncHandler(async (req, res) => {
  const orders = await prisma.order.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      items: {
        include: {
          product: {
            select: {
              title: true,
              images: true,
              price: true,
              discountedPrice: true,
            },
          },
        },
      },
      shippingAddress: true,
      user: {
        select: { email: true, fullName: true },
      },
    },
  });

  return res
    .status(200)
    .json(new ApiResponse(200, orders, "Orders fetched successfully"));
});

/*  UPDATE ORDER STATUS (ADMIN)  */
export const updateOrderStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;
  const { id } = req.params;

  const order = await prisma.order.findFirst({
    where: {
      OR: [{ id }, { orderId: id }],
    },
  });

  if (!order) throw new ApiError(404, "Order not found");

  const updatedOrder = await prisma.order.update({
    where: { id: order.id },
    data: { status },
  });

  return res
    .status(200)
    .json(new ApiResponse(200, updatedOrder, "Order status updated"));
});

/*  CANCEL ORDER  */
export const cancelOrder = asyncHandler(async (req, res) => {
  const order = await prisma.order.findUnique({
    where: { id: req.params.id },
  });

  if (!order) throw new ApiError(404, "Order not found");

  if (order.userId !== req.user.id) {
    throw new ApiError(403, "Unauthorized Access");
  }

  if (order.status === "DELIVERED") {
    throw new ApiError(400, "Delivered order cannot be cancelled");
  }

  const updated = await prisma.order.update({
    where: { id: order.id },
    data: {
      status: "CANCELLED",
      paymentStatus: "REFUNDED",
      isCancelled: true,
    },
  });

  return res
    .status(200)
    .json(new ApiResponse(200, updated, "Order cancelled successfully"));
});

/*  RETURN ORDER  */
export const returnOrder = asyncHandler(async (req, res) => {
  const order = await prisma.order.findUnique({
    where: { id: req.params.id },
  });

  if (!order) throw new ApiError(404, "Order not found");

  if (order.userId !== req.user.id) {
    throw new ApiError(403, "Unauthorized Access");
  }

  const updated = await prisma.order.update({
    where: { id: order.id },
    data: {
      status: "RETURNED",
      isReturned: true,
    },
  });

  return res
    .status(200)
    .json(new ApiResponse(200, updated, "Order returned successfully"));
});

/*  RETURNED ORDERS  */
export const getReturnedOrder = asyncHandler(async (req, res) => {
  const orders = await prisma.order.findMany({
    where: {
      userId: req.user.id,
      isReturned: true,
    },
    include: {
      user: { select: { fullName: true, email: true } },
      items: {
        include: {
          product: {
            select: { images: true, title: true, price: true },
          },
        },
      },
    },
  });

  return res
    .status(200)
    .json(new ApiResponse(200, orders, "Returned orders fetched successfully"));
});
