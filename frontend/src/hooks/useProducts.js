import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";

import {
  setSearch,
  setSubCategory,
  setCategory,
  setSubCategories,
} from "../redux/filterSlice";
import { fetchAllProducts } from "../services/productService";

export const useProducts = () => {
  const dispatch = useDispatch();
  const [searchParams] = useSearchParams();

  const filters = useSelector((state) => state.filters);
  const productState = useSelector((state) => state.products);

  /*  URL → FILTER SYNC  */
  useEffect(() => {
    const search = searchParams.get("search") || "";
    const category = searchParams.get("category") || "";
    const subParam = searchParams.get("subcategory");
    const subCategories = subParam ? subParam.split(",") : [];

    if (search !== filters.search) dispatch(setSearch(search));
    if (category && category !== "undefined" && category !== filters.category) {
      dispatch(setCategory(category));
    }

    if (subParam && subCategories.length) {
      if (
        JSON.stringify(subCategories) !== JSON.stringify(filters.subCategory)
      ) {
        dispatch(setSubCategories(subCategories));
      }
    }
  }, [searchParams]);

  /*  FETCH PRODUCTS  */
  useEffect(() => {
    dispatch(
      fetchAllProducts({
        search: filters.search,
        category: filters.category,
        subCategory: filters.subCategory,
        sort: filters.sort,
        page: filters.page,
        limit: filters.limit,
        color: filters.color,
        maxPrice: filters.maxPrice,
        discount: filters.discount,
      })
    );
  }, [filters]);

  return {
    products: productState.products,
    loading: productState.loading,
    total: productState.total,
    pages: productState.pages,
    filters,
  };
};
