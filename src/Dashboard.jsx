import React, { useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./Dashboard.css";

export default function Dashboard() {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/");
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  return (
    <div className="dashboard-container">
      {/* Top Navbar Header */}
      <header className="dashboard-header">
        <div className="header-brand">
          <h1>Hotel ERP Dashboard</h1>
        </div>
        <div className="header-actions">
          <Link to="/pos" className="pos-nav-btn" style={{ padding: "10px 20px", backgroundColor: "#f2a900", color: "white", textDecoration: "none", fontWeight: "bold", borderRadius: "6px", marginRight: "10px" }}>🛒 Open POS Billing</Link>
          <button onClick={handleLogout} className="logout-btn" style={{ padding: "10px 20px", backgroundColor: "#ef4444", color: "white", border: "none", borderRadius: "6px", cursor: "pointer" }}>↩️ Logout</button>
        </div>
      </header>

      {/* Main KPI Stat Cards */}
      <section className="stats-grid" style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "20px", margin: "20px 0" }}>
        <div className="stat-card" style={{ background: "white", padding: "20px", borderRadius: "8px", boxShadow: "0 4px 6px rgba(0,0,0,0.05)" }}>
          <p style={{ color: "#666", margin: "0 0 8px 0" }}>Total Rooms</p>
          <h2 style={{ margin: 0, fontSize: "1.8rem" }}>120</h2>
        </div>
        <div className="stat-card" style={{ background: "white", padding: "20px", borderRadius: "8px", boxShadow: "0 4px 6px rgba(0,0,0,0.05)" }}>
          <p style={{ color: "#666", margin: "0 0 8px 0" }}>Available Rooms</p>
          <h2 style={{ margin: 0, fontSize: "1.8rem" }}>45</h2>
        </div>
        <div className="stat-card" style={{ background: "white", padding: "20px", borderRadius: "8px", boxShadow: "0 4px 6px rgba(0,0,0,0.05)" }}>
          <p style={{ color: "#666", margin: "0 0 8px 0" }}>Today's Guests</p>
          <h2 style={{ margin: 0, fontSize: "1.8rem" }}>78</h2>
        </div>
        <div className="stat-card" style={{ background: "white", padding: "20px", borderRadius: "8px", boxShadow: "0 4px 6px rgba(0,0,0,0.05)" }}>
          <p style={{ color: "#666", margin: "0 0 8px 0" }}>Revenue</p>
          <h2 style={{ margin: 0, fontSize: "1.8rem" }}>₹85,000</h2>
        </div>
      </section>

      {/* Recent Bookings Section Panel */}
      <section className="bookings-section" style={{ background: "white", padding: "25px", borderRadius: "8px", boxShadow: "0 4px 6px rgba(0,0,0,0.05)" }}>
        <h3 style={{ marginBottom: "20px" }}>Recent Bookings</h3>
        <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
          <thead>
            <tr style={{ borderBottom: "1px solid #eee", color: "#777" }}>
              <th style={{ padding: "12px" }}>Guest</th>
              <th style={{ padding: "12px" }}>Room</th>
              <th style={{ padding: "12px" }}>Status</th>
            </tr>
          </thead>
          <tbody>
            <tr style={{ borderBottom: "1px solid #eee" }}>
              <td style={{ padding: "12px" }}><strong>Rahul</strong></td>
              <td style={{ padding: "12px" }}>Room 101</td>
              <td style={{ padding: "12px" }}><span style={{ padding: "4px 10px", borderRadius: "12px", backgroundColor: "#e1f5fe", color: "#0288d1" }}>Checked In</span></td>
            </tr>
            <tr style={{ borderBottom: "1px solid #eee" }}>
              <td style={{ padding: "12px" }}><strong>Ananya</strong></td>
              <td style={{ padding: "12px" }}>Room 205</td>
              <td style={{ padding: "12px" }}><span style={{ padding: "4px 10px", borderRadius: "12px", backgroundColor: "#fff3e0", color: "#f57c00" }}>Reserved</span></td>
            </tr>
          </tbody>
        </table>
      </section>
    </div>
  );
}