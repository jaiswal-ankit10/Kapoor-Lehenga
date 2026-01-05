import React, { useState, useEffect } from "react";
import { breadcrumbRoutes } from "../utils/breadcrumbRoutes";
import RoutesSection from "../components/RoutesSection";
import { useDispatch, useSelector } from "react-redux";
import { fetchReturnedOrders } from "../services/orderService";

const ReturnProduct = () => {
  const dummyproducts = [
    {
      img: "https://via.placeholder.com/120",
      title: "Peach Art Silk A Line Wear Silk Printed Designer Lehenga Choli",
      qty: 1,
      price: "₹4,000",
      status: "Returned",
    },
    {
      img: "https://via.placeholder.com/120",
      title: "Peach Art Silk A Line Wear Silk Printed Designer Lehenga Choli",
      qty: 1,
      price: "₹4,000",
      status: "Returned",
    },
    {
      img: "https://via.placeholder.com/120",
      title: "Peach Art Silk A Line Wear Silk Printed Designer Lehenga Choli",
      qty: 1,
      price: "₹4,000",
      status: "Returned",
    },
  ];
  const breadcrumb = [breadcrumbRoutes.home, breadcrumbRoutes.returnProduct];
  const { orders } = useSelector((state) => state.order);
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(fetchReturnedOrders());
  }, [dispatch]);

  return (
    <>
      <RoutesSection breadcrumb={breadcrumb} />

      <div className="w-full max-w-4xl mx-auto p-6 my-5">
        {orders.length === 0 ? (
          <p className="text-center text-gray-500">No returned orders found</p>
        ) : (
          orders.map((order) =>
            order.items.map((item, index) => (
              <div
                key={index}
                className="flex gap-4 border border-gray-100 rounded-lg p-5 mb-5 bg-white shadow-sm"
              >
                <img
                  src={item.product.images?.[0]}
                  alt={item.product.title}
                  className="w-28 h-28 rounded-md object-fit"
                />

                <div className="flex-1">
                  <h4 className="font-semibold text-gray-800 mb-1">
                    {item.product.title}
                  </h4>

                  <div className="flex items-center gap-10">
                    <p className="text-sm text-gray-700 mb-1">
                      Order Id: {order.orderId}
                    </p>
                    <p className="text-sm text-gray-700 mb-1">
                      Qty: {item.quantity}
                    </p>
                    <p className="text-sm text-gray-700 mb-1">
                      ₹{item.product.price}({item.quantity} item)
                    </p>
                  </div>

                  <span className="text-xs px-3 py-1 bg-gray-200 rounded-md inline-block">
                    {order.status}
                  </span>
                </div>
              </div>
            ))
          )
        )}
      </div>
    </>
  );
};

export default ReturnProduct;
