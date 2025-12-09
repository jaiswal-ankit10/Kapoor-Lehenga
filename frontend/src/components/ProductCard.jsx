import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { addToWishlist, removeFromWishlist } from "../redux/wishListSlice";
import { addToCart } from "../redux/cartSlice";

const ProductCard = ({ product }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { wishlistItems } = useSelector((store) => store.wishlist);
  const isWishlisted = wishlistItems.some((item) => item.id === product.id);

  const toggleWishlist = (e) => {
    e.stopPropagation();
    if (isWishlisted) {
      dispatch(removeFromWishlist(product.id));
    } else {
      dispatch(addToWishlist(product));
    }
  };
  const addItemToCart = (e) => {
    e.stopPropagation();
    dispatch(addToCart(product));
  };
  return (
    <div
      onClick={() => navigate(`/products/${product.id}`)}
      className="w-[260px] shrink-0 h-[450px] hover:bg-white  hover:shadow-md overflow-hidden relative group cursor-pointer"
    >
      {/* Discount Ribbon */}
      {product.discount && (
        <span className="absolute top-2 left-2 bg-red-600 text-white text-xs px-2 py-1 rounded z-20 pointer-events-auto">
          {product.discount}% OFF
        </span>
      )}

      {/* Heart Icon */}
      <button
        onClick={toggleWishlist}
        className="absolute top-2 right-2 bg-white p-2 rounded-full shadow opacity-0 group-hover:opacity-100 duration-300 z-20"
      >
        {isWishlisted ? (
          <FaHeart className="text-red-500 text-lg" />
        ) : (
          <FaRegHeart className="text-gray-600 text-lg" />
        )}
      </button>

      {/* Slider */}
      <div className="relative h-90">
        <Swiper navigation={true} modules={[Navigation]} className="h-full ">
          {product.images.map((img, index) => (
            <SwiperSlide key={index}>
              <img
                src={img}
                alt="product"
                className="w-full h-full object-cover duration-300 "
              />
            </SwiperSlide>
          ))}
        </Swiper>

        {/* ADD TO CART */}
        <button
          onClick={addItemToCart}
          className="absolute bottom-4 left-7 w-[200px] bg-white py-2 font-semibold text-sm opacity-0 group-hover:opacity-100 duration-300 pointer-events-auto z-20"
        >
          {isWishlisted ? "Move to Bag" : "Add to Cart"}
        </button>
      </div>

      {/* Details */}
      <div className="p-3">
        <h3 className="text-sm font-semibold leading-tight">{product.title}</h3>

        <div className="flex items-center gap-2 mt-1">
          <span className="text-gray-500 line-through text-sm">
            ₹{product.oldPrice}
          </span>
          <span className="text-green-600 font-semibold text-lg">
            ₹{product.price}
          </span>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
