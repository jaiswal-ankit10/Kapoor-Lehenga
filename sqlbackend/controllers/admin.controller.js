import prisma from "../config/prisma.js";
import bcrypt from "bcryptjs";
import { ApiError } from "../utils/api-error.js";
import { asyncHandler } from "../utils/async-handler.js";

/*  USERS  */

export const getAllUsers = asyncHandler(async (req, res) => {
  const users = await prisma.user.findMany({
    select: {
      id: true,
      fullName: true,
      email: true,
      mobile: true,
      role: true,
      createdAt: true,
    },
  });

  res.json({ success: true, users });
});

export const createUser = asyncHandler(async (req, res) => {
  const { fullName, email, mobile, password, role = "CUSTOMER" } = req.body;

  if (!fullName || !mobile || !email || !password) {
    throw new ApiError(400, "All the fields are required");
  }

  if (!["CUSTOMER", "ADMIN"].includes(role)) {
    throw new ApiError(400, "Invalid role");
  }

  const exists = await prisma.user.findFirst({
    where: {
      OR: [{ email }, { mobile }],
    },
  });

  if (exists) {
    throw new ApiError(409, "User with email or phoneNumber already exists");
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: {
      fullName,
      email,
      mobile,
      password: hashedPassword,
      role,
      authProvider: "LOCAL",
    },
  });

  res.status(201).json({
    success: true,
    message: "User created successfully",
    user: {
      id: user.id,
      fullName: user.fullName,
      email: user.email,
      mobile: user.mobile,
      role: user.role,
    },
  });
});

export const getUserById = asyncHandler(async (req, res) => {
  const user = await prisma.user.findUnique({
    where: { id: req.params.id },
    select: {
      id: true,
      fullName: true,
      email: true,
      mobile: true,
      role: true,
      createdAt: true,
    },
  });

  if (!user) throw new ApiError(404, "User not found");

  res.json({ success: true, user });
});

export const deleteUser = asyncHandler(async (req, res) => {
  await prisma.user.delete({
    where: { id: req.params.id },
  });

  res.json({ success: true, message: "User deleted" });
});

export const updateUserRole = asyncHandler(async (req, res) => {
  const { role } = req.body;

  if (!["CUSTOMER", "ADMIN"].includes(role)) {
    throw new ApiError(400, "Invalid role");
  }

  const user = await prisma.user.update({
    where: { id: req.params.id },
    data: { role },
    select: {
      id: true,
      fullName: true,
      email: true,
      role: true,
    },
  });

  res.json({ success: true, user });
});

/*  DASHBOARD  */

export const getDashboardStats = asyncHandler(async (req, res) => {
  const now = new Date();

  const startOfToday = new Date(now);
  startOfToday.setHours(0, 0, 0, 0);

  const endOfToday = new Date(now);
  endOfToday.setHours(23, 59, 59, 999);

  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const endOfMonth = new Date(
    now.getFullYear(),
    now.getMonth() + 1,
    0,
    23,
    59,
    59,
    999
  );

  const startOfYear = new Date(now.getFullYear(), 0, 1);
  const endOfYear = new Date(now.getFullYear(), 11, 31, 23, 59, 59, 999);

  const [
    totalUsers,
    totalOrders,
    totalProducts,
    completedOrders,
    cancelledOrders,
    todaysOrders,
    revenueAgg,
    todaysRevenueAgg,
    monthlyRevenueAgg,
    yearlyRevenueAgg,
  ] = await Promise.all([
    prisma.user.count(),
    prisma.order.count(),
    prisma.product.count(),

    prisma.order.count({ where: { status: "DELIVERED" } }),
    prisma.order.count({ where: { status: "CANCELLED" } }),

    prisma.order.count({
      where: {
        createdAt: { gte: startOfToday, lte: endOfToday },
      },
    }),

    prisma.order.aggregate({
      where: {
        status: { notIn: ["CANCELLED", "RETURNED"] },
      },
      _sum: { totalAmount: true },
    }),

    prisma.order.aggregate({
      where: {
        createdAt: { gte: startOfToday, lte: endOfToday },
        status: { not: "CANCELLED" },
      },
      _sum: { totalAmount: true },
    }),

    prisma.order.aggregate({
      where: {
        createdAt: { gte: startOfMonth, lte: endOfMonth },
        status: { notIn: ["CANCELLED", "RETURNED"] },
      },
      _sum: { totalAmount: true },
    }),

    prisma.order.aggregate({
      where: {
        createdAt: { gte: startOfYear, lte: endOfYear },
        status: { notIn: ["CANCELLED", "RETURNED"] },
      },
      _sum: { totalAmount: true },
    }),
  ]);

  res.json({
    success: true,
    stats: {
      totalUsers,
      totalOrders,
      totalProducts,
      completedOrders,
      cancelledOrders,
      todaysOrders,
      totalRevenue: revenueAgg._sum.totalAmount || 0,
      todaysRevenue: todaysRevenueAgg._sum.totalAmount || 0,
      monthlyRevenue: monthlyRevenueAgg._sum.totalAmount || 0,
      yearlyRevenue: yearlyRevenueAgg._sum.totalAmount || 0,
    },
  });
});
