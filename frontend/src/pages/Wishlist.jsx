import React, { useEffect } from "react";
import { breadcrumbRoutes } from "../utils/breadcrumbRoutes";
import RoutesSection from "../components/RoutesSection";
import { useDispatch, useSelector } from "react-redux";
import ProductCard from "../components/ProductCard";
import { loadWishlistFromBackend } from "../services/wishlistService";

const Wishlist = () => {
  const dispatch = useDispatch();
  const breadcrumb = [breadcrumbRoutes.home, breadcrumbRoutes.wishlist];
  const { wishlistItems } = useSelector((store) => store.wishlist);
  useEffect(() => {
    dispatch(loadWishlistFromBackend());
  }, []);

  return (
    <>
      <RoutesSection breadcrumb={breadcrumb} />

      <div className="max-w-7xl mx-auto">
        <div className="flex items-center gap-4 mt-4">
          <h1 className="text-2xl">My Wishlist</h1>
          <p className="text-gray-500">{wishlistItems.length} products</p>
        </div>

        {wishlistItems.length === 0 && (
          <p className="text-gray-500 mt-4">Your wishlist is empty.</p>
        )}

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 my-6">
          {wishlistItems?.map((item) => (
            <ProductCard key={item?.product?._id} product={item?.product} />
          ))}
        </div>
      </div>
    </>
  );
};

export default Wishlist;
