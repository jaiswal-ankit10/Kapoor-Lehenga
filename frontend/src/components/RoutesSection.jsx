import React from "react";
import { Link, useNavigate } from "react-router-dom";

const RoutesSection = ({ breadcrumb }) => {
  return (
    <div className="bg-[#EEEEEE] w-full py-2 px-4">
      <div className="flex items-center gap-2 text-md ">
        {breadcrumb.map((item, index) => (
          <span key={index} className="flex items-center">
            <Link
              to={item.route}
              className={
                index === breadcrumb.length - 1 ? "text-[#B57A1C] " : ""
              }
            >
              {item.name}
            </Link>
            {index !== breadcrumb.length - 1 && (
              <span className="mx-2 text-gray-400">›</span>
            )}
          </span>
        ))}
      </div>
    </div>
  );
};

export default RoutesSection;
