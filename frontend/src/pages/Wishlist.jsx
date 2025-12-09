import React from "react";
import { breadcrumbRoutes } from "../utils/breadcrumbRoutes";
import RoutesSection from "../components/RoutesSection";
import { useSelector } from "react-redux";
import ProductCard from "../components/ProductCard";

const Wishlist = () => {
  const breadcrumb = [breadcrumbRoutes.home, breadcrumbRoutes.wishlist];
  const { wishlistItems } = useSelector((store) => store.wishlist);
  return (
    <>
      {/* routes section */}
      <RoutesSection breadcrumb={breadcrumb} />
      <div className="max-w-[90vw] mx-auto">
        <div className="flex items-center gap-4 mt-4">
          <h1 className="text-2xl">My Wishlist</h1>
          <p className="text-gray-500">{wishlistItems.length} products</p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 my-6 ">
          {wishlistItems.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </>
  );
};

export default Wishlist;
