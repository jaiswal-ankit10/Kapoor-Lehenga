import React, { useEffect, useState } from "react";
import axiosInstance from "../../api/axiosInstance";
import { breadcrumbAdmin } from "../../utils/breadcrumbRoutes";
import PageHeader from "./PageHeader";
import StatCard from "./StatCard";
import { Users, ShoppingCart, TrendingUp, Box } from "lucide-react";
import Graph from "./Graph";

export default function AdminDashboard() {
  const [stats, setStats] = useState({ users: 0, orders: 0, revenue: 0 });

  useEffect(() => {
    (async () => {
      try {
        const res = await axiosInstance.get("/admin/dashboard");
        // console.log("DASHBOARD RESPONSE:", res.data);
        if (res.data.success) setStats(res.data.stats);
      } catch (err) {
        console.error(err);
      }
    })();
  }, []);
  const breadcrumb = [breadcrumbAdmin.home, breadcrumbAdmin.dashboard];

  return (
    <div>
      <PageHeader title={"Dashboard"} breadcrumbs={breadcrumb} />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title={"Total Users"}
          value={stats.totalUsers}
          Icon={Users}
          borderColor={"border-black-700"}
          iconColor={"text-black-400"}
          iconBackgroundColor={"bg-black/10"}
        />
        <StatCard
          title={"Total Orders"}
          value={stats.totalOrders}
          Icon={ShoppingCart}
          borderColor={"border-green-400"}
          iconColor={"text-green-400"}
          iconBackgroundColor={"bg-green-100"}
        />
        <StatCard
          title={"Payment History"}
          value={stats.totalRevenue?.toFixed(2)}
          Icon={TrendingUp}
          borderColor={"border-blue-400"}
          iconColor={"text-blue-400"}
          iconBackgroundColor={"bg-blue-100"}
        />
        <StatCard
          title={"Total Products"}
          value={stats.totalProducts}
          Icon={Box}
          borderColor={"border-gray-400"}
          iconColor={"text-gray-400"}
          iconBackgroundColor={"bg-gray-100"}
        />
      </div>

      <div className="mt-15">
        <Graph />
      </div>
    </div>
  );
}
