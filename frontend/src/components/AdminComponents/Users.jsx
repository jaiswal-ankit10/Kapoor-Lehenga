import React, { useEffect, useState } from "react";

import axiosInstance from "../../api/axiosInstance";

export default function Users() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    (async () => {
      try {
        const res = await axiosInstance.get("/admin/users");
        if (res.data.success) setUsers(res.data.users);
      } catch (err) {
        console.error(err);
      }
    })();
  }, []);

  return (
    <div className="bg-white p-4 rounded shadow">
      <h3 className="text-lg font-semibold mb-4">Users</h3>
      <div className="overflow-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="text-sm text-gray-500">
              <th className="py-2">Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Joined</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u._id} className="border-t">
                <td className="py-2">{u.name}</td>
                <td>{u.email}</td>
                <td>{u.role}</td>
                <td>{new Date(u.createdAt).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
