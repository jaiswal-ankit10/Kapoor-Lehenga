import React from "react";
import { useNavigate } from "react-router-dom";

const SidebarRouteWrapper = ({ children }) => {
  const navigate = useNavigate();

  const closeSidebar = () => {
    navigate(-1);
  };

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
        onClick={closeSidebar}
      ></div>

      {/* Sliding Sidebar */}
      <div className="fixed top-0 right-0 h-full w-full sm:w-[420px] bg-white z-50 shadow-xl p-6 transform duration-300 translate-x-0">
        <button
          className="absolute top-3 right-3 text-xl"
          onClick={closeSidebar}
        >
          ✕
        </button>

        {children}
      </div>
    </>
  );
};

export default SidebarRouteWrapper;
