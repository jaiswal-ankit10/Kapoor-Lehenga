import React, { useState } from "react";
import AddressCard from "../components/AddressCard";
import CartSummary from "../components/CartSummary";
import CouponBox from "../components/CouponBox";
import PriceDetails from "../components/PriceDetails";
import logo from "../assets/images/full-logo.png";
import paymentBar from "../assets/icons/address-pay.png";
import map from "../assets/icons/map.png";
import { Link, useNavigate } from "react-router-dom";
import NewAddressSideBar from "../components/NewAddressSideBar";

const Address = () => {
  const navigate = useNavigate();
  const [openNewAddress, setOpenNewAddress] = useState(false);

  const addresses = [
    {
      id: 1,
      name: "Piyush Kalsariya",
      address: "146, Laxmi Nagar, Surat",
      default: true,
    },
    { id: 2, name: "Rohit Kumar", address: "Dindoli Road, Surat" },
    { id: 3, name: "Mehul Desai", address: "146, Laxmi Nagar, Surat" },
  ];

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
      <div className="container mx-auto flex flex-col lg:flex-row gap-2 md:gap-20">
        {/* LEFT – ADDRESS LIST */}
        <div className="md:flex-1">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-20 ">
            {addresses.map((address) => (
              <AddressCard key={address.id} address={address} />
            ))}

            {/* ADD NEW ADDRESS CARD */}
            <div
              onClick={() => setOpenNewAddress(true)}
              className="rounded-md p-4 bg-[#F6F6F6] hover:shadow-md duration-300 
                         flex flex-col items-center justify-center cursor-pointer w-full md:w-[320px] lg:w-[420px]"
            >
              <div className="text-3xl font-bold">+</div>
              <p className="mt-2 font-medium">Add New Address</p>

              <NewAddressSideBar
                openNewAddress={openNewAddress}
                setOpenNewAddress={setOpenNewAddress}
              />
            </div>
          </div>
        </div>

        {/* RIGHT – CART SUMMARY */}
        <div
          className="w-full hidden md:block md:w-[760px] lg:w-[420px] 
                        border border-gray-200 bg-[#F6F6F6] rounded-md p-4"
        >
          <CartSummary />
          <CouponBox />
          <PriceDetails />

          <button
            onClick={() => navigate("/payment")}
            className="bg-[#E9B159] text-white w-full py-3 rounded-md mt-4 text-lg font-medium"
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  );
};

export default Address;
