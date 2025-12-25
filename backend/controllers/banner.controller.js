import { Banner } from "../models/banner.model.js";
import { asyncHandler } from "../utils/async-handler.js";
import { ApiError } from "../utils/api-error.js";
import { ApiResponse } from "../utils/api-response.js";
import cloudinary from "../config/cloudinary.js";

export const uploadToCloudinary = async (fileBuffer) => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader
      .upload_stream({ folder: "banners" }, (error, result) => {
        if (error) reject(error);
        else resolve(result);
      })
      .end(fileBuffer);
  });
};

export const createBanner = asyncHandler(async (req, res) => {
  if (!req.file) {
    throw new ApiError(400, "Banner image is required");
  }

  const upload = await uploadToCloudinary(req.file.buffer);

  const banner = await Banner.create({
    title: req.body.title,
    image: {
      url: upload.secure_url,
      publicId: upload.public_id,
    },
  });

  return res
    .status(200)
    .json(new ApiResponse(200, banner, "Banner created successfully"));
});

export const updateBanner = asyncHandler(async (req, res) => {
  const banner = await Banner.findById(req.params.id);
  if (!banner) {
    throw new ApiError(404, "Banner not found");
  }

  banner.title = req.body.title ?? banner.title;
  banner.isActive = req.body.isActive ?? banner.isActive;

  if (req.file) {
    if (banner.image?.publicId) {
      await cloudinary.uploader.destroy(banner.image.publicId);
    }

    const upload = await uploadToCloudinary(req.file.buffer);

    banner.image = {
      url: upload.secure_url,
      publicId: upload.public_id,
    };
  }

  await banner.save();

  return res
    .status(200)
    .json(new ApiResponse(200, banner, "Banner updated successfully"));
});

export const getBanners = asyncHandler(async (req, res) => {
  const banners = await Banner.find();

  return res.status(200).json(new ApiResponse(200, banners, "Banners fetched"));
});
export const getActiveBanners = asyncHandler(async (req, res) => {
  const banners = await Banner.find({ isActive: true }).sort({ createdAt: -1 });

  return res.status(200).json(new ApiResponse(200, banners, "Banners fetched"));
});

export const removeBanner = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const banner = await Banner.findById(id);
  if (!banner) {
    throw new ApiError(404, "Banner not found");
  }
  if (banner.image?.publicId) {
    await cloudinary.uploader.destroy(banner.image.publicId);
  }
  await banner.deleteOne();
  return res
    .status(200)
    .json(new ApiResponse(200, null, "Banner removed successfully"));
});
