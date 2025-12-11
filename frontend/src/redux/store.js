import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./userSlice";
import productReducer from "./productSlice";
import wishListReducer from "./wishListSlice";
import cartReducer from "./cartSlice";

export const store = configureStore({
  reducer: {
    user: userReducer,
    products: productReducer,
    wishlist: wishListReducer,
    cart: cartReducer,
  },
});

export default store;
