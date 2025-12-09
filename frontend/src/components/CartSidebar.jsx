import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { removeFromCart, increaseQty, decreaseQty } from "../redux/cartSlice";
import { IoClose } from "react-icons/io5";

const CartSidebar = ({ openCart, setOpenCart }) => {
  const { cartItems, totalAmount } = useSelector((store) => store.cart);
  const dispatch = useDispatch();

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
        className={`fixed top-0 right-0 h-full w-full sm:w-[420px] bg-white z-50 shadow-xl p-3 transform duration-300 ${
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
        <div className="py-4 space-y-2  max-h-[70vh] ">
          {cartItems.map((item) => (
            <div
              key={item.id}
              className="border  rounded-md border-gray-300 flex gap-3 relative pr-4"
            >
              <img
                src={item.images[0]}
                alt=""
                className="w-24 h-full rounded"
              />

              <div>
                <h3 className="font-semibold text-sm text-black mb-2">
                  {item.title}
                </h3>
                <p className="text-xs text-gray-500">
                  {item.description.slice(0, 60)}...
                </p>

                <div className="flex items-center gap-2 mt-2 text-black">
                  <button
                    onClick={() => dispatch(decreaseQty(item.id))}
                    className="border px-2"
                  >
                    -
                  </button>
                  <span className="font-semibold">{item.qty}</span>
                  <button
                    onClick={() => dispatch(increaseQty(item.id))}
                    className="border px-2"
                  >
                    +
                  </button>
                </div>

                <p className="text-green-700 font-semibold mt-1">
                  ₹{item.price}
                </p>
              </div>

              <button
                className="absolute top-2 right-2 text-[10px] bg-gray-200 px-2 py-1 rounded text-black"
                onClick={() => dispatch(removeFromCart(item.id))}
              >
                x
              </button>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="absolute bottom-0 left-0 w-full border-t p-4 flex items-center justify-between bg-white">
          <p className="text-lg font-semibold text-black">₹{totalAmount}</p>
          <button className="bg-[#E9B159] text-white px-6 py-2 text-xl">
            Proceed to Buy
          </button>
        </div>
      </div>
    </>
  );
};

export default CartSidebar;
