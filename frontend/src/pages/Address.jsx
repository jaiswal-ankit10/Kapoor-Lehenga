import React, { lazy, Suspense, useEffect, useState } from "react";
import AddressCard from "../components/AddressCard";
const CartSummary = lazy(() => import("../components/CartSummary"));
const CouponBox = lazy(() => import("../components/CouponBox"));
const PriceDetails = lazy(() => import("../components/PriceDetails"));
const NewAddressSideBar = lazy(() => import("../components/NewAddressSideBar"));
import logo from "../assets/images/full-logo.png";
import paymentBar from "../assets/icons/address-pay.png";
import map from "../assets/icons/map.png";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchAddresses } from "../services/addressService";

const Address = () => {
  const navigate = useNavigate();
  const [openNewAddress, setOpenNewAddress] = useState(false);
  const dispatch = useDispatch();
  const { addresses, selectedAddress, loading } = useSelector(
    (state) => state.address
  );

  const handleContinue = () => {
    if (!selectedAddress) return;
    navigate("/payment");
  };
  useEffect(() => {
    dispatch(fetchAddresses());
  }, []);

  return (
    <div className="w-full min-h-screen bg-white overflow-x-hidden">
      {/* TOP BAR */}
      <div className="bg-[#E9B159] p-4 flex justify-center">
        <Link to={"/"}>
          <img src={logo} alt="logo" className="w-32 sm:w-40" />
        </Link>
      </div>

      {/* STEPS IMAGE */}
      <div className="flex justify-center items-center py-6">
        <img src={paymentBar} alt="" className="w-[80%] sm:w-[60%]" />
      </div>

      {/* TITLE + MAP */}
      <div className="max-w-[95%] md:max-w-[85%] mx-auto flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        <div className="text-center md:text-left">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold">
            Choose Address
          </h2>
          <p className="text-gray-500 mt-2 text-sm sm:text-base">
            Detailed address will help our delivery partner reach you quickly
          </p>
        </div>

        <img src={map} alt="map" className="hidden md:block w-40 lg:w-56" />
      </div>

      {/* MAIN SECTION */}
      <div className="container mx-auto flex flex-col lg:flex-row gap-8 px-4 pb-10">
        {!loading && addresses.length === 0 && (
          <p className="text-gray-500">No addresses found</p>
        )}

        {/* LEFT – ADDRESS LIST */}
        <div className="flex-1">
          {loading && <p>Loading addresses...</p>}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {!loading &&
              addresses
                ?.filter((address) => address && address.id)
                .map((address) => (
                  <AddressCard
                    key={address.id}
                    address={address}
                    isSelected={selectedAddress?.id === address.id}
                  />
                ))}

            {/* ADD NEW ADDRESS CARD */}
            <div
              onClick={() => setOpenNewAddress(!openNewAddress)}
              className="rounded-md p-6 bg-[#F6F6F6] border border-dashed border-gray-300 
                   hover:border-[#E9B159] hover:shadow-md duration-300 
                   flex flex-col items-center justify-center cursor-pointer min-h-40"
            >
              <div className="text-3xl font-bold">+</div>
              <p className="mt-2 font-medium">Add New Address</p>

              <Suspense fallback={<div>Loading...</div>}>
                <NewAddressSideBar
                  openNewAddress={openNewAddress}
                  setOpenNewAddress={setOpenNewAddress}
                />
              </Suspense>
            </div>
          </div>
        </div>

        {/* RIGHT – CART SUMMARY */}
        <div
          className="w-full lg:w-100 h-fit sticky top-4
                        border border-gray-200 bg-[#F6F6F6] rounded-md p-4"
        >
          <Suspense fallback={<div>Loading...</div>}>
            <CartSummary />
          </Suspense>
          <Suspense fallback={<div>Loading...</div>}>
            <CouponBox />
          </Suspense>
          <Suspense fallback={<div>Loading...</div>}>
            <PriceDetails />
          </Suspense>

          <button
            onClick={handleContinue}
            disabled={!selectedAddress}
            className={`w-full py-3 rounded-md mt-4 text-lg font-medium transition-colors
        ${
          selectedAddress
            ? "bg-[#E9B159] text-white cursor-pointer hover:bg-[#d8a148]"
            : "bg-gray-300 text-gray-500 cursor-not-allowed"
        }`}
          >
            {selectedAddress ? "Continue" : "Select an Address"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Address;
