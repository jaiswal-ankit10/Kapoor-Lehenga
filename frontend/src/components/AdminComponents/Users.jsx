import React, { useEffect, useState } from "react";
import axiosInstance from "../../api/axiosInstance";
import AddUserForm from "./AddUserForm";
import { useDispatch } from "react-redux";
import { deleteUser } from "../../redux/userSlice";

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

  return (
    <div className="bg-white p-4 rounded shadow">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">Users</h3>
        <button
          onClick={() => setShowAddForm(true)}
          className="px-4 py-2 bg-[#E9B159] text-white rounded hover:bg-[#d49d4a]"
        >
          + Add User
        </button>
      </div>
      <div className="overflow-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="text-sm text-gray-500">
              <th className="py-2">Name</th>
              <th>Email</th>
              <th>Mobile</th>
              <th>Role</th>
              <th>Joined</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u._id} className="border-t">
                <td className="py-3">{u.fullName || u.name}</td>
                <td>{u.email}</td>
                <td>{u.mobile || "-"}</td>
                <td>
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
                <td>{new Date(u.createdAt).toLocaleDateString()}</td>
                <td>
                  <button
                    className="bg-red-300 text-red-600 p-2 rounded"
                    onClick={(e) => handleDelete(e, u._id)}
                  >
                    Delete
                  </button>
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
  );
}
