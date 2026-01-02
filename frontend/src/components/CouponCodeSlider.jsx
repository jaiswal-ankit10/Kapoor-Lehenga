import { useEffect } from "react";
import { IoClose } from "react-icons/io5";
import { useDispatch, useSelector } from "react-redux";
import { applyCoupon, fetchCoupons } from "../redux/couponSlice";

const CouponCodeSlider = ({ openCoupon, setCoupon }) => {
  const dispatch = useDispatch();
  const { cartItems, totalAmount } = useSelector((state) => state.cart);
  const { coupons, error, loading } = useSelector((state) => state.coupon);
  const handleApply = (coupon) => {
    dispatch(
      applyCoupon({
        code: coupon.code,
        cartItems,
        cartTotal: totalAmount,
      })
    );

    setCoupon(false);
  };
  useEffect(() => {
    dispatch(fetchCoupons());
  }, [dispatch]);
  return (
    <>
      {openCoupon && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
          onClick={() => setCoupon(false)}
        />
      )}

      <div
        className={`fixed top-0 right-0 h-full w-full sm:w-[420px] bg-white z-50 shadow-xl p-3 duration-300 ${
          openCoupon ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex justify-between p-4">
          <h2 className="text-xl ">Coupons List</h2>
          <IoClose
            className="text-2xl cursor-pointer"
            onClick={() => setCoupon(false)}
          />
        </div>

        <hr className="text-gray-200" />

        <div className="mt-3 space-y-3">
          {coupons.map((coupon) => (
            <div
              key={coupon.id}
              className="border bg-gray-100 rounded-lg flex justify-between p-3 items-center"
            >
              <div className="">
                <p className="font-semibold">{coupon.title}</p>
                <p className="text-gray-500 text-sm">Use Code: {coupon.code}</p>
                <p className="text-gray-500 text-sm">
                  Minimum Purchase Amount: {coupon.minPurchaseAmount}
                </p>
              </div>

              <button
                className="bg-black text-white px-3 py-1 rounded text-sm"
                onClick={() => handleApply(coupon)}
              >
                {loading ? "Applying..." : "Apply"}
              </button>
            </div>
          ))}
        </div>
        {error && (
          <div className="mx-4 mt-3 p-2 rounded bg-red-100 text-red-600 text-sm ">
            {error}
          </div>
        )}
      </div>
    </>
  );
};

export default CouponCodeSlider;
