import React, { useEffect, useState } from "react";
import axiosInstance from "../../api/axiosInstance";

export default function AdminDashboard() {
  const [stats, setStats] = useState({ users: 0, orders: 0, revenue: 0 });

  useEffect(() => {
    (async () => {
      try {
        const res = await axiosInstance.get("/admin/dashboard");
        console.log("DASHBOARD RESPONSE:", res.data);
        if (res.data.success) setStats(res.data.stats);
      } catch (err) {
        console.error(err);
      }
    })();
  }, []);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="bg-white p-4 rounded shadow">
        <div className="text-sm text-gray-500">Users</div>
        <div className="text-2xl font-bold">
          {stats.totalUsers ?? stats.users}
        </div>
      </div>
      <div className="bg-white p-4 rounded shadow">
        <div className="text-sm text-gray-500">Orders</div>
        <div className="text-2xl font-bold">
          {stats.totalOrders ?? stats.orders}
        </div>
      </div>
      <div className="bg-white p-4 rounded shadow">
        <div className="text-sm text-gray-500">Revenue</div>
        <div className="text-2xl font-bold">
          ₹{stats.totalRevenue ?? stats.revenue}
        </div>
      </div>
    </div>
  );
}
