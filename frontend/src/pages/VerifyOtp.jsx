import React from "react";
import brandLogo from "../assets/images/brandLogo.jpg";

const VerifyOtp = ({ setPage }) => {
  return (
    <div className="flex flex-col items-center gap-5 mt-5">
      <button
        className="absolute top-5 left-4 text-xl"
        onClick={() => setPage()}
      >
        ←
      </button>

      <img src={brandLogo} alt="logo" className="w-40" />

      <h2 className="text-xl font-bold">Verify OTP</h2>

      <p className="text-center text-gray-600 text-sm">
        Enter the 6-digit OTP sent to +91-*****2156
      </p>

      <div className="flex gap-2">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <input
            key={i}
            className="border w-10 h-12 text-center"
            maxLength="1"
          />
        ))}
      </div>

      <button className="bg-[#F3A93C] text-white font-semibold w-full py-2 rounded mt-3">
        SUBMIT
      </button>

      <p className="text-sm underline text-gray-500 mt-2 cursor-pointer">
        Resend OTP in 25s
      </p>
    </div>
  );
};

export default VerifyOtp;
