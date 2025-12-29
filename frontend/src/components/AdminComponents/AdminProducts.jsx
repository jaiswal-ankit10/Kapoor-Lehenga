import React, { useEffect, useState } from "react";
import axiosInstance from "../../api/axiosInstance";
import AddProductForm from "./AddProductForm";
import { deleteProductById } from "../../services/productService";
import { useDispatch } from "react-redux";
import { breadcrumbAdmin } from "../../utils/breadcrumbRoutes";
import PageHeader from "./PageHeader";
import { Edit, Plus, Search, Trash } from "lucide-react";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const fetchProducts = async () => {
    try {
      const res = await axiosInstance.get("/admin/products?sort=newest");
      if (res.data.success) setProducts(res.data.products || []);
    } catch (err) {
      console.error(err);
    }
  };

  //pagination
  const totalPages = Math.ceil(products.length / rowsPerPage);

  const startIndex = (currentPage - 1) * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;

  const visibleProducts = products.slice(startIndex, endIndex);

  const handleDelete = (e, p) => {
    e.preventDefault();
    if (!window.confirm("Are you sure you want to delete this product?"))
      return;

    dispatch(deleteProductById(p._id));
    fetchProducts();
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const breadcrumb = [breadcrumbAdmin.home, breadcrumbAdmin.product];

  return (
    <div>
      <div>
        <PageHeader
          title={"Product List"}
          breadcrumbs={breadcrumb}
          buttonText={"Add Product"}
          Icon={Plus}
          handleClick={() => navigate("/admin/productform")}
          buttonBg={"bg-[#E9B159]"}
          buttonTextColor={"text-white"}
        />
      </div>
      <div className="bg-white p-4 rounded shadow">
        <div className="flex flex-wrap gap-4 items-center justify-between p-5 ">
          <div className="flex gap-4">
            <select className="border border-gray-300 rounded-md px-3  py-2 text-sm text-gray-600">
              <option>Action</option>
              <option>Active All</option>
              <option>Deactive All</option>
              <option>Delete All</option>
            </select>
            <select
              className="border border-gray-300 rounded-md px-3  py-2 text-sm text-gray-600 outline-none"
              value={rowsPerPage}
              onChange={(e) => {
                setRowsPerPage(Number(e.target.value));
                setCurrentPage(1);
              }}
            >
              <option value={5}>5 rows</option>
              <option value={10}>10 rows</option>
              <option value={20}>20 rows</option>
              <option value={50}>50 rows</option>
            </select>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative">
              <Search
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <input
                placeholder="Search"
                className="pl-9 pr-4 py-2 border border-gray-300 rounded-md text-sm w-40 md:w-64"
              />
            </div>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left table-auto">
            <thead className="bg-gray-50 text-gray-500">
              <tr className="text-sm text-gray-500">
                <th className="px-5 py-3 text-center whitespace-nowrap min-w-max">
                  ACTION
                </th>
                <th className="px-5 py-3 text-center whitespace-nowrap min-w-max">
                  PRODUCT NAME
                </th>
                <th className="px-5 py-3 text-center whitespace-nowrap min-w-max">
                  BRAND NAME
                </th>
                <th className="px-5 py-3 text-center whitespace-nowrap min-w-max">
                  PRODUCT THUMBNAIL IMAGE
                </th>
                <th className="px-5 py-3 text-center whitespace-nowrap min-w-max">
                  PRODUCT STOCK
                </th>
                <th className="px-5 py-3 text-center whitespace-nowrap min-w-max">
                  PRODUCT MRP
                </th>
                <th className="px-5 py-3 text-center whitespace-nowrap min-w-max">
                  PRODUCT PRICE
                </th>
                <th className="px-5 py-3 text-center whitespace-nowrap min-w-max">
                  PRODUCT DISCOUNT
                </th>
                <th className="px-15 py-3 text-center whitespace-nowrap min-w-max">
                  UPDATED AT
                </th>
              </tr>
            </thead>
            <tbody>
              {visibleProducts.map((p) => (
                <tr key={p._id} className="border-t border-gray-300">
                  <td className="px-5 py-4 flex items-center gap-2">
                    <div
                      className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center"
                      onClick={() =>
                        navigate("/admin/productform", {
                          state: { product: p },
                        })
                      }
                    >
                      <Edit size={16} className="text-green-950" />
                    </div>
                    <div
                      className="w-9 h-9 rounded-full bg-red-100 flex items-center justify-center"
                      onClick={handleDelete}
                    >
                      <Trash size={16} className="text-red-700" />
                    </div>
                  </td>
                  <td className="py-2 px-5 text-center">{p.title}</td>
                  <td className="py-2 px-5 text-center">{p.brand}</td>
                  <td className="py-2 px-5 text-center">
                    <div className="flex items-center justify-center ">
                      <img
                        src={p.thumbnail}
                        alt={p.title}
                        className="w-10 rounded"
                      />
                    </div>
                  </td>
                  <td className="py-2 px-5 text-center">{p.stock}</td>
                  <td className="py-2 px-5 text-center">₹{p.price}</td>
                  <td className="py-2 px-5 text-center">
                    ₹{p.discountedPrice || p.price}
                  </td>
                  <td className="py-2 px-5 text-center">{p.discount}%</td>
                  <td className="py-2 px-5 text-center">
                    {dayjs(p.updatedAt).format("YYYY-MM-DD HH:mm:ss")}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mt-5 flex justify-between items-center">
          <p className="text-gray-300 text-sm">{`Showing ${
            startIndex + 1
          } to ${endIndex} of ${products.length} results`}</p>
          <div className="flex ">
            <div className="flex items-center gap-2 bg-gray-100 px-4 py-2 rounded-full">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                className="px-2 text-gray-500 disabled:opacity-40"
              >
                ‹
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`w-8 h-8 rounded-full text-sm font-medium
          ${
            currentPage === page
              ? "bg-[#E9B159] text-white"
              : "text-gray-600 hover:bg-gray-200"
          }
        `}
                  >
                    {page}
                  </button>
                )
              )}

              <button
                disabled={currentPage === totalPages}
                onClick={() =>
                  setCurrentPage((p) => Math.min(p + 1, totalPages))
                }
                className="px-2 text-gray-500 disabled:opacity-40"
              >
                ›
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
