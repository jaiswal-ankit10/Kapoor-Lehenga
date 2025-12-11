import { useDispatch, useSelector } from "react-redux";
import ProductCard from "./ProductCard";
import { useEffect } from "react";
import { fetchAllProducts } from "../services/productService";

const NewArrival = () => {
  const dispatch = useDispatch();
  const { products, loading, error } = useSelector((store) => store.products);

  useEffect(() => {
    dispatch(fetchAllProducts());
  }, [dispatch]);

  if (loading) return <p>Loading products...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="max-w-[85vw] mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-6">
      {products.length > 0 &&
        products.map((product) => (
          <ProductCard key={product._id} product={product} />
        ))}
    </div>
  );
};

export default NewArrival;
