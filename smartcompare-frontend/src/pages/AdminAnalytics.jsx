import { useEffect, useState } from "react";
import api from "../api/axios";
import AdminNavbar from "../components/AdminNavbar";
import "../styles/AdminAnalytics.css";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid
} from "recharts";

function AdminAnalytics() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const STATUS_COLORS = {
  PLACED: "#f59e0b",     // amber
  SHIPPED: "#0ea5e9",    // blue
  DELIVERED: "#22c55e",  // green
  CANCELLED: "#ef4444",  // red
  };

  const pieData = data ? Object.entries(data.ordersByStatus).map(
     ([name, value]) => ({ name, value })): [];
  


  useEffect(() => {
    api.get("/admin/orders/analytics")
      .then(res => {
        setData(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  if (loading || !data) {
    return (
      <>
        <AdminNavbar />
        <p className="analytics-loading">Loading analytics…</p>
      </>
    );
  }

  return (
    <>
      <AdminNavbar />
      <div className="analytics-page">
        {/* HEADER */}
        <div className="analytics-header">
          <h2>Admin Analytics</h2>
          <p>Overview of orders and revenue</p>
        </div>

        {/* TOP KPIs */}
        <div className="analytics-kpis">
          <div className="kpi-card primary">
            <span>Total Orders</span>
            <h3>{data.totalOrders}</h3>
          </div>

          <div className="kpi-card success">
            <span>Total Revenue</span>
            <h3>₹{data.totalRevenue}</h3>
          </div>
        </div>

        {/* STATUS CARDS */}
        <div className="analytics-grid">
          {Object.entries(data.ordersByStatus).map(([status, count]) => (
            <div
              key={status}
              className={`analytics-card ${status.toLowerCase()}`}
            >
              <span>{status} Orders</span>
              <h3>{count}</h3>
            </div>
          ))}
        </div>
        {/* CHARTS */}
<div className="analytics-charts">

  {/* BAR CHART */}
  <div className="chart-card">
    <h4>Orders by Status</h4>
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={pieData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Bar dataKey="value">
          {pieData.map((entry) => (
            <Cell
              key={entry.name}
              fill={STATUS_COLORS[entry.name]}
            />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  </div>

  {/* PIE / DONUT CHART */}
  <div className="chart-card">
    <h4>Order Distribution</h4>
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={pieData}
          dataKey="value"
          nameKey="name"
          innerRadius={70}
          outerRadius={110}
          paddingAngle={4}
        >
          {pieData.map((entry) => (
            <Cell
              key={entry.name}
              fill={STATUS_COLORS[entry.name]}
            />
          ))}
        </Pie>
        <Tooltip />
      </PieChart>
    </ResponsiveContainer>
  </div>

</div>

      </div>
    </>
  );
}

export default AdminAnalytics;  