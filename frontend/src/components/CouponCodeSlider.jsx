import { IoClose } from "react-icons/io5";

const CouponCodeSlider = ({ openCoupon, setCoupon }) => {
  return (
    <>
      {/* Overlay */}
      {openCoupon && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
          onClick={() => setCoupon(false)}
        ></div>
      )}

      {/* Coupon Drawer */}
      <div
        className={`fixed top-0 right-0 h-full w-full sm:w-[420px] bg-white z-50 shadow-xl p-3 transform duration-300 ${
          openCoupon ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex  justify-between  gap-4  p-4">
          <h2 className="text-xl font-semibold text-black">New Address</h2>
          <IoClose
            className="text-2xl cursor-pointer text-black"
            onClick={() => setCoupon(false)}
          />
        </div>
        <hr className="text-gray-300" />
        <div className="mt-3 space-y-3">
          {[
            {
              code: "NEW25",
              offer: "Get FLAT 25% OFF",
              desc: "On 1st New User Shopping",
            },
            { code: "NEW10", offer: "Flat 10% off", desc: "On All Orders" },
          ].map((offer, index) => (
            <div
              key={index}
              className="border rounded-lg flex justify-between p-3 items-center"
            >
              <div>
                <p className="font-semibold">{offer.offer}</p>
                <p className="text-gray-500 text-sm">Use Code: {offer.code}</p>
              </div>
              <button className="bg-black text-white px-3 py-1 rounded text-sm">
                Apply
              </button>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default CouponCodeSlider;
