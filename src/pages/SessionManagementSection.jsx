import React, { useState, useEffect, useCallback } from "react";
import { Calendar, RefreshCw, Sun, Moon } from "lucide-react";

export default function SessionManagementSection() {
  // Dynamically set today's date automatically on load and refresh
  const [selectedDate, setSelectedDate] = useState(() => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  });

  const [sessionsData, setSessionsData] = useState({
    stats: { totalCashiers: 12, presentToday: 10, absentToday: 2, totalSessions: 24, totalWorkingHours: "110h 30m" },
    cashier1: [
      { id: 1, name: "Rahul Sharma", session: "Morning Session", timing: "06.00 AM - 02:00 PM", login: "09:01 AM", logout: "02:03 PM", breakTime: "0h 30m", workingHours: "4h 32m", extraHours: "0h 32m", status: "Completed", attendance: "Present" },
      { id: 2, name: "Anjali Verma", session: "Evening Session", timing: "02:00 PM - 11:00 PM", login: "02:05 PM", logout: "11:00 PM", breakTime: "0h 45m", workingHours: "8h 10m", extraHours: "0h 00m", status: "Completed", attendance: "Present" },
      { id: 3, name: "Pooja Patel", session: "Morning Session", timing: "06:00 AM - 03:00 PM", login: "--:--", logout: "--:--", breakTime: "--", workingHours: "--", extraHours: "--", status: "Not Started", attendance: "Absent" },
      { id: 4, name: "Vikram Singh", session: "Evening Session", timing: "02:00 PM - 11:00 PM", login: "--:--", logout: "--:--", breakTime: "--", workingHours: "--", extraHours: "--", status: "Not Started", attendance: "Absent" }
    ],
    cashier2: [
      { id: 1, name: "Sandeep Kumar", session: "Morning Session", timing: "06:00 AM - 02:00 PM", login: "08:55 AM", logout: "02:01 PM", breakTime: "0h 30m", workingHours: "4h 36m", extraHours: "0h 25m", status: "Completed", attendance: "Present" },
      { id: 2, name: "Neha Joshi", session: "Evening Session", timing: "02:00 PM - 11:00 PM", login: "02:02 PM", logout: "09:58 PM", breakTime: "0h 40m", workingHours: "7h 16m", extraHours: "0h 00m", status: "Completed", attendance: "Present" },
      { id: 3, name: "Arjun Mehta", session: "Morning Session", timing: "06:00 AM - 02:00 PM", login: "09:10 AM", logout: "--:--", breakTime: "--", workingHours: "--", extraHours: "--", status: "Active", attendance: "Present" },
      { id: 4, name: "Kavya Reddy", session: "Evening Session", timing: "02:00 PM - 11:00 PM", login: "--:--", logout: "--:--", breakTime: "--", workingHours: "--", extraHours: "--", status: "Not Started", attendance: "Absent" }
    ]
  });

  const [loading, setLoading] = useState(false);

  const fetchSessionsFromBackend = useCallback(async () => {
    try {
      setLoading(true);
      // Automatically reset date to today on refresh
      const today = new Date();
      const year = today.getFullYear();
      const month = String(today.getMonth() + 1).padStart(2, '0');
      const day = String(today.getDate()).padStart(2, '0');
      setSelectedDate(`${year}-${month}-${day}`);

      const res = await fetch("http://localhost:5000/api/sessions");
      const data = await res.json();
      if (data.success && data.data && data.data.cashier1) {
        setSessionsData(data.data);
      }
    } catch (err) {
      console.error("Error fetching sessions:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSessionsFromBackend();
  }, [fetchSessionsFromBackend]);

  const getStatusBadge = (status) => {
    switch (status) {
      case "Completed":
        return <span style={{ backgroundColor: "#dcfce7", color: "#16a34a", padding: "3px 10px", borderRadius: "12px", fontSize: "11px", fontWeight: "bold", display: "inline-flex", alignItems: "center", gap: "4px" }}>● Completed</span>;
      case "Active":
        return <span style={{ backgroundColor: "#dbeafe", color: "#2563eb", padding: "3px 10px", borderRadius: "12px", fontSize: "11px", fontWeight: "bold", display: "inline-flex", alignItems: "center", gap: "4px" }}>● Active</span>;
      default:
        return <span style={{ backgroundColor: "#f1f5f9", color: "#64748b", padding: "3px 10px", borderRadius: "12px", fontSize: "11px", fontWeight: "bold", display: "inline-flex", alignItems: "center", gap: "4px" }}>● Not Started</span>;
    }
  };

  const getAttendanceBadge = (attendance) => {
    return attendance === "Present" ? (
      <span style={{ backgroundColor: "#dcfce7", color: "#16a34a", padding: "3px 10px", borderRadius: "12px", fontSize: "11px", fontWeight: "bold", display: "inline-flex", alignItems: "center", gap: "4px" }}>● Present</span>
    ) : (
      <span style={{ backgroundColor: "#fee2e2", color: "#dc2626", padding: "3px 10px", borderRadius: "12px", fontSize: "11px", fontWeight: "bold", display: "inline-flex", alignItems: "center", gap: "4px" }}>● Absent</span>
    );
  };

  return (
    <div style={{ padding: "24px", fontFamily: "Inter, sans-serif", backgroundColor: "#f8fafc", minHeight: "100vh", color: "#0f172a", overflowY: "auto", boxSizing: "border-box" }}>
      
      {/* Header & Controls */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px", backgroundColor: "#fff", padding: "20px 24px", borderRadius: "12px", border: "1px solid #e2e8f0", boxShadow: "0 1px 3px rgba(0,0,0,0.05)" }}>
        <div>
          <h2 style={{ margin: 0, fontSize: "20px", color: "#0f172a", fontWeight: "bold" }}>Session Management & Attendance</h2>
          <p style={{ margin: "4px 0 0 0", color: "#64748b", fontSize: "13px" }}>Manage sessions (Morning & Evening) and view attendance for Cashier 1 & Cashier 2.</p>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <button 
            onClick={fetchSessionsFromBackend} 
            title="Refresh Data"
            style={{ backgroundColor: "#1e293b", color: "#fff", border: "none", padding: "9px 14px", borderRadius: "8px", cursor: "pointer", display: "flex", alignItems: "center", gap: "6px", fontWeight: "bold", fontSize: "13px" }}
          >
            <RefreshCw size={15} /> {loading ? "Syncing..." : "Refresh"}
          </button>
          <div style={{ display: "flex", alignItems: "center", backgroundColor: "#f1f5f9", padding: "7px 12px", borderRadius: "8px", border: "1px solid #cbd5e1", gap: "8px" }}>
            <Calendar size={16} color="#64748b" />
            <input 
              type="date" 
              value={selectedDate} 
              onChange={(e) => setSelectedDate(e.target.value)}
              style={{ border: "none", outline: "none", fontSize: "13px", fontWeight: "bold", color: "#0f172a", background: "transparent" }}
            />
          </div>
        </div>
      </div>

      {/* KPI Metric Summary Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: "16px", marginBottom: "24px" }}>
        <div style={{ backgroundColor: "#fff", padding: "16px", borderRadius: "10px", border: "1px solid #e2e8f0", boxShadow: "0 1px 2px rgba(0,0,0,0.04)" }}>
          <div style={{ fontSize: "22px", fontWeight: "bold", color: "#0f172a" }}>{sessionsData.stats.totalCashiers}</div>
          <div style={{ fontSize: "12px", color: "#64748b", fontWeight: "600", marginTop: "4px" }}>Total Cashiers</div>
          <div style={{ fontSize: "11px", color: "#94a3b8", marginTop: "2px" }}>All Registered</div>
        </div>
        <div style={{ backgroundColor: "#fff", padding: "16px", borderRadius: "10px", border: "1px solid #e2e8f0", boxShadow: "0 1px 2px rgba(0,0,0,0.04)" }}>
          <div style={{ fontSize: "22px", fontWeight: "bold", color: "#16a34a" }}>{sessionsData.stats.presentToday}</div>
          <div style={{ fontSize: "12px", color: "#64748b", fontWeight: "600", marginTop: "4px" }}>Present Today</div>
          <div style={{ fontSize: "11px", color: "#94a3b8", marginTop: "2px" }}>Marked Present</div>
        </div>
        <div style={{ backgroundColor: "#fff", padding: "16px", borderRadius: "10px", border: "1px solid #e2e8f0", boxShadow: "0 1px 2px rgba(0,0,0,0.04)" }}>
          <div style={{ fontSize: "22px", fontWeight: "bold", color: "#dc2626" }}>{sessionsData.stats.absentToday}</div>
          <div style={{ fontSize: "12px", color: "#64748b", fontWeight: "600", marginTop: "4px" }}>Absent Today</div>
          <div style={{ fontSize: "11px", color: "#94a3b8", marginTop: "2px" }}>Not Marked In</div>
        </div>
        <div style={{ backgroundColor: "#fff", padding: "16px", borderRadius: "10px", border: "1px solid #e2e8f0", boxShadow: "0 1px 2px rgba(0,0,0,0.04)" }}>
          <div style={{ fontSize: "22px", fontWeight: "bold", color: "#7c3aed" }}>{sessionsData.stats.totalSessions}</div>
          <div style={{ fontSize: "12px", color: "#64748b", fontWeight: "600", marginTop: "4px" }}>Total Sessions</div>
          <div style={{ fontSize: "11px", color: "#94a3b8", marginTop: "2px" }}>Total Sessions on {selectedDate}</div>
        </div>
        <div style={{ backgroundColor: "#fff", padding: "16px", borderRadius: "10px", border: "1px solid #e2e8f0", boxShadow: "0 1px 2px rgba(0,0,0,0.04)" }}>
          <div style={{ fontSize: "22px", fontWeight: "bold", color: "#d97706" }}>{sessionsData.stats.totalWorkingHours}</div>
          <div style={{ fontSize: "12px", color: "#64748b", fontWeight: "600", marginTop: "4px" }}>Total Working Hours</div>
          <div style={{ fontSize: "11px", color: "#94a3b8", marginTop: "2px" }}>Today (All)</div>
        </div>
      </div>

      {/* Filters Bar */}
      <div style={{ display: "flex", gap: "12px", marginBottom: "20px" }}>
        <select style={{ padding: "8px 14px", borderRadius: "6px", border: "1px solid #cbd5e1", backgroundColor: "#fff", fontSize: "13px", fontWeight: "500" }}>
          <option>All Cashiers</option>
          <option>Cashier 1</option>
          <option>Cashier 2</option>
        </select>
        <select style={{ padding: "8px 14px", borderRadius: "6px", border: "1px solid #cbd5e1", backgroundColor: "#fff", fontSize: "13px", fontWeight: "500" }}>
          <option>All Sessions</option>
          <option>Morning Session</option>
          <option>Evening Session</option>
        </select>
      </div>

      {/* CASHIER 1 TABLE */}
      <div style={{ backgroundColor: "#fff", borderRadius: "10px", border: "1px solid #e2e8f0", marginBottom: "20px", overflow: "hidden", boxShadow: "0 1px 3px rgba(0,0,0,0.05)" }}>
        <div style={{ backgroundColor: "#0284c7", color: "#fff", padding: "10px 16px", fontWeight: "bold", fontSize: "13px", letterSpacing: "0.5px" }}>
          CASHIER 1
        </div>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13px", textAlign: "left" }}>
          <thead>
            <tr style={{ backgroundColor: "#f8fafc", color: "#64748b", borderBottom: "1px solid #e2e8f0", fontSize: "12px", fontWeight: "bold" }}>
              <th style={{ padding: "10px 16px", width: "50px" }}>#</th>
              <th style={{ padding: "10px 16px" }}>Cashier Name</th>
              <th style={{ padding: "10px 16px" }}>Session</th>
              <th style={{ padding: "10px 16px" }}>Login Time</th>
              <th style={{ padding: "10px 16px" }}>Logout Time</th>
              <th style={{ padding: "10px 16px" }}>Break Time</th>
              <th style={{ padding: "10px 16px" }}>Working Hours</th>
              <th style={{ padding: "10px 16px" }}>Extra Hours</th>
              <th style={{ padding: "10px 16px" }}>Session Status</th>
              <th style={{ padding: "10px 16px" }}>Attendance Status</th>
            </tr>
          </thead>
          <tbody>
            {sessionsData.cashier1.map((row) => (
              <tr key={row.id} style={{ borderBottom: "1px solid #f1f5f9" }}>
                <td style={{ padding: "12px 16px", fontWeight: "bold", color: "#64748b" }}>{row.id}</td>
                <td style={{ padding: "12px 16px", fontWeight: "600", color: "#0f172a" }}>{row.name}</td>
                <td style={{ padding: "12px 16px" }}>
                  <div style={{ fontWeight: "600", color: "#1e293b", display: "flex", alignItems: "center", gap: "6px" }}>
                    {row.session.includes("Morning") ? <Sun size={14} color="#d97706" /> : <Moon size={14} color="#4f46e5" />}
                    {row.session}
                  </div>
                  <div style={{ fontSize: "11px", color: "#64748b" }}>{row.timing}</div>
                </td>
                <td style={{ padding: "12px 16px", color: "#334155" }}>{row.login}</td>
                <td style={{ padding: "12px 16px", color: "#334155" }}>{row.logout}</td>
                <td style={{ padding: "12px 16px", color: "#334155" }}>{row.breakTime}</td>
                <td style={{ padding: "12px 16px", fontWeight: "600", color: "#0f172a" }}>{row.workingHours}</td>
                <td style={{ padding: "12px 16px", color: "#16a34a", fontWeight: "600" }}>{row.extraHours}</td>
                <td style={{ padding: "12px 16px" }}>{getStatusBadge(row.status)}</td>
                <td style={{ padding: "12px 16px" }}>{getAttendanceBadge(row.attendance)}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div style={{ backgroundColor: "#f8fafc", padding: "10px 16px", textAlign: "right", fontWeight: "bold", fontSize: "13px", borderTop: "1px solid #e2e8f0" }}>
          Total Working Hours (Cashier 1): <span style={{ color: "#0284c7" }}>13h 14m</span>
        </div>
      </div>

      {/* CASHIER 2 TABLE */}
      <div style={{ backgroundColor: "#fff", borderRadius: "10px", border: "1px solid #e2e8f0", marginBottom: "20px", overflow: "hidden", boxShadow: "0 1px 3px rgba(0,0,0,0.05)" }}>
        <div style={{ backgroundColor: "#0284c7", color: "#fff", padding: "10px 16px", fontWeight: "bold", fontSize: "13px", letterSpacing: "0.5px" }}>
          CASHIER 2
        </div>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13px", textAlign: "left" }}>
          <thead>
            <tr style={{ backgroundColor: "#f8fafc", color: "#64748b", borderBottom: "1px solid #e2e8f0", fontSize: "12px", fontWeight: "bold" }}>
              <th style={{ padding: "10px 16px", width: "50px" }}>#</th>
              <th style={{ padding: "10px 16px" }}>Cashier Name</th>
              <th style={{ padding: "10px 16px" }}>Session</th>
              <th style={{ padding: "10px 16px" }}>Login Time</th>
              <th style={{ padding: "10px 16px" }}>Logout Time</th>
              <th style={{ padding: "10px 16px" }}>Break Time</th>
              <th style={{ padding: "10px 16px" }}>Working Hours</th>
              <th style={{ padding: "10px 16px" }}>Extra Hours</th>
              <th style={{ padding: "10px 16px" }}>Session Status</th>
              <th style={{ padding: "10px 16px" }}>Attendance Status</th>
            </tr>
          </thead>
          <tbody>
            {sessionsData.cashier2.map((row) => (
              <tr key={row.id} style={{ borderBottom: "1px solid #f1f5f9" }}>
                <td style={{ padding: "12px 16px", fontWeight: "bold", color: "#64748b" }}>{row.id}</td>
                <td style={{ padding: "12px 16px", fontWeight: "600", color: "#0f172a" }}>{row.name}</td>
                <td style={{ padding: "12px 16px" }}>
                  <div style={{ fontWeight: "600", color: "#1e293b", display: "flex", alignItems: "center", gap: "6px" }}>
                    {row.session.includes("Morning") ? <Sun size={14} color="#d97706" /> : <Moon size={14} color="#4f46e5" />}
                    {row.session}
                  </div>
                  <div style={{ fontSize: "11px", color: "#64748b" }}>{row.timing}</div>
                </td>
                <td style={{ padding: "12px 16px", color: "#334155" }}>{row.login}</td>
                <td style={{ padding: "12px 16px", color: "#334155" }}>{row.logout}</td>
                <td style={{ padding: "12px 16px", color: "#334155" }}>{row.breakTime}</td>
                <td style={{ padding: "12px 16px", fontWeight: "600", color: "#0f172a" }}>{row.workingHours}</td>
                <td style={{ padding: "12px 16px", color: "#16a34a", fontWeight: "600" }}>{row.extraHours}</td>
                <td style={{ padding: "12px 16px" }}>{getStatusBadge(row.status)}</td>
                <td style={{ padding: "12px 16px" }}>{getAttendanceBadge(row.attendance)}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div style={{ backgroundColor: "#f8fafc", padding: "10px 16px", textAlign: "right", fontWeight: "bold", fontSize: "13px", borderTop: "1px solid #e2e8f0" }}>
          Total Working Hours (Cashier 2): <span style={{ color: "#0284c7" }}>12h 17m</span>
        </div>
      </div>

      {/* Bottom Info Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "16px" }}>
        <div style={{ backgroundColor: "#fff", padding: "16px", borderRadius: "10px", border: "1px solid #e2e8f0" }}>
          <h4 style={{ margin: "0 0 10px 0", fontSize: "13px", color: "#0f172a", fontWeight: "bold" }}>Session Timings</h4>
          <div style={{ fontSize: "12px", color: "#334155", marginBottom: "6px" }}>☀️ Morning Session: 06:00 AM - 02:50 PM</div>
          <div style={{ fontSize: "12px", color: "#334155" }}>🌙 Evening Session: 02:00 PM - 11:00 PM</div>
        </div>
        <div style={{ backgroundColor: "#fff", padding: "16px", borderRadius: "10px", border: "1px solid #e2e8f0" }}>
          <h4 style={{ margin: "0 0 10px 0", fontSize: "13px", color: "#0f172a", fontWeight: "bold" }}>Note</h4>
          <div style={{ fontSize: "11px", color: "#64748b", lineHeight: "1.4" }}>
            • Attendance is marked based on login within 30 minutes of session start.<br />
            • Minimum 4 hours of each session is required to be marked as Present.<br />
            • Both sessions are required for full-day attendance.
          </div>
        </div>
        <div style={{ backgroundColor: "#fff", padding: "16px", borderRadius: "10px", border: "1px solid #e2e8f0" }}>
          <h4 style={{ margin: "0 0 10px 0", fontSize: "13px", color: "#0f172a", fontWeight: "bold" }}>Legend (Session Status)</h4>
          <div style={{ fontSize: "11px", color: "#64748b", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "4px" }}>
            <span>🟢 Completed</span><span>🔵 Active</span>
            <span>⚪ Not Started</span><span>⏱️ Overtime recorded</span>
          </div>
        </div>
      </div>

    </div>
  );
}