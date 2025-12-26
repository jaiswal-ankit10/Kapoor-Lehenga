import React, { useEffect } from "react";
import RoutesSection from "../components/RoutesSection";
import { breadcrumbRoutes } from "../utils/breadcrumbRoutes";

import ProductCard from "../components/ProductCard";
import Pagination from "../components/pagination";
import FAQs from "../components/Faqs";
import { fetchAllProducts } from "../services/productService";

import { useDispatch, useSelector } from "react-redux";
import { setCategory, setSort, setPage, setSearch } from "../redux/filterSlice";
import { useSearchParams } from "react-router-dom";
import FilterSidebar from "../components/FilterSidebar";
import { ToastContainer } from "react-toastify";

const Products = () => {
  const dispatch = useDispatch();
  const [searchParams] = useSearchParams();
  const { products, loading, error, total, pages, page } = useSelector(
    (store) => store.products
  );
  const filters = useSelector((store) => store.filters);

  const breadcrumb = [breadcrumbRoutes.home, breadcrumbRoutes.productPage];

  useEffect(() => {
    dispatch(fetchAllProducts(filters));
  }, [dispatch, filters]);

  useEffect(() => {
    const search = searchParams.get("search") || "";
    const category = searchParams.get("category") || "";

    if (search !== filters.search) {
      dispatch(setSearch(search));
    }

    if (category !== filters.category) {
      dispatch(setCategory(category));
    }
  }, [searchParams, dispatch]);

  const handleCategory = (value) => {
    dispatch(setCategory(value));
  };
  const handleSort = (value) => {
    dispatch(setSort(value));
  };

  const handlePageChange = (p) => {
    dispatch(setPage(p));
  };

  if (loading) return <p className="text-center py-10">Loading products...</p>;
  if (error) return <p className="text-center py-10 text-red-500">{error}</p>;

  return (
    <>
      <ToastContainer />
      {/* routes section */}
      <RoutesSection breadcrumb={breadcrumb} />

      {/* main section */}
      <div className="flex gap-6 px-10 py-6">
        {/* LEFT FILTERS */}
        <FilterSidebar
          onCategorySelect={handleCategory}
          selected={filters.category}
        />

        <div className="flex-1">
          {/* TOP HEADER */}
          <div className="flex flex-col md:flex-row justify-between items-center pb-4 ">
            <div>
              <h2 className="text-lg lg:text-2xl font-semibold capitalize">
                {filters.category
                  ? `${filters.category} Collection`
                  : "All Products"}
              </h2>
              <p className="text-sm text-gray-500 mt-1">
                Showing {products.length} of {total || products.length} results
              </p>
            </div>

            {/* Sort Dropdown */}
            <div className="relative flex gap-4 items-center">
              <h1>Sort By:</h1>
              <select
                className="bg-[#F5F4F4] px-3 py-2 rounded outline-0"
                value={filters.sort}
                onChange={(e) => handleSort(e.target.value)}
              >
                <option value="newest">Sort By Latest</option>
                <option value="price_asc">Sort By Low to High Price</option>
                <option value="price_desc">Sort By High to Low Price</option>
              </select>
            </div>
          </div>

          {/* PRODUCTS GRID */}
          <div className="grid grid-cols-2  lg:grid-cols-4 gap-6 mt-6 ">
            {products?.map((product) => (
              <ProductCard key={product._id || product.id} product={product} />
            ))}
          </div>
        </div>
      </div>
      {/* Pagination section */}
      <div className="flex items-center justify-center mb-20">
        <Pagination
          currentPage={page}
          totalPages={pages || 1}
          onPageChange={handlePageChange}
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
