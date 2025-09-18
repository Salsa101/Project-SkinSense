import React, { useEffect } from "react";
import api from "../api/api"; // sesuaikan path
import Navbar from "../Components/Navbar";

function Dashboard() {
  return (
    <div>
      <div className="container-fluid">
        <Navbar />
      </div>
    </div>
  );
}

export default Dashboard;
