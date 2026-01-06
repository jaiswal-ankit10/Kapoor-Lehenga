import React, { useState } from "react";
import RoutesSection from "../components/RoutesSection";
import { breadcrumbRoutes } from "../utils/breadcrumbRoutes";

import ProductCard from "../components/ProductCard";
import Pagination from "../components/pagination";
import FAQs from "../components/Faqs";
import FilterSidebar from "../components/FilterSidebar";
import MobileFilterDrawer from "../components/MobileFilterDrawer";
import EmptyState from "../components/EmptyState";

import { useProducts } from "../hooks/useProducts";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

import {
  setSort,
  setPage,
  setSubCategories,
  setSubCategory,
  setCategory,
} from "../redux/filterSlice";
import { ToastContainer } from "react-toastify";

const Products = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [openFilter, setOpenFilter] = useState(false);

  const { products, loading, pages, filters } = useProducts();

  const breadcrumb = [breadcrumbRoutes.home, breadcrumbRoutes.productPage];

  const handleSort = (value) => {
    dispatch(setSort(value));
  };

  const handlePageChange = (page) => {
    dispatch(setPage(page));
  };

  return (
    <>
      <ToastContainer />

      {/*  ROUTES / BREADCRUMB  */}
      <RoutesSection breadcrumb={breadcrumb} />

      {/*  MAIN SECTION  */}
      <div className="flex gap-6 px-4 lg:px-10 py-6">
        {/*  DESKTOP SIDEBAR  */}
        <div className="hidden md:flex sticky top-5 self-start">
          <FilterSidebar
            selectedSubCategory={filters.subCategory}
            products={products}
          />
        </div>

        {/*  RIGHT CONTENT  */}
        <div className="flex-1">
          {/*  TOP BAR  */}
          <div className="">
            <div className="flex justify-between items-center w-full">
              <h2 className="text-lg lg:text-2xl font-semibold capitalize">
                {filters.category
                  ? `${filters.category} Collection`
                  : "All Products"}
              </h2>
              <div className="flex items-center gap-2">
                <span className="text-sm">Sort By:</span>
                <select
                  className="bg-[#F5F4F4] px-3 py-2 rounded outline-0 text-sm"
                  value={filters.sort}
                  onChange={(e) => handleSort(e.target.value)}
                >
                  <option value="newest">Latest</option>
                  <option value="price_asc">Price: Low to High</option>
                  <option value="price_desc">Price: High to Low</option>
                </select>
              </div>
            </div>

            <div className="flex items-center gap-4">
              {/* MOBILE FILTER BUTTON */}
              <button
                onClick={() => setOpenFilter(true)}
                className="md:hidden border px-4 py-2 rounded text-sm"
              >
                Filters
              </button>
            </div>
            {filters.subCategory.length > 0 && (
              <div className="flex flex-wrap items-center gap-3 pt-2">
                {/* Clear All */}
                <button
                  onClick={() => {
                    dispatch(setSubCategories([]));
                    dispatch(setCategory(""));
                    navigate("/products", { replace: true });
                  }}
                  className="px-4 py-1.5 text-sm border border-gray-300 rounded-full bg-gray-100 cursor-pointer"
                >
                  Clear All
                </button>

                {/* Product Type Chips */}
                {filters.subCategory.map((sub) => (
                  <div
                    key={sub}
                    className="flex items-center gap-2 px-3 py-1.5 border border-dashed border-gray-400 rounded-full text-sm text-gray-700"
                  >
                    <span>
                      Product Type: <strong>{sub}</strong>
                    </span>
                    <button
                      onClick={() => dispatch(setSubCategory(sub))}
                      className="text-gray-500 hover:text-black cursor-pointer"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/*  PRODUCTS  */}

          {!loading && products.length === 0 && (
            <EmptyState
              title="No products found"
              description="Try changing filters or explore other categories."
            />
          )}

          {!loading && products.length > 0 && (
            <div
              className="grid gap-8 mt-6
  grid-cols-2
  sm:grid-cols-2
  md:grid-cols-[repeat(auto-fill,260px)]
  justify-start
"
            >
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </div>

      {/*  PAGINATION  */}
      {!loading && pages > 1 && (
        <div className="flex items-center justify-center mb-20">
          <Pagination
            currentPage={filters.page}
            totalPages={pages}
            onPageChange={handlePageChange}
          />
        </div>
      )}

      {/*  FAQS  */}
      <FAQs />

      {/*  MOBILE FILTER DRAWER  */}
      <MobileFilterDrawer
        open={openFilter}
        onClose={() => setOpenFilter(false)}
        selectedSubCategory={filters.subCategory}
        products={products}
      />
    </>
  );
};

export default Products;
