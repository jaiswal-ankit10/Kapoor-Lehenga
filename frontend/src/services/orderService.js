import axiosInstance from "../api/axiosInstance";
import {
  setLoading,
  setOrders,
  setOrder,
  addOrder,
  updateOrder,
  setError,
} from "../redux/orderSlice";
export const createOrder = (orderData) => async (dispatch) => {
  try {
    dispatch(setLoading());
    const res = await axiosInstance.post("/orders", orderData);
    dispatch(addOrder(res.data.data));
  } catch (error) {
    dispatch(setError("Failed to place order"));
  }
};

export const fetchMyOrders = () => async (dispatch) => {
  try {
    dispatch(setLoading());
    const res = await axiosInstance.get("/orders/my");
    dispatch(setOrders(res.data.data));
  } catch (error) {
    dispatch(setError("Failed to fetch orders"));
  }
};

export const fetchSingleOrder = (id) => async (dispatch) => {
  try {
    dispatch(setLoading());
    const res = await axiosInstance.get(`/orders/${id}`);
    dispatch(setOrder(res.data.data));
  } catch (error) {
    dispatch(setError("Failed to fetch order"));
  }
};

export const fetchAllOrders = () => async (dispatch) => {
  try {
    dispatch(setLoading());
    const res = await axiosInstance.get("/admin/orders");
    dispatch(setOrders(res.data.data));
  } catch (error) {
    dispatch(setError("Failed to fetch orders"));
  }
};

export const updateOrderStatus = (id, status) => async (dispatch) => {
  try {
    dispatch(setLoading());
    const res = await axiosInstance.put(`/admin/orders/${id}/status`, {
      status,
    });
    dispatch(updateOrder(res.data.data));
  } catch (error) {
    dispatch(setError("Failed to update order status"));
  }
};
export const cancelOrder = (id) => async (dispatch) => {
  try {
    dispatch(setLoading());
    const res = await axiosInstance.put(`/admin/orders/${id}/cancel`);
    dispatch(updateOrder(res.data.data));
  } catch (error) {
    dispatch(setError("Failed to cancel order"));
  }
};
export const returnOrder = (id) => async (dispatch) => {
  try {
    dispatch(setLoading());
    const res = await axiosInstance.put(`/admin/orders/${id}/return`);
    dispatch(updateOrder(res.data.data));
  } catch (error) {
    dispatch(setError("Failed to return order"));
  }
};
