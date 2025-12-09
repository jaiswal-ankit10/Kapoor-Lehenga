import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, "Please enter a valid email"],
    },

    mobile: {
      type: String,
      required: true,
      unique: true,
      match: [/^[6-9]\d{9}$/, "Please enter a valid phone number"],
    },

    password: {
      type: String,
      minlength: 6,
      select: false, // Prevents password return in API response
    },

    otp: {
      type: String, // Save OTP temporarily
    },

    otpExpireTime: {
      type: Date,
    },

    role: {
      type: String,
      enum: ["customer", "admin"],
      default: "customer",
    },

    profileImage: {
      type: String,
    },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);
export default User;
