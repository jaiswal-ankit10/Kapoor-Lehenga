import React from "react";
import { useState } from "react";
import razorpayLogo from "../assets/icons/razorpay.png";
import PriceDetails from "../components/PriceDetails";
import logo from "../assets/images/full-logo.png";
import paymentBar from "../assets/icons/payment.png";
import map from "../assets/icons/map.png";
import { Link } from "react-router-dom";
import { IoCardOutline } from "react-icons/io5";
import { BsCashCoin } from "react-icons/bs";
import OrderSuccessModal from "../components/OrderSuccessModal";
import { useDispatch, useSelector } from "react-redux";
import { createOrder } from "../services/orderService";
import { clearBackendCart } from "../services/cartService";
import { toast, ToastContainer } from "react-toastify";

const PaymentPage = () => {
  const [openSuccess, setOpenSuccess] = useState(false);
  const dispatch = useDispatch();

  const { cartItems } = useSelector((state) => state.cart);
  const { selectedAddress } = useSelector((state) => state.address);

  const buildOrderData = () => {
    if (!selectedAddress) {
      throw new Error("No address selected");
    }

    const items = cartItems
      .filter((item) => item.product && item.product.id)
      .map((item) => ({
        productId: item.product.id,
        quantity: item.quantity,
        price: item.product.discountedPrice || item.product.price,
      }));

    const paymentStatus = selected === "cod" ? "PENDING" : "COMPLETE";

    return {
      shippingAddress: {
        fullName: selectedAddress.fullName,
        mobile: selectedAddress.mobile,
        address: selectedAddress.address,
        city: selectedAddress.city,
        state: selectedAddress.state,
        pincode: selectedAddress.pincode,
      },
      items,
      paymentMethod: selected.toUpperCase(),
      paymentStatus,
    };
  };

  const placeOrder = async () => {
    if (!cartItems.length) return toast.warning("Your cart is empty");

    try {
      const orderData = buildOrderData();

      await dispatch(createOrder(orderData));

      dispatch(clearBackendCart());
      setOpenSuccess(true);
    } catch (error) {
      console.error("Payment error:", error);
      toast.error(error?.message || "Payment failed. Please try again.");
    }
  };
  const [selected, setSelected] = useState("razorpay");
  return (
    <div className="w-full min-h-screen bg-white">
      <ToastContainer />
      <div className="bg-[#E9B159] p-5 flex justify-center text-white text-xl font-semibold">
        <Link to={"/"}>
          <img src={logo} alt="logo" />
        </Link>
      </div>

      {/* Steps */}
      <div className="flex justify-center items-center py-10 ">
        <img src={paymentBar} alt="" className="w-[80%] sm:w-[60%]" />
      </div>

      <div className="max-w-[85%] mx-auto flex justify-between items-center mb-10">
        <div>
          <h2 className="text-4xl font-semibold">Payment Method</h2>
          <p className="text-lg text-gray-500 mb-5">
            Select your preferred payment method.
          </p>
        </div>
        <img src={map} alt="map" className="w-50 mr-10 hidden  md:block" />
      </div>
      <div className="container mx-auto flex  items-center justify-center  mt-4">
        {/* LEFT - Price Detals */}
        <div className="w-[480px] hidden lg:block border border-gray-200 rounded-md p-3">
          <PriceDetails />
        </div>
        {/* Right - Payment Method */}
        <div className="w-full max-w-md mx-auto border border-gray-200 bg-[#F6F6F6] rounded-xl shadow-sm p-4 ">
          <div className="flex items-center gap-2 mb-4">
            <IoCardOutline size={24} />
            <h2 className="font-semibold text-lg">Payment Method</h2>
          </div>

          {/* Options */}
          <div className="space-y-3">
            <div
              onClick={() => setSelected("razorpay")}
              className="flex items-center justify-between p-4 cursor-pointer bg-white 
              "
            >
              <div className="flex items-center gap-3">
                <img src={razorpayLogo} className="w-8 h-8" alt="razorpay" />
                <span className="font-medium">Razor Pay</span>
              </div>

              <span
                className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                  selected === "razorpay"
                    ? "border-yellow-500"
                    : "border-gray-400"
                }`}
              >
                {selected === "razorpay" && (
                  <span className="w-2.5 h-2.5 bg-yellow-500 rounded-full"></span>
                )}
              </span>
            </div>

            <div
              onClick={() => setSelected("cod")}
              className="flex items-center justify-between p-4 cursor-pointer bg-white"
            >
              <div className="flex items-center gap-3">
                <BsCashCoin />
                <span className="font-medium">COD (Cash on delivery)</span>
              </div>

              <span
                className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                  selected === "cod" ? "border-yellow-500" : "border-gray-400"
                }`}
              >
                {selected === "cod" && (
                  <span className="w-2.5 h-2.5 bg-yellow-500 rounded-full"></span>
                )}
              </span>
            </div>
          </div>

          <button
            onClick={placeOrder}
            className="w-full mt-5 bg-[#E9B159] text-white text-xl font-semibold py-3"
          >
            Payment
          </button>
          <OrderSuccessModal
            isOpen={openSuccess}
            onClose={() => setOpenSuccess(false)}
          />
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;
