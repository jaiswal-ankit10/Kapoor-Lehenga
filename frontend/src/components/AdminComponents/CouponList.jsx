import React, { useEffect, useState } from "react";
import { breadcrumbAdmin } from "../../utils/breadcrumbRoutes";
import PageHeader from "./PageHeader";
import { Plus, Search, SquarePen, Trash } from "lucide-react";
import CouponForm from "./CouponForm";
import { useDispatch, useSelector } from "react-redux";
import { fetchCoupons } from "../../redux/couponSlice";
import dayjs from "dayjs";
import { ToastContainer } from "react-toastify";
import axiosInstance from "../../api/axiosInstance";
import usePagination from "../../hooks/usePagination";

const CouponList = () => {
  const dispatch = useDispatch();
  const { coupons } = useSelector((state) => state.coupon);
  const [showCouponForm, setShowCouponForm] = useState(false);
  const [selectedCoupon, setSelectedCoupon] = useState(null);
  const breadcrumb = [breadcrumbAdmin.home, breadcrumbAdmin.coupon];
  const handleClick = (e) => {
    e.preventDefault();
    setSelectedCoupon(null);
    setShowCouponForm((prev) => !prev);
  };
  const handleEdit = (coupon) => {
    setSelectedCoupon(coupon);
    setShowCouponForm(true);
  };
  const handleDelete = async (coupon) => {
    try {
      await axiosInstance.delete(`/coupons/delete/${coupon.id}`);
      dispatch(fetchCoupons());
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    dispatch(fetchCoupons());
  }, [dispatch]);

  //pagination
  const {
    totalPages,
    startIndex,
    endIndex,
    currentPage,
    setCurrentPage,
    rowsPerPage,
    setRowsPerPage,
  } = usePagination(coupons);
  const visibleCoupons = coupons.slice(startIndex, endIndex);

  return (
    <div>
      <ToastContainer />
      <PageHeader
        title={"Coupon List"}
        breadcrumbs={breadcrumb}
        buttonText={"Add Coupon"}
        Icon={Plus}
        handleClick={handleClick}
        buttonBg={"bg-[#E9B159]"}
        buttonTextColor={"text-white"}
      />

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
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-500">
              <tr>
                <th className="px-5 py-3 text-center whitespace-nowrap min-w-max">
                  ACTION
                </th>
                <th className="px-5 py-3 text-left whitespace-nowrap min-w-max">
                  COUPON NAME
                </th>
                <th className="px-5 py-3 text-center whitespace-nowrap min-w-max">
                  COUPON CODE
                </th>
                <th className="px-5 py-3 text-center whitespace-nowrap min-w-max">
                  COUPON STATUS
                </th>
                <th className="px-5 py-3 text-center whitespace-nowrap min-w-max">
                  COUPON VALUE
                </th>
                <th className="px-5 py-3 text-center whitespace-nowrap min-w-max">
                  MINIMUM PURCHASE AMOUNT
                </th>
                <th className="px-5 py-3 text-center whitespace-nowrap min-w-max">
                  MAXIMUM USERS USE LIMIT
                </th>
                <th className="px-5 py-3 text-center whitespace-nowrap min-w-max">
                  FOR NEW MEMBER
                </th>
                <th className="px-5 py-3 text-center whitespace-nowrap min-w-max">
                  COUPON START DATE
                </th>
                <th className="px-5 py-3 text-center whitespace-nowrap min-w-max">
                  COUPON END DATE
                </th>
              </tr>
            </thead>
            <tbody className="text-gray-600">
              {visibleCoupons?.map((coupon) => (
                <tr key={coupon.id}>
                  <td className="px-5 py-4 flex gap-2">
                    <div
                      className="w-9 h-9 rounded-full bg-green-100 flex items-center justify-center cursor-pointer"
                      onClick={() => handleEdit(coupon)}
                    >
                      <SquarePen size={16} />
                    </div>
                    <div
                      className="w-9 h-9 rounded-full bg-red-100 flex items-center justify-center cursor-pointer"
                      onClick={() => handleDelete(coupon.id)}
                    >
                      <Trash size={16} color="red" />
                    </div>
                  </td>
                  <td className="py-2 px-5 text-center">{coupon.title}</td>
                  <td className="py-2 px-5 text-center">{coupon.code}</td>
                  <td className="py-2 px-5 text-center">
                    <span
                      className={`${
                        coupon.isActive ? "bg-green-500" : "bg-red-500"
                      } text-white px-2 py-1 rounded`}
                    >
                      {coupon.isActive ? "Active" : "Deactive"}
                    </span>
                  </td>
                  <td className="py-2 px-5 text-center">
                    <span>{`${
                      coupon.discountType === "percentage"
                        ? `${coupon.discountValue}%`
                        : `₹${coupon.discountValue}`
                    }`}</span>
                  </td>
                  <td className="py-2 px-5 text-center">
                    ₹{coupon.minPurchaseAmount}
                  </td>
                  <td className="py-2 px-5 text-center">
                    {coupon.usagePerUser}
                  </td>
                  <td className="py-2 px-5 text-center">
                    {coupon.forNewUser ? "true" : "false"}
                  </td>
                  <td className="py-2 px-5 text-center">
                    {dayjs(coupon.startDate).format("YYYY-MM-DD HH:mm:ss")}
                  </td>
                  <td className="py-2 px-5 text-center">
                    {dayjs(coupon.expiryDate).format("YYYY-MM-DD HH:mm:ss")}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mt-5 flex justify-between items-center">
          <p className="text-gray-300 text-sm">{`Showing ${
            startIndex + 1
          } to ${endIndex} of ${coupons.length} results`}</p>
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
      </div>
      {showCouponForm && (
        <CouponForm
          onClose={() => setShowCouponForm(false)}
          coupon={selectedCoupon}
        />
      )}
    </div>
  );
};

export default CouponList;
