import React, { useEffect, useState } from "react";
import RoutesSection from "../components/RoutesSection";
import { breadcrumbRoutes } from "../utils/breadcrumbRoutes";
import FilterSidebar from "../components/FilterSideBar";
import ProductCard from "../components/ProductCard";
import Pagination from "../components/pagination";
import FAQs from "../components/Faqs";
import { fetchAllProducts } from "../services/productService";

import { useDispatch, useSelector } from "react-redux";

const Products = () => {
  const dispatch = useDispatch();
  const { products, loading, error } = useSelector((store) => store.products);
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = 25;

  const breadcrumb = [breadcrumbRoutes.home, breadcrumbRoutes.productPage];
  const [sort, setSort] = useState("latest");

  const sortedProducts = [...products].sort((a, b) => {
    if (sort === "low-to-high") return a.price - b.price;
    if (sort === "high-to-low") return b.price - a.price;
    return b.id - a.id; // latest
  });
  useEffect(() => {
    try {
      dispatch(fetchAllProducts());
    } catch (error) {
      console.log("Error fetching Product");
    }
  }, [dispatch]);
  if (loading) return <p className="text-center py-10">Loading products...</p>;
  if (error) return <p className="text-center py-10 text-red-500">{error}</p>;

  return (
    <>
      {/* routes section */}
      <RoutesSection breadcrumb={breadcrumb} />

      {/* main section */}
      <div className="flex gap-6 px-10 py-6">
        {/* LEFT FILTERS */}
        <FilterSidebar />

        <div className="flex-1">
          {/* TOP HEADER */}
          <div className="flex justify-between items-center pb-4 ">
            <div>
              <h2 className="text-2xl font-semibold">
                Lehenga Wedding Dresses Collection
              </h2>
              <p className="text-sm text-gray-500 mt-1">
                Showing {sortedProducts.length} results
              </p>
            </div>

            {/* Sort Dropdown */}
            <div className="relative flex gap-4 items-center">
              <h1>Sort By:</h1>
              <select
                className="bg-[#F5F4F4] px-3 py-2 rounded outline-0"
                onChange={(e) => setSort(e.target.value)}
              >
                <option value="latest">Sort By Latest</option>
                <option value="low-to-high">Sort By Low to High Price</option>
                <option value="high-to-low">Sort By High to Low Price</option>
              </select>
            </div>
          </div>

          {/* PRODUCTS GRID */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-6">
            {sortedProducts?.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </div>
      {/* Pagination section */}
      <div className="flex items-center justify-center mb-20">
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      </div>
      {/* FAQS */}
      <div>
        <FAQs />
      </div>
    </>
  );
};

export default Products;
