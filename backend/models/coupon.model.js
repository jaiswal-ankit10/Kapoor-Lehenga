import mongoose from "mongoose";

const couponSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true,
    },

    title: {
      type: String,
      required: true,
    },

    discountType: {
      type: String,
      enum: ["percentage", "flat"],
      required: true,
    },

    discountValue: {
      type: Number,
      required: true,
    },

    minPurchaseAmount: {
      type: Number,
      default: 0,
    },

    startDate: {
      type: Date,
      required: true,
    },

    expiryDate: {
      type: Date,
      required: true,
    },

    isActive: {
      type: Boolean,
      default: true,
    },

    usageLimit: {
      type: Number,
      default: 0,
    },

    usedCount: {
      type: Number,
      default: 0,
    },

    usagePerUser: {
      type: Number,
      default: 1,
    },

    forNewUser: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);
const couponUsageSchema = new mongoose.Schema(
  {
    coupon: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Coupon",
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    usedCount: {
      type: Number,
      default: 1,
    },
  },
  { timestamps: true }
);

couponUsageSchema.index({ coupon: 1, user: 1 }, { unique: true });

export const Coupon = mongoose.model("Coupon", couponSchema);
export const CouponUsage = mongoose.model("CouponUsage", couponUsageSchema);
