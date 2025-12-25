import React, { useState, useEffect } from "react";
import googleLogo from "../assets/icons/googleIcon.png";
import facebookLogo from "../assets/icons/facebookIcon.png";
import brandLogo from "../assets/images/brandLogo.jpg";
import { USER_API_END_POINT } from "../utils/constants";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useSelector } from "react-redux";

const Signup = () => {
  const navigate = useNavigate();
  const { user } = useSelector((store) => store.user);

  const [input, setInput] = useState({
    fullName: "",
    email: "",
    mobile: "",
    password: "",
  });

  const changeEventHandler = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };

  const submitHandler = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post(`${USER_API_END_POINT}/register`, input, {
        withCredentials: true,
      });

      if (res.data.success) {
        navigate("/login");
      }
    } catch (error) {
      console.log(error);
    }
  };

  // Redirect after signup if user exists
  useEffect(() => {
    if (user) navigate("/");
  }, [user, navigate]);

  return (
    <div className="h-screen w-full flex justify-center overflow-hidden">
      <div className="w-full max-w-[350px] flex flex-col items-center gap-5 overflow-y-auto py-5 px-4">
        <img src={brandLogo} alt="logo" className="w-40" />

        <p className="border border-[#C18B32] px-4 py-2 rounded text-sm text-center">
          Fashion at Your Fingertips: Explore, Shop, and Slay!
        </p>

        <h2 className="text-2xl font-semibold">Signup</h2>

        <p className="text-gray-600 text-center text-sm">
          Sign in so you can save items to your wishlists, track your orders,
          and checkout faster!
        </p>

        <form className="flex flex-col gap-4 w-full" onSubmit={submitHandler}>
          <input
            type="text"
            name="fullName"
            value={input.fullName}
            onChange={changeEventHandler}
            placeholder="Full Name"
            className="bg-[#CDCDCD] py-2 px-3 rounded"
          />

          <input
            type="email"
            name="email"
            value={input.email}
            onChange={changeEventHandler}
            placeholder="Enter Email ID"
            className="bg-[#CDCDCD] py-2 px-3 rounded"
          />
          <input
            type="text"
            name="mobile"
            value={input.mobile}
            onChange={changeEventHandler}
            placeholder="Enter Mobile Number"
            className="bg-[#CDCDCD] py-2 px-3 rounded"
          />

          <input
            type="password"
            name="password"
            value={input.password}
            onChange={changeEventHandler}
            placeholder="Enter Password"
            className="bg-[#CDCDCD] py-2 px-3 rounded"
          />

          <button className="bg-[#F3A93C] text-white text-xl w-full py-3 rounded mt-3">
            CONTINUE
          </button>
        </form>

        <p className="text-sm mt-1">
          Already have an account?{" "}
          <span
            onClick={() => navigate("/login")}
            className="underline cursor-pointer"
          >
            Login
          </span>
        </p>

        <button className="text-sm">Login With B2B →</button>

        <div className="flex gap-4 mt-2">
          <button className="bg-gray-200 px-4 py-2 rounded">
            <img src={googleLogo} className="w-10" />
          </button>
          <button className="bg-gray-200 px-4 py-2 rounded">
            <img src={facebookLogo} className="w-10" />
          </button>
        </div>

        <p className="text-xs mt-4 text-center">
          By signing up you agree to our{" "}
          <span className="underline">Terms of Service</span> &
          <span className="underline"> Privacy Policy</span>
        </p>
      </div>
    </div>
  );
};

export default Signup;
