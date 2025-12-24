import { IoClose } from "react-icons/io5";

const CouponCodeSlider = ({ openCoupon, setCoupon, onApplyCoupon }) => {
  const handleApply = (offer) => {
    onApplyCoupon(offer);
    setCoupon(false);
  };

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
          <h2 className="text-xl font-semibold">Coupons List</h2>
          <IoClose
            className="text-2xl cursor-pointer"
            onClick={() => setCoupon(false)}
          />
        </div>

        <hr />

        <div className="mt-3 space-y-3">
          {[
            {
              code: "NEW25",
              offer: "Get FLAT 25% OFF",
              desc: "On 1st New User Shopping",
              discount: 25,
            },
            {
              code: "NEW10",
              offer: "Flat 10% off",
              desc: "On All Orders",
              discount: 10,
            },
          ].map((offer, index) => (
            <div
              key={index}
              className="border rounded-lg flex justify-between p-3 items-center"
            >
              <div>
                <p className="font-semibold">{offer.offer}</p>
                <p className="text-gray-500 text-sm">Use Code: {offer.code}</p>
              </div>

              <button
                className="bg-black text-white px-3 py-1 rounded text-sm"
                onClick={() => handleApply(offer)}
              >
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
