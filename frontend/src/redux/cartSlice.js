import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  cartItems: [],
  totalAmount: 0,
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
      updateLocalStorage(state);
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
} = cartSlice.actions;

export default cartSlice.reducer;
