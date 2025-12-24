import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  cartItems: [],
  totalAmount: 0,
  appliedCoupon: null,
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    setCart(state, action) {
      state.cartItems = action.payload?.items || [];
      state.totalAmount = action.payload?.totalPrice || 0;
    },

    clearCartReducer(state) {
      state.cartItems = [];
      state.totalAmount = 0;
      // updateLocalStorage(state);
    },

    applyCoupon(state, action) {
      state.appliedCoupon = action.payload;
    },
    removeCoupon(state) {
      state.appliedCoupon = null;
    },
  },
});

export const {
  setCart,
  addToCart,
  removeFromCart,
  increaseQty,
  decreaseQty,
  clearCartReducer,
  applyCoupon,
  removeCoupon,
} = cartSlice.actions;

export default cartSlice.reducer;
