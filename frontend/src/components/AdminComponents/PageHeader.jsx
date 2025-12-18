import React from "react";
import { Link } from "react-router-dom";

const PageHeader = ({
  title,
  breadcrumbs = [],
  buttonText,
  Icon,
  handleClick,
  buttonBg,
  buttonTextColor,
}) => {
  return (
    <div className="w-full py-6 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <h2 className="text-md md:text-xl lg:text-3xl  text-gray-500">
          {title}
        </h2>

        {breadcrumbs.length > 0 && (
          <div className="hidden md:flex items-center text-sm text-gray-500 gap-2">
            {breadcrumbs.map((item, index) => (
              <div key={index} className="flex items-center gap-2">
                {index !== 0 && <span>›</span>}
                {item.to ? (
                  <Link
                    to={item.to}
                    className={
                      index === breadcrumbs.length - 1 ? "text-[#B57A1C] " : ""
                    }
                  >
                    {item.label}
                  </Link>
                ) : (
                  <span className="text-gray-700">{item.label}</span>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Right: Action Button */}
      {buttonText && (
        <button
          onClick={handleClick}
          className={`flex items-center gap-2 ${buttonBg} ${buttonTextColor} px-4 py-2 rounded-md text-xs md:text-sm font-medium transition border`}
        >
          <Icon size={16} />
          {buttonText}
        </button>
      )}
    </div>
  );
};

export default PageHeader;
