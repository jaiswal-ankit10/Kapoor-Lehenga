import { createSlice } from "@reduxjs/toolkit";
import {
  loadCartFromBackend,
  addItemToBackendCart,
  updateQtyBackend,
  removeBackendCartItem,
  clearBackendCart,
} from "../services/cartService";

const initialState = {
  cartItems: [],
  totalAmount: 0,
  loading: false,
  error: null,
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    clearCartReducer(state) {
      state.cartItems = [];
      state.totalAmount = 0;
    },
  },
  extraReducers: (builder) => {
    builder
      /* LOAD */
      .addCase(loadCartFromBackend.pending, (state) => {
        state.loading = true;
      })
      .addCase(loadCartFromBackend.fulfilled, (state, action) => {
        state.loading = false;
        state.cartItems = action.payload.items || [];
        state.totalAmount = action.payload.totalPrice || 0;
      })
      .addCase(loadCartFromBackend.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      /* ADD */
      .addCase(addItemToBackendCart.fulfilled, (state, action) => {
        state.cartItems = action.payload.items || [];
        state.totalAmount = action.payload.totalPrice || 0;
      })

      /* UPDATE QTY */
      .addCase(updateQtyBackend.fulfilled, (state, action) => {
        state.cartItems = action.payload.items || [];
        state.totalAmount = action.payload.totalPrice || 0;
      })

      /* REMOVE */
      .addCase(removeBackendCartItem.fulfilled, (state, action) => {
        state.cartItems = action.payload.items || [];
        state.totalAmount = action.payload.totalPrice || 0;
      })

      /* CLEAR */
      .addCase(clearBackendCart.fulfilled, (state) => {
        state.cartItems = [];
        state.totalAmount = 0;
      });
  },
});

export const { clearCartReducer } = cartSlice.actions;
export default cartSlice.reducer;
