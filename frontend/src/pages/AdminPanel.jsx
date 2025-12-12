import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { logout } from "../redux/userSlice";
import { Outlet, NavLink, useNavigate } from "react-router-dom";
import blackLogo from "../assets/icons/blackLogo.png";

const nav = [
  { to: "/admin/dashboard", label: "Dashboard" },
  { to: "/admin/users", label: "Users" },
  { to: "/admin/products", label: "Products" },
];

export default function AdminPanel() {
  const [open, setOpen] = useState(true);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  return (
    <div className="flex h-screen">
      <aside
        className={`transition-width duration-200 ${
          open ? "w-80" : "w-16"
        } bg-white border-r relative`}
      >
        <div className="p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="">
              <img src={blackLogo} alt="logo" width={200} />
            </div>
          </div>
          <button
            onClick={() => setOpen((v) => !v)}
            className="p-2 rounded hover:bg-gray-100"
          >
            {open ? "<" : ">"}
          </button>
        </div>

        <nav className="mt-6">
          {nav.map((i) => (
            <NavLink
              key={i.to}
              to={i.to}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 hover:bg-gray-100 ${
                  isActive ? "bg-gray-100 font-medium" : ""
                }`
              }
            >
              <span className="w-6 text-center">•</span>
              {open && i.label}
            </NavLink>
          ))}
        </nav>

        <div className="absolute bottom-4 w-full px-4">
          {open && (
            <button
              onClick={handleLogout}
              className="w-full bg-[#E9B159] text-white py-2 rounded"
            >
              Logout
            </button>
          )}
        </div>
      </aside>

      <main className="flex-1 p-6 overflow-auto">
        <header className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-semibold">Welcome, Admin</h2>
            <p className="text-sm text-gray-500">
              Manage users, products and orders
            </p>
          </div>
          <div className="flex items-center gap-4">
            <input
              placeholder="Search..."
              className="px-3 py-2 border rounded"
            />
            <button className="px-3 py-2 border rounded">New</button>
          </div>
        </header>

        <Outlet />
      </main>
    </div>
  );
}
