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

    // addToCart(state, action) {
    //   const price = Number(action.payload.price.toString().replace(/,/g, ""));
    //   const existing = state.cartItems.find((i) => i.id === action.payload.id);
    //   if (existing) {
    //     existing.qty++;
    //   } else {
    //     state.cartItems.push({ ...action.payload, qty: 1, price });
    //   }
    //   state.totalAmount = state.cartItems.reduce(
    //     (sum, item) => sum + item.price * item.qty,
    //     0
    //   );
    //   updateLocalStorage(state);
    // },

    // removeFromCart(state, action) {
    //   state.cartItems = state.cartItems.filter((i) => i.id !== action.payload);
    //   state.totalAmount = state.cartItems.reduce(
    //     (sum, item) => sum + item.price * item.qty,
    //     0
    //   );
    //   updateLocalStorage(state);
    // },

    // increaseQty(state, action) {
    //   const item = state.cartItems.find((i) => i.id === action.payload);
    //   if (item) item.qty++;
    //   state.totalAmount = state.cartItems.reduce(
    //     (sum, item) => sum + item.price * item.qty,
    //     0
    //   );
    //   updateLocalStorage(state);
    // },

    // decreaseQty(state, action) {
    //   const item = state.cartItems.find((i) => i.id === action.payload);
    //   if (item && item.qty > 1) item.qty--;
    //   state.totalAmount = state.cartItems.reduce(
    //     (sum, item) => sum + item.price * item.qty,
    //     0
    //   );
    //   updateLocalStorage(state);
    // },

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
