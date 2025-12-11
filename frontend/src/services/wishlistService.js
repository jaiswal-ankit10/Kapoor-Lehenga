import axiosInstance from "../api/axiosInstance";
import { clearWishlistReducer, setWishlist } from "../redux/wishListSlice";

export const loadWishlistFromBackend = () => async (dispatch) => {
  const res = await axiosInstance.get("/wishlist");
  dispatch(setWishlist(res.data.wishlist));
};

export const addItemToWishlist = (productId) => async (dispatch) => {
  const res = await axiosInstance.post("/wishlist/add", { productId });
  dispatch(setWishlist(res.data.wishlist));
};

export const removeFromWishlistBackend = (productId) => async (dispatch) => {
  const res = await axiosInstance.delete("/wishlist/remove", {
    data: { productId },
  });
  dispatch(setWishlist(res.data.wishlist));
};

export const clearBackendWishlist = () => async (dispatch) => {
  await axiosInstance.delete("/wishlist/clear");
  dispatch(clearWishlistReducer());
};
