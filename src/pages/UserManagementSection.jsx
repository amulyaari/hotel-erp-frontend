import React, { useState, useEffect, useCallback } from "react";
import { Plus, Edit2, Trash2, Check, X, ArrowLeft } from "lucide-react";

export default function UserManagementSection() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [editFormData, setEditFormData] = useState({});
  const [isAdding, setIsAdding] = useState(false);
  const [selectedUserForView, setSelectedUserForView] = useState(null);

  const [payrollData, setPayrollData] = useState({
    baseSalary: 12000,
    presenceDays: 28,
    lateArrivalDays: 2,
    extraHours: 10,
    missedHours: 0,
    tips: 4500,
    cashAdvance: 1500,
    otherDeductions: 0
  });

  const [newUser, setNewUser] = useState({
    id: "C0W05",
    full_name: "",
    username: "",
    password: "",
    job_role: "Waiter",
    employment_status: "Active",
    contact_info: "",
    join_date: "24/08/2026"
  });

  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch("http://localhost:5000/api/users");
      const data = await res.json();
      
      let rawData = [];
      if (data.success && data.data) {
        rawData = data.data;
      } else if (Array.isArray(data)) {
        rawData = data;
      }

      const normalized = rawData.length > 0 ? rawData.map((u, index) => ({
        id: u.id || u.worker_id || `C0W0${index + 1}`,
        full_name: u.full_name || u.name || `User ${index + 1}`,
        username: u.username || `user${index + 1}`,
        password: u.password || "••••••••",
        job_role: u.job_role || (index < 2 ? "Cashier" : "Waiter"),
        employment_status: u.employment_status || u.status || "Active",
        contact_info: u.contact_info || u.email || `user${index + 1}@hotel.com`,
        join_date: u.join_date || "18/01/2022"
      })) : [];

      setUsers(normalized);
    } catch (err) {
      console.error("Error fetching users:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleToggleStatus = async (user) => {
    const newStatus = user.employment_status === "Active" ? "Inactive" : "Active";
    const updatedUser = { ...user, employment_status: newStatus };

    try {
      await fetch(`http://localhost:5000/api/users/${user.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedUser)
      });
      setUsers(users.map(u => u.id === user.id ? updatedUser : u));
    } catch (err) {
      setUsers(users.map(u => u.id === user.id ? updatedUser : u));
    }
  };

  const handleSaveNewUser = async () => {
    if (!newUser.full_name.trim() || !newUser.username.trim()) {
      alert("Please enter Full Name and Username!");
      return;
    }

    try {
      await fetch("http://localhost:5000/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newUser)
      });

      setIsAdding(false);
      fetchUsers();
    } catch (err) {
      console.error("Error adding user:", err);
    }
  };

  const handleDeleteUser = async (id) => {
    if (!window.confirm(`Are you sure you want to remove worker ${id}?`)) return;
    try {
      await fetch(`http://localhost:5000/api/users/${id}`, { method: "DELETE" });
      setUsers(users.filter(u => u.id !== id));
    } catch (err) {
      console.error("Error deleting user:", err);
    }
  };

  const startEditing = (user) => {
    setEditingId(user.id);
    setEditFormData({ ...user });
  };

  const handleSaveEdit = async (id) => {
    try {
      await fetch(`http://localhost:5000/api/users/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editFormData)
      });
      setEditingId(null);
      fetchUsers();
    } catch (err) {
      console.error("Error updating user:", err);
    }
  };

  // Payroll calculations
  const dailyBaseRate = Math.round(payrollData.baseSalary / 30);
  const presenceSalary = payrollData.presenceDays * dailyBaseRate;
  const lateDeduction = payrollData.lateArrivalDays * 100;
  const overtimePay = payrollData.extraHours * 150;
  const extraHoursDeduction = payrollData.missedHours * 200;
  const subtotalEarnings = presenceSalary - lateDeduction + overtimePay - extraHoursDeduction;
  const netSalary = subtotalEarnings + payrollData.tips;
  const totalNetPayable = netSalary - payrollData.cashAdvance - payrollData.otherDeductions;

  if (selectedUserForView) {
    return (
      <div style={{ padding: "24px", fontFamily: "Inter, sans-serif", backgroundColor: "#f1f5f9", minHeight: "100vh", color: "#0f172a", overflowY: "auto", boxSizing: "border-box" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px", backgroundColor: "#fff", padding: "16px 24px", borderRadius: "10px", border: "1px solid #cbd5e1" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <button 
              onClick={() => setSelectedUserForView(null)}
              style={{ display: "flex", alignItems: "center", gap: "6px", backgroundColor: "#0284c7", color: "#fff", border: "none", padding: "8px 14px", borderRadius: "6px", fontWeight: "bold", cursor: "pointer", fontSize: "13px" }}
            >
              <ArrowLeft size={16} /> Back to Directory
            </button>
            <h2 style={{ margin: 0, fontSize: "1.2rem", color: "#0f172a" }}>Payroll Calculator: {selectedUserForView.full_name} ({selectedUserForView.job_role})</h2>
          </div>
          <span style={{ fontSize: "0.85rem", color: "#64748b", fontWeight: "600" }}>ID: {selectedUserForView.id}</span>
        </div>

        <div style={{ backgroundColor: "#f8fafc", padding: "24px", borderRadius: "12px", border: "2px solid #cbd5e1", boxShadow: "0 10px 25px rgba(0,0,0,0.1)", display: "grid", gridTemplateColumns: "1.2fr 1.5fr 1.2fr 1.2fr", gap: "16px" }}>
          <div style={{ backgroundColor: "#fff", padding: "16px", borderRadius: "8px", border: "1px solid #cbd5e1" }}>
            <h3 style={{ margin: "0 0 14px 0", fontSize: "0.95rem", color: "#1e293b", borderBottom: "2px solid #e2e8f0", paddingBottom: "8px" }}>DATA INPUT</h3>
            <div style={{ marginBottom: "10px" }}>
              <label style={{ fontSize: "0.75rem", color: "#64748b", display: "block", marginBottom: "4px" }}>Base Salary (₹)</label>
              <input type="number" value={payrollData.baseSalary} onChange={(e) => setPayrollData({...payrollData, baseSalary: Number(e.target.value)})} style={{ width: "100%", padding: "6px", borderRadius: "4px", border: "1px solid #cbd5e1", fontSize: "0.85rem" }} />
            </div>
            <div style={{ marginBottom: "10px" }}>
              <label style={{ fontSize: "0.75rem", color: "#64748b", display: "block", marginBottom: "4px" }}>Presence Days (1-30)</label>
              <input type="number" value={payrollData.presenceDays} onChange={(e) => setPayrollData({...payrollData, presenceDays: Number(e.target.value)})} style={{ width: "100%", padding: "6px", borderRadius: "4px", border: "1px solid #cbd5e1", fontSize: "0.85rem" }} />
            </div>
            <div style={{ marginBottom: "10px" }}>
              <label style={{ fontSize: "0.75rem", color: "#64748b", display: "block", marginBottom: "4px" }}>Late Arrival Days</label>
              <input type="number" value={payrollData.lateArrivalDays} onChange={(e) => setPayrollData({...payrollData, lateArrivalDays: Number(e.target.value)})} style={{ width: "100%", padding: "6px", borderRadius: "4px", border: "1px solid #cbd5e1", fontSize: "0.85rem" }} />
            </div>
            <div style={{ marginBottom: "10px" }}>
              <label style={{ fontSize: "0.75rem", color: "#64748b", display: "block", marginBottom: "4px" }}>Extra Hours</label>
              <input type="number" value={payrollData.extraHours} onChange={(e) => setPayrollData({...payrollData, extraHours: Number(e.target.value)})} style={{ width: "100%", padding: "6px", borderRadius: "4px", border: "1px solid #cbd5e1", fontSize: "0.85rem" }} />
            </div>
            <div style={{ marginBottom: "14px" }}>
              <label style={{ fontSize: "0.75rem", color: "#64748b", display: "block", marginBottom: "4px" }}>Total Waiter Tips (₹)</label>
              <input type="number" value={payrollData.tips} onChange={(e) => setPayrollData({...payrollData, tips: Number(e.target.value)})} style={{ width: "100%", padding: "6px", borderRadius: "4px", border: "1px solid #cbd5e1", fontSize: "0.85rem" }} />
            </div>
          </div>

          <div style={{ backgroundColor: "#fff", padding: "16px", borderRadius: "8px", border: "1px solid #cbd5e1" }}>
            <h3 style={{ margin: "0 0 14px 0", fontSize: "0.95rem", color: "#1e293b", borderBottom: "2px solid #e2e8f0", paddingBottom: "8px" }}>CALCULATION VIEW</h3>
            <div style={{ fontSize: "0.8rem", fontWeight: "bold", color: "#0f172a", marginBottom: "6px" }}>EARNINGS</div>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.8rem", padding: "4px 0" }}><span>Daily Base Rate:</span><span>₹{dailyBaseRate}</span></div>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.8rem", padding: "4px 0" }}><span>Presence Salary:</span><span>₹{presenceSalary}</span></div>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.8rem", padding: "4px 0", color: "#dc2626" }}><span>Late Deduction:</span><span>-₹{lateDeduction}</span></div>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.8rem", padding: "4px 0", color: "#16a34a" }}><span>Overtime Pay:</span><span>+₹{overtimePay}</span></div>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.85rem", fontWeight: "bold", padding: "6px 0", backgroundColor: "#f8fafc", marginTop: "10px" }}><span>Subtotal:</span><span>₹{subtotalEarnings}</span></div>
          </div>

          <div style={{ backgroundColor: "#fff", padding: "16px", borderRadius: "8px", border: "1px solid #cbd5e1", display: "flex", flexDirection: "column", gap: "10px" }}>
            <h3 style={{ margin: "0 0 10px 0", fontSize: "0.95rem", color: "#1e293b", borderBottom: "2px solid #e2e8f0", paddingBottom: "8px" }}>SUMMARY</h3>
            <div style={{ backgroundColor: "#f8fafc", padding: "10px", borderRadius: "6px", border: "1px solid #e2e8f0" }}><div style={{ fontSize: "0.75rem", color: "#64748b" }}>Attendance Salary</div><div style={{ fontSize: "1.1rem", fontWeight: "bold" }}>₹{presenceSalary}</div></div>
            <div style={{ backgroundColor: "#f8fafc", padding: "10px", borderRadius: "6px", border: "1px solid #e2e8f0" }}><div style={{ fontSize: "0.75rem", color: "#64748b" }}>Tips</div><div style={{ fontSize: "1.1rem", fontWeight: "bold" }}>₹{payrollData.tips}</div></div>
          </div>

          <div style={{ backgroundColor: "#fff", padding: "16px", borderRadius: "8px", border: "1px solid #cbd5e1", display: "flex", flexDirection: "column", justifyContent: "space-between", alignItems: "center", textAlign: "center" }}>
            <div>
              <div style={{ fontSize: "0.85rem", fontWeight: "bold", color: "#1e293b", marginBottom: "16px" }}>TOTAL NET PAYABLE</div>
              <div style={{ fontSize: "2rem", fontWeight: "bold", color: "#16a34a", marginBottom: "20px" }}>₹{totalNetPayable}</div>
            </div>
            <div style={{ borderTop: "1px solid #e2e8f0", paddingTop: "12px", width: "100%" }}>
              <div style={{ fontStyle: "italic", fontFamily: "cursive", fontSize: "1.1rem", color: "#334155" }}>HR Dept.</div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: "24px", fontFamily: "Inter, sans-serif", backgroundColor: "#0f172a", minHeight: "100vh", color: "#fff", overflowY: "auto", boxSizing: "border-box" }}>
      <div style={{ backgroundColor: "#1e293b", padding: "20px 24px", borderRadius: "10px", border: "1px solid #334155", marginBottom: "20px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <h2 style={{ margin: 0, fontSize: "20px", color: "#fff", fontWeight: "bold" }}>User Management - Workers Directory</h2>
          <p style={{ margin: "4px 0 0 0", color: "#94a3b8", fontSize: "13px" }}>Hotel Team Members & Staff Directory with Database Sync</p>
        </div>
        <button 
          onClick={() => setIsAdding(true)} 
          style={{ display: "flex", alignItems: "center", gap: "6px", backgroundColor: "#16a34a", color: "#fff", border: "none", padding: "8px 16px", borderRadius: "6px", fontWeight: "bold", fontSize: "13px", cursor: "pointer" }}
        >
          <Plus size={16} /> + Add New User
        </button>
      </div>

      <div style={{ backgroundColor: "#1e293b", borderRadius: "10px", border: "1px solid #334155", overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13px", textAlign: "left" }}>
          <thead>
            <tr style={{ backgroundColor: "#334155", color: "#cbd5e1", borderBottom: "1px solid #475569", fontSize: "12px", fontWeight: "bold", textTransform: "uppercase" }}>
              <th style={{ padding: "12px 16px" }}>Worker ID</th>
              <th style={{ padding: "12px 16px" }}>Full Name</th>
              <th style={{ padding: "12px 16px" }}>Username</th>
              <th style={{ padding: "12px 16px" }}>Password</th>
              <th style={{ padding: "12px 16px" }}>Job Role</th>
              <th style={{ padding: "12px 16px" }}>Employment Status</th>
              <th style={{ padding: "12px 16px" }}>Contact Info</th>
              <th style={{ padding: "12px 16px" }}>Join Date</th>
              <th style={{ padding: "12px 16px", textAlign: "right" }}>Actions</th>
              <th style={{ padding: "12px 16px", textAlign: "center" }}>Options</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="10" style={{ textAlign: "center", padding: "40px", color: "#94a3b8" }}>Loading users...</td></tr>
            ) : users.length === 0 && !isAdding ? (
              <tr><td colSpan="10" style={{ textAlign: "center", padding: "40px", color: "#94a3b8" }}>No workers found.</td></tr>
            ) : (
              users.map((u) => {
                const isEditing = editingId === u.id;
                return (
                  <tr key={u.id} style={{ borderBottom: "1px solid #334155" }}>
                    <td style={{ padding: "14px 16px", fontWeight: "bold", color: "#fff" }}>{u.id}</td>
                    <td style={{ padding: "14px 16px" }}>
                      {isEditing ? <input type="text" value={editFormData.full_name || ""} onChange={(e) => setEditFormData({...editFormData, full_name: e.target.value})} style={{ padding: "4px 8px", borderRadius: "4px", border: "1px solid #64748b", background: "#0f172a", color: "#fff", width: "100%" }} /> : u.full_name}
                    </td>
                    <td style={{ padding: "14px 16px", color: "#cbd5e1" }}>
                      {isEditing ? <input type="text" value={editFormData.username || ""} onChange={(e) => setEditFormData({...editFormData, username: e.target.value})} style={{ padding: "4px 8px", borderRadius: "4px", border: "1px solid #64748b", background: "#0f172a", color: "#fff", width: "100%" }} /> : u.username}
                    </td>
                    <td style={{ padding: "14px 16px", color: "#cbd5e1" }}>
                      {isEditing ? <input type="text" value={editFormData.password || ""} onChange={(e) => setEditFormData({...editFormData, password: e.target.value})} style={{ padding: "4px 8px", borderRadius: "4px", border: "1px solid #64748b", background: "#0f172a", color: "#fff", width: "100%" }} /> : u.password}
                    </td>
                    <td style={{ padding: "14px 16px" }}>
                      {isEditing ? <select value={editFormData.job_role || "Waiter"} onChange={(e) => setEditFormData({...editFormData, job_role: e.target.value})} style={{ padding: "4px 8px", borderRadius: "4px", border: "1px solid #64748b", background: "#0f172a", color: "#fff" }}><option>Cashier</option><option>Waiter</option><option>Super Admin</option></select> : u.job_role}
                    </td>
                    <td style={{ padding: "14px 16px" }}>
                      <button onClick={() => handleToggleStatus(u)} style={{ backgroundColor: u.employment_status === "Active" ? "#16a34a" : "#dc2626", color: "#fff", padding: "4px 10px", borderRadius: "4px", fontSize: "11px", fontWeight: "bold", border: "none", cursor: "pointer" }}>
                        {u.employment_status}
                      </button>
                    </td>
                    <td style={{ padding: "14px 16px", color: "#94a3b8" }}>
                      {isEditing ? <input type="text" value={editFormData.contact_info || ""} onChange={(e) => setEditFormData({...editFormData, contact_info: e.target.value})} style={{ padding: "4px 8px", borderRadius: "4px", border: "1px solid #64748b", background: "#0f172a", color: "#fff", width: "100%" }} /> : u.contact_info}
                    </td>
                    <td style={{ padding: "14px 16px", color: "#94a3b8" }}>{u.join_date}</td>
                    <td style={{ padding: "14px 16px", textAlign: "right" }}>
                      {isEditing ? (
                        <div style={{ display: "flex", gap: "6px", justifyContent: "flex-end" }}>
                          <button onClick={() => handleSaveEdit(u.id)} style={{ background: "#16a34a", color: "#fff", border: "none", padding: "4px 8px", borderRadius: "4px", cursor: "pointer" }}><Check size={14}/></button>
                          <button onClick={() => setEditingId(null)} style={{ background: "#dc2626", color: "#fff", border: "none", padding: "4px 8px", borderRadius: "4px", cursor: "pointer" }}><X size={14}/></button>
                        </div>
                      ) : (
                        <div style={{ display: "flex", gap: "8px", justifyContent: "flex-end" }}>
                          <button onClick={() => startEditing(u)} style={{ backgroundColor: "#0284c7", color: "#fff", border: "none", padding: "5px 10px", borderRadius: "4px", cursor: "pointer", fontWeight: "bold", fontSize: "11px", display: "flex", alignItems: "center", gap: "3px" }}><Edit2 size={12} /> Edit</button>
                          <button onClick={() => handleDeleteUser(u.id)} style={{ backgroundColor: "#dc2626", color: "#fff", border: "none", padding: "5px 10px", borderRadius: "4px", cursor: "pointer", fontWeight: "bold", fontSize: "11px", display: "flex", alignItems: "center", gap: "3px" }}><Trash2 size={12} /> Remove</button>
                        </div>
                      )}
                    </td>
                    <td style={{ padding: "14px 16px", textAlign: "center" }}>
                      <button onClick={() => setSelectedUserForView(u)} style={{ backgroundColor: "#2563eb", color: "#fff", border: "none", padding: "5px 12px", borderRadius: "4px", cursor: "pointer", fontSize: "11px", fontWeight: "bold" }}>View</button>
                    </td>
                  </tr>
                );
              })
            )}

            {isAdding && (
              <tr style={{ backgroundColor: "#1e293b", borderTop: "2px solid #3b82f6" }}>
                <td style={{ padding: "14px 16px", fontWeight: "bold", color: "#3b82f6" }}>{newUser.id}</td>
                <td style={{ padding: "14px 16px" }}><input type="text" placeholder="Full Name" value={newUser.full_name} onChange={(e) => setNewUser({...newUser, full_name: e.target.value})} style={{ padding: "6px 10px", borderRadius: "4px", border: "1px solid #64748b", background: "#0f172a", color: "#fff", width: "100%", fontSize: "13px" }} /></td>
                <td style={{ padding: "14px 16px" }}><input type="text" placeholder="Username" value={newUser.username} onChange={(e) => setNewUser({...newUser, username: e.target.value})} style={{ padding: "6px 10px", borderRadius: "4px", border: "1px solid #64748b", background: "#0f172a", color: "#fff", width: "100%", fontSize: "13px" }} /></td>
                <td style={{ padding: "14px 16px" }}><input type="password" placeholder="Password" value={newUser.password} onChange={(e) => setNewUser({...newUser, password: e.target.value})} style={{ padding: "6px 10px", borderRadius: "4px", border: "1px solid #64748b", background: "#0f172a", color: "#fff", width: "100%", fontSize: "13px" }} /></td>
                <td style={{ padding: "14px 16px" }}><select value={newUser.job_role} onChange={(e) => setNewUser({...newUser, job_role: e.target.value})} style={{ padding: "6px 10px", borderRadius: "4px", border: "1px solid #64748b", background: "#0f172a", color: "#fff", width: "100%", fontSize: "13px" }}><option>Cashier</option><option>Waiter</option><option>Super Admin</option></select></td>
                <td style={{ padding: "14px 16px" }}><select value={newUser.employment_status} onChange={(e) => setNewUser({...newUser, employment_status: e.target.value})} style={{ padding: "6px 10px", borderRadius: "4px", border: "1px solid #64748b", background: "#0f172a", color: "#fff", width: "100%", fontSize: "13px" }}><option>Active</option><option>Inactive</option></select></td>
                <td style={{ padding: "14px 16px" }}><input type="text" placeholder="Contact Info" value={newUser.contact_info} onChange={(e) => setNewUser({...newUser, contact_info: e.target.value})} style={{ padding: "6px 10px", borderRadius: "4px", border: "1px solid #64748b", background: "#0f172a", color: "#fff", width: "100%", fontSize: "13px" }} /></td>
                <td style={{ padding: "14px 16px", color: "#94a3b8" }}>{newUser.join_date}</td>
                <td colSpan="2" style={{ padding: "14px 16px", textAlign: "right" }}>
                  <div style={{ display: "flex", gap: "6px", justifyContent: "flex-end" }}>
                    <button onClick={handleSaveNewUser} style={{ backgroundColor: "#2563eb", color: "#fff", border: "none", padding: "6px 14px", borderRadius: "6px", fontWeight: "bold", cursor: "pointer", fontSize: "12px" }}>Save User</button>
                    <button onClick={() => setIsAdding(false)} style={{ backgroundColor: "#dc2626", color: "#fff", border: "none", padding: "6px 14px", borderRadius: "6px", fontWeight: "bold", cursor: "pointer", fontSize: "12px" }}>Cancel</button>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}