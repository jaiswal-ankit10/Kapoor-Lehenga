import React, { useEffect, useState } from "react";
import axiosInstance from "../../api/axiosInstance";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllOrders } from "../../services/orderService";
import EditOrderForm from "./EditOrderForm";

export default function AdminOrders() {
  const dispatch = useDispatch();
  const { orders } = useSelector((state) => state.order);

  useEffect(() => {
    dispatch(fetchAllOrders());
  }, []);

  const [isEditOpen, setIsEditOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  const openEditModal = (order) => {
    setIsEditOpen(true);
    setSelectedOrder(order);
  };

  const closeEditModal = () => {
    setIsEditOpen(false);
  };

  return (
    <div className="bg-white p-4 rounded shadow">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">Orders</h3>
      </div>
      <div className="overflow-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="text-sm text-gray-500">
              <th className="py-2">Order by</th>
              <th>Items</th>
              <th>Total Amount</th>
              <th>Shipping Address</th>
              <th>Status</th>
              <th>Ordered On</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders?.map((order) => (
              <tr key={order._id} className="border-t">
                <td className="py-2">{order.user?.email}</td>
                <td>{order.items.length}</td>
                <td>₹{order.totalAmount}</td>
                <td>{order.shippingAddress?.address}</td>
                <td>{order.status}</td>
                <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                <td className="flex items-center gap-4">
                  <button
                    onClick={() => openEditModal(order)}
                    className="text-blue-600 hover:underline"
                  >
                    Edit
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isEditOpen && selectedOrder && (
        <EditOrderForm order={selectedOrder} onClose={closeEditModal} />
      )}
    </div>
  );
}
