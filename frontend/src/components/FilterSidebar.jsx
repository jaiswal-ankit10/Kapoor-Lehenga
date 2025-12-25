import React, { useEffect, useState } from "react";
import { FiChevronDown } from "react-icons/fi";
import axiosInstance from "../api/axiosInstance";

// const categories = ["LEHENGA", "SAREE", "KURTI", "GOWN", "SUIT", "DRESS"];

const FilterSidebar = ({ onCategorySelect, selected }) => {
  const [categories, setCategories] = useState([]);

  const [open, setOpen] = useState({
    category: true,
    fabric: false,
    price: false,
    color: false,
    rating: false,
    discount: false,
  });

  const toggle = (key) => setOpen({ ...open, [key]: !open[key] });

  const handleCategory = (cat) => {
    if (!onCategorySelect) return;
    onCategorySelect(selected === cat ? "" : cat);
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

      {/* Fabric */}
      <div className={`mt-4 ${open.fabric ? "bg-gray-100 p-2" : ""}`}>
        <button
          className="flex justify-between w-full"
          onClick={() => toggle("fabric")}
        >
          <span>Fabric</span>
          <FiChevronDown className={`${open.category && "rotate-180"}`} />
        </button>

        {open.fabric && (
          <div className="pl-2 mt-2 flex flex-col gap-1">
            <label>
              <input type="checkbox" /> Umbrella Lehenga
            </label>
            <label>
              <input type="checkbox" /> Silk Lehenga
            </label>
            <label>
              <input type="checkbox" /> Bridal Lehenga
            </label>
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
          <div className="pl-2 mt-2 flex flex-col gap-1">
            <label>
              <input type="checkbox" /> Umbrella Lehenga
            </label>
            <label>
              <input type="checkbox" /> Silk Lehenga
            </label>
            <label>
              <input type="checkbox" /> Bridal Lehenga
            </label>
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
          <div className="pl-2 mt-2 flex flex-col gap-1">
            <label>
              <input type="checkbox" /> Umbrella Lehenga
            </label>
            <label>
              <input type="checkbox" /> Silk Lehenga
            </label>
            <label>
              <input type="checkbox" /> Bridal Lehenga
            </label>
          </div>
        )}
      </div>
      {/* Rating */}
      <div className={`mt-4 ${open.rating ? "bg-gray-100 p-2" : ""}`}>
        <button
          className="flex justify-between w-full"
          onClick={() => toggle("rating")}
        >
          <span>Rating</span>
          <FiChevronDown className={`${open.category && "rotate-180"}`} />
        </button>

        {open.rating && (
          <div className="pl-2 mt-2 flex flex-col gap-1">
            <label>
              <input type="checkbox" /> Umbrella Lehenga
            </label>
            <label>
              <input type="checkbox" /> Silk Lehenga
            </label>
            <label>
              <input type="checkbox" /> Bridal Lehenga
            </label>
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
          <div className="pl-2 mt-2 flex flex-col gap-1">
            <label>
              <input type="checkbox" /> Umbrella Lehenga
            </label>
            <label>
              <input type="checkbox" /> Silk Lehenga
            </label>
            <label>
              <input type="checkbox" /> Bridal Lehenga
            </label>
          </div>
        )}
      </div>
    </div>
  );
};

export default FilterSidebar;
