import { useState } from "react";
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";
import { LiaRupeeSignSolid } from "react-icons/lia";
import { useSelector } from "react-redux";

const PriceDetails = () => {
  const { totalAmount, appliedCoupon } = useSelector((store) => store.cart);

  const [isOpen, setIsOpen] = useState(true);

  const gstRate = 18;

  const couponDiscount = appliedCoupon
    ? (totalAmount * appliedCoupon.discount) / 100
    : 0;

  const gstAmount = ((totalAmount - couponDiscount) * gstRate) / 100;

  const payableAmount = totalAmount - couponDiscount + gstAmount;

  return (
    <div className="bg-white rounded-md p-3">
      <div className="flex justify-between">
        <div className="flex items-center gap-2">
          <LiaRupeeSignSolid size={24} className="border rounded-2xl p-1" />
          <h3 className="font-semibold">Price Details</h3>
        </div>
        <div onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <IoIosArrowUp size={24} /> : <IoIosArrowDown size={24} />}
        </div>
      </div>

      {isOpen && (
        <div className="mt-2 text-md text-[#555555] bg-[#F8F8F8] p-4">
          <div className="flex justify-between mb-1">
            <span>Bag Total</span>
            <span>₹{totalAmount}</span>
          </div>

          <div className="flex justify-between mb-1">
            <span>Packing Charge</span>
            <span>₹0.00</span>
          </div>

          {appliedCoupon && (
            <div className="flex justify-between mb-1 text-green-600">
              <span>Coupon ({appliedCoupon.code})</span>
              <span>-₹{couponDiscount.toFixed(0)}</span>
            </div>
          )}

          <div className="flex justify-between mb-1">
            <span>GST 18%</span>
            <span>₹{gstAmount.toFixed(0)}</span>
          </div>

          <div className="flex justify-between font-semibold text-green-600 mt-2">
            <span>You Pay</span>
            <span>₹{payableAmount.toFixed(0)}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default PriceDetails;
