import React, { useState } from "react";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import {
  fetchSingleOrder,
  cancelOrder,
  returnOrder,
} from "../services/orderService";

import { breadcrumbRoutes } from "../utils/breadcrumbRoutes";
import RoutesSection from "../components/RoutesSection";

export default function OrderDetail() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();

  const { order, loading } = useSelector((state) => state.order);
  useEffect(() => {
    dispatch(fetchSingleOrder(id));
  }, [dispatch, id]);
  const breadcrumb = [
    breadcrumbRoutes.home,
    breadcrumbRoutes.myOrder,
    breadcrumbRoutes.orderDetail,
  ];
  const handleOrderCancel = (e) => {
    e.preventDefault();
    const answer = confirm("Do you really want to cancel order");
    if (answer) {
      dispatch(cancelOrder(order.id));
      navigate("/my-order");
    } else {
      return;
    }
  };
  const handleReturnOrder = (e) => {
    e.preventDefault();
    const answer = confirm("Do you really want to return order");

    if (answer) {
      dispatch(returnOrder(order.id));
      navigate("/my-order");
    } else {
      return;
    }
  };
  if (loading) {
    return <p className="text-center py-10">Loading order details...</p>;
  }
  if (!order) {
    return <p className="text-center py-10">No order found</p>;
  }

  return (
    <>
      <RoutesSection breadcrumb={breadcrumb} />
      <div className="w-full max-w-4xl mx-auto p-6 my-5">
        <h1 className="text-2xl font-semibold mb-2">Order Details</h1>

        <div className="flex justify-between items-center text-sm text-gray-600 mb-6">
          <p>
            {new Date(order.createdAt).toLocaleDateString("en-IN", {
              day: "2-digit",
              month: "long",
              year: "numeric",
            })}
            <span className="font-medium">Order# {order.orderId}</span>
          </p>
          <button className="text-teal-600 font-medium hover:underline">
            Download Invoice
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 border border-gray-100 p-6 mb-8 bg-white shadow-sm">
          <div>
            <h3 className="font-semibold mb-2">Shipping Address</h3>
            <p className="text-sm text-gray-700 leading-relaxed">
              {order.shippingAddress?.fullName}
              <br />
              {order.shippingAddress?.address}
              <br />
              {order.shippingAddress?.city}, {order.shippingAddress?.state}
              <br />
              {order.shippingAddress?.pincode}
            </p>
          </div>

          <div>
            <h3 className="font-semibold mb-2">Payment Methods</h3>
            <p className="text-sm capitalize">{order.paymentMethod}</p>
          </div>

          <div>
            <h3 className="font-semibold mb-2">Order Summary</h3>
            <div className="text-sm text-gray-600 space-y-1">
              <p className="flex justify-between">
                <span>Bag Total:</span> <span>₹{order.totalAmount}</span>
              </p>
              <p className="flex justify-between">
                <span>Packing Charge:</span> <span>₹0.00</span>
              </p>
              <p className="flex justify-between">
                <span>Sub Total:</span> <span>₹{order.totalAmount}.00</span>
              </p>
              <p className="flex justify-between">
                <span>Coupon:</span> <span>- ₹1,000.00</span>
              </p>
              <p className="flex justify-between font-medium">
                <span>GST 18%:</span> <span>₹1800.00</span>
              </p>

              <p className="flex justify-between font-bold pt-2">
                <span>You Pay:</span>{" "}
                <span>₹{order.totalAmount - 1000 + 1800}.00</span>
              </p>
            </div>
          </div>
        </div>

        {/* Product List */}
        {order.items.map((item) => (
          <div
            key={item.id}
            className="flex gap-4 border border-gray-100 rounded-lg p-4 mb-5 bg-white shadow-sm"
          >
            <img
              src={item.product.images?.[0]}
              alt={item.product.title}
              className="w-28 h-28 rounded-md object-cover"
            />

            <div className="flex-1">
              <h4 className="font-semibold text-gray-800 mb-1">
                {item.product.title}
              </h4>

              <p className="text-sm text-gray-700 mb-1">
                Qty: {item.quantity} | ₹{item.price}
              </p>

              <span
                className={`text-xs px-3 py-1 ${
                  order.status === "Cancelled"
                    ? "bg-red-200 text-red-500"
                    : "bg-gray-200"
                } rounded-md inline-block`}
              >
                {order.status}
              </span>
            </div>
          </div>
        ))}

        <div className="flex justify-center items-center">
          {order.status !== "Cancelled" &&
            order.status !== "Delivered" &&
            order.status !== "Returned" && (
              <button
                className="bg-[#E9B159] px-12 py-3 font-medium text-white text-lg"
                onClick={handleOrderCancel}
              >
                Order Cancel
              </button>
            )}
          {order.status === "Delivered" && (
            <button
              className="bg-[#E9B159] px-12 py-3 font-medium text-white text-lg"
              onClick={handleReturnOrder}
            >
              Return Order
            </button>
          )}
        </div>
      </div>
    </>
  );
}
