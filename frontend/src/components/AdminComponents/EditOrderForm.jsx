import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { updateOrderStatus } from "../../services/orderService";

const EditOrderForm = ({ order, onClose }) => {
  const dispatch = useDispatch();

  const [formData, setFormData] = useState({
    status: "PENDING",
  });

  // Pre-filled data
  useEffect(() => {
    if (order) {
      setFormData({
        status: order.status || "PENDING",
      });
    }
  }, [order]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(updateOrderStatus(order.id, formData.status));
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-[400px] p-6">
        <h2 className="text-xl font-semibold mb-4">Update Order Status</h2>

        <form onSubmit={handleSubmit} className="space-y-3">
          <select
            name="status"
            id="status"
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-[#E9B159]"
          >
            <option value="PENDING">Pending</option>
            <option value="CONFIRMED">Confirmed</option>
            <option value="PROCESSING">Processing</option>
            <option value="SHIPPED">Shipped</option>
            <option value="DELIVERED">Delivered</option>
            <option value="CANCELLED">Cancelled</option>
            <option value="RETURNED">Returned</option>
          </select>
          <div className="flex justify-end gap-3 pt-4">
            <button type="button" onClick={onClose} className="btn btn-ghost">
              Cancel
            </button>

            <button type="submit" className="btn btn-primary">
              Update
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditOrderForm;
