import React, { useEffect, useState, useMemo } from "react";
import { FiChevronDown, FiMinus, FiPlus } from "react-icons/fi";
import axiosInstance from "../api/axiosInstance";
import { useDispatch, useSelector } from "react-redux";
import {
  setColor,
  setDiscount,
  setMaxPrice,
  setMinPrice,
  setSubCategory,
} from "../redux/filterSlice";
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

  const minPrice = useSelector((s) => s.filters.minPrice);
  const maxPrice = useSelector((s) => s.filters.maxPrice);
  const selectedColor = useSelector((s) => s.filters.color);
  const discount = useSelector((s) => s.filters.discount);
  const selectedSubCategories = useSelector((s) => s.filters.subCategory);
  const activeCategory = useSelector((s) => s.filters.category);

  /*  FETCH CATEGORIES + SUBCATEGORIES  */
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

  /*  FETCH COLORS  */
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

  /*  DECIDE WHICH CATEGORIES TO SHOW  */
  const visibleCategories = useMemo(() => {
    if (!activeCategory) return categories;

    return categories.filter((cat) => cat.name === activeCategory);
  }, [categories, activeCategory]);

  /*  SUBCATEGORY CLICK  */
  const toggleSubCategory = (name) => {
    dispatch(setSubCategory(name));
  };

  /*  COLOR  */
  const toggleColor = (color) => {
    const updated = selectedColor.includes(color)
      ? selectedColor.filter((f) => f !== color)
      : [...selectedColor, color];

    dispatch(setColor(updated));
  };

  /*  DISCOUNT  */
  const handleDiscount = (value) => {
    dispatch(setDiscount(discount === value ? 0 : value));
  };

  return (
    <div className="w-[250px] md:w-[250px]">
      <h3 className="text-lg font-semibold">Filter</h3>

      {/*  CATEGORY / SUBCATEGORY  */}
      <div className={`mt-4 ${open.category ? "bg-[#F6F6F6] p-2" : ""}`}>
        {/* Header */}
        <div
          className="flex justify-between items-center px-2 py-3 cursor-pointer"
          onClick={() => toggle("category")}
        >
          <h3 className="text-md ">Sub Category</h3>
          {open.category ? <FiMinus size={18} /> : <FiPlus size={18} />}
        </div>

        <div className="border-t border-gray-200" />

        {/* Category List */}
        {open.category && (
          <div className="max-h-[260px] overflow-y-auto px-4 py-3 space-y-4">
            {visibleCategories.flatMap((cat) =>
              cat.subCategories.map((sc) => (
                <label
                  key={sc.id}
                  className="flex items-center gap-3 text-[15px] cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={selectedSubCategories.includes(sc.name)}
                    onChange={() => dispatch(setSubCategory(sc.name))}
                    className="w-5 h-5 border-gray-400"
                  />

                  <span className="text-gray-900 capitalize">{sc.name}</span>
                </label>
              ))
            )}
          </div>
        )}
      </div>

      {/*  PRICE  */}
      <div className={`mt-4 ${open.price ? "bg-[#F6F6F6] p-2" : ""}`}>
        <div
          className="flex justify-between items-center px-2 py-3 cursor-pointer"
          onClick={() => toggle("price")}
        >
          <h3 className="text-md ">Price</h3>
          {open.price ? <FiMinus size={18} /> : <FiPlus size={18} />}
        </div>

        <div className="border-t border-gray-200" />

        {open.price && (
          <>
            <div className="relative w-full h-6">
              {/* Track */}
              <div className="absolute w-full h-1 bg-gray-300 rounded top-1/2 -translate-y-1/2" />

              {/* Active Range */}
              <div
                className="absolute h-1 bg-[#E9B159] rounded top-1/2 -translate-y-1/2"
                style={{
                  left: `${(minPrice / 20000) * 100}%`,
                  right: `${100 - (maxPrice / 20000) * 100}%`,
                }}
              />

              {/* Min Range */}
              <input
                type="range"
                min="0"
                max="20000"
                step="500"
                value={minPrice}
                onChange={(e) =>
                  dispatch(
                    setMinPrice(Math.min(+e.target.value, maxPrice - 500))
                  )
                }
                className="absolute w-full h-6 pointer-events-none appearance-none bg-transparent z-20
                [&::-webkit-slider-thumb]:pointer-events-auto
                 [&::-webkit-slider-thumb]:appearance-none
                 [&::-webkit-slider-thumb]:w-4
                 [&::-webkit-slider-thumb]:h-4
                 [&::-webkit-slider-thumb]:rounded-full
                 [&::-webkit-slider-thumb]:bg-[#E9B159]
                 [&::-webkit-slider-thumb]:cursor-pointer"
              />

              {/* Max Range */}
              <input
                type="range"
                min="0"
                max="20000"
                step="500"
                value={maxPrice}
                onChange={(e) =>
                  dispatch(
                    setMaxPrice(Math.max(+e.target.value, minPrice + 500))
                  )
                }
                className="absolute w-full h-6 appearance-none bg-transparent pointer-events-none z-30
                [&::-webkit-slider-thumb]:pointer-events-auto
                 [&::-webkit-slider-thumb]:appearance-none
                 [&::-webkit-slider-thumb]:w-4
                 [&::-webkit-slider-thumb]:h-4
                 [&::-webkit-slider-thumb]:rounded-full
                 [&::-webkit-slider-thumb]:bg-[#E9B159]
                 [&::-webkit-slider-thumb]:cursor-pointer"
              />
            </div>
            <p className="text-sm mt-3 font-medium">
              ₹{minPrice.toLocaleString()} - ₹{maxPrice.toLocaleString()}+
            </p>
          </>
        )}
      </div>

      {/*  COLOR  */}
      <div className={`mt-4 ${open.color ? "bg-[#F6F6F6] p-2" : ""}`}>
        <div
          className="flex justify-between items-center px-2 py-3 cursor-pointer"
          onClick={() => toggle("color")}
        >
          <h3 className="text-md ">Color</h3>
          {open.color ? <FiMinus size={18} /> : <FiPlus size={18} />}
        </div>

        <div className="border-t border-gray-200" />

        {open.color && (
          <div className="pl-2 mt-2 flex flex-col gap-1 text-sm">
            {colors.map((color) => (
              <label key={color} className="flex items-center gap-2 capitalize">
                <input
                  type="checkbox"
                  checked={selectedColor.includes(color)}
                  onChange={() => toggleColor(color)}
                  className="w-5 h-5"
                />
                {color}
              </label>
            ))}
          </div>
        )}
      </div>

      {/*  DISCOUNT  */}
      <div className={`mt-4 ${open.discount ? "bg-[#F6F6F6] p-2" : ""}`}>
        <div
          className="flex justify-between items-center px-2 py-3 cursor-pointer"
          onClick={() => toggle("discount")}
        >
          <h3 className="text-md ">Discount</h3>
          {open.discount ? <FiMinus size={18} /> : <FiPlus size={18} />}
        </div>

        <div className="border-t border-gray-200" />

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
