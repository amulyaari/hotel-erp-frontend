// src/App.js
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import LoginPage from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import AdminDashboard from "./pages/AdminDashboard";
import POSBilling from "./pages/POSBilling";
import CaptainDashboard from "./pages/captainDashboard"; // 👈 Matches lowercase filename on disk
import SupervisorDashboard from "./pages/SupervisorDashboard"; // 👈 Newly added Supervisor page

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
        <Route path="/pos" element={<POSBilling />} />
        <Route path="/captain-dashboard" element={<CaptainDashboard />} />
        <Route path="/supervisor-dashboard" element={<SupervisorDashboard />} />
      </Routes>
    </Router>
  );
}

export default App;