import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: function () {
        return this.authProvider === "local";
      },
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
      required: function () {
        return this.authProvider === "local";
      },
      unique: function () {
        return this.authProvider === "local";
      },
      match: [/^[6-9]\d{9}$/, "Please enter a valid phone number"],
    },

    password: {
      type: String,
      minlength: 6,
      select: false,
      required: function () {
        return this.authProvider === "local";
      },
    },

    otp: {
      type: String,
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

    authProvider: {
      type: String,
      enum: ["local", "google"],
      default: "local",
    },

    googleId: {
      type: String,
      unique: false,
      sparse: true,
    },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);
export default User;
