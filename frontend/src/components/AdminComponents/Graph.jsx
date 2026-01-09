import React, { useEffect, useState } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import axiosInstance from "../../api/axiosInstance";

const Graph = () => {
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        setLoading(true);
        const res = await axiosInstance.get("/admin/dashboard");

        console.log("Chartdata from backend:", res.data.chartData);

        if (res.data.success && Array.isArray(res.data.chartData)) {
          setChartData(res.data.chartData);
        }
      } catch (err) {
        console.error("Dashboard chart error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  if (loading) return <div>Loading Chart...</div>;

  return (
    <div style={{ width: "100%", height: 300 }}>
      <ResponsiveContainer>
        <AreaChart
          data={chartData}
          margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
        >
          <defs>
            <linearGradient id="colorOrders" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#6366f1" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
            </linearGradient>
          </defs>

          <CartesianGrid strokeDasharray="3 3" vertical={false} />

          {/* MONTH */}
          <XAxis
            dataKey="month"
            tick={{ fontSize: 12 }}
            tickLine={false}
            axisLine={false}
          />

          <YAxis tick={{ fontSize: 12 }} tickLine={false} axisLine={false} />

          <Tooltip
            formatter={(value) => value}
            contentStyle={{
              borderRadius: "10px",
              border: "none",
              boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
            }}
          />

          {/* ORDERS */}
          <Area
            type="monotone"
            dataKey="orders"
            stroke="#6366f1"
            fillOpacity={1}
            fill="url(#colorOrders)"
            name="Orders"
          />

          {/* REVENUE */}
          <Area
            type="monotone"
            dataKey="revenue"
            stroke="#6366f1"
            fillOpacity={1}
            fill="url(#colorOrders)"
            name="Revenue"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default Graph;
