import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  addresses: [],
  selectedAddress: null,
  loading: false,
  error: null,
};

const addressSlice = createSlice({
  name: "address",
  initialState,
  reducers: {
    setLoading: (state) => {
      state.loading = true;
      state.error = null;
    },

    setAddresses: (state, action) => {
      state.loading = false;
      state.addresses = action.payload;

      // auto-select default address
      const defaultAddress = action.payload.find((a) => a.isDefault);
      state.selectedAddress = defaultAddress || action.payload[0] || null;
    },

    addAddress: (state, action) => {
      if (!action.payload || !action.payload._id) return;

      state.loading = false;
      state.addresses.push(action.payload);
      state.selectedAddress = action.payload;
    },

    updateAddress: (state, action) => {
      state.addresses = state.addresses.map((addr) =>
        addr._id === action.payload._id ? action.payload : addr
      );
    },

    deleteAddress: (state, action) => {
      state.addresses = state.addresses.filter(
        (addr) => addr._id !== action.payload
      );

      if (
        state.selectedAddress &&
        state.selectedAddress._id === action.payload
      ) {
        state.selectedAddress = state.addresses[0] || null;
      }
    },

    selectAddress: (state, action) => {
      state.selectedAddress = action.payload;
    },

    setError: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    clearAddressState: (state) => {
      state.addresses = [];
      state.selectedAddress = null;
      state.error = null;
    },
  },
});

export const {
  setLoading,
  setAddresses,
  addAddress,
  updateAddress,
  deleteAddress,
  selectAddress,
  setError,
  clearAddressState,
} = addressSlice.actions;

export default addressSlice.reducer;
