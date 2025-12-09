import { productList } from "../utils/productList";
import ProductCard from "./ProductCard";

const NewArrival = () => {
  return (
    <div className="max-w-[85vw] mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-6">
      {productList.map((product, index) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
};

export default NewArrival;
