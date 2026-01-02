import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";

import { setSearch, setSubCategory, setCategory } from "../redux/filterSlice";
import { fetchAllProducts } from "../services/productService";

export const useProducts = () => {
  const dispatch = useDispatch();
  const [searchParams] = useSearchParams();

  const filters = useSelector((state) => state.filters);
  const productState = useSelector((state) => state.products);

  /*  URL → FILTER SYNC  */
  useEffect(() => {
    const search = searchParams.get("search") || "";
    const subCategory = searchParams.get("subcategory") || "";

    if (search !== filters.search) {
      dispatch(setSearch(search));
    }

    if (subCategory !== filters.subCategory) {
      dispatch(setSubCategory(subCategory));
      dispatch(setCategory(""));
    }
  }, [searchParams, dispatch]);

  /*  FETCH PRODUCTS  */
  useEffect(() => {
    dispatch(
      fetchAllProducts({
        search: filters.search,
        subCategory: filters.subCategory,
        sort: filters.sort,
        page: filters.page,
        limit: filters.limit,
        color: filters.color,
        maxPrice: filters.maxPrice,
        discount: filters.discount,
      })
    );
  }, [
    dispatch,
    filters.search,
    filters.subCategory,
    filters.sort,
    filters.page,
    filters.limit,
    filters.color,
    filters.maxPrice,
    filters.discount,
  ]);

  return {
    products: productState.products,
    loading: productState.loading,
    total: productState.total,
    pages: productState.pages,
    filters,
  };
};
