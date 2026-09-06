import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { LogOut, CheckCircle, Clock, Utensils, Bell } from "lucide-react";

export default function SupervisorDashboard() {
  const [kots, setKots] = useState([]);
  const [activeTab, setActiveTab] = useState("Active"); // 'Active' or 'Completed'
  const [notifications, setNotifications] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate();

  const fetchKots = () => {
    fetch("http://localhost:5000/api/kots")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setKots(data.data);
        }
      })
      .catch((err) => console.error("Error fetching KOTs:", err));
  };

  const fetchNotifications = () => {
    fetch("http://localhost:5000/api/notifications/Supervisor")
      .then(res => res.json())
      .then(data => {
        if (data.success) setNotifications(data.data);
      })
      .catch(err => console.error("Error fetching notifications:", err));
  };

  useEffect(() => {
    fetchKots();
    fetchNotifications();
    const interval = setInterval(() => {
      fetchKots();
      fetchNotifications();
    }, 5000); // Live poll every 5s
    return () => clearInterval(interval);
  }, []);

  // 1. Mark as Complete -> instantly moves to completed list AND immediately pushes order to Cashier Open Bills
  const handleCompleteKOT = async (id) => {
    try {
      // First update status to Completed locally/on server status endpoint
      await fetch(`http://localhost:5000/api/kots/status/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "Completed" })
      });

      // Instantly trigger push to cashier open bills behind the scenes in one click
      await fetch(`http://localhost:5000/api/kots/push-to-cashier/${id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" }
      });

      fetchKots(); 
    } catch (err) {
      console.error("Failed to complete and push KOT", err);
    }
  };

  const markNotificationRead = (id) => {
    fetch(`http://localhost:5000/api/notifications/read/${id}`, { method: "PUT" })
      .then(() => fetchNotifications());
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  const activeKots = kots.filter((k) => (k.status || "").toLowerCase() === "active");
  const completedKots = kots.filter((k) => (k.status || "").toLowerCase() === "completed");
  const unreadCount = notifications.filter(n => n.is_read === 0).length;

  const filteredKots = activeTab === "Active" ? activeKots : completedKots;

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100vh", fontFamily: "Inter, sans-serif", backgroundColor: "#f8fafc" }}>
      {/* Header */}
      <header style={{ height: "60px", backgroundColor: "#0f172a", color: "#fff", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 24px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
          <h2 style={{ margin: 0, fontSize: "18px" }}>Supervisor Dashboard - Live KOT Monitor</h2>
          <div style={{ display: "flex", gap: "10px" }}>
            <button 
              onClick={() => setActiveTab("Active")}
              style={{ padding: "6px 14px", backgroundColor: activeTab === "Active" ? "#d97706" : "#334155", color: "#fff", border: "none", borderRadius: "6px", cursor: "pointer", fontWeight: "bold", fontSize: "12px" }}
            >
              Active KOTs ({activeKots.length})
            </button>
            <button 
              onClick={() => setActiveTab("Completed")}
              style={{ padding: "6px 14px", backgroundColor: activeTab === "Completed" ? "#16a34a" : "#334155", color: "#fff", border: "none", borderRadius: "6px", cursor: "pointer", fontWeight: "bold", fontSize: "12px" }}
            >
              Completed KOTs ({completedKots.length})
            </button>
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
          {/* Notifications Bell Component */}
          <div style={{ position: "relative", display: "inline-block" }}>
            <button 
              onClick={() => setShowDropdown(!showDropdown)}
              style={{ background: "none", border: "none", color: "#fff", cursor: "pointer", position: "relative", padding: "6px", display: "flex", alignItems: "center" }}
            >
              <Bell size={22} />
              {unreadCount > 0 && (
                <span style={{ position: "absolute", top: "-2px", right: "-2px", background: "#dc2626", color: "#fff", fontSize: "10px", padding: "2px 6px", borderRadius: "50%", fontWeight: "bold" }}>
                  {unreadCount}
                </span>
              )}
            </button>

            {showDropdown && (
              <div style={{ position: "absolute", right: 0, top: "40px", width: "320px", background: "#fff", color: "#0f172a", borderRadius: "8px", boxShadow: "0 4px 15px rgba(0,0,0,0.2)", zIndex: 1000, padding: "12px", maxHeight: "400px", overflowY: "auto", textAlign: "left" }}>
                <h4 style={{ margin: "0 0 10px 0", fontSize: "14px", borderBottom: "1px solid #e2e8f0", paddingBottom: "6px" }}>Supervisor Alerts & Warnings</h4>
                {notifications.length === 0 ? (
                  <p style={{ fontSize: "12px", color: "#64748b", textAlign: "center" }}>No alerts received</p>
                ) : (
                  notifications.map(n => (
                    <div 
                      key={n.id} 
                      onClick={() => markNotificationRead(n.id)}
                      style={{ padding: "10px", borderBottom: "1px solid #f1f5f9", backgroundColor: n.is_read === 0 ? "#fee2e2" : "#f8fafc", borderRadius: "6px", marginBottom: "6px", cursor: "pointer" }}
                    >
                      <div style={{ fontWeight: "bold", fontSize: "12px", color: n.is_read === 0 ? "#991b1b" : "#0f172a" }}>{n.title}</div>
                      <div style={{ fontSize: "11px", color: "#475569", marginTop: "2px" }}>{n.message}</div>
                      <div style={{ fontSize: "9px", color: "#94a3b8", marginTop: "4px", textAlign: "right" }}>{new Date(n.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>

          <span style={{ fontSize: "14px" }}>Supervisor</span>
          <button onClick={handleLogout} style={{ backgroundColor: "#dc2626", color: "#fff", border: "none", padding: "6px 12px", borderRadius: "6px", cursor: "pointer", display: "flex", alignItems: "center", gap: "6px", fontSize: "13px" }}>
            <LogOut size={16} /> Logout
          </button>
        </div>
      </header>

      {/* Content Body */}
      <div style={{ flex: 1, padding: "24px", overflowY: "auto" }}>
        <h3 style={{ margin: "0 0 16px 0", color: "#0f172a", display: "flex", alignItems: "center", gap: "8px" }}>
          <Utensils size={20} /> {activeTab} Kitchen Orders
        </h3>

        {filteredKots.length === 0 ? (
          <div style={{ textAlign: "center", color: "#64748b", padding: "60px", backgroundColor: "#ffffff", borderRadius: "12px", border: "1px solid #e2e8f0" }}>
            <h3>No {activeTab.toLowerCase()} KOT orders found.</h3>
            <p style={{ fontSize: "13px" }}>Orders will appear here instantly when processed.</p>
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: "16px" }}>
            {filteredKots.map((kot) => {
              const isCompleted = (kot.status || "").toLowerCase() === "completed";
              
              // Read warning status correctly from backend fields (warningStatus or warning_status)
              const currentWarning = kot.warningStatus || kot.warning_status;
              const isCritical = currentWarning === 'Critical';
              const isWarning = currentWarning === 'Warning';
              
              const cardBg = isCritical ? "#fef2f2" : isWarning ? "#fffbeb" : "#ffffff";
              const borderColor = isCritical ? "#dc2626" : isWarning ? "#f59e0b" : (isCompleted ? "#16a34a" : "#cbd5e1");

              return (
                <div 
                  key={kot.id} 
                  style={{ 
                    backgroundColor: cardBg, 
                    borderRadius: "10px", 
                    border: `2px solid ${borderColor}`, 
                    boxShadow: "0 2px 5px rgba(0,0,0,0.05)", 
                    padding: "16px", 
                    display: "flex", 
                    flexDirection: "column", 
                    justifyContent: "space-between" 
                  }}
                >
                  <div>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid #f1f5f9", paddingBottom: "8px", marginBottom: "10px" }}>
                      <span style={{ fontWeight: "bold", color: "#0f172a", fontSize: "15px" }}>{kot.kotNo || `KOT #${kot.id}`}</span>
                      <span style={{ backgroundColor: "#e0f2fe", color: "#0369a1", padding: "2px 8px", borderRadius: "4px", fontSize: "12px", fontWeight: "bold" }}>Table: {kot.table}</span>
                    </div>

                    <div style={{ fontSize: "12px", color: isCritical ? "#991b1b" : "#64748b", display: "flex", alignItems: "center", gap: "6px", marginBottom: "12px" }}>
                      <Clock size={14} /> {kot.dateStr} {kot.time} | <strong>{kot.customer}</strong>
                      {isCritical && <span style={{ marginLeft: "auto", color: "#dc2626", fontWeight: "bold" }}>⚠️ CRITICAL DELAY</span>}
                      {isWarning && <span style={{ marginLeft: "auto", color: "#d97706", fontWeight: "bold" }}>⚠️ DELAYED</span>}
                    </div>

                    <div style={{ display: "flex", flexDirection: "column", gap: "6px", marginBottom: "16px" }}>
                      {kot.items && kot.items.map((item, idx) => (
                        <div key={idx} style={{ display: "flex", justifyContent: "space-between", fontSize: "13px", backgroundColor: isCritical ? "#fee2e2" : "#f8fafc", padding: "6px 10px", borderRadius: "6px" }}>
                          <span style={{ fontWeight: "500", color: "#334155" }}>{item.name}</span>
                          <span style={{ fontWeight: "bold", color: "#0f172a" }}>x{item.qty}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    {isCompleted ? (
                      <div style={{ padding: "10px", backgroundColor: "#f0fdf4", color: "#15803d", border: "1px solid #bbf7d0", borderRadius: "6px", fontWeight: "bold", fontSize: "13px", textAlign: "center", display: "flex", alignItems: "center", justifyContent: "center", gap: "6px" }}>
                        <CheckCircle size={15} /> Completed & Sent to Open Bills
                      </div>
                    ) : (
                      <button 
                        onClick={() => handleCompleteKOT(kot.id)}
                        style={{ width: "100%", padding: "10px", backgroundColor: isCritical ? "#dc2626" : "#16a34a", color: "#fff", border: "none", borderRadius: "6px", fontWeight: "bold", cursor: "pointer", fontSize: "13px", display: "flex", alignItems: "center", justifyContent: "center", gap: "6px" }}
                      >
                        <CheckCircle size={16} /> {isCritical ? "Critical - Mark as Complete" : "Mark as Complete"}
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}