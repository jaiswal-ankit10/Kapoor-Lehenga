import React, { useEffect, useState } from "react";
import axiosInstance from "../../api/axiosInstance";
import AddUserForm from "./AddUserForm";
import { useDispatch } from "react-redux";
import { deleteUser } from "../../redux/userSlice";
import { breadcrumbAdmin } from "../../utils/breadcrumbRoutes";
import PageHeader from "./PageHeader";
import { Download, Search, Trash } from "lucide-react";

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

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleSuccess = () => {
    fetchUsers();
  };
  const breadcrumb = [breadcrumbAdmin.home, breadcrumbAdmin.user];

  return (
    <div>
      <PageHeader
        title={"Users List"}
        breadcrumbs={breadcrumb}
        buttonText={"Export"}
        Icon={Download}
        handleClick={(e) => e.preventDefault()}
        buttonBg={"bg-none"}
        buttonTextColor={"text-green-900"}
      />
      <div className="bg-white p-4 rounded shadow">
        <div className="overflow-auto">
          <div className="flex flex-wrap gap-4 items-center justify-between p-5 ">
            <select className="border rounded-md px-3 py-2 text-sm text-gray-600">
              <option>10 rows</option>
              <option>20 rows</option>
              <option>50 rows</option>
            </select>

            <div className="flex items-center gap-3">
              <div className="relative w-52 lg:w-64">
                <Search
                  size={16}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                />
                <input
                  name="search"
                  placeholder="Search"
                  className="pl-9 pr-4 py-2 border rounded-md text-sm w-full"
                />
              </div>
            </div>
          </div>
          <table className="w-full text-left">
            <thead className="bg-gray-50 text-gray-500">
              <tr className="text-sm text-gray-500">
                <th className="px-3 py-3 text-left">Name</th>
                <th className="px-4 py-3 text-left">Action</th>
                <th className="px-3 py-3 text-center">Email</th>
                <th className="px-3 py-3 text-center">Mobile</th>
                <th className="px-3 py-3 text-center">Role</th>
                <th className="px-3 py-3 text-center">Joined</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u._id} className="border-t border-gray-300">
                  <td className="py-3 px-3 text-left">{u.fullName}</td>
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
                      className={`p-2 rounded text-md ${
                        u.role === "admin"
                          ? "bg-purple-100 text-purple-700"
                          : "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {u.role}
                    </span>
                  </td>
                  <td className="py-3 px-5 text-center">
                    {new Date(u.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
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
