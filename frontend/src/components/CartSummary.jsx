import { useSelector } from "react-redux";

const CartSummary = () => {
  const { cartItems } = useSelector((store) => store.cart);
  const imageBaseUrl = import.meta.env.VITE_BACKEND_URL;

  return (
    <div className=" mb-3 ">
      <div className="flex justify-between  bg-white p-1">
        <h3 className="font-semibold mb-3">Bag </h3>
        <p>({cartItems.length} items)</p>
      </div>

      <div className="py-4 space-y-2 max-h-[75vh] overflow-y-auto bg-white p-2 ">
        {cartItems?.length === 0 && (
          <p className="text-center text-gray-500 mt-4">Your bag is empty.</p>
        )}

        {cartItems?.map((item) => (
          <div
            key={item.product?._id}
            className="border rounded-md border-gray-300 flex gap-4 relative pr-4"
          >
            <img
              src={`${imageBaseUrl}${item.product?.images?.[0]}`}
              alt={item.product?.title}
              className="w-25 h-full rounded"
            />

            <div>
              <h3 className=" text-md text-black ">{item.product?.title}</h3>
              <h3 className=" text-sm text-black mb-2">
                {item.product?.description}
              </h3>

              <div className="flex items-center gap-2 mt-2 text-black">
                Qty:
                <span className="font-semibold">{item.quantity}</span>
              </div>

              <div className="flex items-center gap-4">
                <p className="text-green-700 font-semibold text-lg mt-1">
                  ₹{item.product?.discountedPrice}
                </p>
                <p className="text-gray-400 line-through text-md">
                  ₹{item.product?.price}
                </p>
                <p className="text-red-600 text-sm">
                  ₹{item.product?.discount}% off
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CartSummary;
