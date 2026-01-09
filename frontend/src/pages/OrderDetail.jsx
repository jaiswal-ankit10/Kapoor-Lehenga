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
import ReviewModal from "../components/ReviewModal";

import razorpay from "../assets/icons/razorpay.png";
import { BsCashCoin } from "react-icons/bs";

export default function OrderDetail() {
  const statusStyle = {
    PENDING: "bg-yellow-100 text-yellow-600",
    CONFIRMED: "bg-blue-100 text-blue-600",
    COMPLETED: "bg-green-100 text-green-600",
    CANCELLED: "bg-red-100 text-red-500",
    PROCESSING: "bg-blue-100 text-blue-500",
    RETURNED: "bg-gray-100 text-gray-500",
    DELIVERED: "bg-green-400 text-white",
  };

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();

  const [isReviewOpen, setIsReviewOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const { order, loading, error } = useSelector((state) => state.order);
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
            <p className="text-sm capitalize flex items-center">
              <img
                src={order.paymentMethod === "COD" ? <BsCashCoin /> : razorpay}
                alt="payment-method"
                className="w-8"
              />
              {order.paymentMethod}
            </p>
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
            className="flex flex-col gap-2 md:gap-0 md:flex-row justify-between items-center  border border-gray-100 rounded-lg p-4 mb-5 bg-white shadow-sm"
          >
            <div className="flex gap-3">
              <img
                src={item.product.images?.[0]}
                alt={item.product.title}
                className="w-28 h-28 rounded-md object-fit"
              />

              <div className="">
                <h4 className="font-semibold text-gray-800 mb-1">
                  {item.product.title}
                </h4>

                <div className="flex gap-4">
                  <p className="text-sm text-gray-700 mb-1">
                    Qty: {item.quantity}
                  </p>
                  <p className="text-sm text-gray-700 mb-1">
                    ₹{item.price * item.quantity}
                  </p>
                  <p className="text-sm text-gray-700 mb-1">
                    ({item.quantity} item)
                  </p>
                </div>

                <span
                  className={`text-xs px-3 py-1 ${
                    statusStyle[order.status]
                  } rounded-md inline-block`}
                >
                  {order.status}
                </span>
              </div>
            </div>
            {order.status === "DELIVERED" && (
              <div className="flex flex-col gap-2">
                <button
                  onClick={() => navigate(`/products/${item.productId}`)}
                  className="bg-[#E9B159] text-white py-2 text-xs cursor-pointer"
                >
                  Buy it again
                </button>
                <button
                  onClick={() => {
                    setSelectedProduct({
                      id: item.productId,
                      title: item.product.title,
                      images: item.product.images,
                    });
                    setIsReviewOpen(true);
                  }}
                  className="bg-[#F4F4F4] text-black py-2 text-xs px-3 cursor-pointer"
                >
                  Write Product Review
                </button>
              </div>
            )}
          </div>
        ))}
        {error && (
          <div className="bg-red-100 text-red-600 px-4 py-2 rounded mb-4">
            {error}
          </div>
        )}

        <div className="flex justify-center items-center">
          {order.status !== "CANCELLED" &&
            order.status !== "DELIVERED" &&
            order.status !== "RETURNED" && (
              <button
                className="bg-[#E9B159] px-12 py-3 font-medium text-white text-lg cursor-pointer"
                onClick={handleOrderCancel}
              >
                Order Cancel
              </button>
            )}
          {order.status === "DELIVERED" && (
            <button
              className="bg-[#E9B159] px-12 py-3 font-medium text-white text-lg cursor-pointer"
              onClick={handleReturnOrder}
            >
              Return Order
            </button>
          )}
        </div>
      </div>
      {isReviewOpen && (
        <ReviewModal
          product={selectedProduct}
          onClose={() => setIsReviewOpen(false)}
        />
      )}
    </>
  );
}
