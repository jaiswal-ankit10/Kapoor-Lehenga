import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../api/axiosInstance";

/*  LOAD CART  */
export const loadCartFromBackend = createAsyncThunk(
  "cart/load",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get("/cart");
      return res.data.cart;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

/*  ADD ITEM  */
export const addItemToBackendCart = createAsyncThunk(
  "cart/addItem",
  async ({ id, discountedPrice, quantity = 1 }, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.post("/cart/add", {
        productId: id,
        price: discountedPrice,
        quantity,
      });
      return res.data.cart;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

/*  UPDATE QTY  */
export const updateQtyBackend = createAsyncThunk(
  "cart/updateQty",
  async ({ productId, quantity }, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.put("/cart/update", {
        productId,
        quantity,
      });
      return res.data.cart;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

/*  REMOVE ITEM  */
export const removeBackendCartItem = createAsyncThunk(
  "cart/removeItem",
  async (productId, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.delete("/cart/remove", {
        data: { productId },
      });
      return res.data.cart;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

/*  CLEAR CART  */
export const clearBackendCart = createAsyncThunk(
  "cart/clear",
  async (_, { rejectWithValue }) => {
    try {
      await axiosInstance.delete("/cart/clear");
      return true;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);
