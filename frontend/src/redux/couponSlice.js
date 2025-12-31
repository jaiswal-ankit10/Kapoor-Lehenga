import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../api/axiosInstance";
export const createCoupon = createAsyncThunk(
  "coupon/createCoupon",
  async (couponData, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.post("/coupons/create", couponData);
      return res.data.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to create coupon"
      );
    }
  }
);

export const fetchCoupons = createAsyncThunk(
  "coupon/fetchCoupons",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get("/coupons");
      return res.data.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to fetch coupons"
      );
    }
  }
);

// Apply coupon (user)
export const applyCoupon = createAsyncThunk(
  "coupon/applyCoupon",
  async ({ code, cartItems, cartTotal }, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.post("/coupons/apply", {
        code,
        cartItems,
        cartTotal,
      });
      return res.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Invalid coupon");
    }
  }
);
// Update coupon (admin)
export const updateCoupon = createAsyncThunk(
  "coupon/updateCoupon",
  async ({ id, couponData }, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.put(`/coupons/update/${id}`, couponData);
      return res.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Invalid coupon");
    }
  }
);

const initialState = {
  coupons: [],
  appliedCoupon: null,
  discount: 0,
  finalAmount: 0,
  loading: false,
  error: null,
};

const couponSlice = createSlice({
  name: "coupon",
  initialState,
  reducers: {
    clearCouponError: (state) => {
      state.error = null;
    },

    removeAppliedCoupon: (state) => {
      state.appliedCoupon = null;
      state.discount = 0;
      state.finalAmount = 0;
    },
  },
  extraReducers: (builder) => {
    builder

      /* CREATE COUPON */
      .addCase(createCoupon.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createCoupon.fulfilled, (state, action) => {
        state.loading = false;
        state.coupons.push(action.payload);
      })
      .addCase(createCoupon.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      /* FETCH COUPONS */
      .addCase(fetchCoupons.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchCoupons.fulfilled, (state, action) => {
        state.loading = false;
        state.coupons = action.payload;
      })
      .addCase(fetchCoupons.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      /* APPLY COUPON */
      .addCase(applyCoupon.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(applyCoupon.fulfilled, (state, action) => {
        state.loading = false;
        state.appliedCoupon = action.payload.coupon;
        state.discount = action.payload.discount;
        state.finalAmount = action.payload.finalAmount;
      })
      .addCase(applyCoupon.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      //   update coupon
      .addCase(updateCoupon.fulfilled, (state, action) => {
        state.loading = false;

        const index = state.coupons.findIndex(
          (c) => c.id === action.payload.id
        );

        if (index !== -1) {
          state.coupons[index] = action.payload;
        }
      })
      .addCase(updateCoupon.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateCoupon.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearCouponError, removeAppliedCoupon } = couponSlice.actions;

export default couponSlice.reducer;
