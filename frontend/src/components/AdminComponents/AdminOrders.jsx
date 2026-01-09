import React, { useEffect, useState } from "react";
import axiosInstance from "../../api/axiosInstance";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllOrders } from "../../services/orderService";
import EditOrderForm from "./EditOrderForm";
import dayjs from "dayjs";
import PageHeader from "./PageHeader";
import { breadcrumbAdmin } from "../../utils/breadcrumbRoutes";
import {
  ShoppingCart,
  CheckCircle,
  XCircle,
  Search,
  Filter,
  SquarePen,
  Download,
} from "lucide-react";
import { exportToCSV, formatOrdersForCSV } from "../../utils/exportToCSV";
import usePagination from "../../hooks/usePagination";

export default function AdminOrders() {
  const dispatch = useDispatch();
  const { orders } = useSelector((state) => state.order);

  useEffect(() => {
    dispatch(fetchAllOrders());
  }, []);

  //pagination
  const {
    totalPages,
    startIndex,
    endIndex,
    currentPage,
    setCurrentPage,
    rowsPerPage,
    setRowsPerPage,
  } = usePagination(orders);
  const visibleOrders = orders.slice(startIndex, endIndex);

  const [isEditOpen, setIsEditOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const openEditModal = (order) => {
    setIsEditOpen(true);
    setSelectedOrder(order);
  };

  const closeEditModal = () => {
    setIsEditOpen(false);
  };
  const statusStyle = {
    Pending: "bg-yellow-100 text-yellow-600",
    Completed: "bg-green-100 text-green-600",
    Cancel: "bg-red-100 text-red-500",
    Processing: "bg-blue-100 text-blue-500",
    Returned: "bg-gray-100 text-gray-500",
  };
  const paymentStatusStyle = {
    COMPLETE: "bg-green-400",
    REFUNDED: "bg-blue-400",
    PENDING: "bg-red-400",
  };
  const [stats, setStats] = useState({
    todaysOrders: 0,
    completedOrders: 0,
    cancelledOrders: 0,
    totalOrders: 0,
  });
  useEffect(() => {
    (async () => {
      try {
        const res = await axiosInstance.get("/admin/dashboard");
        if (res.data.success) setStats(res.data.stats);
      } catch (err) {
        console.error(err);
      }
    })();
  }, []);

  const breadcrumb = [breadcrumbAdmin.home, breadcrumbAdmin.orders];

  const exportCSV = (e) => {
    e.preventDefault();
    exportToCSV(formatOrdersForCSV(orders), "orders.csv");
  };

  return (
    <div className="">
      <div>
        <PageHeader
          title={"Order List"}
          breadcrumbs={breadcrumb}
          buttonText={"Export"}
          Icon={Download}
          handleClick={exportCSV}
          buttonBg={"bg-none"}
          buttonTextColor={"text-green-900"}
        />
      </div>

      {/* cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4  gap-6">
        <div className="bg-white rounded-xl shadow-sm p-5 flex justify-between items-center">
          <div>
            <h3 className="text-2xl font-semibold text-gray-800">
              {stats.todaysOrders}
            </h3>
            <p className="text-sm text-gray-500 mt-1">Today's Orders</p>
          </div>

          <div
            className={`w-11 h-11 flex items-center justify-center rounded-full bg-green-100`}
          >
            <ShoppingCart className="text-green-700" size={20} />
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-5 flex justify-between items-center">
          <div>
            <h3 className="text-2xl font-semibold text-gray-800">
              {stats.completedOrders}
            </h3>
            <p className="text-sm text-gray-500 mt-1">Total Complete Orders</p>
          </div>

          <div
            className={`w-11 h-11 flex items-center justify-center rounded-full bg-cyan-100`}
          >
            <CheckCircle className="text-cyan-600" size={20} />
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-5 flex justify-between items-center">
          <div>
            <h3 className="text-2xl font-semibold text-gray-800">
              {stats.cancelledOrders}
            </h3>
            <p className="text-sm text-gray-500 mt-1">Total Cancel Orders</p>
          </div>

          <div
            className={`w-11 h-11 flex items-center justify-center rounded-full bg-green-100`}
          >
            <XCircle className="text-green-600" size={20} />
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-5 flex justify-between items-center">
          <div>
            <h3 className="text-2xl font-semibold text-gray-800">
              {stats.totalOrders}
            </h3>
            <p className="text-sm text-gray-500 mt-1">Total Orders</p>
          </div>

          <div
            className={`w-11 h-11 flex items-center justify-center rounded-full bg-orange-100`}
          >
            <ShoppingCart className="text-orange-500" size={20} />
          </div>
        </div>
      </div>
      {/* table */}
      <div className="bg-white p-4 rounded shadow-xl my-6">
        <div className="flex flex-wrap gap-4 items-center justify-between p-5 ">
          <select
            className="border border-gray-300 rounded-md px-3  py-2 text-sm text-gray-600 outline-none cursor-pointer"
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

          <div className="flex items-center gap-3">
            <div className="relative ">
              <Search
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <input
                name="search"
                placeholder="Search"
                className="pl-9 pr-4 py-2 border border-gray-300 rounded-md text-sm w-40 md:w-64"
              />
            </div>

            <button className="border px-3 py-2 rounded-md hover:bg-gray-50 ">
              <Filter size={16} />
            </button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm table-auto">
            <thead className="bg-gray-50 text-gray-500 border-gray-300">
              <tr>
                <th className="px-5 py-3 text-left whitespace-nowrap min-w-max">
                  Edit Status
                </th>
                <th className="px-15 py-3 text-center whitespace-nowrap min-w-max">
                  ORDER ID
                </th>
                <th className="px-5 py-3 text-center whitespace-nowrap min-w-max">
                  ORDER BY
                </th>
                <th className="px-5 py-3 text-center whitespace-nowrap min-w-max">
                  ORDER STATUS
                </th>
                <th className="px-5 py-3 text-center whitespace-nowrap min-w-max">
                  PAYMENT STATUS
                </th>
                <th className="px-5 py-3 text-center whitespace-nowrap min-w-max">
                  PAYMENT TYPE
                </th>
                <th className="px-5 py-3 text-center whitespace-nowrap min-w-max">
                  TOTAL AMOUNT
                </th>
                <th className="px-15 py-3 text-center whitespace-nowrap min-w-max">
                  ORDER DATE
                </th>
              </tr>
            </thead>
            <tbody className="text-gray-600">
              {visibleOrders?.map((order) => (
                <tr key={order.id} className="border-t border-gray-300">
                  <td className="px-5 py-4">
                    <div
                      className="w-9 h-9 rounded-full bg-green-100 flex items-center justify-center cursor-pointer"
                      onClick={() => openEditModal(order)}
                    >
                      <SquarePen size={16} />
                    </div>
                  </td>
                  <td className="py-2 px-5 text-center">{order.orderId}</td>
                  <td className="py-2 px-5 text-center">{order.user?.email}</td>
                  <td className="py-2 px-5 text-center">
                    <span
                      className={`${
                        statusStyle[order.status]
                      } px-2 py-1 rounded`}
                    >
                      {order.status}
                    </span>
                  </td>
                  <td className="py-2 px-5 text-center">
                    <span
                      className={`${
                        paymentStatusStyle[order.paymentStatus]
                      } text-white px-2 py-1 rounded`}
                    >
                      {order.paymentStatus}
                    </span>
                  </td>
                  <td className="py-2 px-5 text-center uppercase">
                    {order.paymentMethod}
                  </td>
                  <td className="py-2 px-5 text-center">
                    ₹{order.totalAmount}
                  </td>
                  <td className="py-2 px-5 text-center">
                    {dayjs(order.updatedAt).format("YYYY-MM-DD HH:mm:ss")}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mt-5 flex justify-between items-center">
          <p className="text-gray-300 text-sm">{`Showing ${
            startIndex + 1
          } to ${endIndex} of ${orders.length} results`}</p>
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
                    className={`w-8 h-8 rounded-full text-sm font-medium cursor-pointer
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
        {isEditOpen && selectedOrder && (
          <EditOrderForm order={selectedOrder} onClose={closeEditModal} />
        )}
      </div>
    </div>
  );
}
