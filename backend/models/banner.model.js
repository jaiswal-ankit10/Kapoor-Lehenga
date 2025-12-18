import mongoose from "mongoose";

const bannerSchema = new mongoose.Schema(
  {
    title: String,
    image: {
      url: {
        type: String,
        required: true,
      },
      publicId: {
        type: String,
        required: true,
      },
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);
export const Banner = mongoose.model("Banner", bannerSchema);
