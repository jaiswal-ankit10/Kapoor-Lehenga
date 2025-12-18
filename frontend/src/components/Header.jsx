import React, { useEffect, useState } from "react";
import {
  MdOutlineKeyboardArrowDown,
  MdOutlineKeyboardArrowUp,
} from "react-icons/md";
import { FaRegUser } from "react-icons/fa";
import { IoIosNotificationsOutline } from "react-icons/io";
import { IoCubeOutline } from "react-icons/io5";

import { IoExitOutline } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import logo from "../assets/images/logo.png";
import kapoor from "../assets/images/kapoor.png";
import mobileLogo from "../assets/images/mobile-logo.png";
import cartIcon from "../assets/icons/cart.png";
import favouriteIcon from "../assets/icons/favourite.png";
import userIcon from "../assets/icons/user.png";
import returnIcon from "../assets/icons/return.png";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../redux/userSlice";
import CartSidebar from "./CartSidebar";
import { loadCartFromBackend } from "../services/cartService";
import { loadWishlistFromBackend } from "../services/wishlistService";
import { setCategory, setSearch } from "../redux/filterSlice";

const Header = () => {
  const [openMenu, setOpenMenu] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(false);
  const [openCart, setOpenCart] = useState(false);

  const { user } = useSelector((store) => store.user);
  const { cartItems } = useSelector((store) => store.cart);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const menuItems = [
    "SALE",
    "NEW ARRIVAL",
    "HALF SAREE",
    "FASHION SAREE",
    "LEHENGA",
    "GOWN",
    "WEDDING",
    "CELEBRITY OUTFITS",
    "OCCASIONS",
    "ENGAGEMENT",
    "RECEPTION",
    "OTHERS",
  ];
  useEffect(() => {
    dispatch(loadCartFromBackend());
    dispatch(loadWishlistFromBackend());
  }, []);

  const handleSearchChange = (e) => {
    const value = e.target.value;
    dispatch(setSearch(value));
    navigate(`/products?search=${encodeURIComponent(value)}`);
  };
  const handleCategory = (category) => {
    const normalizedCategory = category.toLowerCase();
    dispatch(setCategory(normalizedCategory));
    navigate(`/products?category=${encodeURIComponent(category)}`);
  };

  return (
    <div className="bg-[#E9B159] w-full  px-6 md:px-10 py-3">
      {/* TOP ROW */}
      <div className="flex  justify-between items-center gap-4">
        {/* Mobile Hamburger Menu */}
        <div
          className="lg:hidden cursor-pointer mt-1"
          onClick={() => setOpenMenu(!openMenu)}
        >
          <div className="w-6 h-0.5 bg-white mb-[5px]"></div>
          <div className="w-6 h-0.5 bg-white mb-[5px]"></div>
          <div className="w-6 h-0.5 bg-white"></div>
        </div>
        {/* Logo */}
        <div
          className="flex items-center gap-0 lg:gap-2"
          onClick={() => navigate("/")}
        >
          <img
            src={logo}
            className="hidden  md:block md:w-16 lg:w-[84px] lg:h-[81px]"
          />
          <img
            src={kapoor}
            className="hidden md:block  lg:w-[180px] lg:h-[69px]"
          />
          {/* mobile logo */}
          <img
            src={mobileLogo}
            alt="logo"
            className="block h-10 md:h-0 md-hidden"
          />
        </div>

        {/* Search Bar */}
        <div className="w-full hidden md:w-md lg:block lg:max-w-xl">
          <div className="flex items-center gap-3 bg-white/20 border border-white/50 rounded-lg px-4 py-2 text-white">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-5 h-5 opacity-70"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M21 21l-4.35-4.35M11 19a8 8 0 100-16 8 8 0 000 16z"
              />
            </svg>
            <input
              type="text"
              placeholder="Search for products..."
              className="bg-transparent outline-none text-white w-full"
              onChange={handleSearchChange}
            />
          </div>
        </div>

        {/* USER + WISHLIST + CART */}
        <div className="flex items-center gap-4 md:gap-6 text-white">
          {/* Account Button */}
          <div className="hidden md:block relative">
            <div
              className="flex items-center gap-2 cursor-pointer"
              onClick={() => setOpenDropdown(!openDropdown)}
            >
              <div className="w-9 h-9 md:w-10 md:h-10 rounded-full bg-white flex items-center justify-center">
                <img src={userIcon} className="w-5 h-5" />
              </div>

              <div className="hidden lg:flex gap-1 items-center">
                {!user ? (
                  <>
                    <h2>Login</h2>
                    {openDropdown ? (
                      <MdOutlineKeyboardArrowUp />
                    ) : (
                      <MdOutlineKeyboardArrowDown />
                    )}
                  </>
                ) : (
                  <>
                    <h2>Account</h2>
                    {openDropdown ? (
                      <MdOutlineKeyboardArrowUp />
                    ) : (
                      <MdOutlineKeyboardArrowDown />
                    )}
                  </>
                )}
              </div>
            </div>

            {/* Dropdown */}
            {openDropdown && (
              <div className="absolute right-0 mt-2 bg-white shadow-lg px-4 py-3 b w-50 z-50 text-black">
                {!user ? (
                  <div
                    className="flex items-center gap-2 cursor-pointer hover:text-gray-600"
                    onClick={() => {
                      navigate("/login");
                      setOpenDropdown(false);
                    }}
                  >
                    <IoExitOutline />
                    <p>Login / Signup</p>
                  </div>
                ) : (
                  <>
                    <div
                      className="flex items-center gap-2 cursor-pointer border-b border-gray-300 mb-1 p-2"
                      // onClick={() => {
                      //   dispatch(logout());
                      //   setOpenDropdown(false);
                      //   navigate("/");
                      // }}
                    >
                      <FaRegUser />
                      <p>My Profile</p>
                    </div>
                    <div
                      className="flex items-center gap-2 cursor-pointer border-b border-gray-300 mb-1 p-2"
                      // onClick={() => {
                      //   dispatch(logout());
                      //   setOpenDropdown(false);
                      //   navigate("/");
                      // }}
                    >
                      <IoIosNotificationsOutline
                        size={24}
                        className="-ml-1.5"
                      />
                      <p>Notification</p>
                    </div>
                    <div
                      className="flex items-center gap-2 cursor-pointer border-b border-gray-300 mb-1 p-2"
                      onClick={() => {
                        // dispatch(logout());
                        setOpenDropdown(false);
                        navigate("/my-order");
                      }}
                    >
                      <IoCubeOutline size={22} className="-ml-1.5" />
                      <p>My Order</p>
                    </div>
                    <div
                      className="flex items-center gap-2 cursor-pointer border-b border-gray-300 mb-1 p-2"
                      onClick={() => {
                        setOpenDropdown(false);
                        navigate("/return-product");
                      }}
                    >
                      <img src={returnIcon} alt="" className="w-5 -ml-1.5" />
                      <p>Return Product</p>
                    </div>
                    <div
                      className="flex items-center gap-2 cursor-pointer hover:text-red-600 p-2"
                      onClick={() => {
                        dispatch(logout());
                        setOpenDropdown(false);
                        navigate("/");
                      }}
                    >
                      <IoExitOutline size={24} className="-ml-1.5" />
                      <p>Logout</p>
                    </div>
                  </>
                )}
              </div>
            )}
          </div>

          <div
            className="hidden lg:flex items-center gap-2 cursor-pointer"
            onClick={() => navigate("/wishlist")}
          >
            <img src={favouriteIcon} className="w-5 md:w-6" />
            <h2 className="hidden md:block">Wishlist</h2>
          </div>

          <div
            className="flex items-center gap-3 cursor-pointer "
            onClick={() => setOpenCart(true)}
          >
            <div className="relative">
              <img src={cartIcon} className="w-5 md:w-6 " />
              <p className="absolute bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs left-3 bottom-0">
                {cartItems.length}
              </p>
            </div>
            <h2 className="hidden md:block">Cart</h2>
          </div>
          <CartSidebar openCart={openCart} setOpenCart={setOpenCart} />
        </div>
      </div>
      {/* mobile searchbar */}
      <div className="w-full mt-3 lg:hidden ">
        <div className="flex items-center gap-3 bg-white/20 border border-white/50 rounded-lg px-4 py-2 text-white">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-5 h-5 opacity-70"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M21 21l-4.35-4.35M11 19a8 8 0 100-16 8 8 0 000 16z"
            />
          </svg>
          <input
            type="text"
            placeholder="Search for products..."
            className="bg-transparent outline-none text-white w-full"
            onChange={handleSearchChange}
          />
        </div>
      </div>

      {/* MENU BAR */}
      <div className="mt-3 w-full">
        <ul className="hidden lg:flex text-white  lg:justify-around  w-full  mx-auto text-base md:text-sm  lg:text-lg xl:text-xl  ">
          {menuItems.map((item, index) => (
            <li
              onClick={() => handleCategory(item)}
              key={index}
              className="cursor-pointer hover:text-gray-200 whitespace-nowrap min-w-max"
            >
              {item}
            </li>
          ))}
        </ul>

        {openMenu && (
          <ul className="lg:hidden bg-[#E9B159] text-white flex flex-col gap-4 mt-4 py-4 px-3 uppercase font-medium rounded-lg shadow-lg">
            <li
              className="cursor-pointer border-b border-white/30 pb-1"
              onClick={() => navigate("/")}
            >
              Account
            </li>
            <li
              className="cursor-pointer border-b border-white/30 pb-1"
              onClick={() => navigate("/my-profile")}
            >
              My Profile
            </li>
            <li
              className="cursor-pointer border-b border-white/30 pb-1"
              onClick={() => navigate("/wishlist")}
            >
              Wishlist
            </li>
            <li
              className="cursor-pointer border-b border-white/30 pb-1"
              onClick={() => setOpenCart(!openCart)}
            >
              Cart
            </li>
          </ul>
        )}
      </div>
    </div>
  );
};

export default Header;
