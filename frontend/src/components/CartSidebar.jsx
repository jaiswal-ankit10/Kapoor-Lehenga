import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { IoClose } from "react-icons/io5";
import {
  loadCartFromBackend,
  removeBackendCartItem,
  updateQtyBackend,
} from "../services/cartService";
import { useEffect } from "react";

const CartSidebar = ({ openCart, setOpenCart }) => {
  const { cartItems, totalAmount } = useSelector((store) => store.cart);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const imageBaseUrl = import.meta.env.VITE_BACKEND_URL;
  const resolveImage = (url) => {
    if (!url) return "";
    return url.startsWith("http") ? url : `${imageBaseUrl}${url}`;
  };
  useEffect(() => {
    if (openCart) {
      dispatch(loadCartFromBackend());
    }
  }, [openCart, dispatch]);

  return (
    <>
      {/* Overlay */}
      {openCart && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
          onClick={() => setOpenCart(false)}
        ></div>
      )}

      {/* Cart Drawer */}
      <div
        className={`fixed top-0 right-0 h-full w-full sm:w-[520px] bg-white z-50 shadow-xl p-3 transform duration-300 ${
          openCart ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex flex-row justify-between md:flex-col gap-4 border-b pb-3">
          <IoClose
            className="text-2xl cursor-pointer text-black"
            onClick={() => setOpenCart(false)}
          />
          <h2 className="text-xl font-semibold text-black">Bag</h2>
        </div>

        {/* Cart Items List */}
        <div className="py-4 space-y-2 max-h-[75vh] overflow-y-auto">
          {cartItems?.length === 0 && (
            <p className="text-center text-gray-500 mt-4">Your bag is empty.</p>
          )}

          {cartItems?.map((item) => (
            <div
              key={item?._id}
              className="border rounded-md border-gray-300 flex gap-4 relative pr-4"
            >
              <img
                src={resolveImage(
                  item.product?.images?.[0] || item.product?.thumbnail
                )}
                alt={item.product?.title}
                className="w-[100px] h-[140px] object-cover rounded"
              />

              <div>
                <h3 className=" text-md text-black ">{item.product?.title}</h3>
                <h3 className=" text-sm text-black mb-2">
                  <div
                    className="prose prose-sm max-w-none"
                    dangerouslySetInnerHTML={{
                      __html: item.product?.description,
                    }}
                  />
                </h3>

                <div className="flex items-center gap-2 mt-2 text-black">
                  <button
                    onClick={() => {
                      if (item.quantity > 1) {
                        dispatch(
                          updateQtyBackend(item.product._id, item.quantity - 1)
                        );
                      }
                    }}
                    className="border px-2"
                  >
                    -
                  </button>

                  <span className="font-semibold">{item.quantity}</span>

                  <button
                    onClick={() =>
                      dispatch(
                        updateQtyBackend(item.product._id, item.quantity + 1)
                      )
                    }
                    className="border px-2"
                  >
                    +
                  </button>
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

              <button
                className="absolute top-2 right-2 text-[10px] bg-gray-200 px-2 py-1 rounded text-black"
                onClick={() =>
                  dispatch(removeBackendCartItem(item.product._id))
                }
              >
                x
              </button>
            </div>
          ))}
        </div>

        {/* Footer */}
        {cartItems.length > 0 && (
          <div className="absolute bottom-0 left-0 w-full border-t p-4 flex items-center justify-between bg-white">
            <p className="text-lg font-semibold text-black">₹{totalAmount}</p>

            <button
              className="bg-[#E9B159] text-white px-6 py-2 text-xl"
              onClick={() => navigate("/address")}
            >
              Proceed to Buy
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default CartSidebar;
