import React, { useState, useEffect } from "react";
import { Calendar, RefreshCw, CheckCircle, Clock, AlertCircle, Search, Sun, Moon, Info } from "lucide-react";

export default function AttendanceManagement() {
  const [attendanceList, setAttendanceList] = useState([]);
  const [activityTimeline, setActivityTimeline] = useState([]);
  const [leaveSummary, setLeaveSummary] = useState([]);
  const [loading, setLoading] = useState(false);
  
  // Automatically set default date to today's date in YYYY-MM-DD format
  const [selectedDate, setSelectedDate] = useState(() => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  });

  const [sessionFilter, setSessionFilter] = useState("All Sessions");
  const [searchQuery, setSearchQuery] = useState("");

  const fetchAttendanceData = async () => {
    try {
      setLoading(true);
      // Fetch live attendance and active user logins from backend
      const res = await fetch("http://localhost:5000/api/attendance/live");
      const data = await res.json();
      if (data.success && data.data) {
        setAttendanceList(data.data);

        // Automatically build Today's Activity Timeline based on logins
        const timeline = data.data.map((user, idx) => ({
          time: user.loginTime || "08:00 AM",
          description: `${user.employeeName || user.username} logged in successfully for the ${user.session} session.`,
          badge: "Login"
        }));
        setActivityTimeline(timeline);
      }

      // Fetch Leave Summary data
      const leaveRes = await fetch("http://localhost:5000/api/leaves");
      const leaveData = await leaveRes.json();
      if (leaveData.success && leaveData.data) {
        setLeaveSummary(leaveData.data.slice(0, 3));
      }
    } catch (err) {
      console.error("Error fetching attendance and timeline data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAttendanceData();
    const interval = setInterval(fetchAttendanceData, 4000); // Auto-sync in real time
    return () => clearInterval(interval);
  }, []);

  const totalEmployees = attendanceList.length;
  const presentCount = attendanceList.filter(a => a.status === "Present").length;

  const filteredList = attendanceList.filter(item => {
    const matchesSearch = item.username?.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          item.employeeName?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSession = sessionFilter === "All Sessions" || item.session === sessionFilter;
    return matchesSearch && matchesSession;
  });

  return (
    <div style={{ padding: "24px", fontFamily: "Inter, sans-serif", backgroundColor: "#f8fafc", minHeight: "100vh", color: "#0f172a", boxSizing: "border-box" }}>
      
      {/* Top Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px", backgroundColor: "#fff", padding: "20px 24px", borderRadius: "12px", border: "1px solid #e2e8f0" }}>
        <div>
          <h2 style={{ margin: 0, fontSize: "20px", fontWeight: "bold" }}>Attendance Management</h2>
          <p style={{ margin: "4px 0 0 0", color: "#64748b", fontSize: "13px" }}>Real-time attendance tracking based on backend login activity.</p>
        </div>
        <button onClick={fetchAttendanceData} style={{ backgroundColor: "#1e293b", color: "#fff", border: "none", padding: "9px 14px", borderRadius: "8px", cursor: "pointer", display: "flex", alignItems: "center", gap: "6px", fontWeight: "bold", fontSize: "13px" }}>
          <RefreshCw size={15} /> {loading ? "Syncing..." : "Refresh"}
        </button>
      </div>

      {/* KPI Metric Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: "14px", marginBottom: "20px" }}>
        <div style={{ backgroundColor: "#fff", padding: "16px", borderRadius: "10px", border: "1px solid #e2e8f0" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div style={{ fontSize: "22px", fontWeight: "bold", color: "#0f172a" }}>{totalEmployees}</div>
            <div style={{ backgroundColor: "#e0f2fe", padding: "8px", borderRadius: "8px" }}><Clock size={18} color="#0284c7" /></div>
          </div>
          <div style={{ fontSize: "12px", color: "#64748b", fontWeight: "600", marginTop: "6px" }}>Total Employees</div>
          <div style={{ fontSize: "11px", color: "#94a3b8" }}>All Branch</div>
        </div>

        <div style={{ backgroundColor: "#fff", padding: "16px", borderRadius: "10px", border: "1px solid #e2e8f0" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div style={{ fontSize: "22px", fontWeight: "bold", color: "#16a34a" }}>{presentCount}</div>
            <div style={{ backgroundColor: "#dcfce7", padding: "8px", borderRadius: "8px" }}><CheckCircle size={18} color="#16a34a" /></div>
          </div>
          <div style={{ fontSize: "12px", color: "#64748b", fontWeight: "600", marginTop: "6px" }}>Present</div>
          <div style={{ fontSize: "11px", color: "#94a3b8" }}>Marked Present</div>
        </div>

        <div style={{ backgroundColor: "#fff", padding: "16px", borderRadius: "10px", border: "1px solid #e2e8f0" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div style={{ fontSize: "22px", fontWeight: "bold", color: "#d97706" }}>0</div>
            <div style={{ backgroundColor: "#fef3c7", padding: "8px", borderRadius: "8px" }}><Clock size={18} color="#d97706" /></div>
          </div>
          <div style={{ fontSize: "12px", color: "#64748b", fontWeight: "600", marginTop: "6px" }}>On Break</div>
          <div style={{ fontSize: "11px", color: "#94a3b8" }}>Auto-Break Active</div>
        </div>

        <div style={{ backgroundColor: "#fff", padding: "16px", borderRadius: "10px", border: "1px solid #e2e8f0" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div style={{ fontSize: "22px", fontWeight: "bold", color: "#dc2626" }}>0</div>
            <div style={{ backgroundColor: "#fee2e2", padding: "8px", borderRadius: "8px" }}><AlertCircle size={18} color="#dc2626" /></div>
          </div>
          <div style={{ fontSize: "12px", color: "#64748b", fontWeight: "600", marginTop: "6px" }}>On Leave</div>
          <div style={{ fontSize: "11px", color: "#94a3b8" }}>Approved Leaves</div>
        </div>

        <div style={{ backgroundColor: "#fff", padding: "16px", borderRadius: "10px", border: "1px solid #e2e8f0" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div style={{ fontSize: "22px", fontWeight: "bold", color: "#2563eb" }}>0</div>
            <div style={{ backgroundColor: "#dbeafe", padding: "8px", borderRadius: "8px" }}><Clock size={18} color="#2563eb" /></div>
          </div>
          <div style={{ fontSize: "12px", color: "#64748b", fontWeight: "600", marginTop: "6px" }}>Late</div>
          <div style={{ fontSize: "11px", color: "#94a3b8" }}>Delayed Logins</div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px", backgroundColor: "#fff", padding: "14px 20px", borderRadius: "10px", border: "1px solid #e2e8f0" }}>
        <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
          <div style={{ display: "flex", alignItems: "center", backgroundColor: "#f8fafc", padding: "6px 10px", borderRadius: "6px", border: "1px solid #cbd5e1", gap: "6px" }}>
            <Calendar size={15} color="#64748b" />
            <input type="date" value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)} style={{ border: "none", background: "transparent", fontSize: "13px", fontWeight: "bold", outline: "none" }} />
          </div>
          <select value={sessionFilter} onChange={(e) => setSessionFilter(e.target.value)} style={{ padding: "7px 12px", borderRadius: "6px", border: "1px solid #cbd5e1", backgroundColor: "#f8fafc", fontSize: "13px", fontWeight: "500" }}>
            <option>All Sessions</option>
            <option>Morning</option>
            <option>Evening</option>
          </select>
        </div>

        <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
          <div style={{ display: "flex", alignItems: "center", backgroundColor: "#f8fafc", padding: "6px 12px", borderRadius: "6px", border: "1px solid #cbd5e1", gap: "8px", width: "260px" }}>
            <Search size={15} color="#94a3b8" />
            <input type="text" placeholder="Search by name or username..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} style={{ border: "none", background: "transparent", fontSize: "13px", outline: "none", width: "100%" }} />
          </div>
        </div>
      </div>

      {/* Session Details Bar */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", backgroundColor: "#fff", padding: "14px 20px", borderRadius: "10px", border: "1px solid #e2e8f0", marginBottom: "16px", fontSize: "13px", alignItems: "center" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}><Sun size={16} color="#d97706" /><div><strong>Morning Session</strong><div style={{ fontSize: "11px", color: "#64748b" }}>06:00 AM - 02:00 PM</div></div></div>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}><Moon size={16} color="#4f46e5" /><div><strong>Evening Session</strong><div style={{ fontSize: "11px", color: "#64748b" }}>02:00 PM - 10:00 PM</div></div></div>
        <div><strong>Working Hours / Day</strong><div style={{ fontSize: "11px", color: "#64748b" }}>8 Hrs</div></div>
        <div><strong>Break Duration</strong><div style={{ fontSize: "11px", color: "#64748b" }}>1 Hr</div></div>
        <div><strong>Auto Break</strong><div style={{ fontSize: "11px", color: "#64748b" }}>After 1 Hr</div></div>
      </div>

      {/* Attendance Overview Table */}
      <div style={{ backgroundColor: "#fff", borderRadius: "10px", border: "1px solid #e2e8f0", overflow: "hidden", marginBottom: "20px" }}>
        <div style={{ backgroundColor: "#0284c7", color: "#fff", padding: "12px 16px", fontWeight: "bold", fontSize: "13px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span>Attendance Overview ({selectedDate})</span>
          <div style={{ display: "flex", gap: "14px", fontSize: "11px", fontWeight: "normal" }}>
            <span>🟢 Present</span>
            <span>🟠 On Break</span>
            <span>🔴 Late</span>
            <span>🔵 On Leave</span>
            <span>⚪ Absent</span>
          </div>
        </div>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13px", textAlign: "left" }}>
          <thead>
            <tr style={{ backgroundColor: "#f8fafc", color: "#64748b", borderBottom: "1px solid #e2e8f0", fontSize: "12px" }}>
              <th style={{ padding: "12px 16px" }}>Emp ID</th>
              <th style={{ padding: "12px 16px" }}>Employee Name</th>
              <th style={{ padding: "12px 16px" }}>Username</th>
              <th style={{ padding: "12px 16px" }}>Session</th>
              <th style={{ padding: "12px 16px" }}>Login Time</th>
              <th style={{ padding: "12px 16px" }}>Break Time (Auto)</th>
              <th style={{ padding: "12px 16px" }}>Logout Time</th>
              <th style={{ padding: "12px 16px" }}>Working Hours</th>
              <th style={{ padding: "12px 16px" }}>Status</th>
              <th style={{ padding: "12px 16px" }}>Remark</th>
            </tr>
          </thead>
          <tbody>
            {filteredList.length === 0 ? (
              <tr>
                <td colSpan="10" style={{ textAlign: "center", padding: "35px", color: "#94a3b8", fontStyle: "italic" }}>
                  No active logins recorded yet. Employees will appear here automatically as **Present** once they log in through the login page.
                </td>
              </tr>
            ) : (
              filteredList.map((row, idx) => (
                <tr key={idx} style={{ borderBottom: "1px solid #f1f5f9" }}>
                  <td style={{ padding: "14px 16px", fontWeight: "bold" }}>{row.empId}</td>
                  <td style={{ padding: "14px 16px", fontWeight: "600" }}>{row.employeeName}</td>
                  <td style={{ padding: "14px 16px", color: "#64748b" }}>{row.username}</td>
                  <td style={{ padding: "14px 16px" }}>{row.session}</td>
                  <td style={{ padding: "14px 16px", color: "#334155" }}>{row.loginTime}</td>
                  <td style={{ padding: "14px 16px", color: "#64748b" }}>{row.breakTime}</td>
                  <td style={{ padding: "14px 16px", color: "#334155" }}>{row.logoutTime}</td>
                  <td style={{ padding: "14px 16px", fontWeight: "600" }}>{row.workingHours}</td>
                  <td style={{ padding: "14px 16px" }}>
                    <span style={{ backgroundColor: "#dcfce7", color: "#16a34a", padding: "4px 10px", borderRadius: "12px", fontSize: "11px", fontWeight: "bold", display: "inline-flex", alignItems: "center", gap: "4px" }}>
                      ● Present
                    </span>
                  </td>
                  <td style={{ padding: "14px 16px", color: "#64748b" }}>{row.remark}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Bottom 2-Column Section: Today's Activity Timeline & Leave Summary */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", marginBottom: "20px" }}>
        
        {/* Today's Activity Timeline */}
        <div style={{ backgroundColor: "#fff", padding: "20px", borderRadius: "10px", border: "1px solid #e2e8f0" }}>
          <h4 style={{ margin: "0 0 16px 0", fontSize: "15px", fontWeight: "bold", color: "#0f172a" }}>Today's Activity Timeline</h4>
          {activityTimeline.length === 0 ? (
            <div style={{ fontSize: "12px", color: "#94a3b8", fontStyle: "italic" }}>No login activities recorded yet today.</div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              {activityTimeline.map((item, idx) => (
                <div key={idx} style={{ display: "flex", alignItems: "flex-start", gap: "12px", fontSize: "13px", borderBottom: "1px solid #f1f5f9", paddingBottom: "8px" }}>
                  <span style={{ backgroundColor: "#e0f2fe", color: "#0284c7", padding: "2px 8px", borderRadius: "6px", fontSize: "11px", fontWeight: "bold" }}>{item.time}</span>
                  <span style={{ color: "#334155" }}>{item.description}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Leave Summary */}
        <div style={{ backgroundColor: "#fff", padding: "20px", borderRadius: "10px", border: "1px solid #e2e8f0" }}>
          <h4 style={{ margin: "0 0 16px 0", fontSize: "15px", fontWeight: "bold", color: "#0f172a" }}>Leave Summary (This Month)</h4>
          {leaveSummary.length === 0 ? (
            <div style={{ fontSize: "12px", color: "#94a3b8", fontStyle: "italic" }}>No leave requests submitted for this month.</div>
          ) : (
            <table style={{ width: "100%", fontSize: "12px", borderCollapse: "collapse", textAlign: "left" }}>
              <thead>
                <tr style={{ color: "#64748b", borderBottom: "1px solid #e2e8f0" }}>
                  <th style={{ paddingBottom: "8px" }}>Leave ID</th>
                  <th style={{ paddingBottom: "8px" }}>Type</th>
                  <th style={{ paddingBottom: "8px" }}>Date</th>
                  <th style={{ paddingBottom: "8px" }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {leaveSummary.map((leave, idx) => (
                  <tr key={idx} style={{ borderBottom: "1px solid #f1f5f9" }}>
                    <td style={{ padding: "8px 0", fontWeight: "bold", color: "#0284c7" }}>{leave.id}</td>
                    <td>{leave.leaveType}</td>
                    <td>{leave.fromDate}</td>
                    <td><span style={{ color: leave.status === "Approved" ? "#16a34a" : "#f97316", fontWeight: "bold" }}>{leave.status}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

      </div>

    </div>
  );
}