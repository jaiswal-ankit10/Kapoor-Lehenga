import * as React from "react";
import { useState } from "react";
import { IoClose } from "react-icons/io5";
import Switch from "@mui/material/Switch";
import { useDispatch, useSelector } from "react-redux";
import { createAddress } from "../services/addressService";

const NewAddressSideBar = ({ openNewAddress, setOpenNewAddress }) => {
  const initialInputState = {
    country: "",
    fullName: "",
    mobile: "",
    address: "",
    village: "",
    landmark: "",
    pincode: "",
    city: "",
    state: "",
  };

  const [input, setInput] = useState(initialInputState);
  const [checked, setChecked] = React.useState(true);
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.address);

  const handleChange = (event) => {
    event.preventDefault();
    setChecked(event.target.checked);
  };

  const changeEventHandler = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    const payload = {
      ...input,
      isDefault: checked,
    };
    await dispatch(createAddress(payload));

    setInput(initialInputState);
    setChecked(false);
    setOpenNewAddress(false);
  };
  return (
    <>
      {/* Overlay */}
      {openNewAddress && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
          onClick={() => setOpenNewAddress(false)}
        ></div>
      )}

      {/* New Address Drawer */}
      <div
        onClick={(e) => e.stopPropagation()}
        className={`fixed top-0 right-0 h-full w-full sm:w-[420px] bg-white z-50 shadow-xl p-3 transform duration-300 ${
          openNewAddress ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex  justify-between  gap-4  p-4">
          <h2 className="text-xl font-semibold text-black">New Address</h2>
          <IoClose
            className="text-2xl cursor-pointer text-black"
            onClick={() => setOpenNewAddress(!openNewAddress)}
          />
        </div>
        <hr className="text-gray-300" />
        <form
          className="flex flex-col gap-4 w-full mt-4"
          onSubmit={submitHandler}
        >
          <input
            type="text"
            name="country"
            value={input.country}
            onChange={changeEventHandler}
            placeholder="India"
            className="bg-[#F5F5F5] py-3 px-3 rounded"
          />
          <input
            type="text"
            name="fullName"
            value={input.fullName}
            onChange={changeEventHandler}
            placeholder="Full Name"
            className="bg-[#F5F5F5] py-3 px-3 rounded"
          />
          <input
            type="text"
            name="mobile"
            value={input.mobile}
            onChange={changeEventHandler}
            placeholder="Enter Mobile Number"
            className="bg-[#F5F5F5] py-3 px-3 rounded"
          />
          <input
            type="text"
            name="address"
            value={input.address}
            onChange={changeEventHandler}
            placeholder="Flat, House, No, Building, Company"
            className="bg-[#F5F5F5] py-3 px-3 rounded"
          />
          <input
            type="text"
            name="village"
            value={input.village}
            onChange={changeEventHandler}
            placeholder="Area, Street, Village"
            className="bg-[#F5F5F5] py-3 px-3 rounded"
          />
          <input
            type="text"
            name="landmark"
            value={input.landmark}
            onChange={changeEventHandler}
            placeholder="Lankmark"
            className="bg-[#F5F5F5] py-3 px-3 rounded"
          />
          <input
            type="number"
            name="pincode"
            value={input.pincode}
            onChange={changeEventHandler}
            placeholder="Pincode"
            className="bg-[#F5F5F5] py-3 px-3 rounded"
          />
          <input
            type="text"
            name="city"
            value={input.town}
            onChange={changeEventHandler}
            placeholder="Town/City"
            className="bg-[#F5F5F5] py-3 px-3 rounded"
          />
          <input
            type="text"
            name="state"
            value={input.state}
            onChange={changeEventHandler}
            placeholder="State"
            className="bg-[#F5F5F5] py-3 px-3 rounded"
          />

          <div className="flex justify-between">
            <p className="text-md mt-2 p-2">Use default Address</p>
            <Switch
              checked={checked}
              onChange={handleChange}
              slotProps={{ input: { "aria-label": "controlled" } }}
            />
          </div>
          <div className="absolute bottom-1 left-0 w-full p-4 flex items-center justify-center bg-white">
            <button
              type="submit"
              className="bg-[#E9B159] text-white px-6 py-2 text-xl w-full"
              disabled={loading}
            >
              {loading ? "Saving..." : "Submit"}
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default NewAddressSideBar;
