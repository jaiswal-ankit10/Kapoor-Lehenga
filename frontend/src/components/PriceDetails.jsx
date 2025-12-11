const PriceDetails = () => (
  <div className="border rounded-md p-3">
    <h3 className="font-semibold">Price Details</h3>

    <div className="mt-2 text-sm">
      <div className="flex justify-between mb-1">
        <span>Bag Total</span>
        <span>₹10,000</span>
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

      <hr className="my-2" />

      <div className="flex justify-between font-semibold text-green-600">
        <span>You Pay</span>
        <span>₹10,800</span>
      </div>
    </div>
  </div>
);

export default PriceDetails;
