import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  products: [],
  product: null,
  loading: false,
  error: null,
};

const productSlice = createSlice({
  name: "products",
  initialState,
  reducers: {
    setProducts(state, action) {
      state.products = action.payload;
      state.loading = false;
      state.error = null;
    },
    setSingleProduct(state, action) {
      state.product = action.payload;
      state.loading = false;
      state.error = null;
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

export const { setProducts, setSingleProduct, setLoading, setError } =
  productSlice.actions;

export default productSlice.reducer;
