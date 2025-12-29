import { Heart } from "lucide-react";
import React from "react";

const AdminFooter = () => {
  return (
    <footer className="w-full px-4 md:px-6 py-3  ">
      <div className="flex flex-col md:flex-row justify-between items-center gap-2">
        <p className="text-gray-400 text-sm text-center md:text-left">
          COPYRIGHT © 2025{" "}
          <span className="text-orange-200">KAPOOR LEHENGA</span>
          <span className="hidden lg:inline">
            {" "}
            | All rights Reserved | Developed by Sridix Technology
          </span>
        </p>

        <p className="text-gray-400 hidden md:flex items-center gap-2 text-sm">
          Hand-crafted & Made with <Heart size={16} color="red" />
        </p>
      </div>
    </footer>
  );
};

export default AdminFooter;
