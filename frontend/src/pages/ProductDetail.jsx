import React, { useState } from "react";
import { breadcrumbRoutes } from "../utils/breadcrumbRoutes";
import RoutesSection from "../components/RoutesSection";
import { useParams } from "react-router-dom";
import { productList } from "../utils/productList";
import { FaStar } from "react-icons/fa";
import cart from "../assets/icons/cart.png";
import ServicesSection from "../components/ServicesSection";
import { FiHeart } from "react-icons/fi";
import { GoPlus } from "react-icons/go";
import ProductInfo from "../components/ProductInfo";
import ProductCard from "../components/ProductCard";
import SimilarProductsSlider from "../components/SimilarProductsSlider";
import MoreProducts from "../components/MoreProducts";
import ReviewSection from "../components/ReviewSection";

const ProductDetail = () => {
  const { id } = useParams();
  const product = productList.find((p) => p.id === parseInt(id));
  const [selectedThumb, setSelectedThumb] = useState(product.thumbnails[0]);
  const [qty, setQty] = useState(1);
  const [stitchOption, setStitchOption] = useState("unstitched");

  const breadcrumb = [
    breadcrumbRoutes.home,
    breadcrumbRoutes.productPage,
    breadcrumbRoutes.productDetails(id),
  ];
  if (!product) return <div>Loading...</div>;
  return (
    <>
      {/* routes section */}
      <RoutesSection breadcrumb={breadcrumb} />
      <div className="max-w-[85vw] mx-auto px-12 py-10 flex gap-10 flex-col md:flex-row">
        {/* Thumbnails */}
        <div className="flex flex-row md:flex-col gap-3 overflow-y-auto h-[120px] md:h-[550px] pr-2 ">
          {product.thumbnails.map((thumb, index) => (
            <img
              key={index}
              src={thumb}
              onClick={() => setSelectedThumb(thumb)}
              className={`w-[100px] h-[140px] object-cover rounded cursor-pointer border 
              ${selectedThumb === thumb ? "border-black" : "border-gray-300"}`}
            />
          ))}
        </div>

        {/* MAIN IMAGE */}
        <img
          src={selectedThumb}
          className="w-[450px] h-[550px] object-fill rounded"
        />

        {/* RIGHT SECTION */}
        <div className="flex-1">
          <h2 className="text-3xl font-bold">{product.title}</h2>
          <p className="text-gray-600 mt-1 text-sm">{product.description}</p>

          {/* Rating */}
          <div className="flex items-center gap-2 mt-2">
            <span className="bg-green-600 text-white px-2 rounded text-sm flex items-center gap-1">
              {product.rating} <FaStar className="text-xs" />
            </span>
            <p className="text-gray-500 text-sm">
              Based on {product.reviews} ratings
            </p>
          </div>

          {/* Price */}
          <div className="mt-4">
            <div className="flex gap-4 items-center">
              <p className="text-3xl font-bold">
                ₹{product.price.toLocaleString()}
              </p>
              <p className="text-green-500  text-3xl">
                {product.discount}% Off
              </p>
            </div>
            <p className="text-gray-400 text-sm">Inclusive of all taxes</p>
          </div>

          <hr className="my-4 text-gray-300" />

          {/* Color Options */}
          <p className="text-sm font-semibold">Select Color</p>
          <div className="flex gap-2 mt-2">
            {product.colors.map((color, index) => (
              <img
                key={index}
                src={color}
                className="w-[60px] h-20 object-cover rounded cursor-pointer border border-gray-300"
              />
            ))}
          </div>

          {/* Offers */}
          <h3 className="font-semibold mt-6">Available Offers</h3>
          <div className="mt-3 space-y-3">
            {[
              { code: "NEW25", offer: "Get FLAT 25% OFF" },
              { code: "NEW10", offer: "Flat 10% off" },
            ].map((offer, index) => (
              <div
                key={index}
                className="border rounded-lg flex justify-between p-3 items-center"
              >
                <div>
                  <p className="font-semibold">{offer.offer}</p>
                  <p className="text-gray-500 text-sm">
                    Use Code: {offer.code}
                  </p>
                </div>
                <button className="border px-3 py-1 rounded text-sm">
                  COPY
                </button>
              </div>
            ))}
          </div>

          {/* Stitching Options */}
          <div className="mt-6">
            <p className="font-semibold">Lehenga Choli:</p>

            {[
              { id: "unstitched", label: "Unstitched Lehenga Choli", price: 0 },
              { id: "standard", label: "Standard Stitching", price: 1499 },
              { id: "custom", label: "Customize Stitching", price: 1899 },
            ].map((option) => (
              <label
                key={option.id}
                className="flex items-center gap-2 mt-2 cursor-pointer"
              >
                <input
                  type="radio"
                  name="stitch"
                  checked={stitchOption === option.id}
                  onChange={() => setStitchOption(option.id)}
                />
                <span>{option.label}</span>
                <span className="text-gray-600">₹{option.price}</span>
              </label>
            ))}
          </div>

          {/* Quantity */}
          <div className="mt-6">
            <p className="font-semibold mb-2">Quantity:</p>
            <div className="flex items-center">
              <button
                onClick={() => setQty(qty > 1 ? qty - 1 : 1)}
                className="border border-gray-300 px-4 py-1 text-lg"
              >
                -
              </button>
              <span className="border border-gray-300 px-4 py-1 text-lg">
                {qty}
              </span>
              <button
                onClick={() => setQty(qty + 1)}
                className="border border-gray-300 px-4 py-1 text-lg"
              >
                +
              </button>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex gap-4 mt-6">
            <button className="bg-[#EDEDED] px-4 py-3 rounded-lg">
              <div className="relative inline-block ">
                <FiHeart size={28} />
                <GoPlus
                  size={14}
                  className="absolute bottom-1 -right-1 bg-white rounded-full"
                />
              </div>
            </button>
            <button className="bg-[#E9B159] w-full py-4 text-xl text-white flex items-center justify-center gap-4">
              <img src={cart} alt="add to bag" className="w-10" />
              <h2>Add to Bag</h2>
            </button>
            <button className="bg-[#03A685] w-full py-4 text-xl text-white">
              Buy Now
            </button>
          </div>
          <hr className="my-10 text-gray-400" />
          <div className="bg-[#EDEDED] rounded-lg">
            <ServicesSection />
          </div>
          <div>
            <ProductInfo product={product} />
          </div>
        </div>
      </div>

      {/* Similar Products */}
      <SimilarProductsSlider products={productList} />
      {/* More Products For Ethnic */}
      <MoreProducts products={productList} />

      {/* reviews */}
      <ReviewSection />
    </>
  );
};

export default ProductDetail;
