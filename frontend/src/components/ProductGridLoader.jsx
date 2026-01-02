const ProductGridLoader = () => {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mt-6">
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} className="h-80 bg-gray-200 animate-pulse rounded" />
      ))}
    </div>
  );
};

export default ProductGridLoader;
