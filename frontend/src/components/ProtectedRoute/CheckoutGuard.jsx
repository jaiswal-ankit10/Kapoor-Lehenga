import React from "react";
import { useSelector } from "react-redux";
import { Navigate, useLocation } from "react-router-dom";

const CheckoutGuard = ({ children, requiredStep }) => {
  const { cartItems } = useSelector((state) => state.cart);
  const { selectedAddress } = useSelector((state) => state.address);
  const location = useLocation();

  // 1. Always block if cart is empty
  if (cartItems.length === 0) {
    return <Navigate to="/products" replace />;
  }

  // 2. Logic for Address Page: Must have items in cart
  if (requiredStep === "address") {
    return children;
  }

  // 3. Logic for Payment Page: Must have a selected address
  if (requiredStep === "payment") {
    if (!selectedAddress) {
      return <Navigate to="/address" replace />;
    }
    return children;
  }

  return children;
};

export default CheckoutGuard;
