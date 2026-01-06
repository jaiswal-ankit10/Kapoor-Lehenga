import React, { useState } from "react";
import googleLogo from "../assets/icons/googleIcon.png";
import facebookLogo from "../assets/icons/facebookIcon.png";
import brandLogo from "../assets/images/brandLogo.jpg";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { USER_API_END_POINT } from "../utils/constants";
import { useDispatch } from "react-redux";
import { setUser } from "../redux/userSlice";
import GoogleLogin from "../components/GoogleAuth/GoogleLogin";

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [input, setInput] = useState({
    email: "",
    // mobile: "",
    password: "",
  });
  const [errors, setErrors] = useState({});

  const changeEventHandler = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: "" });
    }
  };

  const validate = () => {
    let newErrors = {};

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!input.email) {
      newErrors.email = "Email is required";
    } else if (!emailRegex.test(input.email)) {
      newErrors.email = "Invalid email format";
    }

    // const mobileRegex = /^[0-9]{10}$/;
    // if (!input.mobile) {
    //   newErrors.mobile = "Mobile number is required";
    // } else if (!mobileRegex.test(input.mobile)) {
    //   newErrors.mobile = "Enter a valid 10-digit number";
    // }

    if (!input.password) {
      newErrors.password = "Password is required";
    } else if (input.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    try {
      const res = await axios.post(`${USER_API_END_POINT}/login`, input, {
        withCredentials: true,
      });

      if (res.data.success) {
        dispatch(
          setUser({
            user: res.data.user,
            token: res.data.token,
          })
        );

        navigate(res.data.user.role === "ADMIN" ? "/admin" : "/");
      }
    } catch (error) {
      if (error.response && error.response.data) {
        const backendError =
          error.response.data.erros || error.response.data.message;

        setErrors({
          server: backendError || "Invalid email or password",
        });
      } else {
        setErrors({ server: "Network error. Please try again later." });
      }
      console.log("Backend Error Log:", error.response?.data);
    }
  };
  return (
    <div className="h-screen w-full flex justify-center overflow-hidden">
      <div className="w-full max-w-[350px] flex flex-col items-center gap-5 overflow-y-auto py-5 px-4">
        <img src={brandLogo} alt="logo" className="w-40" />

        <p className="border border-[#C18B32] px-4 py-2 rounded text-sm text-center">
          Fashion at Your Fingertips: Explore, Shop, and Slay!
        </p>

        <h2 className="text-2xl font-semibold">Login</h2>

        <p className="text-gray-600 text-center text-sm">
          Sign in so you can save items to your wishlists, track your orders,
          and checkout faster!
        </p>
        {errors.server && (
          <div className="text-red-500 bg-red-100 border border-red-400 px-3 py-2 rounded text-sm w-full text-center">
            {errors.server}
          </div>
        )}
        <form className="flex flex-col gap-4 w-full" onSubmit={submitHandler}>
          <div className="flex flex-col">
            <input
              type="email"
              name="email"
              value={input.email}
              onChange={changeEventHandler}
              placeholder="Enter Email ID"
              className={`bg-[#CDCDCD] py-2 px-3 rounded outline-none ${
                errors.email ? "border border-red-500" : ""
              }`}
            />
            {errors.email && (
              <span className="text-red-500 text-[10px] mt-1">
                {errors.email}
              </span>
            )}
          </div>

          {/* <div className="flex flex-col">
            <input
              type="text"
              name="mobile"
              value={input.mobile}
              onChange={changeEventHandler}
              placeholder="Enter Mobile Number"
              className={`bg-[#CDCDCD] py-2 px-3 rounded outline-none ${
                errors.mobile ? "border border-red-500" : ""
              }`}
            />
            {errors.mobile && (
              <span className="text-red-500 text-[10px] mt-1">
                {errors.mobile}
              </span>
            )}
          </div> */}

          <div className="flex flex-col">
            <input
              type="password"
              name="password"
              value={input.password}
              onChange={changeEventHandler}
              placeholder="Enter Password"
              className={`bg-[#CDCDCD] py-2 px-3 rounded outline-none ${
                errors.password ? "border border-red-500" : ""
              }`}
            />
            {errors.password && (
              <span className="text-red-500 text-[10px] mt-1">
                {errors.password}
              </span>
            )}
          </div>

          <button className="bg-[#F3A93C] text-white text-xl w-full py-3 rounded mt-3 cursor-pointer">
            CONTINUE
          </button>
        </form>

        <p className="text-sm mt-2">
          New User?{" "}
          <span
            onClick={() => navigate("/signup")}
            className="underline cursor-pointer"
          >
            Signup
          </span>
        </p>

        <button className="text-sm">Login With B2B →</button>

        <div className="flex gap-4 mt-2">
          <GoogleLogin />

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

export default Login;
