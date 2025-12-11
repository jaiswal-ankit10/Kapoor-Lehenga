import React from "react";
import AddressCard from "../components/AddressCard";
import CartSummary from "../components/CartSummary";
import CouponBox from "../components/CouponBox";
import PriceDetails from "../components/PriceDetails";
import logo from "../assets/images/full-logo.png";
import paymentBar from "../assets/icons/address-pay.png";
import map from "../assets/icons/map.png";

const Address = () => {
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
    <div className="w-full min-h-screen bg-white">
      {/* Breadcrumb top */}
      <div className="bg-[#E9B159] p-5 flex justify-center text-white text-xl font-semibold">
        <img src={logo} alt="logo" />
      </div>

      {/* Steps */}
      <div className="flex justify-center items-center py-10">
        <img src={paymentBar} alt="" />
      </div>

      <div className="max-w-[95%] mx-auto flex justify-between items-center mb-10">
        <div>
          <h2 className="text-4xl font-semibold">Choose Address</h2>
          <p className="text-lg text-gray-500 mb-5">
            Detailed address will help our delivery partner reach you quickly
          </p>
        </div>
        <img src={map} alt="map" className="w-50 mr-10" />
      </div>
      <div className="max-w-[95%] mx-auto flex  gap-10 mt-4">
        {/* LEFT - Address List */}

        <div className="flex-1">
          {/* Address Cards */}
          <div className="grid grid-cols-2 gap-4">
            {addresses.map((address) => (
              <AddressCard key={address.id} address={address} />
            ))}

            {/* Add New Address */}
            <div className="rounded-md p-4 bg-[#F6F6F6] hover:shadow-md duration-300 w-[420px] h-[200px] flex flex-col items-center justify-center">
              <div className="text-2xl">+</div>
              <p className="mt-2 font-medium">Add New Address</p>
            </div>
          </div>
        </div>

        {/* RIGHT - Cart Summary */}
        {/* <div className="w-[350px]">
          <CartSummary />

          <CouponBox />

          <PriceDetails />

          <button className="bg-[#E9B159] text-white w-full py-3 rounded-md mt-4 text-lg font-medium">
            Continue →
          </button>
        </div> */}
      </div>
    </div>
  );
};

export default Address;
