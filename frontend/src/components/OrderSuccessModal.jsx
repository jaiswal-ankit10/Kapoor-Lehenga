import React from "react";
import tick from "../assets/icons/tick.png";
import { useNavigate } from "react-router-dom";

const OrderSuccessModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;
  const navigate = useNavigate();
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">
      <div className="bg-white  p-8 w-[90%] max-w-sm shadow-xl text-center animate-scaleIn">
        <div className="flex justify-center mb-3">
          <img src={tick} alt="order-done" className="w-30" />
        </div>

        <h2 className="text-xl font-semibold mb-2">Order Successfully</h2>

        <p className="text-gray-500 text-sm mb-6">
          Your order has been placed successfully. You can see the status of the
          order at any time.
        </p>

        <button
          onClick={() => navigate("/")}
          className="w-full bg-[#E9B159] text-white py-3 text-lg"
        >
          Back to Home
        </button>
      </div>
    </div>
  );
};

export default OrderSuccessModal;
