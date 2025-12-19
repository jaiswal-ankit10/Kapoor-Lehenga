import React, { useState, useEffect } from "react";
import { breadcrumbRoutes } from "../utils/breadcrumbRoutes";
import RoutesSection from "../components/RoutesSection";
import { useParams } from "react-router-dom";
import { fetchProductById } from "../services/productService";
import { FaStar } from "react-icons/fa";
import cart from "../assets/icons/cart.png";
import ServicesSection from "../components/ServicesSection";
import { FiHeart } from "react-icons/fi";
import { GoPlus } from "react-icons/go";
import ProductInfo from "../components/ProductInfo";
import SimilarProductsSlider from "../components/SimilarProductsSlider";
import MoreProducts from "../components/MoreProducts";
import ReviewSection from "../components/ReviewSection";
import { useDispatch, useSelector } from "react-redux";
import { addItemToBackendCart } from "../services/cartService";
import {
  addItemToWishlist,
  removeFromWishlistBackend,
} from "../services/wishlistService";

const ProductDetail = () => {
  const { id } = useParams();
  const dispatch = useDispatch();

  const { product, products, loading } = useSelector((store) => store.products);
  const { wishlistItems } = useSelector((store) => store.wishlist);

  const [selectedThumb, setSelectedThumb] = useState(null);
  const [stitchOption, setStitchOption] = useState("unstitched");
  const [qty, setQty] = useState(1);

  const isWishlisted = wishlistItems.some((item) => item.product?._id === id);
  const imageBaseUrl = import.meta.env.VITE_BACKEND_URL;
  const resolveImage = (url) => {
    if (!url) return "";
    return url.startsWith("http") ? url : `${imageBaseUrl}${url}`;
  };

  useEffect(() => {
    dispatch(fetchProductById(id));
  }, [dispatch, id]);

  useEffect(() => {
    if (product?.images?.length > 0) {
      setSelectedThumb(product.images[0]);
    } else if (product?.thumbnail) {
      setSelectedThumb(product.thumbnail);
    }
  }, [product]);

  if (loading) return <p>Loading product...</p>;
  if (!product) return <p>Product not found</p>;

  const addItemToCart = () => {
    dispatch(addItemToBackendCart(product));
  };

  const toggleWishlist = () => {
    if (isWishlisted) {
      dispatch(removeFromWishlistBackend(product._id));
    } else {
      dispatch(addItemToWishlist(product._id));
    }
  };

  const breadcrumb = [
    breadcrumbRoutes.home,
    breadcrumbRoutes.productPage,
    breadcrumbRoutes.productDetails(product.title),
  ];

  return (
    <>
      <RoutesSection breadcrumb={breadcrumb} />
      <div className="max-w-[85vw] mx-auto px-12 py-10 flex gap-10 flex-col md:flex-row">
        {/* Thumbnails */}
        <div className="flex flex-row md:flex-col gap-3">
          {(product?.images || [product?.thumbnail])
            .filter(Boolean)
            .map((thumb, i) => (
              <img
                key={i}
                src={resolveImage(thumb)}
                onClick={() => setSelectedThumb(thumb)}
                className={`w-[70px] h-[100px] md:w-[100px] md:h-[140px] object-cover rounded cursor-pointer border ${
                  selectedThumb === thumb ? "border-black" : "border-gray-300"
                }`}
              />
            ))}
        </div>

        {/* Main Image */}
        {selectedThumb && (
          <img
            src={resolveImage(selectedThumb)}
            className="w-[320px] h-[420px] md:w-[450px] md:h-[550px] object-fill rounded"
          />
        )}

        {/* Right Panel */}
        <div className="flex-1">
          <h2 className="text-3xl font-bold">{product.title}</h2>
          <div
            className="prose prose-sm max-w-none text-gray-500 text-sm mt-4"
            dangerouslySetInnerHTML={{ __html: product.description }}
          />

          <div className="flex items-center gap-2 mt-2">
            <span className="bg-green-600 text-white px-2 rounded text-sm flex items-center gap-1">
              {product.rating} <FaStar className="text-xs" />
            </span>
            <p className="text-gray-500 text-sm">
              Based on {product.totalReviews} reviews
            </p>
          </div>

          {/* Price */}
          <div className="mt-4">
            <div className="flex gap-4 items-center">
              <p className="text-xl font-bold line-through text-gray-500">
                ₹{product.price}
              </p>
              <p className="text-xl font-bold text-gray-700">
                ₹{product.discountedPrice}
              </p>
              <p className="text-green-500 text-xl">{product.discount}% Off</p>
            </div>
            <p className="text-gray-400 text-sm">Inclusive of all taxes</p>
          </div>

          <hr className="my-4 text-gray-300" />
          {/* Color Options */}
          <p className="text-sm font-semibold mt-6">Select Color</p>

          <div className="flex gap-2 mt-2">
            {(product?.images || [product?.thumbnail])
              .filter(Boolean)
              .map((color, index) => (
                <div key={index} className="relative">
                  <img
                    src={resolveImage(color)}
                    onClick={() => setSelectedThumb(color)}
                    className={`w-[60px] h-20 object-cover rounded cursor-pointer border ${
                      selectedThumb === color
                        ? "border-black"
                        : "border-gray-300"
                    }`}
                  />

                  {/* Circle Selection Indicator */}
                  {selectedThumb === color && (
                    <div className="absolute top-1 right-1 bg-white rounded-full p-0.5 border border-black" />
                  )}
                </div>
              ))}
          </div>

          {/* Available Offers */}
          <h3 className="font-semibold mt-6">Available Offers</h3>
          <div className="mt-3 space-y-3">
            {[
              {
                code: "NEW25",
                offer: "Get FLAT 25% OFF",
                desc: "On 1st New User Shopping",
              },
              { code: "NEW10", offer: "Flat 10% off", desc: "On All Orders" },
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
                className="border border-gray-300 px-4 py-1 text-lg"
                onClick={() => setQty((prev) => (prev > 1 ? prev - 1 : 1))}
              >
                -
              </button>
              <span className="border border-gray-300 px-4 py-1 text-lg">
                {qty}
              </span>
              <button
                className="border border-gray-300 px-4 py-1 text-lg"
                onClick={() => setQty((prev) => prev + 1)}
              >
                +
              </button>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex flex-col md:flex-row gap-4 mt-6 ">
            <button
              onClick={toggleWishlist}
              className="bg-[#EDEDED] px-4 py-3 rounded-lg cursor-pointer"
            >
              <div className="relative inline-block">
                <FiHeart size={28} />
                <GoPlus
                  size={14}
                  className="absolute bottom-1 -right-1 bg-white rounded-full"
                />
              </div>
            </button>

            <button
              onClick={addItemToCart}
              className="bg-[#E9B159] w-full py-4 text-xl text-white flex items-center justify-center gap-4 cursor-pointer"
            >
              <img src={cart} className="w-10" />
              <h2>Add to Bag</h2>
            </button>

            <button className="bg-[#03A685] w-full py-4 text-xl text-white cursor-pointer">
              Buy Now
            </button>
          </div>

          <hr className="my-10 text-gray-400" />
          <div className="bg-[#EDEDED] rounded-lg">
            <ServicesSection />
          </div>

          <ProductInfo product={product} />
        </div>
      </div>

      <SimilarProductsSlider products={products} />
      <MoreProducts products={products} />
      <ReviewSection />
    </>
  );
};

export default ProductDetail;
