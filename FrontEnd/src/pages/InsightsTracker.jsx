import React, { useState, useEffect } from "react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell,
} from "recharts";

const AdminInsights = () => {
  const [insights, setInsights] = useState(null);

  useEffect(() => {
    fetchInsights();
  }, []);

  const fetchInsights = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/admin/insights");
      const data = await response.json();
      setInsights(data);
    } catch (error) {
      console.error("Error fetching insights:", error);
    }
  };

  if (!insights) {
    return <div className="p-10 text-center text-xl">Loading Insights...</div>;
  }

  // Colors for charts
  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#a83279", "#ff6361"];

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold mb-8 text-center">Admin Insights Dashboard</h1>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white shadow rounded-lg p-6 text-center">
          <h2 className="text-xl font-semibold mb-2">Total Revenue</h2>
          <p className="text-3xl font-bold text-green-600">₹{insights.totalRevenue}</p>
        </div>
        <div className="bg-white shadow rounded-lg p-6 text-center">
          <h2 className="text-xl font-semibold mb-2">Tickets Sold</h2>
          <p className="text-3xl font-bold text-blue-600">{insights.totalTicketsSold}</p>
        </div>
        <div className="bg-white shadow rounded-lg p-6 text-center">
          <h2 className="text-xl font-semibold mb-2">Food Sales</h2>
          <p className="text-3xl font-bold text-purple-600">₹{insights.totalFoodSales}</p>
        </div>
      </div>

      {/* Sales Over Time */}
      <div className="bg-white shadow rounded-lg p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">Daily Revenue</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={insights.dailyRevenue}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="revenue" fill="#8884d8" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Top Movies */}
      <div className="bg-white shadow rounded-lg p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">Top Performing Movies (Tickets Sold)</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={insights.topMovies}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="movie" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="ticketsSold" fill="#82ca9d" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Top Food Items */}
      <div className="bg-white shadow rounded-lg p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">Top Selling Food Items</h2>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={insights.topFoodItems}
              dataKey="quantitySold"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={100}
              label
            >
              {insights.topFoodItems.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default AdminInsights;
