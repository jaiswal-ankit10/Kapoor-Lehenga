import React, { useEffect, useState } from "react";
import RoutesSection from "../components/RoutesSection";
import { breadcrumbRoutes } from "../utils/breadcrumbRoutes";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchMyOrders } from "../services/orderService";

const MyOrder = () => {
  const dummyOrders = [
    {
      date: "11 December 2025",
      total: "₹10,000 (3 item)",
      orderId: "954-65221854-152321",
      status: "Pending",
    },
    {
      date: "11 December 2025",
      total: "₹10,000 (3 item)",
      orderId: "954-65221854-152321",
      status: "Completed",
    },
    {
      date: "11 December 2025",
      total: "₹10,000 (3 item)",
      orderId: "954-65221854-152321",
      status: "Cancel",
    },
    {
      date: "11 December 2025",
      total: "₹10,000 (3 item)",
      orderId: "954-65221854-152321",
      status: "Cancel",
    },
  ];
  const statusStyle = {
    PENDING: "bg-yellow-100 text-yellow-600",
    CONFIRMED: "bg-blue-100 text-blue-600",
    COMPLETED: "bg-green-100 text-green-600",
    CANCELLED: "bg-red-100 text-red-500",
    PROCESSING: "bg-blue-100 text-blue-500",
    RETURNED: "bg-gray-100 text-gray-500",
    DELIVERED: "bg-green-400 text-white",
  };

  const [showAll, setShowAll] = useState(false);
  const breadcrumb = [breadcrumbRoutes.home, breadcrumbRoutes.myOrder];
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { orders, loading } = useSelector((state) => state.order);

  const visibleOrders = showAll ? orders : orders.slice(0, 4);

  useEffect(() => {
    dispatch(fetchMyOrders());
  }, []);

  return (
    <>
      <div>
        <RoutesSection breadcrumb={breadcrumb} />
      </div>
      <div className="w-full max-w-3xl mx-auto my-10 p-2">
        {loading && <p>Loading orders...</p>}

        {!loading && orders.length === 0 && (
          <p className="text-gray-500">No order found</p>
        )}
        {visibleOrders.map((order) => (
          <div
            key={order.id}
            className="flex justify-between items-center border border-gray-100 rounded p-4 my-3 shadow-sm bg-white cursor-pointer"
            onClick={() => navigate(`/orders/${order.id}`)}
          >
            <div>
              <p className="text-xs text-gray-500 font-semibold">ORDER DATE</p>
              <p className="text-sm font-medium">
                {new Date(order.createdAt).toLocaleDateString("en-IN", {
                  day: "2-digit",
                  month: "long",
                  year: "numeric",
                })}
              </p>
            </div>

            <div className="">
              <p className="text-xs text-gray-500 font-semibold">ORDER TOTAL</p>
              <p className="text-sm font-medium">{order.totalAmount}</p>
            </div>

            <div className="text-right">
              <p className="text-sm font-medium">{order.orderId}</p>
              <span
                className={`text-xs px-3 py-1 rounded-md inline-block mt-1 ${
                  statusStyle[order.status]
                }`}
              >
                {order.status}
              </span>
            </div>
          </div>
        ))}

        {/* See More */}
        {orders.length > 4 && (
          <div className="text-right mt-4">
            <button
              onClick={() => setShowAll((prev) => !prev)}
              className="text-md font-medium text-gray-600 hover:underline"
            >
              {showAll ? "Show Less" : "See More"}
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default MyOrder;
