import axiosInstance from "../api/axiosInstance";
import {
  setProducts,
  setSingleProduct,
  setLoading,
  setError,
} from "../redux/productSlice";

// Fetch All Products
export const fetchAllProducts = () => async (dispatch) => {
  try {
    dispatch(setLoading());
    const res = await axiosInstance.get("/products");
    dispatch(setProducts(res.data.products));
  } catch (error) {
    dispatch(setError("Failed to load products"));
  }
};

// Fetch Single Product
export const fetchProductById = (id) => async (dispatch) => {
  try {
    dispatch(setLoading());
    const res = await axiosInstance.get(`/products/${id}`);
    dispatch(setSingleProduct(res.data.product));
  } catch (error) {
    dispatch(setError("Failed to load product"));
  }
};
