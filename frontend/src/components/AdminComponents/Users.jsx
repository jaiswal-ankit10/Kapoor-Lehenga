import React, { useEffect, useState } from "react";
import axiosInstance from "../../api/axiosInstance";
import AddUserForm from "./AddUserForm";
import { breadcrumbAdmin } from "../../utils/breadcrumbRoutes";
import PageHeader from "./PageHeader";
import { Download, Search, Trash } from "lucide-react";
import { exportToCSV, formatUsersForCSV } from "../../utils/exportToCSV";
import dayjs from "dayjs";
import usePagination from "../../hooks/usePagination";

export default function Users() {
  const [users, setUsers] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);

  const fetchUsers = async () => {
    try {
      const res = await axiosInstance.get("/admin/users");
      if (res.data.success) setUsers(res.data.users);
    } catch (err) {
      console.error(err);
    }
  };
  const handleDelete = async (e, id) => {
    try {
      await axiosInstance.delete(`/admin/users/${id}`);
      if (!window.confirm("Are you sure you want to delete this product?"))
        return;
    } catch (error) {
      console.error(error);
    }
  };
  const handleUserExport = (e) => {
    e.preventDefault();
    exportToCSV(formatUsersForCSV(users), "users.csv");
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleSuccess = () => {
    fetchUsers();
  };
  const breadcrumb = [breadcrumbAdmin.home, breadcrumbAdmin.user];

  //pagination
  const {
    totalPages,
    startIndex,
    endIndex,
    currentPage,
    setCurrentPage,
    rowsPerPage,
    setRowsPerPage,
  } = usePagination(users);
  const visibleUsers = users.slice(startIndex, endIndex);

  return (
    <div>
      <PageHeader
        title={"Users List"}
        breadcrumbs={breadcrumb}
        buttonText={"Export"}
        Icon={Download}
        handleClick={handleUserExport}
        buttonBg={"bg-none"}
        buttonTextColor={"text-green-900"}
      />
      <div className="bg-white p-4 rounded shadow">
        <div className="overflow-auto">
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
                  className="pl-9 pr-4 py-2 border border-gray-300 rounded-md text-sm w-40 lg:w-64"
                />
              </div>
            </div>
          </div>
          <table className="w-full text-left">
            <thead className="bg-gray-50 text-gray-500">
              <tr className="text-sm text-gray-500">
                <th className="px-3 py-3 text-center">Name</th>
                <th className="px-4 py-3 text-left">Action</th>
                <th className="px-3 py-3 text-center">Email</th>
                <th className="px-3 py-3 text-center">Mobile</th>
                <th className="px-3 py-3 text-center">Role</th>
                <th className="px-3 py-3 text-center">Joined</th>
              </tr>
            </thead>
            <tbody className="text-gray-600">
              {visibleUsers.map((u) => (
                <tr key={u._id} className="border-t border-gray-300">
                  <td className="py-3 px-4 text-center flex gap-2">
                    <img src="/avatar.png" alt="avatar" className="w-6" />
                    {u.fullName}
                  </td>
                  <td className="py-3 px-5 text-center">
                    <button
                      className="bg-red-100 w-9 h-9 rounded-full flex items-center justify-center"
                      onClick={(e) => handleDelete(e, u._id)}
                    >
                      <Trash size={16} className="text-red-500" />
                    </button>
                  </td>
                  <td className="py-3 px-5 text-center">{u.email}</td>
                  <td className="py-3 px-5 text-center">{u.mobile || "-"}</td>
                  <td className="py-3 px-5 text-center">
                    <span
                      className={`p-2 rounded text-sm ${
                        u.role === "admin"
                          ? "bg-purple-100 text-purple-700"
                          : "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {u.role}
                    </span>
                  </td>
                  <td className="py-3 px-5 text-center">
                    {dayjs(u.createdAt).format("YYYY-MM-DD HH:mm:ss")}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mt-5 flex justify-between items-center">
          <p className="text-gray-300 text-sm">{`Showing ${
            startIndex + 1
          } to ${endIndex} of ${users.length} results`}</p>
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
        {showAddForm && (
          <AddUserForm
            onClose={() => setShowAddForm(false)}
            onSuccess={handleSuccess}
          />
        )}
      </div>
    </div>
  );
}
