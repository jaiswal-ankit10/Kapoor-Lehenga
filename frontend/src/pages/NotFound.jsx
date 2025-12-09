import React from "react";
import notFound from "../assets/icons/notfound.png";
const NotFound = () => {
  return (
    <div className="flex items-center justify-center h-[80vh]">
      <img src={notFound} alt="" />
    </div>
  );
};

export default NotFound;
