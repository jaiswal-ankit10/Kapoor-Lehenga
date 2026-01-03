import React, { useState } from "react";
import RoutesSection from "../components/RoutesSection";
import { breadcrumbRoutes } from "../utils/breadcrumbRoutes";

import ProductCard from "../components/ProductCard";
import Pagination from "../components/pagination";
import FAQs from "../components/Faqs";
import FilterSidebar from "../components/FilterSidebar";
import ProductGridLoader from "../components/ProductGridLoader";
import MobileFilterDrawer from "../components/MobileFilterDrawer";
import EmptyState from "../components/EmptyState";

import { useProducts } from "../hooks/useProducts";
import { useDispatch } from "react-redux";
import { setSort, setPage } from "../redux/filterSlice";
import { ToastContainer } from "react-toastify";

const Products = () => {
  const dispatch = useDispatch();
  const [openFilter, setOpenFilter] = useState(false);

  const { products, loading, total, pages, filters } = useProducts();

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
        <div className="hidden md:block">
          <FilterSidebar
            selectedSubCategory={filters.subCategory}
            products={products}
          />
        </div>

        {/*  RIGHT CONTENT  */}
        <div className="flex-1">
          {/*  TOP BAR  */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center pb-4 gap-4">
            <div>
              <h2 className="text-lg lg:text-2xl font-semibold capitalize">
                {filters.subCategory
                  ? `${filters.subCategory} Collection`
                  : "All Products"}
              </h2>

              <p className="text-sm text-gray-500 mt-1">
                Showing {products.length} of {total || products.length} results
              </p>
            </div>

            <div className="flex items-center gap-4">
              {/* MOBILE FILTER BUTTON */}
              <button
                onClick={() => setOpenFilter(true)}
                className="md:hidden border px-4 py-2 rounded text-sm"
              >
                Filters
              </button>

              {/* SORT */}
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
          </div>

          {/*  PRODUCTS  */}
          {loading && <ProductGridLoader />}

          {!loading && products.length === 0 && (
            <EmptyState
              title="No products found"
              description="Try changing filters or explore other categories."
            />
          )}

          {!loading && products.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-6">
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
