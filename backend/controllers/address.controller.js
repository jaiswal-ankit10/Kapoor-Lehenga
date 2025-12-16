import { Address } from "../models/address.model.js";
import { ApiError } from "../utils/api-error.js";
import { ApiResponse } from "../utils/api-response.js";
import { asyncHandler } from "../utils/async-handler.js";

export const createAddress = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const addressData = {
    ...req.body,
    user: userId,
  };

  //   if the address is default
  if (req.body.isDefault) {
    await Address.updateMany(
      {
        user: userId,
      },
      { isDefault: false }
    );
  }

  const address = await Address.create(addressData);
  return res
    .status(201)
    .json(new ApiResponse(201, address, "Address created successfully"));
});

export const getAllAddress = asyncHandler(async (req, res) => {
  const addresses = await Address.find({ user: req.user.id }).sort({
    createdAt: -1,
  });
  return res
    .status(200)
    .json(new ApiResponse(200, addresses, "Address fetched successfully"));
});

export const updateAddress = asyncHandler(async (req, res) => {
  const address = await Address.findOne({
    _id: req.params.id,
    user: req.user.id,
  });
  if (!address) {
    throw new ApiError(404, "Address not found");
  }
  //   if the address is default
  if (req.body.isDefault) {
    await Address.updateMany(
      {
        user: req.user.id,
      },
      { isDefault: false }
    );
  }
  Object.assign(address, req.body);
  await address.save();
  return res
    .status(200)
    .json(new ApiResponse(200, address, "Address updated successfully"));
});
export const deleteAddress = asyncHandler(async (req, res) => {
  const address = await Address.findOneAndDelete({
    _id: req.params.id,
    user: req.user.id,
  });

  if (!address) {
    throw new ApiError(404, "Address not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Address deleted successfully"));
});

export const setDefaultAddress = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const addressId = req.params.id;

  await Address.updateMany({ user: userId }, { isDefault: false });
  const address = await Address.findByIdAndUpdate(
    { _id: addressId, user: userId },
    { isDefault: true },
    { new: true }
  );

  if (!address) {
    throw new ApiError(404, "Address not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, address, "Address upadated successfully"));
});
