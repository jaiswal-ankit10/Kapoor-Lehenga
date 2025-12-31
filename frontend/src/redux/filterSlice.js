import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  search: "",
  category: "",
  sort: "newest", // newest | price_asc | price_desc
  page: 1,
  limit: 20,
  color: [],
  maxPrice: 20000,
  discount: 0,
};

const filterSlice = createSlice({
  name: "filters",
  initialState,
  reducers: {
    setSearch(state, action) {
      state.search = action.payload;
      state.page = 1;
    },
    setCategory(state, action) {
      state.category = action.payload;
      state.page = 1;
    },
    setSort(state, action) {
      state.sort = action.payload;
      state.page = 1;
    },
    setPage(state, action) {
      state.page = action.payload;
    },
    setLimit(state, action) {
      state.limit = action.payload;
      state.page = 1;
    },

    setColor(state, action) {
      state.color = action.payload;
      state.page = 1;
    },

    setMaxPrice(state, action) {
      state.maxPrice = action.payload;
      state.page = 1;
    },

    setDiscount(state, action) {
      state.discount = action.payload;
      state.page = 1;
    },

    resetFilters(state) {
      state.search = "";
      state.category = "";
      state.sort = "newest";
      state.page = 1;
      state.limit = 20;
      state.color = [];
      state.discount = 0;
    },
  },
});

export const {
  setSearch,
  setCategory,
  setSort,
  setPage,
  setLimit,
  setColor,
  setMaxPrice,
  setDiscount,
  resetFilters,
} = filterSlice.actions;

export default filterSlice.reducer;
