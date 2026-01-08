import { useRef } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import ProductCard from "./ProductCard";

const SimilarProductsSlider = ({ products }) => {
  const sliderRef = useRef(null);

  const slideLeft = () => {
    sliderRef.current.scrollLeft -= 350;
  };

  const slideRight = () => {
    sliderRef.current.scrollLeft += 350;
  };

  return (
    <div className="max-w-7xl mx-auto mt-10 relative">
      <h1 className="text-2xl font-semibold mb-4">Similar Products</h1>

      {/* Left Arrow */}
      <button
        onClick={slideLeft}
        className="hidden lg:block absolute -left-3 top-1/2 transform -translate-y-1/2 bg-white shadow-md p-2 rounded-full z-50"
      >
        <FaChevronLeft />
      </button>

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
      <button
        onClick={slideRight}
        className="hidden lg:block absolute -right-3 top-1/2 transform -translate-y-1/2 bg-white shadow-md p-2 rounded-full z-50"
      >
        <FaChevronRight />
      </button>
    </div>
  );
};

export default SimilarProductsSlider;
