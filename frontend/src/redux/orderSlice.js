import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  orders: [],
  order: null,
  loading: false,
  error: null,
};

const orderSlice = createSlice({
  name: "order",
  initialState,
  reducers: {
    setLoading: (state) => {
      state.loading = true;
      state.error = null;
    },
    setOrders: (state, action) => {
      state.loading = false;
      state.orders = action.payload;
    },
    setOrder: (state, action) => {
      state.loading = false;
      state.order = action.payload;
    },
    addOrder: (state, action) => {
      state.loading = false;
      state.orders.unshift(action.payload);
    },
    updateOrder: (state, action) => {
      state.orders = state.orders.map((order) =>
        order.id === action.payload.id ? action.payload : order
      );
    },

    setError: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    clearOrderState: (state) => {
      state.orders = [];
      state.order = null;
      state.error = null;
    },
  },
});

export const {
  setLoading,
  setError,
  addOrder,
  setOrders,
  setOrder,
  updateOrder,
  clearOrderState,
} = orderSlice.actions;
export default orderSlice.reducer;
