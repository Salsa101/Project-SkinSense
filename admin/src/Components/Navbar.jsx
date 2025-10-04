import React, { useEffect } from "react";
import { useLocation } from "react-router-dom"; // 👈 tambahin ini
import api from "../api/api";

const Navbar = () => {
  const location = useLocation(); // 👈 cek URL sekarang

  useEffect(() => {
    fetchAdminData();
  }, []);

  const fetchAdminData = async () => {
    try {
      const res = await api.get("/admin/products"); // cookie otomatis dikirim
      console.log(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleLogout = async () => {
    await api.post("/admin/logout"); // cookie dihapus di backend
    window.location.href = "/admin/login";
  };

  return (
    <nav className="navbar navbar-expand-lg bg-body-tertiary">
      <div className="container-fluid">
        <a className="navbar-brand" href="#">
          SkinSense Admin
        </a>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <a
                className={`nav-link ${
                  location.pathname === "/admin/dashboard" ? "active" : ""
                }`}
                href="/admin/dashboard"
              >
                Dashboard
              </a>
            </li>
            <li className="nav-item">
              <a
                className={`nav-link ${
                  location.pathname.startsWith("/admin/products")
                    ? "active"
                    : ""
                }`}
                href="/admin/products"
              >
                Product
              </a>
            </li>
            <li className="nav-item">
              <a
                className={`nav-link ${
                  location.pathname.startsWith("/admin/news") ? "active" : ""
                }`}
                href="/admin/news"
              >
                News
              </a>
            </li>
            <li className="nav-item">
              <a
                className={`nav-link ${
                  location.pathname.startsWith("/admin/categories")
                    ? "active"
                    : ""
                }`}
                href="/admin/categories"
              >
                Category
              </a>
            </li>
            <li className="nav-item">
              <a
                className={`nav-link ${
                  location.pathname.startsWith("/admin/analytics")
                    ? "active"
                    : ""
                }`}
                href="/admin/analytics"
              >
                Analytics
              </a>
            </li>
          </ul>

          <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
            <li className="nav-item dropdown">
              <a
                className="nav-link dropdown-toggle"
                href="#"
                id="adminDropdown"
                role="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                Hello, Admin
              </a>
              <ul
                className="dropdown-menu dropdown-menu-end"
                aria-labelledby="adminDropdown"
              >
                <li>
                  <a className="dropdown-item" href="#" onClick={handleLogout}>
                    Logout
                  </a>
                </li>
              </ul>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
