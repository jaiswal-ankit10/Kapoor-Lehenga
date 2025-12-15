import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./userSlice";
import productReducer from "./productSlice";
import wishListReducer from "./wishListSlice";
import cartReducer from "./cartSlice";
import filterReducer from "./filterSlice";

export const store = configureStore({
  reducer: {
    user: userReducer,
    products: productReducer,
    wishlist: wishListReducer,
    cart: cartReducer,
    filters: filterReducer,
  },
});

export default store;
