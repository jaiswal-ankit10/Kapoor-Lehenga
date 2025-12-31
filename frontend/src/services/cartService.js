import axiosInstance from "../api/axiosInstance";
import { clearCartReducer, setCart } from "../redux/cartSlice";

export const loadCartFromBackend = () => async (dispatch) => {
  const res = await axiosInstance.get("/cart");
  dispatch(setCart(res.data.cart));
};

export const addItemToBackendCart = (item) => async (dispatch) => {
  const price = item.discountedPrice;
  const productId = item.id;

  const res = await axiosInstance.post("/cart/add", {
    productId,
    price: price,
    quantity: 1,
  });

  dispatch(setCart(res.data.cart));
};

export const updateQtyBackend = (itemId, qty) => async (dispatch) => {
  const res = await axiosInstance.put("/cart/update", {
    productId: itemId,
    quantity: qty,
  });
  dispatch(setCart(res.data.cart));
};

export const removeBackendCartItem = (itemId) => async (dispatch) => {
  const res = await axiosInstance.delete("/cart/remove", {
    data: { productId: itemId },
  });
  dispatch(setCart(res.data.cart));
};

export const clearBackendCart = () => async (dispatch) => {
  await axiosInstance.delete("/cart/clear");
  dispatch(clearCartReducer());
};
