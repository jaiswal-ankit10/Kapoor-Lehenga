import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  products: [],
  product: null,
  loading: false,
  error: null,
  total: 0,
  page: 1,
  pages: 1,
};

const productSlice = createSlice({
  name: "products",
  initialState,
  reducers: {
    setProductsData(state, action) {
      const { products, total = 0, page = 1, pages = 1 } = action.payload;
      state.products = products || [];
      state.total = total;
      state.page = page;
      state.pages = pages;
      state.loading = false;
      state.error = null;
    },
    setSingleProduct(state, action) {
      state.product = action.payload;
      state.loading = false;
      state.error = null;
    },
    setNewProducts(state, action) {
      state.products = action.payload;
      state.loading = false;
      state.error = null;
    },
    updateProduct(state, action) {
      state.products = state.products.map((product) =>
        product._id === action.payload._id ? action.payload : product
      );
    },
    removeProduct(state, action) {
      state.products = state.products.filter((p) => p._id !== action.payload);
    },
    setLoading(state) {
      state.loading = true;
    },
    setError(state, action) {
      state.error = action.payload;
      state.loading = false;
    },
  },
});

export const {
  setProductsData,
  setSingleProduct,
  setNewProducts,
  updateProduct,
  removeProduct,
  setLoading,
  setError,
} = productSlice.actions;

export default productSlice.reducer;
