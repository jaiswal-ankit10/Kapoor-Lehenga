import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import { ApiError } from "../utils/api-error.js";
import { asyncHandler } from "../utils/async-handler.js";

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

  res.json({
    success: true,
    stats: {
      totalUsers,
    },
  });
};
