import { useState } from "react";
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";
import { LiaRupeeSignSolid } from "react-icons/lia";
import { useSelector } from "react-redux";
const PriceDetails = () => {
  const { cartItems, totalAmount } = useSelector((store) => store.cart);
  const [isOpen, setIsOpen] = useState(true);
  const handleToggle = (e) => {
    e.preventDefault();
    setIsOpen(!isOpen);
  };
  return (
    <div className="bg-white rounded-md p-3">
      <div className="flex justify-between">
        <div className="flex items-center gap-2">
          <LiaRupeeSignSolid size={24} className="border rounded-2xl p-1" />
          <h3 className="font-semibold">Price Details</h3>
        </div>
        <div onClick={handleToggle}>
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
          <div className="flex justify-between mb-1">
            <span>Coupon</span>
            <span>-₹1,000</span>
          </div>
          <div className="flex justify-between mb-1">
            <span>GST 18%</span>
            <span>₹1,800</span>
          </div>

          <div className="flex justify-between font-semibold text-green-600 mt-2">
            <span>You Pay</span>
            <span>₹{totalAmount - 1000 + 1800}</span>
          </div>
        </div>
      )}
    </div>
  );
};
export default PriceDetails;
