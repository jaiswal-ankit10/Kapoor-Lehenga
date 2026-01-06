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
import { toast, ToastContainer } from "react-toastify";
import { setSearch } from "../redux/filterSlice";

const ProductCard = ({ product }) => {
  if (!product) return null;
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { wishlistItems } = useSelector((store) => store.wishlist);
  const { isAuthenticated } = useSelector((store) => store.user);
  const { cartItems } = useSelector((store) => store.cart);

  const actualProduct = product.product ? product.product : product;

  const productId = actualProduct._id || actualProduct.id;
  const imageBaseUrl = import.meta.env.VITE_BACKEND_URL;
  const resolveImage = (url) =>
    url?.startsWith("http") ? url : `${imageBaseUrl}${url}`;

  const isWishlisted = wishlistItems.some(
    (item) => item?.product?.id === productId || item?.id === productId
  );
  const isInCart = cartItems.some((item) => item.product?.id === productId);

  const toggleWishlist = (e) => {
    e.stopPropagation();
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }
    if (isWishlisted) {
      dispatch(removeFromWishlistBackend(productId));
    } else {
      dispatch(addItemToWishlist(productId));
    }
  };

  const addItemToCart = async (e) => {
    e.stopPropagation();

    if (!isAuthenticated) {
      navigate("/login");
      return;
    }
    if (isInCart) {
      toast.info("Already in cart");
      return;
    }

    dispatch(
      addItemToBackendCart({
        id: product.id,
        discountedPrice: product.discountedPrice,
        quantity: 1,
      })
    );

    toast.success("Item added to cart");
  };

  const handleClick = () => {
    dispatch(setSearch(""));
    navigate(`/products/${productId}`);
  };

  return (
    <div
      onClick={handleClick}
      className="group w-[260px] shrink-0 overflow-hidden hover:shadow-xl duration-300 cursor-pointer relative bg-white"
    >
      {/* <ToastContainer /> */}
      {/* Wishlist Icon */}
      <button
        onClick={toggleWishlist}
        className="absolute top-3 right-3 bg-white p-2 rounded-full shadow z-30 opacity-0 group-hover:opacity-100 transition duration-300 cursor-pointer"
      >
        {isWishlisted ? (
          <FaHeart className="text-red-500 text-lg" />
        ) : (
          <FaRegHeart className="text-gray-700 text-lg" />
        )}
      </button>

      {/* Slider */}
      <div className="relative h-[340px]" onClick={(e) => e.stopPropagation()}>
        <Swiper
          navigation={true}
          modules={[Navigation]}
          className="w-full h-full product-swiper"
        >
          {(actualProduct?.images || [actualProduct?.thumbnail])
            ?.filter(Boolean)
            .map((img, index) => (
              <SwiperSlide key={index}>
                <img
                  src={resolveImage(img)}
                  alt={actualProduct.title}
                  className="w-full h-full object-cover"
                />
              </SwiperSlide>
            ))}
        </Swiper>

        {/* Add to Cart button */}
        <button
          onClick={addItemToCart}
          className="absolute bottom-4 left-1/2 -translate-x-1/2 w-[80%] max-w-[200px] bg-white py-2 font-semibold text-sm opacity-0 group-hover:opacity-100 duration-300 z-20 cursor-pointer"
        >
          {isWishlisted ? "Move to Bag" : "Add to Cart"}
        </button>
      </div>

      {/* Product Info */}
      <div className="p-3 text-left">
        <h3 className="font-medium text-md leading-tight">
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
