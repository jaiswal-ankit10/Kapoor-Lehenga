import React, { useState } from "react";
import { breadcrumbRoutes } from "../utils/breadcrumbRoutes";
import RoutesSection from "../components/RoutesSection";

const ReturnProduct = () => {
  const products = [
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
  return (
    <>
      <RoutesSection breadcrumb={breadcrumb} />

      <div className="w-full max-w-4xl mx-auto p-6 my-5">
        {products.map((item, i) => (
          <div
            key={i}
            className="flex gap-4 border border-gray-100 rounded-lg p-5 mb-5 bg-white shadow-sm"
          >
            <img
              src={item.img}
              alt=""
              className="w-28 h-28 rounded-md object-cover"
            />

            <div className="flex-1">
              <h4 className="font-semibold text-gray-800 mb-1">{item.title}</h4>

              <p className="text-sm text-gray-700 mb-1">
                Qty : {item.qty} &nbsp; | &nbsp; {item.price} ({item.qty} item)
              </p>

              <span className="text-xs px-3 py-1 bg-gray-200 rounded-md inline-block">
                {item.status}
              </span>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default ReturnProduct;
