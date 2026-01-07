import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";

import {
  setSearch,
  setSubCategory,
  setCategory,
  setSubCategories,
  setMinPrice,
  setMaxPrice,
} from "../redux/filterSlice";
import { fetchAllProducts } from "../services/productService";
import { useDebounce } from "./useDebounce";

export const useProducts = () => {
  const dispatch = useDispatch();
  const [searchParams, setSearchParams] = useSearchParams();

  const filters = useSelector((state) => state.filters);
  const productState = useSelector((state) => state.products);

  const debouncedMinPrice = useDebounce(filters.minPrice, 600);
  const debouncedMaxPrice = useDebounce(filters.maxPrice, 600);

  // sync url
  useEffect(() => {
    setSearchParams((prev) => {
      const params = new URLSearchParams(prev);

      // search
      filters.search
        ? params.set("search", filters.search)
        : params.delete("search");

      // category
      filters.category
        ? params.set("category", filters.category)
        : params.delete("category");

      // subCategory
      filters.subCategory.length
        ? params.set("subcategory", filters.subCategory.join(","))
        : params.delete("subcategory");

      // price
      params.set("price", `${filters.minPrice}-${filters.maxPrice}`);

      // color
      filters.color.length
        ? params.set("color", filters.color.join(","))
        : params.delete("color");

      // discount
      filters.discount
        ? params.set("discount", filters.discount)
        : params.delete("discount");

      return params;
    });
  }, [
    filters.search,
    filters.category,
    filters.subCategory,
    filters.minPrice,
    filters.maxPrice,
    filters.color,
    filters.discount,
  ]);

  /*  URL → FILTER SYNC  */
  useEffect(() => {
    const search = searchParams.get("search") || "";
    const category = searchParams.get("category") || "";
    const subParam = searchParams.get("subcategory");
    const subCategories = subParam ? subParam.split(",") : [];
    const priceParam = searchParams.get("price");

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
    if (priceParam) {
      const [min, max] = priceParam.split("-").map(Number);
      if (!isNaN(min) && !isNaN(max)) {
        dispatch(setMinPrice(min));
        dispatch(setMaxPrice(max));
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
        minPrice: debouncedMinPrice,
        maxPrice: debouncedMaxPrice,
        discount: filters.discount,
      })
    );
  }, [
    dispatch,
    filters.search,
    filters.category,
    filters.subCategory,
    filters.sort,
    filters.page,
    filters.limit,
    filters.color,
    filters.discount,
    debouncedMinPrice,
    debouncedMaxPrice,
  ]);

  return {
    products: productState.products,
    loading: productState.loading,
    total: productState.total,
    pages: productState.pages,
    filters,
  };
};
