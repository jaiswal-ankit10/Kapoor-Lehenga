import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../api/axiosInstance";

//  Create review
export const createReview = createAsyncThunk(
  "review/create",
  async ({ productId, formData }, { rejectWithValue }) => {
    try {
      const { data } = await axiosInstance.post(
        `/review/${productId}`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      return data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to create review"
      );
    }
  }
);

//  Get reviews by product
export const fetchReviews = createAsyncThunk(
  "review/fetchAll",
  async (productId, { rejectWithValue }) => {
    try {
      const { data } = await axiosInstance.get(`/review/${productId}`);
      return data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch reviews"
      );
    }
  }
);

//  Delete review
export const deleteReview = createAsyncThunk(
  "review/delete",
  async (reviewId, { rejectWithValue }) => {
    try {
      await axiosInstance.delete(`/review/delete/${reviewId}`);
      return reviewId;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to delete review"
      );
    }
  }
);

//  Get reviews for admin
export const fetchAdminReviews = createAsyncThunk(
  "review/fetchAllAdminReviews",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axiosInstance.get("/review/");
      return data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch reviews"
      );
    }
  }
);
