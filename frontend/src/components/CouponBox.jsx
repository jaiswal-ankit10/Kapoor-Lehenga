import { useState } from "react";
import coupon from "../assets/icons/receipt-tax.png";
import { IoIosArrowForward } from "react-icons/io";
import CouponCodeSlider from "./CouponCodeSlider";
import { useDispatch, useSelector } from "react-redux";
import { applyCoupon, removeAppliedCoupon } from "../redux/couponSlice";
import { toast, ToastContainer } from "react-toastify";

const CouponBox = () => {
  const dispatch = useDispatch();
  const [openCoupon, setCoupon] = useState(false);
  const [couponInput, setCouponInput] = useState("");

  const { appliedCoupon } = useSelector((state) => state.coupon);

  const handleApply = async () => {
    if (!couponInput.trim()) {
      toast.error("Please enter a coupon code");
      return;
    }

    const result = await dispatch(applyCoupon(couponInput));

    if (!result.success) {
      toast.error(result.message);
    } else {
      toast.success("Coupon applied successfully");
    }
  };

  const handleRemove = () => {
    setCouponInput("");
    dispatch(removeAppliedCoupon());
    toast.success("Coupon removed");
  };

  return (
    <div className="bg-white rounded-md p-3 mb-3">
      <ToastContainer />
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
          value={couponInput}
          onChange={(e) => setCouponInput(e.target.value)}
        />

        <button
          onClick={handleApply}
          className="bg-[#E9B159] text-white px-4 rounded"
        >
          Apply
        </button>
      </div>

      {appliedCoupon && (
        <div className="flex justify-between items-center">
          <p className="text-green-600 text-sm mt-2">
            Coupon <b>{appliedCoupon}</b> applied successfully
          </p>
          <button className="text-red-500" onClick={handleRemove}>
            remove
          </button>
        </div>
      )}
    </div>
  );
};

export default CouponBox;
