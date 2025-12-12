import User from "../models/user.model.js";

//user management
export const getAllUsers = async (req, res) => {
  const users = await User.find().select("-password");
  res.json({ success: true, users });
};
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
