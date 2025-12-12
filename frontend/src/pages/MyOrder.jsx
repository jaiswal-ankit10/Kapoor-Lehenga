import React from "react";
import RoutesSection from "../components/RoutesSection";
import { breadcrumbRoutes } from "../utils/breadcrumbRoutes";
import { useNavigate } from "react-router-dom";

const MyOrder = () => {
  const orders = [
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
    Pending: "bg-yellow-100 text-yellow-600",
    Completed: "bg-green-100 text-green-600",
    Cancel: "bg-red-100 text-red-500",
  };
  const breadcrumb = [breadcrumbRoutes.home, breadcrumbRoutes.myOrder];
  const navigate = useNavigate();
  return (
    <>
      <div>
        <RoutesSection breadcrumb={breadcrumb} />
      </div>
      <div className="w-full max-w-3xl mx-auto my-10">
        {orders.map((order, i) => (
          <div
            key={i}
            className="flex justify-between items-center border border-gray-100 rounded p-4 my-3 shadow-sm bg-white"
            onClick={() => navigate("/order-detail")}
          >
            <div>
              <p className="text-xs text-gray-500 font-semibold">ORDER DATE</p>
              <p className="text-sm font-medium">{order.date}</p>
            </div>

            <div className="">
              <p className="text-xs text-gray-500 font-semibold">ORDER TOTAL</p>
              <p className="text-sm font-medium">{order.total}</p>
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
        <div className="text-right mt-4">
          <button className="text-md font-medium text-gray-600 hover:underline">
            See More
          </button>
        </div>
      </div>
    </>
  );
};

export default MyOrder;
