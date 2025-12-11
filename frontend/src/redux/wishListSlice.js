import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  wishlistItems: [],
};

const wishlistSlice = createSlice({
  name: "wishlist",
  initialState,
  reducers: {
    setWishlist(state, action) {
      state.wishlistItems = action.payload?.items || [];
    },

    clearWishlistReducer(state) {
      state.wishlistItems = [];
    },
  },
});

export const { setWishlist, clearWishlistReducer } = wishlistSlice.actions;

export default wishlistSlice.reducer;
