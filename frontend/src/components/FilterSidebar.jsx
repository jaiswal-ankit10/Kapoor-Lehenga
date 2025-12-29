import React, { useEffect, useState } from "react";
import { FiChevronDown } from "react-icons/fi";
import axiosInstance from "../api/axiosInstance";
import { useDispatch, useSelector } from "react-redux";
import { setColor, setDiscount, setMaxPrice } from "../redux/filterSlice";
import { useNavigate } from "react-router-dom";

// const categories = ["LEHENGA", "SAREE", "KURTI", "GOWN", "SUIT", "DRESS"];

const FilterSidebar = ({ onCategorySelect, selected }) => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [colors, setColors] = useState([]);

  const [open, setOpen] = useState({
    category: true,
    price: false,
    color: false,
    discount: false,
  });

  const toggle = (key) => setOpen({ ...open, [key]: !open[key] });
  const dispatch = useDispatch();
  const maxPrice = useSelector((s) => s.filters.maxPrice);
  const selectedColor = useSelector((s) => s.filters.color);
  const discount = useSelector((s) => s.filters.discount);

  const handleCategory = (cat) => {
    if (!onCategorySelect) return;
    onCategorySelect(selected === cat ? "" : cat);
  };

  const toggleColor = (color) => {
    const updated = selectedColor.includes(color)
      ? selectedColor.filter((f) => f !== color)
      : [...selectedColor, color];

    dispatch(setColor(updated));
    navigate(`/products?color=${encodeURIComponent(updated)}`);
  };
  const handleDiscount = (value) => {
    dispatch(setDiscount(discount === value ? 0 : value));
    navigate(`/products?discount=${encodeURIComponent(value)}`);
  };

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axiosInstance.get("/products/categories");
        if (res.data.success) {
          setCategories(res.data.categories);
        }
      } catch (err) {
        console.error(err);
      }
    };

    fetchCategories();
  }, []);
  useEffect(() => {
    const fetchColors = async () => {
      try {
        const res = await axiosInstance.get("/products/colors");
        if (res.data.success) {
          setColors(res.data.colors);
        }
      } catch (err) {
        console.error(err);
      }
    };

    fetchColors();
  }, []);

  return (
    <div className="hidden md:block w-[250px]">
      <h3 className="text-lg font-semibold">Filter</h3>

      {/* Category */}
      <div className={`mt-4 ${open.category ? "bg-gray-100 p-2" : ""}`}>
        <button
          className="flex justify-between w-full"
          onClick={() => toggle("category")}
        >
          <span>Category</span>
          <FiChevronDown className={`${open.category && "rotate-180"}`} />
        </button>

        {open.category && (
          <div className="pl-2 mt-2 flex flex-col gap-2 overflow-hidden">
            {categories.map((cat) => (
              <label key={cat} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={selected === cat}
                  onChange={() => handleCategory(cat)}
                />
                <span className="capitalize">{cat}</span>
              </label>
            ))}
            <button
              type="button"
              onClick={() => handleCategory("")}
              className="text-xs text-gray-600 underline mt-1 text-left"
            >
              Clear
            </button>
          </div>
        )}
      </div>

      {/* Price */}
      <div className={`mt-4 ${open.price ? "bg-gray-100 p-2" : ""}`}>
        <button
          className="flex justify-between w-full"
          onClick={() => toggle("price")}
        >
          <span>Price</span>
          <FiChevronDown className={`${open.category && "rotate-180"}`} />
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
      {/* Color */}
      <div className={`mt-4 ${open.color ? "bg-gray-100 p-2" : ""}`}>
        <button
          className="flex justify-between w-full"
          onClick={() => toggle("color")}
        >
          <span>Color</span>
          <FiChevronDown className={`${open.category && "rotate-180"}`} />
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

      {/* Discount */}
      <div className={`mt-4 ${open.discount ? "bg-gray-100 p-2" : ""}`}>
        <button
          className="flex justify-between w-full"
          onClick={() => toggle("discount")}
        >
          <span>Discount</span>
          <FiChevronDown className={`${open.category && "rotate-180"}`} />
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
