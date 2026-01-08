import React, { useState, useEffect } from "react";
import { breadcrumbRoutes } from "../utils/breadcrumbRoutes";
import RoutesSection from "../components/RoutesSection";
import { useNavigate, useParams } from "react-router-dom";
import { fetchAllProducts, fetchProductById } from "../services/productService";
import { FaStar } from "react-icons/fa";
import cart from "../assets/icons/cart.png";
import ellipse from "../assets/images/Ellipse1.png";
import ellipse2 from "../assets/icons/Ellipse2.png";
import shoppingBag from "../assets/icons/shopping-bags1.png";
import carts from "../assets/icons/carts.png";
import onlineShopping from "../assets/icons/online-shopping.png";
import { FiHeart } from "react-icons/fi";
import { GoPlus } from "react-icons/go";
import ProductInfo from "../components/ProductInfo";
import SimilarProductsSlider from "../components/SimilarProductsSlider";
import MoreProducts from "../components/MoreProducts";
import ReviewSection from "../components/ReviewSection";
import { useDispatch, useSelector } from "react-redux";
import {
  addItemToBackendCart,
  updateQtyBackend,
  removeBackendCartItem,
  loadCartFromBackend,
} from "../services/cartService";
import {
  addItemToWishlist,
  removeFromWishlistBackend,
} from "../services/wishlistService";
import { toast, ToastContainer } from "react-toastify";
import { fetchCoupons } from "../redux/couponSlice";
import ServicesSectionProduct from "../components/ServicesSectionProduct";
import ProductDetailImages from "../components/MediumDeviceComponents/ProductDetailImages";

const ProductDetail = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { product, products, loading } = useSelector((state) => state.products);
  const { wishlistItems } = useSelector((state) => state.wishlist);
  const { cartItems } = useSelector((state) => state.cart);
  const { coupons } = useSelector((state) => state.coupon);

  const [selectedThumb, setSelectedThumb] = useState(null);
  const [qty, setQty] = useState(1);

  const imageBaseUrl = import.meta.env.VITE_BACKEND_URL;
  const resolveImage = (url) =>
    url?.startsWith("http") ? url : `${imageBaseUrl}${url}`;

  useEffect(() => {
    dispatch(fetchProductById(id));
  }, [dispatch, id]);

  useEffect(() => {
    dispatch(fetchCoupons());
  }, [dispatch]);
  useEffect(() => {
    if (!products || products.length === 0) {
      dispatch(fetchAllProducts());
    }
  }, [dispatch, products?.length]);

  useEffect(() => {
    if (product?.images?.length) {
      setSelectedThumb(product.images[0]);
    } else if (product?.thumbnail) {
      setSelectedThumb(product.thumbnail);
    }
  }, [product]);
  useEffect(() => {
    if (product && cartItems) {
      const item = cartItems.find((i) => i.product?.id === product.id);
      if (item?.quantity) {
        setQty(item.quantity);
      }
    }
  }, [product?.id, cartItems]);

  /*  EARLY RETURNS (CRITICAL)  */
  if (loading) return <p>Loading product...</p>;
  if (!product) return <p>Product not found</p>;

  /*  SAFE PRODUCT LOGIC  */
  const cartItem = cartItems?.find((item) => item.product?.id === product.id);

  const isInCart = Boolean(cartItem);
  const stock = product.stock ?? 0;
  const isOutOfStock = stock === 0;
  const isMaxQtyReached = qty >= stock;

  /*  ACTIONS  */
  const addItemToCart = async () => {
    if (isOutOfStock || isMaxQtyReached || isInCart) return;

    try {
      await dispatch(
        addItemToBackendCart({
          id: product.id,
          discountedPrice: product.discountedPrice,
          quantity: qty,
        })
      ).unwrap();

      toast.success("Item added to cart");
    } catch (error) {
      toast.error("Failed to add item to cart");
    }
  };
  const handleBuyNow = async () => {
    try {
      // 1. Only add to cart if it's NOT already there
      if (!isInCart) {
        await dispatch(
          addItemToBackendCart({
            id: product.id,
            discountedPrice: product.discountedPrice,
            quantity: qty,
          })
        ).unwrap();
      }

      // 2. Ensure Redux state is fully updated before moving
      await dispatch(loadCartFromBackend()).unwrap();

      // 3. Navigate to address
      navigate("/address");
    } catch (error) {
      console.error("Buy Now Error:", error);
      toast.error("Failed to proceed to checkout");
    }
  };

  const toggleWishlist = () => {
    const isWishlisted = wishlistItems.some(
      (item) => item.product?.id === product.id
    );

    if (isWishlisted) {
      dispatch(removeFromWishlistBackend(product.id));
    } else {
      dispatch(addItemToWishlist(product.id));
      toast("Added to wishlist");
    }
  };

  const handleCopy = (code) => {
    navigator.clipboard.writeText(code);
    toast("Code copied");
  };

  const breadcrumb = [
    breadcrumbRoutes.home,
    breadcrumbRoutes.productPage,
    breadcrumbRoutes.productDetails(product.title),
  ];

  return (
    <>
      <RoutesSection breadcrumb={breadcrumb} />
      <div className="max-w-xl lg:max-w-7xl mx-auto px-1 lg:px-10 py-10 flex gap-10 flex-col lg:flex-row">
        <ToastContainer />

        {/* LEFT PANEL for big screen  */}
        <div className="hidden  lg:sticky md:top-5 self-start lg:flex gap-6 flex-col lg:flex-row">
          <div className="flex gap-6 flex-row md:flex-col overflow-auto max-h-105 lg:max-h-155">
            {(product.images || [product.thumbnail])
              .filter(Boolean)
              .map((thumb, i) => (
                <img
                  key={i}
                  src={resolveImage(thumb)}
                  onClick={() => setSelectedThumb(thumb)}
                  className={`w-17.5 h-25 md:w-30 md:h-40 object-cover rounded cursor-pointer border ${
                    selectedThumb === thumb ? "border-black" : "border-gray-300"
                  }`}
                />
              ))}
          </div>

          {selectedThumb && (
            <img
              src={resolveImage(selectedThumb)}
              className="w-[320px] h-105 lg:w-112.5 lg:h-162.5 object-cover rounded"
            />
          )}
        </div>
        {/* Top PANEL for big screen  */}
        <div className="block lg:hidden w-full">
          <ProductDetailImages product={product} />
        </div>
        {/* RIGHT PANEL */}
        <div className="flex-1 mt-2">
          <h2 className="text-2xl md:text-3xl font-semibold">
            {product.title}
          </h2>

          <div
            className="prose prose-sm max-w-none text-gray-500 text-sm mt-2"
            dangerouslySetInnerHTML={{ __html: product.description }}
          />

          <div className="flex items-center gap-2 mt-3">
            <span className="border border-gray-500 text-black px-2 rounded text-sm flex items-center gap-1">
              {product.rating || 2.5} <FaStar className="text-xs" />
            </span>
            <p className="text-gray-500 text-sm">
              Based on {product.totalReviews} ratings
            </p>
          </div>

          {/* PRICE */}
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
                    className={`w-15 h-20 object-cover rounded cursor-pointer border ${
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
          <hr className="my-4 text-gray-300" />
          {/* Available Offers */}
          <h3 className="font-semibold mt-4">Available Offers</h3>
          <div className="mt-3 space-y-3">
            {coupons.map((offer) => (
              <div
                key={offer.id}
                className="border border-gray-200  flex  justify-between pr-4 items-center "
              >
                <div className="flex items-center gap-4 ">
                  <div className="relative">
                    <img src={ellipse} alt="coupon" className="w-40 h-22 " />
                    <p className="absolute top-4 left-8 z-10 text-[#FF3F4C] text-md sm:text-xl font-semibold">
                      Get {offer.title}
                    </p>
                    <img
                      src={shoppingBag}
                      alt=""
                      className="absolute top-0 left-2"
                    />
                    <img
                      src={carts}
                      alt=""
                      className="absolute top-0 right-3 w-5"
                    />
                    <img
                      src={onlineShopping}
                      alt=""
                      className="absolute bottom-0 left-0 w-7"
                    />
                    <img
                      src={ellipse2}
                      alt=""
                      className="absolute bottom-3 right-8"
                    />
                  </div>
                  <div>
                    <p className="font-semibold">{offer.title}</p>
                    <p className="text-gray-500 text-sm">
                      Use Code: {offer.code}
                    </p>
                  </div>
                </div>

                <button
                  className="border px-3 py-1 rounded text-sm cursor-pointer bg-black text-white"
                  onClick={() => handleCopy(offer.code)}
                >
                  COPY
                </button>
              </div>
            ))}
          </div>
          {/* QUANTITY  */}
          <div className="mt-6">
            <p className="font-semibold mb-2">Quantity:</p>
            <div className="flex items-center">
              <button
                className="border border-gray-300 px-4 py-1 text-lg cursor-pointer"
                onClick={() => {
                  if (qty === 1) {
                    if (isInCart) {
                      dispatch(removeBackendCartItem(product.id));
                    }
                    setQty(1);
                  } else {
                    const newQty = qty - 1;
                    setQty(newQty);
                    if (isInCart) {
                      dispatch(
                        updateQtyBackend({
                          productId: item.product.id,
                          quantity: newQty,
                        })
                      );
                    }
                  }
                }}
              >
                -
              </button>

              <span className="border border-gray-300 px-4 py-1 text-lg">
                {qty}
              </span>

              <button
                className="border border-gray-300 px-4 py-1 text-lg cursor-pointer"
                onClick={() => {
                  if (qty < stock) {
                    const newQty = qty + 1;
                    setQty(newQty);
                    if (isInCart) {
                      dispatch(
                        updateQtyBackend({
                          productId: item.product.id,
                          quantity: newQty,
                        })
                      );
                    }
                  }
                }}
                disabled={qty >= stock}
              >
                +
              </button>
            </div>

            {qty >= stock && stock > 0 && (
              <p className="text-xs text-red-500 mt-1">Maximum stock reached</p>
            )}
            {isOutOfStock && (
              <p className="text-xs text-red-500 mt-1">Out of stock</p>
            )}
          </div>

          {/* BUTTONS */}
          <div className="flex flex-col lg:flex-row gap-4 mt-6">
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
              disabled={isInCart || isOutOfStock || isMaxQtyReached}
              className={`bg-[#E9B159] w-full py-4 text-xl text-white flex items-center justify-center gap-4 ${
                isInCart
                  ? "bg-gray-600 cursor-not-allowed opacity-70"
                  : "hover:bg-[#d89f3f]"
              } cursor-pointer`}
            >
              <img src={cart} className="w-10" />
              <h2>
                {isOutOfStock
                  ? "Out of Stock"
                  : isInCart
                  ? "Added to Bag"
                  : "Add to Bag"}
              </h2>
            </button>

            <button
              onClick={handleBuyNow}
              className="bg-[#03A685] w-full py-4 text-xl text-white cursor-pointer"
            >
              Buy Now
            </button>
          </div>

          <div className="bg-[#EDEDED] rounded-lg mt-10">
            <ServicesSectionProduct />
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
