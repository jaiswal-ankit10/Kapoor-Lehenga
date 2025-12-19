import { Download, Filter, Search, TrendingUp } from "lucide-react";
import React, { useEffect, useState } from "react";
import { breadcrumbAdmin } from "../../utils/breadcrumbRoutes";
import PageHeader from "./PageHeader";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllOrders } from "../../services/orderService";
import axiosInstance from "../../api/axiosInstance";
import {
  exportToCSV,
  formatPaymentHistorForCSV,
} from "../../utils/exportToCSV";

const PaymentHistory = () => {
  const [stats, setStats] = useState({});
  const breadcrumb = [breadcrumbAdmin.home, breadcrumbAdmin.payment];

  const dispatch = useDispatch();
  const { orders } = useSelector((state) => state.order);

  const handlePaymentExport = (e) => {
    e.preventDefault();
    exportToCSV(formatPaymentHistorForCSV(orders), "payments.csv");
  };

  useEffect(() => {
    dispatch(fetchAllOrders());
  }, []);

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
  return (
    <div>
      <PageHeader
        title={"Payment History List"}
        breadcrumbs={breadcrumb}
        buttonText={"Export"}
        Icon={Download}
        handleClick={handlePaymentExport}
        buttonBg={"bg-none"}
        buttonTextColor={"text-green-900"}
      />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4  gap-6">
        <div className="bg-white rounded-xl shadow-sm p-5 flex justify-between items-center">
          <div>
            <h3 className="text-2xl font-semibold text-gray-600">
              ₹{stats.todaysRevenue}
            </h3>
            <p className="text-md text-gray-500 mt-1">Today's Revenue</p>
          </div>

          <div
            className={`w-11 h-11 flex items-center justify-center rounded-full bg-green-100`}
          >
            <TrendingUp className="text-green-700" size={20} />
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-5 flex justify-between items-center">
          <div>
            <h3 className="text-2xl font-semibold text-gray-600">
              ₹{stats.monthlyRevenue}
            </h3>
            <p className="text-md text-gray-500 mt-1">This Month's Revenue</p>
          </div>

          <div
            className={`w-11 h-11 flex items-center justify-center rounded-full bg-cyan-100`}
          >
            <TrendingUp className="text-cyan-600" size={20} />
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-5 flex justify-between items-center">
          <div>
            <h3 className="text-2xl font-semibold text-gray-600">
              ₹{stats.yearlyRevenue}
            </h3>
            <p className="text-md text-gray-500 mt-1">This Year's Revenue</p>
          </div>

          <div
            className={`w-11 h-11 flex items-center justify-center rounded-full bg-green-100`}
          >
            <TrendingUp className="text-green-600" size={20} />
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-5 flex justify-between items-center">
          <div>
            <h3 className="text-2xl font-semibold text-gray-600">
              ₹{stats.totalRevenue}
            </h3>
            <p className="text-md text-gray-500 mt-1">Total Revenue</p>
          </div>

          <div
            className={`w-11 h-11 flex items-center justify-center rounded-full bg-orange-100`}
          >
            <TrendingUp className="text-orange-500" size={20} />
          </div>
        </div>
      </div>

      <div className="bg-white p-4 rounded shadow-xl my-6">
        <div className="flex flex-wrap gap-4 items-center justify-between p-5 ">
          <select className="border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-600">
            <option>10 rows</option>
            <option>20 rows</option>
            <option>50 rows</option>
          </select>

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

            <button className="border px-3 py-2 rounded-md hover:bg-gray-50">
              <Filter size={16} />
            </button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm table-auto">
            <thead className="bg-gray-50 text-gray-500">
              <tr>
                <th className="px-5 py-3 text-left whitespace-nowrap min-w-max">
                  ORDER BY
                </th>
                <th className="px-5 py-3 text-center whitespace-nowrap min-w-max">
                  ORDER NUMBER
                </th>
                <th className="px-5 py-3 text-center whitespace-nowrap min-w-max">
                  STATUS
                </th>
                <th className="px-5 py-3 text-center whitespace-nowrap min-w-max">
                  PAYMENT METHOD
                </th>
                <th className="px-5 py-3 text-center whitespace-nowrap min-w-max">
                  AMOUNT
                </th>
                <th className="px-5 py-3 text-center whitespace-nowrap min-w-max">
                  PAYMENT DATE
                </th>
              </tr>
            </thead>
            <tbody>
              {orders?.map((order) => (
                <tr key={order._id} className="border-t border-gray-300">
                  <td className="px-5 py-4">{order.user?.email}</td>
                  <td className="py-2 px-5 text-center">{order.orderId}</td>
                  <td className="py-2 px-5 text-center">
                    <div
                      className={`rounded ${
                        order.paymentStatus === "complete"
                          ? "bg-green-400 text-white"
                          : "bg-red-400 text-white"
                      }`}
                    >
                      {order.paymentStatus}
                    </div>
                  </td>
                  <td className="py-2 px-5 text-center uppercase">
                    {order.paymentMethod}
                  </td>
                  <td className="py-2 px-5 text-center">
                    ₹{order.totalAmount}
                  </td>
                  <td className="py-2 px-5 text-center">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default PaymentHistory;
