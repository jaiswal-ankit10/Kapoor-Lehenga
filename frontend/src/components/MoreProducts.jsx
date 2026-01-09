import { useEffect, useRef, useState } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import ProductCard from "./ProductCard";

const MoreProducts = ({ products }) => {
  const sliderRef = useRef(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);

  const toggleArrows = () => {
    if (sliderRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = sliderRef.current;

      // Show left arrow if we have scrolled at least 1px
      setShowLeftArrow(scrollLeft > 0);

      // Show right arrow if there is still content hidden to the right
      // We use -1 to account for potential sub-pixel rounding issues
      setShowRightArrow(scrollLeft + clientWidth < scrollWidth - 1);
    }
  };

  useEffect(() => {
    const slider = sliderRef.current;
    if (slider) {
      // Check on initial load and whenever the user scrolls
      toggleArrows();
      slider.addEventListener("scroll", toggleArrows);

      // Also check if window resizes (which changes clientWidth)
      window.addEventListener("resize", toggleArrows);
    }

    return () => {
      if (slider) {
        slider.removeEventListener("scroll", toggleArrows);
        window.removeEventListener("resize", toggleArrows);
      }
    };
  }, [products]);

  const slide = (offset) => {
    if (sliderRef.current) {
      sliderRef.current.scrollLeft += offset;
    }
  };

  return (
    <div className="max-w-7xl mx-auto mt-10 relative">
      <h1 className="text-2xl font-semibold mb-4">More Products</h1>

      {/* Left Arrow */}
      {showLeftArrow && (
        <button
          onClick={sliderRef}
          className="hidden lg:block absolute -left-1 top-1/2 transform -translate-y-1/2 bg-white shadow-md p-2 rounded-full z-50 cursor-pointer"
        >
          <FaChevronLeft />
        </button>
      )}

      {/* Slider */}
      <div
        ref={sliderRef}
        className="flex gap-6 overflow-x-auto md:overflow-x-hidden scroll-smooth scrollbar-hide px-4 md:px-0"
      >
        {products?.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      {/* Right Arrow */}
      {showRightArrow && (
        <button
          onClick={() => slide(350)}
          className="hidden lg:flex absolute right-0 top-1/2 transform -translate-y-1/2 bg-white shadow-lg p-3 rounded-full z-50 cursor-pointer hover:bg-gray-100 transition-all items-center justify-center border border-gray-200"
        >
          <FaChevronRight />
        </button>
      )}
    </div>
  );
};

export default MoreProducts;
