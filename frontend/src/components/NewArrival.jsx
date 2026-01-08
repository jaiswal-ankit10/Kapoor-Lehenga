import { useDispatch, useSelector } from "react-redux";
import ProductCard from "./ProductCard";
import { useEffect, useState } from "react";
import { fetchNewProducts } from "../services/productService";

const NewArrival = () => {
  const dispatch = useDispatch();
  const { products, loading, error } = useSelector((store) => store.products);
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    dispatch(fetchNewProducts());
  }, [dispatch]);

  if (loading) return <p>Loading products...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  // Logic:
  // Desktop has 5 columns, so 2 rows = 10 items.
  // Mobile has 2 columns, so 2 rows = 4 items.
  // We will use a dynamic limit based on screen width if needed,
  // or a standard 4-item limit for mobile 2x2.

  const getLimit = () => {
    if (window.innerWidth < 768) return 4; // 2 columns x 2 rows
    return 10; // 5 columns x 2 rows
  };

  const visibleProducts = showAll ? products : products.slice(0, getLimit());

  return (
    <div className="px-4 md:px-0">
      {/* Mobile Grid  */}
      <div className="grid grid-cols-2 gap-3 md:hidden">
        {visibleProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      {/* Desktop Grid */}
      <div
        className="hidden md:grid
           grid-cols-[repeat(auto-fill,minmax(240px,1fr))]
          gap-6
          max-w-8xl mx-auto
        "
      >
        {visibleProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      {/* Toggle Button */}
      <div className="w-full flex justify-center mt-6">
        <button
          onClick={() => setShowAll(!showAll)}
          className="bg-black text-white px-8 py-2 cursor-pointer uppercase text-sm hover:bg-gray-800 transition-all active:scale-95"
        >
          {showAll ? "View Less" : "View All"}
        </button>
      </div>
    </div>
  );
};

export default NewArrival;
