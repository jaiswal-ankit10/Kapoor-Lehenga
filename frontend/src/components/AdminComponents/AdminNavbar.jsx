import React, { useState, useRef, useEffect } from "react";
import { Moon, LogOut, Menu } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logout } from "../../redux/userSlice";

const AdminNavbar = ({ setIsSidebarOpen }) => {
  const { user } = useSelector((state) => state.user);
  const [isOpen, setIsOpen] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const dropdownRef = useRef(null);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="w-full bg-white shadow-xl px-6 py-3 flex items-center justify-between rounded">
      <div>
        <Menu
          className="block lg:hidden"
          onClick={() => setIsSidebarOpen((prev) => !prev)}
        />
      </div>

      <div className="flex items-center gap-6 relative" ref={dropdownRef}>
        <button className="p-2 rounded-full hover:bg-gray-100 transition">
          <Moon size={18} className="text-gray-700" />
        </button>

        {/* Profile */}
        <div
          className="flex items-center gap-3 cursor-pointer"
          onClick={() => setIsOpen((prev) => !prev)}
        >
          <div className="text-right leading-tight">
            <p className="text-md font-semibold text-gray-800">
              {user.fullName}
            </p>
            <p className="text-sm text-gray-500 capitalize">{user.role}</p>
          </div>

          <div className="relative">
            <img
              src="https://i.pravatar.cc/40"
              alt="admin"
              className="w-9 h-9 rounded-full object-cover"
            />
            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-white rounded-full" />
          </div>
        </div>

        {/* Dropdown */}
        {isOpen && (
          <div className="absolute right-0 top-14 w-40 bg-white  rounded-md shadow-lg z-50">
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-2 px-4 py-2 text-md text-gray-700 hover:bg-gray-100"
            >
              <LogOut size={16} />
              Logout
            </button>
          </div>
        )}
      </div>
    </header>
  );
};

export default AdminNavbar;
