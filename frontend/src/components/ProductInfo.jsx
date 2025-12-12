import React, { useState } from "react";
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";
import { PiPackageDuotone } from "react-icons/pi";
import { TbInfoSquareRounded } from "react-icons/tb";
import { LuPackageOpen } from "react-icons/lu";
import { productList } from "../../../backend/dummyData/productList";

const ProductInfo = ({ product }) => {
  const [openDetails, setOpenDetails] = useState(true);
  const [openDescription, setOpenDescription] = useState(false);
  const [openReturn, setOpenReturn] = useState(false);

  return (
    <div className="mt-10  p-5 ">
      <h2 className="text-4xl  mb-4">Product Information</h2>

      {/* Product Details */}
      <div className="border-b py-3">
        <div
          className="flex justify-between items-center cursor-pointer"
          onClick={() => setOpenDetails(!openDetails)}
        >
          <div className="flex gap-3 items-center">
            <PiPackageDuotone size={24} />
            <div>
              <p className="font-semibold">Product Details</p>
              <p className="text-md text-gray-500">
                Care instructions, Pack contains
              </p>
            </div>
          </div>
          {openDetails ? <IoIosArrowUp /> : <IoIosArrowDown />}
        </div>

        {openDetails && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-y-2 mt-3 pl-10 text-md">
            <p>
              <span className="font-semibold">Material:</span> Crepe
            </p>
            <p>
              <span className="font-semibold">Type of Work:</span> Embellished &
              Sequined
            </p>
            <p>
              <span className="font-semibold">Pattern:</span> Printed
            </p>
            <p>
              <span className="font-semibold">Type:</span> Lehenga Choli
            </p>
            <p>
              <span className="font-semibold">Fit:</span> Comfortable
            </p>
            <p>
              <span className="font-semibold">Neckline Type:</span> Scoop Neck
            </p>
            <p>
              <span className="font-semibold">Sleeve Type:</span> Sleeveless
            </p>
            <p>
              <span className="font-semibold">Closure Type:</span> Back Closure
            </p>
            <p>
              <span className="font-semibold">Care Instructions:</span> Dry
              Clean Only
            </p>
          </div>
        )}
      </div>

      {/* Description */}
      <div className="border-b py-3">
        <div
          className="flex justify-between items-center cursor-pointer"
          onClick={() => setOpenDescription(!openDescription)}
        >
          <div className="flex gap-3 items-center">
            <TbInfoSquareRounded size={24} />
            <div>
              <p className="font-semibold">Know your product</p>
              <p className="text-md text-gray-500">Description</p>
            </div>
          </div>
          {openDescription ? <IoIosArrowUp /> : <IoIosArrowDown />}
        </div>

        {openDescription && (
          <p className="mt-2 pl-10 text-md text-gray-600 leading-relaxed">
            {product.description}
          </p>
        )}
      </div>

      {/* Return Policy */}
      <div className="py-3">
        <div
          className="flex justify-between items-center cursor-pointer"
          onClick={() => setOpenReturn(!openReturn)}
        >
          <div className="flex gap-3 items-center">
            <LuPackageOpen size={24} />
            <div>
              <p className="font-semibold">Return and exchange policy</p>
              <p className="text-md text-gray-500">
                Know more about return and exchange
              </p>
            </div>
          </div>
          {openReturn ? <IoIosArrowUp /> : <IoIosArrowDown />}
        </div>

        {openReturn && (
          <p className="mt-2 pl-10 text-md text-gray-600 leading-relaxed">
            This product is eligible for returns or replacement. Please initiate
            from "My Orders" within 7 days of delivery. Ensure the product
            condition is original with all tags attached.
          </p>
        )}
      </div>
    </div>
  );
};

export default ProductInfo;
