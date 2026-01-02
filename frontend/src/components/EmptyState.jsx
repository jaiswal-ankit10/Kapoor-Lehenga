const EmptyState = ({ title, description }) => {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <img
        src="https://cdn-icons-png.flaticon.com/512/4076/4076549.png"
        alt="No products"
        className="w-28 mb-4 opacity-70"
      />
      <h2 className="text-lg font-semibold text-gray-700">{title}</h2>
      <p className="text-sm text-gray-500 mt-1 max-w-md">{description}</p>
    </div>
  );
};

export default EmptyState;
