import React, { useState } from "react";
import { breadcrumbRoutes } from "../utils/breadcrumbRoutes";
import RoutesSection from "../components/RoutesSection";
import amazonIcon from "../assets/icons/amazon.png";

export default function OrderDetail() {
  const [products, setProducts] = useState([
    {
      img: "https://via.placeholder.com/120",
      title: "Peach Art Silk A Line Wear Silk Printed Designer Lehenga Choli",
      qty: 1,
      price: "₹4,000",
      status: "Processing",
    },
    {
      img: "https://via.placeholder.com/120",
      title: "Peach Art Silk A Line Wear Silk Printed Designer Lehenga Choli",
      qty: 1,
      price: "₹4,000",
      status: "Processing",
    },
    {
      img: "https://via.placeholder.com/120",
      title: "Peach Art Silk A Line Wear Silk Printed Designer Lehenga Choli",
      qty: 1,
      price: "₹4,000",
      status: "Processing",
    },
  ]);

  const [isOrderCancelled, setIsOrderCancelled] = useState(false);
  const breadcrumb = [
    breadcrumbRoutes.home,
    breadcrumbRoutes.myOrder,
    breadcrumbRoutes.orderDetail,
  ];
  const handleOrderCancel = (e) => {
    e.preventDefault();
    setIsOrderCancelled(true);
    setProducts((prev) =>
      prev.map((item) => ({
        ...item,
        status: "Cancelled",
      }))
    );
  };

  return (
    <>
      <RoutesSection breadcrumb={breadcrumb} />
      <div className="w-full max-w-4xl mx-auto p-6 my-5">
        <h1 className="text-2xl font-semibold mb-2">Order Details</h1>

        <div className="flex justify-between items-center text-sm text-gray-600 mb-6">
          <p>
            Ordered on 11 December 2025 |{" "}
            <span className="font-medium">Order# 954-65218741-215513</span>
          </p>
          <button className="text-teal-600 font-medium hover:underline">
            Download Invoice
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 border border-gray-100 p-6 mb-8 bg-white shadow-sm">
          <div>
            <h3 className="font-semibold mb-2">Shipping Address</h3>
            <p className="text-sm text-gray-700 leading-relaxed">
              146, Laxmi Narayan Nagar-1
              <br />
              G R P Road, Udhna
              <br />
              Road no 3 Surat
              <br />
              Gujarat - 394250
              <br />
              India
            </p>
          </div>

          <div>
            <h3 className="font-semibold mb-2">Payment Methods</h3>
            <div className="flex items-center gap-2">
              <img src={amazonIcon} alt="amazon pay" className="w-5" />
              <p className="text-sm">Amazon Pay Balance</p>
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-2">Order Summary</h3>
            <div className="text-sm text-gray-600 space-y-1">
              <p className="flex justify-between">
                <span>Bag Total:</span> <span>₹10,000.00</span>
              </p>
              <p className="flex justify-between">
                <span>Packing Charge:</span> <span>₹0.00</span>
              </p>
              <p className="flex justify-between">
                <span>Sub Total:</span> <span>₹10,000.00</span>
              </p>
              <p className="flex justify-between">
                <span>Coupon:</span> <span>- ₹1,000.00</span>
              </p>
              <p className="flex justify-between font-medium">
                <span>GST 18%:</span> <span>₹1800.00</span>
              </p>

              <p className="flex justify-between font-bold pt-2">
                <span>You Pay:</span> <span>₹10,800.00</span>
              </p>
            </div>
          </div>
        </div>

        {/* Product List */}
        {products.map((item, i) => (
          <div
            key={i}
            className="flex gap-4 border border-gray-100 rounded-lg p-4 mb-5 bg-white shadow-sm"
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

              <span
                className={`text-xs px-3 py-1 ${
                  isOrderCancelled ? "bg-red-200 text-red-500" : "bg-gray-200"
                } rounded-md inline-block`}
              >
                {item.status}
              </span>
            </div>
          </div>
        ))}

        {/* Cancel Button */}
        <div className="flex justify-center mt-8">
          {!isOrderCancelled && (
            <button
              className="bg-[#E9B159] px-12 py-3  font-medium text-white text-lg "
              onClick={handleOrderCancel}
            >
              Order Cancel
            </button>
          )}
        </div>
      </div>
    </>
  );
}
