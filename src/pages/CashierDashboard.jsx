import React, { useState, useEffect } from "react";
import POSBilling from "./POSBilling";
import OpenBillsDashboard from "./OpenBillsDashboard";
import { Bell } from "lucide-react";

export default function CashierDashboard() {
  const [activeTab, setActiveTab] = useState("Open Bills");
  const [openBillsList, setOpenBillsList] = useState([]);
  const [resumedBill, setResumedBill] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);

  const fetchNotifications = () => {
    fetch("http://localhost:5000/api/notifications/Cashier")
      .then(res => res.json())
      .then(data => {
        if (data.success) setNotifications(data.data);
      })
      .catch(err => console.log("Cashier notification fetch error:", err));
  };

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 10000);
    return () => clearInterval(interval);
  }, []);

  const markNotificationRead = (id) => {
    fetch(`http://localhost:5000/api/notifications/read/${id}`, { method: "PUT" })
      .then(() => fetchNotifications());
  };

  const handleResumeBill = (bill) => {
    setResumedBill(bill);
    setActiveTab("New Billing"); // Automatically switches to the billing view and opens payment
  };

  const unreadCount = notifications.filter(n => n.is_read === 0).length;

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100vh" }}>
      {/* Top Header Navigation Tabs & Notification Bell */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 24px", background: "#0f172a" }}>
        <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
          <button 
            onClick={() => setActiveTab("New Billing")} 
            style={{ padding: "8px 16px", backgroundColor: activeTab === "New Billing" ? "#0284c7" : "#1e293b", color: "#fff", border: "none", borderRadius: "6px", fontWeight: "bold", cursor: "pointer" }}
          >
            New Billing
          </button>
          <button 
            onClick={() => setActiveTab("Open Bills")} 
            style={{ padding: "8px 16px", backgroundColor: activeTab === "Open Bills" ? "#0284c7" : "#1e293b", color: "#fff", border: "none", borderRadius: "6px", fontWeight: "bold", cursor: "pointer" }}
          >
            Open Bills ({openBillsList.length})
          </button>
        </div>

        {/* Cashier Notification Bell Component */}
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
              <h4 style={{ margin: "0 0 10px 0", fontSize: "14px", borderBottom: "1px solid #e2e8f0", paddingBottom: "6px" }}>Cashier Critical Alerts</h4>
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
      </div>

      {/* Main View Router */}
      <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>
        {activeTab === "New Billing" && (
          <POSBilling 
            openBillsList={openBillsList} 
            setOpenBillsList={setOpenBillsList} 
            resumedBill={resumedBill}
            clearResumedBill={() => setResumedBill(null)}
          />
        )}

        {activeTab === "Open Bills" && (
          <OpenBillsDashboard 
            openBillsList={openBillsList} 
            setOpenBillsList={setOpenBillsList} 
            onResumeBill={handleResumeBill} // 👈 Connects the handler and stops the error alert
          />
        )}
      </div>
    </div>
  );
}