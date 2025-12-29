import axiosInstance from "../api/axiosInstance";
import {
  setProductsData,
  setSingleProduct,
  setLoading,
  setError,
  setNewProducts,
  removeProduct,
  updateProduct,
} from "../redux/productSlice";

// Fetch All Products with filters/pagination
export const fetchAllProducts =
  ({
    search = "",
    category = "",
    sort = "newest",
    color = [],
    maxPrice,
    discount,
    page = 1,
    limit = 20,
  } = {}) =>
  async (dispatch) => {
    try {
      dispatch(setLoading());

      const params = new URLSearchParams();
      if (search) params.append("search", search);
      if (category) params.append("category", category);
      if (sort) params.append("sort", sort);
      if (color.length) params.append("color", color.join(","));
      if (maxPrice) params.append("maxPrice", maxPrice);
      if (discount) params.append("discount", discount);
      params.append("page", page);
      params.append("limit", limit);

      const res = await axiosInstance.get(`/products?${params.toString()}`);
      dispatch(
        setProductsData({
          products: res.data.products,
          total: res.data.total,
          page: res.data.page,
          pages: res.data.pages,
        })
      );
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

// Fetch New Products
export const fetchNewProducts = () => async (dispatch) => {
  try {
    dispatch(setLoading());
    const res = await axiosInstance.get("/products?sort-newest");
    dispatch(setNewProducts(res.data.products));
  } catch (error) {
    dispatch(setError("Failed to load new products"));
  }
};

export const deleteProductById = (id) => async (dispatch) => {
  try {
    await axiosInstance.delete(`/admin/products/${id}`);
    dispatch(removeProduct(id));
  } catch (error) {
    dispatch(setError("Failed to delete product"));
  }
};
export const updateProductById = (id, data) => async (dispatch) => {
  try {
    const res = await axiosInstance.put(`/admin/products/${id}`, data);
    dispatch(updateProduct(res.data.product));
  } catch (error) {
    dispatch(setError("Failed to update product"));
  }
};
