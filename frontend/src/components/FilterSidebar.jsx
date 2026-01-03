import React, { useEffect, useState, useMemo } from "react";
import { FiChevronDown, FiMinus, FiPlus } from "react-icons/fi";
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

  /*  FIND ACTIVE PARENT CATEGORY  */
  const activeCategoryId = useMemo(() => {
    if (!selectedSubCategory || !products?.length) return null;

    const product = products.find(
      (p) => p.subCategory?.name === selectedSubCategory
    );

    return product?.subCategory?.category?.id || null;
  }, [selectedSubCategory, products]);

  /*  DECIDE WHICH CATEGORIES TO SHOW  */
  const visibleCategories = useMemo(() => {
    // Case 1: All products → show all categories
    if (!selectedSubCategory) return categories;

    // Case 2: Filtered → show only parent category
    return categories.filter((cat) => cat.id === activeCategoryId);
  }, [categories, selectedSubCategory, activeCategoryId]);

  /*  SUBCATEGORY CLICK  */
  const handleSubCategoryClick = (sc) => {
    navigate(`/products?subcategory=${encodeURIComponent(sc.name)}`);
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
      {/* ================= CATEGORY ================= */}
      <div className={`mt-4 ${open.category ? "bg-[#F6F6F6] p-2" : ""}`}>
        {/* Header */}
        <div
          className="flex justify-between items-center px-2 py-3 cursor-pointer"
          onClick={() => toggle("category")}
        >
          <h3 className="text-md ">Category</h3>
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
                    checked={selectedSubCategory === sc.name}
                    onChange={() => handleSubCategoryClick(sc)}
                    className="w-5 h-5 border-gray-400"
                  />

                  <span className="text-gray-900">
                    {sc.name}
                    <span className="text-gray-500">
                      {" "}
                      ({sc.productCount || 0})
                    </span>
                  </span>
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
