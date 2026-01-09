import { useState } from "react";

const usePagination = (data) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const totalPages = Math.ceil(data.length / rowsPerPage);

  const startIndex = (currentPage - 1) * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;

  return {
    totalPages,
    startIndex,
    endIndex,
    currentPage,
    setCurrentPage,
    setRowsPerPage,
  };
};

export default usePagination;
