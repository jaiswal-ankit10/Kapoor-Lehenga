import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { addItemToBackendCart } from "../services/cartService";
import {
  addItemToWishlist,
  removeFromWishlistBackend,
} from "../services/wishlistService";

const ProductCard = ({ product }) => {
  if (!product) return null;
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { wishlistItems } = useSelector((store) => store.wishlist);

  const actualProduct = product.product ? product.product : product;

  const productId = actualProduct._id || actualProduct.id;
  const imageBaseUrl = import.meta.env.VITE_BACKEND_URL;

  const isWishlisted = wishlistItems.some(
    (item) => item?.product?._id === productId || item?._id === productId
  );

  const toggleWishlist = (e) => {
    e.stopPropagation();
    if (isWishlisted) {
      dispatch(removeFromWishlistBackend(productId));
    } else {
      dispatch(addItemToWishlist(productId));
    }
  };

  const addItemToCart = (e) => {
    e.stopPropagation();
    dispatch(addItemToBackendCart(actualProduct));
  };

  return (
    <div
      onClick={() => navigate(`/products/${productId}`)}
      className="group w-[260px] shrink-0 overflow-hidden hover:shadow-xl duration-300 cursor-pointer relative bg-white"
    >
      {/* Wishlist Icon */}
      <button
        onClick={toggleWishlist}
        className="absolute top-3 right-3 bg-white p-2 rounded-full shadow z-30 opacity-0 group-hover:opacity-100 transition duration-300"
      >
        {isWishlisted ? (
          <FaHeart className="text-red-500 text-lg" />
        ) : (
          <FaRegHeart className="text-gray-700 text-lg" />
        )}
      </button>

      {/* Slider */}
      <div className="relative h-[330px]" onClick={(e) => e.stopPropagation()}>
        <Swiper navigation={true} modules={[Navigation]} className="h-full">
          {actualProduct?.images?.map((img, index) => (
            <SwiperSlide key={index}>
              <img
                src={img.startsWith("http") ? img : `${imageBaseUrl}${img}`}
                alt={actualProduct.title}
                className="w-full h-full object-cover"
              />
            </SwiperSlide>
          ))}
        </Swiper>

        {/* Add to Cart button */}
        <button
          onClick={addItemToCart}
          className="absolute bottom-4 left-7 w-[200px] bg-white py-2 font-semibold text-sm opacity-0 group-hover:opacity-100 duration-300 pointer-events-auto z-20 cursor-pointer"
        >
          {isWishlisted ? "Move to Bag" : "Add to Cart"}
        </button>
      </div>

      {/* Product Info */}
      <div className="p-3 text-left">
        <h3 className="font-semibold text-sm leading-tight">
          {actualProduct.title}
        </h3>

        <div className="flex items-center gap-3 mt-1">
          {actualProduct.price && (
            <span className="text-gray-400 line-through text-md">
              ₹{actualProduct.price}
            </span>
          )}
          <span className="text-green-600 font-semibold text-lg">
            ₹{actualProduct.discountedPrice}
          </span>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
