import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import { ApiError } from "../utils/api-error.js";
import { asyncHandler } from "../utils/async-handler.js";
import { Order } from "../models/order.model.js";
import { Product } from "../models/product.model.js";

//user management
export const getAllUsers = async (req, res) => {
  const users = await User.find().select("-password");
  res.json({ success: true, users });
};

export const createUser = asyncHandler(async (req, res) => {
  const { fullName, email, mobile, password, role = "customer" } = req.body;

  if (!fullName || !mobile || !email || !password) {
    throw new ApiError(400, "All the fields are required");
  }

  const existingUser = await User.findOne({
    $or: [{ email }, { mobile }],
  });

  if (existingUser) {
    throw new ApiError(409, "User with email or phoneNumber already exists");
  }

  if (role && !["customer", "admin"].includes(role)) {
    throw new ApiError(400, "Invalid role. Must be 'customer' or 'admin'");
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await User.create({
    fullName,
    email,
    mobile,
    password: hashedPassword,
    role: role,
    authProvider: "local",
  });

  return res.status(201).json({
    success: true,
    message: "User created successfully",
    user: {
      id: user._id,
      fullName: user.fullName,
      email: user.email,
      mobile: user.mobile,
      role: user.role,
    },
  });
});
export const getUserById = async (req, res) => {
  const { id } = req.params;
  const user = await User.findById(id).select("-password");
  res.json({ success: true, user });
};
export const deleteUser = async (req, res) => {
  await User.findByIdAndDelete(req.params.id);
  res.json({ success: true, message: "User deleted" });
};
export const updateUserRole = async (req, res) => {
  const { role } = req.body;

  const user = await User.findByIdAndUpdate(
    req.params.id,
    { role },
    { new: true }
  );

  res.json({ success: true, user });
};
export const getDashboardStats = async (req, res) => {
  const totalUsers = await User.countDocuments();
  const totalOrders = await Order.countDocuments();
  const totalProducts = await Product.countDocuments();
  const revenueAgg = await Order.aggregate([
    {
      $match: {
        status: { $nin: ["Cancelled", "Returned"] },
      },
    },
    {
      $group: {
        _id: null,
        totalRevenue: { $sum: "$totalAmount" },
      },
    },
  ]);
  const totalRevenue = revenueAgg[0]?.totalRevenue || 0;
  const startOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0);

  const endOfToday = new Date();
  endOfToday.setHours(23, 59, 59, 999);

  const todaysOrders = await Order.countDocuments({
    createdAt: {
      $gte: startOfToday,
      $lte: endOfToday,
    },
  });

  const completedOrders = await Order.countDocuments({
    status: "Delivered",
  });
  const cancelledOrders = await Order.countDocuments({
    status: "Cancelled",
  });

  //todaysRevneue
  const resultOfTodayRevenue = await Order.aggregate([
    {
      $match: {
        createdAt: {
          $gte: startOfToday,
          $lte: endOfToday,
        },
        status: { $ne: "Cancelled" },
      },
    },
    {
      $group: {
        _id: null,
        todaysRevenue: { $sum: "$totalAmount" },
      },
    },
  ]);

  const todaysRevenue = resultOfTodayRevenue[0]?.todaysRevenue || 0;

  //monthlyRevenue
  const now = new Date();
  const startOfMonth = new Date(
    now.getFullYear(),
    now.getMonth(),
    1,
    0,
    0,
    0,
    0
  );

  const endOfMonth = new Date(
    now.getFullYear(),
    now.getMonth() + 1,
    0,
    23,
    59,
    59,
    999
  );

  const resultOfMonthlyRevenue = await Order.aggregate([
    {
      $match: {
        createdAt: {
          $gte: startOfMonth,
          $lte: endOfMonth,
        },
        status: { $nin: ["Cancelled", "Returned"] },
      },
    },
    {
      $group: {
        _id: null,
        monthlyRevenue: { $sum: "$totalAmount" },
      },
    },
  ]);
  const monthlyRevenue = resultOfMonthlyRevenue[0]?.monthlyRevenue || 0;

  //yearlyRevenue
  const startOfYear = new Date(now.getFullYear(), 0, 1, 0, 0, 0, 0);
  const endOfYear = new Date(now.getFullYear(), 11, 31, 23, 59, 59, 999);

  const resultOfYearlyRevenue = await Order.aggregate([
    {
      $match: {
        createdAt: {
          $gte: startOfYear,
          $lte: endOfYear,
        },
        status: { $nin: ["Cancelled", "Returned"] },
      },
    },
    {
      $group: {
        _id: null,
        yearlyRevenue: { $sum: "$totalAmount" },
      },
    },
  ]);
  const yearlyRevenue = resultOfYearlyRevenue[0]?.yearlyRevenue || 0;

  res.json({
    success: true,
    stats: {
      totalUsers,
      totalOrders,
      totalRevenue,
      totalProducts,
      todaysOrders,
      completedOrders,
      cancelledOrders,
      todaysRevenue,
      monthlyRevenue,
      yearlyRevenue,
    },
  });
};
