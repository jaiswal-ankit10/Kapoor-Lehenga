import React, { useEffect, useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { logout } from "../redux/userSlice";

import {
  Home,
  Users,
  ShoppingBag,
  Star,
  Settings,
  ShoppingCart,
  CreditCard,
  Tag,
  MessageCircle,
  ChevronDown,
  Circle,
  CircleSmall,
  CircleStop,
} from "lucide-react";

import blackLogo from "../assets/icons/blackLogo.png";
import AdminNavbar from "../components/AdminComponents/AdminNavbar";
import AdminFooter from "../components/AdminComponents/AdminFooter";

const SidebarLink = ({ to, icon: Icon, label, showLabel }) => (
  <NavLink
    to={to}
    className={({ isActive }) =>
      `flex items-center gap-3 px-4 py-3 rounded-lg transition
      ${
        isActive ? "bg-[#E9B159] text-white" : "text-gray-700 hover:bg-gray-100"
      }`
    }
  >
    <Icon size={18} />
    {showLabel && <span className="text-md font-medium">{label}</span>}
  </NavLink>
);

export default function AdminPanel() {
  const [open, setOpen] = useState({
    order: true,
    product: false,
    home: false,
  });
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [showLabel, setShowLabel] = useState(true);

  const toggle = (key) => setOpen((prev) => ({ ...prev, [key]: !prev[key] }));
  useEffect(() => {
    document.body.style.overflow = isSidebarOpen ? "hidden" : "auto";
  }, [isSidebarOpen]);

  return (
    <div className="flex h-screen bg-gray-50">
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-30 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      <aside
        className={`
    fixed lg:static top-0 left-0 z-40
    h-screen
    ${showLabel ? "w-64" : "w-20"} bg-white shadow-2xl
    transform transition-transform duration-300
    ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}
    lg:translate-x-0
    flex flex-col overflow-y-auto
  `}
      >
        <div className="p-6 flex justify-between items-center">
          <img src={blackLogo} alt="logo" className="w-40" />
          <div
            className="hidden md:block"
            onClick={() => setShowLabel((prev) => !prev)}
          >
            <CircleStop color="#b2b1b4" />
          </div>
          <div className="flex justify-end p-4 md:hidden">
            <button onClick={() => setIsSidebarOpen(false)}>✕</button>
          </div>
        </div>

        {/* Menu */}
        <nav className="flex-1 p-4 ">
          <SidebarLink
            to="/admin/dashboard"
            icon={Home}
            label="Dashboard"
            showLabel={showLabel}
          />
          <SidebarLink
            to="/admin/users"
            icon={Users}
            label="Users"
            showLabel={showLabel}
          />

          <SidebarLink
            to="/admin/products"
            icon={ShoppingBag}
            label="Product"
            showLabel={showLabel}
          />

          {/* Product Config */}
          <button
            onClick={() => toggle("product")}
            className="w-full flex items-center justify-between px-4 py-3 rounded-lg hover:bg-gray-100"
          >
            <div className="flex items-center gap-3 text-gray-700">
              <Settings size={18} />
              {showLabel && (
                <span className="text-md font-medium">Product Config</span>
              )}
            </div>
            {showLabel && (
              <ChevronDown
                size={16}
                className={`transition ${open.product ? "rotate-180" : ""}`}
              />
            )}
          </button>

          {open.product && (
            <>
              <div className="ml-9 space-y-1"></div>
              <div className="ml-9 space-y-1">
                <SidebarLink
                  to="/admin/categories"
                  icon={CircleSmall}
                  label="Categories"
                  showLabel={showLabel}
                />
              </div>
            </>
          )}

          {/* Order Management */}
          <button
            onClick={() => toggle("order")}
            className="w-full flex items-center justify-between px-4 py-3 rounded-lg hover:bg-gray-100"
          >
            <div className="flex items-center gap-3 text-gray-700">
              <ShoppingCart size={18} />
              {showLabel && (
                <span className="text-md font-medium">Order Management</span>
              )}
            </div>
            {showLabel && (
              <ChevronDown
                size={16}
                className={`transition ${open.order ? "rotate-180" : ""}`}
              />
            )}
          </button>

          {open.order && (
            <div className="ml-9 space-y-1">
              <SidebarLink
                to="/admin/orders"
                icon={ShoppingCart}
                label="Orders"
                showLabel={showLabel}
              />
              <SidebarLink
                to="/admin/payments"
                icon={CreditCard}
                label="Payment History"
                showLabel={showLabel}
              />
            </div>
          )}
          <SidebarLink
            to="/admin/coupon"
            icon={Tag}
            label="Coupon"
            showLabel={showLabel}
          />
          <SidebarLink
            to="/admin/product-review"
            icon={Star}
            label="Product Review"
            showLabel={showLabel}
          />
          <SidebarLink
            to="/admin/inquiry"
            icon={MessageCircle}
            label="Inquiry"
            showLabel={showLabel}
          />

          {/* Home page */}
          <button
            onClick={() => toggle("home")}
            className="w-full flex items-center justify-between px-4 py-3 rounded-lg hover:bg-gray-100"
          >
            <div className="flex items-center gap-3 text-gray-700">
              <Settings size={18} />
              {showLabel && (
                <span className="text-md font-medium">Home Page</span>
              )}
            </div>
            {showLabel && (
              <ChevronDown
                size={16}
                className={`transition ${open.home ? "rotate-180" : ""}`}
              />
            )}
          </button>
          {open.home && (
            <div className="ml-9 space-y-1">
              <SidebarLink
                to="/admin/banner"
                icon={CircleSmall}
                label="Banner"
                showLabel={showLabel}
              />
            </div>
          )}
          <SidebarLink
            to="/admin/clients"
            icon={Users}
            label="Clients"
            showLabel={showLabel}
          />
        </nav>
      </aside>

      {/* Content */}
      <main className=" flex-1 pt-5 px-5 md:px-10 lg:px-20 overflow-auto">
        <AdminNavbar setIsSidebarOpen={setIsSidebarOpen} />
        <div className="mx-auto max-w-7xl px-5 md:px-10 py-6">
          <Outlet />
        </div>
        <AdminFooter />
      </main>
    </div>
  );
}
