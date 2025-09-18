import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import api from "../api/api";

function ProtectedRoute({ children }) {
  const [isAuth, setIsAuth] = useState(null); // null artinya belum dicek
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        await api.get("/check-auth"); // cek token
        setIsAuth(true);
      } catch (err) {
        setIsAuth(false);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  if (loading) {
    return (
      <div style={{ textAlign: "center", marginTop: "50px" }}>
        <p>Checking authentication...</p>
      </div>
    );
  }

  if (!isAuth) {
    return (
      <div style={{ textAlign: "center", marginTop: "50px" }}>
        <p>You are not authorized. Redirecting to login...</p>
        <Navigate to="/admin/login" replace />
      </div>
    );
  }

  return children;
}

export default ProtectedRoute;
