import prisma from "../config/prisma.js";
import { ApiError } from "../utils/api-error.js";
import { ApiResponse } from "../utils/api-response.js";
import { asyncHandler } from "../utils/async-handler.js";

/* ================= CREATE ADDRESS ================= */
export const createAddress = asyncHandler(async (req, res) => {
  const userId = req.user.id;

  // if address is default, reset others
  if (req.body.isDefault) {
    await prisma.address.updateMany({
      where: { userId },
      data: { isDefault: false },
    });
  }

  const address = await prisma.address.create({
    data: {
      ...req.body,
      userId,
    },
  });

  return res
    .status(201)
    .json(new ApiResponse(201, address, "Address created successfully"));
});

/* ================= GET ALL ADDRESSES ================= */
export const getAllAddress = asyncHandler(async (req, res) => {
  const addresses = await prisma.address.findMany({
    where: { userId: req.user.id },
    orderBy: { createdAt: "desc" },
  });

  return res
    .status(200)
    .json(new ApiResponse(200, addresses, "Address fetched successfully"));
});

/* ================= UPDATE ADDRESS ================= */
export const updateAddress = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const address = await prisma.address.findFirst({
    where: {
      id,
      userId: req.user.id,
    },
  });

  if (!address) {
    throw new ApiError(404, "Address not found");
  }

  if (req.body.isDefault) {
    await prisma.address.updateMany({
      where: { userId: req.user.id },
      data: { isDefault: false },
    });
  }

  const updatedAddress = await prisma.address.update({
    where: { id },
    data: req.body,
  });

  return res
    .status(200)
    .json(new ApiResponse(200, updatedAddress, "Address updated successfully"));
});

/* ================= DELETE ADDRESS ================= */
export const deleteAddress = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const address = await prisma.address.findFirst({
    where: {
      id,
      userId: req.user.id,
    },
  });

  if (!address) {
    throw new ApiError(404, "Address not found");
  }

  await prisma.address.delete({ where: { id } });

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Address deleted successfully"));
});

/* ================= SET DEFAULT ADDRESS ================= */
export const setDefaultAddress = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const addressId = req.params.id;

  await prisma.address.updateMany({
    where: { userId },
    data: { isDefault: false },
  });

  const address = await prisma.address.update({
    where: { id: addressId },
    data: { isDefault: true },
  });

  return res
    .status(200)
    .json(new ApiResponse(200, address, "Address updated successfully"));
});
