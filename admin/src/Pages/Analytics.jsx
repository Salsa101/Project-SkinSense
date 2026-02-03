import React, { useEffect, useState } from "react";
import api from "../api/api";
import Navbar from "../Components/Navbar";

import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
} from "recharts";

function Analytics() {
  const [filter, setFilter] = useState("monthly");
  const [userGrowthData, setUserGrowthData] = useState([]);
  const [newsActivityData, setNewsActivityData] = useState([]);
  const [topRankingData, setTopRankingData] = useState([]);
  const [faceScanData, setFaceScanData] = useState([]);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const res = await api.get(`/admin/analytics?filter=${filter}`);

        // User Growth
        setUserGrowthData(res.data.userGrowth);

        // Top News
        const newsFormatted = res.data.topNewsBookmark.map((n) => ({
          name: n.title,
          count: n.count,
        }));
        setNewsActivityData(newsFormatted);

        // Top Products
        const productsFormatted = res.data.topProducts.map((p) => ({
          name: p.productName,
          count: p.count,
        }));
        setTopRankingData(productsFormatted);

        // Face Scan Activity
        const faceScanFormatted = res.data.faceScanActivity.map((f) => ({
          month: f.period, // backend sekarang pakai field 'period'
          count: f.count,
        }));
        setFaceScanData(faceScanFormatted);
      } catch (err) {
        console.error("Failed to fetch analytics:", err);
      }
    };

    fetchAnalytics();
  }, [filter]); // <-- re-fetch tiap filter berubah

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

  return (
    <div>
      <Navbar />
      <div className="container mt-4">
        <div className="row mt-4">
          {/* Charts Section */}
          <div className="d-flex justify-content-between align-items-center mb-4 mt-3">
            <h2 className="mb-0">📊 Chart Tren Data</h2>
            <select
              className="form-select w-auto"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            >
              <option value="daily">Per Hari</option>
              <option value="weekly">Per Minggu</option>
              <option value="monthly">Per Bulan</option>
              <option value="yearly">Per Tahun</option>
            </select>
          </div>

          <div className="row mt-3">
            {/* User Growth */}
            <div className="col-md-6 mb-4">
              <div className="card shadow-sm p-3">
                <h5>User Growth</h5>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={userGrowthData}>
                    <Line type="monotone" dataKey="users" stroke="#cb5cc4ff" />
                    <CartesianGrid stroke="#ccc" />
                    <XAxis dataKey="period" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* News Activity */}
            <div className="col-md-6 mb-4">
              <div className="card shadow-sm p-3">
                <h5>News Activity</h5>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={newsActivityData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="count" fill="#65d4e0ff" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Ranking Chart */}
            <div className="col-md-6 mb-4">
              <div className="card shadow-sm p-3">
                <h5>Top 5 Most Used Products</h5>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={topRankingData} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" />
                    <YAxis dataKey="name" type="category" />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="count" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Face Scan Activity */}
            <div className="col-md-6 mb-4">
              <div className="card shadow-sm p-3">
                <h5>Face Scan Activity</h5>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={faceScanData}>
                    <Line type="monotone" dataKey="count" stroke="#88bc2fff" />
                    <CartesianGrid stroke="#ccc" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Analytics;
