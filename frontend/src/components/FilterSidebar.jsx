import React, { useEffect, useState, useMemo } from "react";
import { FiChevronDown } from "react-icons/fi";
import axiosInstance from "../api/axiosInstance";
import { useDispatch, useSelector } from "react-redux";
import { setColor, setDiscount, setMaxPrice } from "../redux/filterSlice";
import { useNavigate } from "react-router-dom";

const FilterSidebar = ({ selectedSubCategory, products }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [categories, setCategories] = useState([]);
  const [colors, setColors] = useState([]);

  const [open, setOpen] = useState({
    category: true,
    price: false,
    color: false,
    discount: false,
  });

  const toggle = (key) => setOpen({ ...open, [key]: !open[key] });

  const maxPrice = useSelector((s) => s.filters.maxPrice);
  const selectedColor = useSelector((s) => s.filters.color);
  const discount = useSelector((s) => s.filters.discount);

  /* ---------- FETCH CATEGORIES + SUBCATEGORIES ---------- */
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axiosInstance.get("/categories");
        setCategories(res.data.categories || []);
      } catch (err) {
        console.error(err);
      }
    };
    fetchCategories();
  }, []);

  /* ---------- FETCH COLORS ---------- */
  useEffect(() => {
    const fetchColors = async () => {
      try {
        const res = await axiosInstance.get("/products/colors");
        if (res.data.success) setColors(res.data.colors);
      } catch (err) {
        console.error(err);
      }
    };
    fetchColors();
  }, []);

  /* ================= FIND ACTIVE PARENT CATEGORY ================= */
  const activeCategoryId = useMemo(() => {
    if (!selectedSubCategory || !products?.length) return null;

    const product = products.find(
      (p) => p.subCategory?.name === selectedSubCategory
    );

    return product?.subCategory?.category?.id || null;
  }, [selectedSubCategory, products]);

  /* ================= DECIDE WHICH CATEGORIES TO SHOW ================= */
  const visibleCategories = useMemo(() => {
    // Case 1: All products → show all categories
    if (!selectedSubCategory) return categories;

    // Case 2: Filtered → show only parent category
    return categories.filter((cat) => cat.id === activeCategoryId);
  }, [categories, selectedSubCategory, activeCategoryId]);

  /* ---------- SUBCATEGORY CLICK ---------- */
  const handleSubCategoryClick = (sc) => {
    navigate(`/products?subcategory=${encodeURIComponent(sc.name)}`);
  };

  /* ---------- COLOR ---------- */
  const toggleColor = (color) => {
    const updated = selectedColor.includes(color)
      ? selectedColor.filter((f) => f !== color)
      : [...selectedColor, color];

    dispatch(setColor(updated));
  };

  /* ---------- DISCOUNT ---------- */
  const handleDiscount = (value) => {
    dispatch(setDiscount(discount === value ? 0 : value));
  };

  return (
    <div className="w-[250px] md:w-[250px]">
      <h3 className="text-lg font-semibold">Filter</h3>

      {/* ================= CATEGORY / SUBCATEGORY ================= */}
      <div className={`mt-4 ${open.category ? "bg-gray-100 p-2" : ""}`}>
        <button
          className="flex justify-between w-full"
          onClick={() => toggle("category")}
        >
          <span>Category</span>
          <FiChevronDown className={`${open.category && "rotate-180"}`} />
        </button>

        {open.category && (
          <div className="pl-2 mt-2 flex flex-col gap-3">
            {visibleCategories.map((cat) => (
              <div key={cat.id}>
                <p className="text-sm font-medium uppercase mb-1">{cat.name}</p>

                <div className="flex flex-col gap-1 pl-2">
                  {cat.subCategories.map((sc) => (
                    <label
                      key={sc.id}
                      className="flex items-center gap-2 text-sm capitalize cursor-pointer"
                    >
                      <input
                        type="radio"
                        checked={selectedSubCategory === sc.name}
                        onChange={() => handleSubCategoryClick(sc)}
                      />
                      {sc.name}
                    </label>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ================= PRICE ================= */}
      <div className={`mt-4 ${open.price ? "bg-gray-100 p-2" : ""}`}>
        <button
          className="flex justify-between w-full"
          onClick={() => toggle("price")}
        >
          <span>Price</span>
          <FiChevronDown className={`${open.price && "rotate-180"}`} />
        </button>

        {open.price && (
          <div className="pl-2 mt-3">
            <div className="flex justify-between text-sm text-gray-600 mb-2">
              <span>₹0</span>
              <span>₹{maxPrice}</span>
              <span>₹20,000</span>
            </div>

            <input
              type="range"
              min="0"
              max="20000"
              step="500"
              value={maxPrice}
              onChange={(e) => dispatch(setMaxPrice(Number(e.target.value)))}
              className="w-full accent-black cursor-pointer"
            />
          </div>
        )}
      </div>

      {/* ================= COLOR ================= */}
      <div className={`mt-4 ${open.color ? "bg-gray-100 p-2" : ""}`}>
        <button
          className="flex justify-between w-full"
          onClick={() => toggle("color")}
        >
          <span>Color</span>
          <FiChevronDown className={`${open.color && "rotate-180"}`} />
        </button>

        {open.color && (
          <div className="pl-2 mt-2 flex flex-col gap-1 text-sm">
            {colors.map((color) => (
              <label key={color} className="flex items-center gap-2 capitalize">
                <input
                  type="checkbox"
                  checked={selectedColor.includes(color)}
                  onChange={() => toggleColor(color)}
                />
                {color}
              </label>
            ))}
          </div>
        )}
      </div>

      {/* ================= DISCOUNT ================= */}
      <div className={`mt-4 ${open.discount ? "bg-gray-100 p-2" : ""}`}>
        <button
          className="flex justify-between w-full"
          onClick={() => toggle("discount")}
        >
          <span>Discount</span>
          <FiChevronDown className={`${open.discount && "rotate-180"}`} />
        </button>

        {open.discount && (
          <div className="pl-2 mt-2 flex flex-col gap-1 text-sm">
            {[10, 20, 30, 40, 50, 60, 70, 80].map((value) => (
              <label key={value} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={discount === value}
                  onChange={() => handleDiscount(value)}
                />
                {value}% and above
              </label>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default FilterSidebar;
