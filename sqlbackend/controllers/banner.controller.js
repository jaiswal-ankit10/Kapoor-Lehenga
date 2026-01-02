import prisma from "../config/prisma.js";
import cloudinary from "../config/cloudinary.js";
import { asyncHandler } from "../utils/async-handler.js";
import { ApiError } from "../utils/api-error.js";
import { ApiResponse } from "../utils/api-response.js";

/*  CLOUDINARY UPLOAD  */
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

/*  CREATE BANNER  */
export const createBanner = asyncHandler(async (req, res) => {
  if (!req.file) {
    throw new ApiError(400, "Banner image is required");
  }

  const upload = await uploadToCloudinary(req.file.buffer);

  const banner = await prisma.banner.create({
    data: {
      title: req.body.title,
      imageUrl: upload.secure_url,
      publicId: upload.public_id,
    },
  });

  return res
    .status(200)
    .json(new ApiResponse(200, banner, "Banner created successfully"));
});

/*  UPDATE BANNER  */
export const updateBanner = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const banner = await prisma.banner.findUnique({ where: { id } });
  if (!banner) throw new ApiError(404, "Banner not found");

  let updateData = {
    title: req.body.title ?? banner.title,
    isActive: req.body.isActive ?? banner.isActive,
  };

  if (req.file) {
    if (banner.publicId) {
      await cloudinary.uploader.destroy(banner.publicId);
    }

    const upload = await uploadToCloudinary(req.file.buffer);
    updateData.imageUrl = upload.secure_url;
    updateData.publicId = upload.public_id;
  }

  const updatedBanner = await prisma.banner.update({
    where: { id },
    data: updateData,
  });

  return res
    .status(200)
    .json(new ApiResponse(200, updatedBanner, "Banner updated successfully"));
});

/*  GET ALL BANNERS  */
export const getBanners = asyncHandler(async (req, res) => {
  const banners = await prisma.banner.findMany({
    orderBy: { createdAt: "desc" },
  });

  return res.status(200).json(new ApiResponse(200, banners, "Banners fetched"));
});

/*  GET ACTIVE BANNERS  */
export const getActiveBanners = asyncHandler(async (req, res) => {
  const banners = await prisma.banner.findMany({
    where: { isActive: true },
    orderBy: { createdAt: "desc" },
  });

  return res
    .status(200)
    .json(new ApiResponse(200, banners, "Active banners fetched"));
});

/*  REMOVE BANNER  */
export const removeBanner = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const banner = await prisma.banner.findUnique({ where: { id } });
  if (!banner) throw new ApiError(404, "Banner not found");

  if (banner.publicId) {
    await cloudinary.uploader.destroy(banner.publicId);
  }

  await prisma.banner.delete({ where: { id } });

  return res
    .status(200)
    .json(new ApiResponse(200, null, "Banner removed successfully"));
});
