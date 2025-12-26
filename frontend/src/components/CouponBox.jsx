import { useState } from "react";
import coupon from "../assets/icons/receipt-tax.png";
import { IoIosArrowForward } from "react-icons/io";
import CouponCodeSlider from "./CouponCodeSlider";
import { useDispatch, useSelector } from "react-redux";

const CouponBox = () => {
  const [openCoupon, setCoupon] = useState(false);
  const [couponInput, setCouponInput] = useState("");
  const { appliedCoupon } = useSelector((state) => state.coupon);
  const handleChange = () => {
    setCouponInput(appliedCoupon);
  };
  return (
    <div className="bg-white rounded-md p-3 mb-3">
      <div className="flex justify-between">
        <div className="flex items-center gap-3">
          <img src={coupon} alt="" />
          <h3 className="font-semibold text-lg">Coupon Code</h3>
        </div>
        <IoIosArrowForward size={24} onClick={() => setCoupon(!openCoupon)} />
        <CouponCodeSlider openCoupon={openCoupon} setCoupon={setCoupon} />
      </div>
      <div className="flex gap-2 mt-2 ml-12">
        <input
          type="text"
          placeholder="Enter coupon code"
          className="border border-gray-200 p-2 flex-1 rounded-md"
          value={appliedCoupon}
          onChange={handleChange}
        />
        <button className="bg-[#E9B159] text-white px-4 rounded">Apply</button>
      </div>
      {appliedCoupon && (
        <p className="text-green-600 text-sm mt-2">
          Coupon <b>{appliedCoupon}</b> applied successfully
        </p>
      )}
    </div>
  );
};

export default CouponBox;
