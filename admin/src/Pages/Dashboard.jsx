import React, { useEffect, useState } from "react";
import api from "../api/api";
import Navbar from "../Components/Navbar";

import productImg from "../assets/product-admin.jpg";
import newsImg from "../assets/news-admin.jpg";
import categoryImg from "../assets/category-admin.jpg";

function Dashboard() {
  const [stats, setStats] = useState({
    products: 0,
    news: 0,
    categories: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [resProducts, resNews, resCategories] = await Promise.all([
          api.get("/admin/products"),
          api.get("/admin/news"),
          api.get("/admin/categories"),
        ]);

        setStats({
          products: resProducts.data.length,
          news: resNews.data.length,
          categories: resCategories.data.filter((c) => c.isActive).length,
        });
      } catch (err) {
        console.error("Failed to fetch stats:", err);
      }
    };

    fetchStats();
  }, []);

  return (
    <div>
      <Navbar />
      <div className="container mt-4">
        <h2>Welcome, admin</h2>
        <div className="row mt-4">
          {/* Products Card */}
          <div className="col-md-4 mb-3">
            <div className="card text-center shadow-sm">
              <img src={productImg} className="card-img-top" alt="Products" />
              <div className="card-body">
                <h5 className="card-title">Products</h5>
                <p className="card-text display-6">{stats.products}</p>
                <a href="/admin/products" className="btn btn-info w-100">
                  Go to Products
                </a>
              </div>
            </div>
          </div>

          {/* News Card */}
          <div className="col-md-4 mb-3">
            <div className="card text-center shadow-sm">
              <img src={newsImg} className="card-img-top" alt="News" />
              <div className="card-body">
                <h5 className="card-title">News</h5>
                <p className="card-text display-6">{stats.news}</p>
                <a href="/admin/news" className="btn btn-info w-100">
                  Go to News
                </a>
              </div>
            </div>
          </div>

          {/* Categories Card */}
          <div className="col-md-4 mb-3">
            <div className="card text-center shadow-sm">
              <img
                src={categoryImg}
                className="card-img-top"
                alt="Categories"
              />
              <div className="card-body">
                <h5 className="card-title">Categories</h5>
                <p className="card-text display-6">{stats.categories}</p>
                <a href="/admin/categories" className="btn btn-info w-100">
                  Go to Categories
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
