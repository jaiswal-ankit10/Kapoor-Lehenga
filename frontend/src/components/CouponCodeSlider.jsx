import { useEffect } from "react";
import { IoClose } from "react-icons/io5";
import { useDispatch, useSelector } from "react-redux";
import { applyCoupon, fetchCoupons } from "../redux/couponSlice";
import ellipse from "../assets/images/Ellipse1.png";
import ellipse2 from "../assets/icons/Ellipse2.png";
import shoppingBag from "../assets/icons/shopping-bags1.png";
import carts from "../assets/icons/carts.png";
import onlineShopping from "../assets/icons/online-shopping.png";

const CouponCodeSlider = ({ openCoupon, setCoupon }) => {
  const dispatch = useDispatch();
  const { cartItems, totalAmount } = useSelector((state) => state.cart);
  const { coupons, error, loading } = useSelector((state) => state.coupon);
  const handleApply = async (coupon) => {
    try {
      await dispatch(
        applyCoupon({
          code: coupon.code,
          cartItems,
          cartTotal: totalAmount,
        })
      ).unwrap();

      setCoupon(false);
    } catch (error) {}
  };
  useEffect(() => {
    dispatch(fetchCoupons());
  }, [dispatch]);
  return (
    <>
      {openCoupon && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
          onClick={() => {
            if (!loading) setCoupon(false);
          }}
        />
      )}

      <div
        className={`fixed top-0 right-0 h-full w-full sm:w-105 bg-white z-50 shadow-xl p-3 duration-300 ${
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
              className="border border-gray-300 bg-gray-100  flex justify-between items-center  pr-3"
            >
              <div className="flex items-center gap-4">
                <div className="relative">
                  <img src={ellipse} alt="coupon" className="w-32 h-22 " />
                  <p className="absolute top-4 left-4 z-40 text-[#FF3F4C] text-xl font-semibold">
                    Get {coupon.title}
                  </p>
                  <img
                    src={shoppingBag}
                    alt=""
                    className="absolute top-0 left-2"
                  />
                  <img
                    src={carts}
                    alt=""
                    className="absolute top-0 right-3 w-5"
                  />
                  <img
                    src={onlineShopping}
                    alt=""
                    className="absolute bottom-0 left-0 w-6"
                  />
                  <img
                    src={ellipse2}
                    alt=""
                    className="absolute bottom-3 right-6"
                  />
                </div>
                <div className="">
                  <p className="font-semibold">{coupon.title}</p>
                  <p className="text-gray-500 text-sm">
                    Use Code: {coupon.code}
                  </p>
                  {/* <p className="text-gray-500 text-sm">
                    Minimum Purchase Amount: {coupon.minPurchaseAmount}
                  </p> */}
                </div>
              </div>

              <button
                className="bg-black text-white px-3 py-1 rounded text-sm cursor-pointer"
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
