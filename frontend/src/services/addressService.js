import axiosInstance from "../api/axiosInstance";
import {
  setLoading,
  setAddresses,
  addAddress,
  updateAddress,
  deleteAddress,
  setError,
} from "../redux/addressSlice";

export const fetchAddresses = () => async (dispatch) => {
  try {
    dispatch(setLoading());

    const res = await axiosInstance.get("/addresses");

    dispatch(setAddresses(res.data.data));
  } catch (error) {
    dispatch(setError("Failed to load addresses"));
  }
};
export const createAddress = (addressData) => async (dispatch) => {
  try {
    dispatch(setLoading());

    const res = await axiosInstance.post("/addresses", addressData);

    const address = res.data.data;

    if (!address || !address._id) {
      throw new Error("Invalid address response");
    }

    dispatch(addAddress(address));
  } catch (error) {
    dispatch(setError("Failed to add address"));
  }
};

export const removeAddress = (id) => async (dispatch) => {
  try {
    dispatch(setLoading());

    await axiosInstance.delete(`/addresses/${id}`);

    dispatch(deleteAddress(id));
  } catch (error) {
    dispatch(setError("Failed to delete address"));
  }
};
export const editAddress = (id, data) => async (dispatch) => {
  try {
    dispatch(setLoading());

    const res = await axiosInstance.put(`/addresses/${id}`, data);

    dispatch(updateAddress(res.data.data));
  } catch (error) {
    dispatch(setError("Failed to update address"));
  }
};
