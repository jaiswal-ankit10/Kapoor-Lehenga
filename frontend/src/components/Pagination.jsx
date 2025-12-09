import React from "react";

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  const pages = [];

  for (let i = 1; i <= totalPages; i++) {
    if (
      i === 1 ||
      i === 2 ||
      i === totalPages ||
      i === currentPage - 1 ||
      i === currentPage ||
      i === currentPage + 1
    ) {
      pages.push(i);
    } else if (pages[pages.length - 1] !== "...") {
      pages.push("...");
    }
  }

  return (
    <div className="flex items-center gap-3 mt-6">
      {pages.map((page, i) =>
        page === "..." ? (
          <span key={i} className="text-gray-400">
            ...
          </span>
        ) : (
          <button
            key={i}
            onClick={() => onPageChange(page)}
            className={`px-3 py-1 border rounded ${
              currentPage === page
                ? "bg-gray-700 text-white"
                : "text-gray-600 hover:bg-gray-200"
            }`}
          >
            {page}
          </button>
        )
      )}

      {currentPage < totalPages && (
        <button
          onClick={() => onPageChange(currentPage + 1)}
          className="px-3 py-1 border rounded text-gray-600 hover:bg-gray-200"
        >
          Next &gt;
        </button>
      )}
    </div>
  );
};

export default Pagination;
