import React from "react";
import { X } from "lucide-react";
import FilterSidebar from "./FilterSidebar";

const MobileFilterDrawer = ({
  open,
  onClose,
  selectedSubCategory,
  products,
}) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 md:hidden">
      {/* BACKDROP */}
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />

      {/* DRAWER */}
      <div
        className="absolute left-0 top-0 h-full w-[85%] bg-white shadow-lg
  transform transition-transform duration-300 translate-x-0"
      >
        {/* HEADER */}
        <div className="flex items-center justify-between px-4 py-3 border-b">
          <h3 className="text-lg font-semibold">Filters</h3>
          <button onClick={onClose}>
            <X size={22} />
          </button>
        </div>

        {/* CONTENT */}
        <div className="flex-1 overflow-y-auto px-4 py-3">
          <FilterSidebar
            selectedSubCategory={selectedSubCategory}
            products={products}
          />
        </div>

        {/* FOOTER */}
        <div className="border-t p-4">
          <button
            onClick={onClose}
            className="w-full bg-black text-white py-2 rounded text-sm"
          >
            Apply Filters
          </button>
        </div>
      </div>
    </div>
  );
};

export default MobileFilterDrawer;
