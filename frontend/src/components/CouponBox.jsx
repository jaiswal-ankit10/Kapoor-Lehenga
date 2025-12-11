const CouponBox = () => (
  <div className="border rounded-md p-3 mb-3">
    <h3 className="font-semibold">Coupon Code</h3>
    <div className="flex gap-2 mt-2">
      <input
        type="text"
        placeholder="Enter coupon code"
        className="border p-2 flex-1 rounded-md"
      />
      <button className="bg-gray-800 text-white px-3 rounded-md">Apply</button>
    </div>
  </div>
);

export default CouponBox;
