import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  LayoutGrid,
  Package,
  Truck,
  Users,
  Settings,
  Search,
  Bell,
  ChevronDown,
  LogOut,
  User,
  Activity,
  Clock,
  X,
  Calendar,
  Save,
  CheckSquare,
  FileText,
} from "lucide-react";

import ItemManagementSection from "./ItemManagementSection";
import SettingsSection from "./SettingsSection";
import VendorManagementSection from "./VendorManagementSection";
import SessionManagementSection from "./SessionManagementSection";
import AttendanceManagementSection from "./AttendanceManagement";
import LeaveManagementSection from "./LeaveManagement";

/* ==========================================================================
    MANAGE PROFILE SECTION COMPONENT
    ========================================================================== */
function ManageProfileSection({ currentUser }) {
  const [profileData, setProfileData] = useState({
    hotel_name: "Hotel ERP Management System",
    first_name: currentUser?.username || "Admin",
    last_name: "",
    email: currentUser?.email || "",
    phone: "",
    dob: "",
    address1: "",
    address2: "",
    city: "",
    state: "",
    postal_code: "",
    designation: "General Manager",
    preferred_currency: "₹ (INR)",
    primary_contact: "+1 555-0123",
  });

  useEffect(() => {
    fetch("http://localhost:5000/api/profile")
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.data) {
          setProfileData((prev) => ({
            ...prev,
            ...data.data,
            dob: data.data.dob ? data.data.dob.split("T")[0] : "",
          }));
        }
      })
      .catch((err) => console.error("Error loading profile:", err));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfileData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(profileData),
      });
      const result = await response.json();
      if (result.success) {
        alert("Hotel & Profile changes saved successfully!");
      } else {
        alert("Failed to save changes: " + result.message);
      }
    } catch (err) {
      console.error("Error saving profile:", err);
      alert("Server connection error while saving profile.");
    }
  };

  const inputStyle = {
    width: "100%",
    padding: "8px 12px",
    borderRadius: "6px",
    border: "1px solid #cbd5e1",
    fontSize: "13px",
    outline: "none",
    backgroundColor: "#ffffff",
    boxSizing: "border-box",
  };

  const labelStyle = {
    fontSize: "12px",
    fontWeight: "600",
    color: "#334155",
    display: "block",
    marginBottom: "4px",
  };

  return (
    <div style={{ backgroundColor: "#ffffff", borderRadius: "12px", padding: "24px", border: "1px solid #e2e8f0", maxWidth: "900px", margin: "0 auto", fontFamily: "Inter, sans-serif" }}>
      <h2 style={{ fontSize: "20px", fontWeight: "bold", color: "#0f172a", marginBottom: "20px" }}>Manage Profile</h2>

      <div style={{ border: "2px dashed #cbd5e1", borderRadius: "8px", padding: "20px", textAlign: "center", marginBottom: "24px", backgroundColor: "#f8fafc" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "16px" }}>
          <div style={{ width: "50px", height: "50px", borderRadius: "50%", backgroundColor: "#e2e8f0", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "20px" }}>
            👤
          </div>
          <div style={{ textAlign: "left" }}>
            <div style={{ fontSize: "14px", fontWeight: "600", color: "#0f172a" }}>Profile Picture</div>
            <div style={{ fontSize: "12px", color: "#64748b", marginBottom: "8px" }}>Drag & Drop or Click to Upload Profile Picture</div>
            <input type="file" id="profile-pic-upload" style={{ display: "none" }} />
            <label htmlFor="profile-pic-upload" style={{ padding: "6px 12px", backgroundColor: "#ffffff", border: "1px solid #cbd5e1", borderRadius: "6px", fontSize: "12px", fontWeight: "600", cursor: "pointer", color: "#334155" }}>
              Choose File
            </label>
          </div>
        </div>
      </div>

      <h3 style={{ fontSize: "15px", fontWeight: "bold", color: "#0f172a", marginBottom: "16px", borderBottom: "1px solid #e2e8f0", paddingBottom: "8px" }}>
        👤 Personal Information
      </h3>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "24px" }}>
        <div>
          <label style={labelStyle}>First Name</label>
          <input type="text" name="first_name" value={profileData.first_name} onChange={handleChange} style={inputStyle} placeholder="First Name" />
        </div>
        <div>
          <label style={labelStyle}>Last Name</label>
          <input type="text" name="last_name" value={profileData.last_name} onChange={handleChange} style={inputStyle} placeholder="Last Name" />
        </div>
        <div>
          <label style={labelStyle}>Email</label>
          <input type="email" name="email" value={profileData.email} onChange={handleChange} style={inputStyle} placeholder="Email" />
        </div>
        <div>
          <label style={labelStyle}>Phone Number</label>
          <input type="text" name="phone" value={profileData.phone} onChange={handleChange} style={inputStyle} placeholder="Phone Number" />
        </div>
        <div>
          <label style={labelStyle}>Date of Birth</label>
          <input type="date" name="dob" value={profileData.dob} onChange={handleChange} style={inputStyle} />
        </div>
        <div>
          <label style={labelStyle}>Admin Address Line 1</label>
          <input type="text" name="address1" value={profileData.address1} onChange={handleChange} style={inputStyle} placeholder="Street Address" />
        </div>
        <div>
          <label style={labelStyle}>Admin Address Line 2</label>
          <input type="text" name="address2" value={profileData.address2} onChange={handleChange} style={inputStyle} placeholder="Apt, Suite, Unit, etc." />
        </div>
        <div>
          <label style={labelStyle}>City</label>
          <input type="text" name="city" value={profileData.city} onChange={handleChange} style={inputStyle} placeholder="City Name" />
        </div>
        <div>
          <label style={labelStyle}>State/Province</label>
          <input type="text" name="state" value={profileData.state} onChange={handleChange} style={inputStyle} placeholder="State/Province" />
        </div>
        <div>
          <label style={labelStyle}>Postal Code</label>
          <input type="text" name="postal_code" value={profileData.postal_code} onChange={handleChange} style={inputStyle} placeholder="Zip/Postal Code" />
        </div>
      </div>

      <h3 style={{ fontSize: "15px", fontWeight: "bold", color: "#0f172a", marginBottom: "16px", borderBottom: "1px solid #e2e8f0", paddingBottom: "8px" }}>
        🏨 Hotel Specific Details
      </h3>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "24px" }}>
        <div>
          <label style={labelStyle}>Hotel Name</label>
          <input type="text" name="hotel_name" value={profileData.hotel_name} onChange={handleChange} style={inputStyle} placeholder="Enter Hotel Name" />
        </div>
        <div>
          <label style={labelStyle}>Designation</label>
          <select name="designation" value={profileData.designation} onChange={handleChange} style={inputStyle}>
            <option value="General Manager">General Manager</option>
            <option value="Supervisor">Supervisor</option>
            <option value="Owner">Owner</option>
          </select>
        </div>
        <div>
          <label style={labelStyle}>Preferred Currency</label>
          <input type="text" name="preferred_currency" value={profileData.preferred_currency} onChange={handleChange} style={inputStyle} />
        </div>
        <div>
          <label style={labelStyle}>Primary Contact Phone for Hotel</label>
          <input type="text" name="primary_contact" value={profileData.primary_contact} onChange={handleChange} style={inputStyle} />
        </div>
      </div>

      <div style={{ display: "flex", justifyContent: "flex-end", gap: "12px", borderTop: "1px solid #e2e8f0", paddingTop: "16px" }}>
        <button onClick={() => window.location.reload()} style={{ padding: "8px 16px", backgroundColor: "#f1f5f9", border: "1px solid #cbd5e1", borderRadius: "6px", fontSize: "13px", fontWeight: "600", color: "#334155", cursor: "pointer" }}>
          Cancel
        </button>
        <button onClick={handleSave} style={{ padding: "8px 20px", backgroundColor: "#0f172a", color: "#ffffff", border: "none", borderRadius: "6px", fontSize: "13px", fontWeight: "600", cursor: "pointer" }}>
          Save Changes
        </button>
      </div>
    </div>
  );
}

/* ==========================================================================
    USER MANAGEMENT SECTION (Workers Directory + Add User Modal + MySQL)
    ========================================================================== */
function ManageUsersSection() {
  const [workers, setWorkers] = useState([
    { id: "C01", name: "cashier01", role: "Cashier", status: "Active", contact: "cashier@1", joinDate: "18/01/2022", salary: 10000, advance: 1000 },
    { id: "C02", name: "cashier02", role: "Cashier", status: "Active", contact: "cashier@2", joinDate: "18/01/2022", salary: 10000, advance: 1000 },
    { id: "W01", name: "Rajesh Kumar", role: "Waiter", status: "Active", contact: "rajeshkumar@hotel.com", joinDate: "18/01/2022", salary: 9000, advance: 500 },
    { id: "W02", name: "Anita Singh", role: "Waiter", status: "Active", contact: "anitasingh@hotel.com", joinDate: "18/01/2022", salary: 9500, advance: 500 },
    { id: "W03", name: "David Lee", role: "Waiter", status: "Active", contact: "davidlee@hotel.com", joinDate: "18/01/2022", salary: 9200, advance: 800 },
    { id: "W04", name: "Davion Kase", role: "Waiter", status: "Active", contact: "davionkase@hotel.com", joinDate: "18/01/2022", salary: 9400, advance: 600 }
  ]);

  const [selectedWorker, setSelectedWorker] = useState(null);
  const [attendanceModalOpen, setAttendanceModalOpen] = useState(false);
  const [addUserModalOpen, setAddUserModalOpen] = useState(false);

  const [attendanceDate] = useState("11-08-2026");
  const [employmentStatus, setEmploymentStatus] = useState("Present");
  const [salaryStartDate, setSalaryStartDate] = useState("30-07-2026");
  const [advanceDate, setAdvanceDate] = useState("11-08-2026");
  const [baseSalary, setBaseSalary] = useState("10000.00");
  const [advanceTaken, setAdvanceTaken] = useState("1000.00");

  const [newUsername, setNewUsername] = useState("");
  const [newRole, setNewRole] = useState("Waiter");
  const [newEmail, setNewEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newSalary, setNewSalary] = useState("10000");

  const fetchWorkers = () => {
    fetch("http://localhost:5000/api/workers")
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.data) {
          setWorkers(data.data);
        }
      })
      .catch((err) => console.error("Error fetching workers:", err));
  };

  useEffect(() => {
    fetchWorkers();
  }, []);

  const handleOpenModal = (worker) => {
    setSelectedWorker(worker);
    setBaseSalary(worker.salary ? Number(worker.salary).toFixed(2) : "10000.00");
    setAdvanceTaken(worker.advance ? Number(worker.advance).toFixed(2) : "1000.00");
    setAttendanceModalOpen(true);
  };

  const handleRemoveWorker = async (id) => {
    if (window.confirm("Are you sure you want to remove this staff member?")) {
      try {
        const response = await fetch(`http://localhost:5000/api/workers/${id}`, { method: "DELETE" });
        const result = await response.json();
        if (result.success) {
          setWorkers(workers.filter(w => w.id !== id));
        } else {
          alert("Failed to remove worker.");
        }
      } catch (err) {
        console.error("Error deleting worker:", err);
      }
    }
  };

  const handleSaveAttendanceRecord = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/workers/attendance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: selectedWorker?.id || 2,
          role_id: 2,
          employee_status: employmentStatus,
          record_date: attendanceDate,
          join_date: selectedWorker?.joinDate || "18/01/2022",
          salary_start_date: salaryStartDate,
          advance_date: advanceDate,
          base_monthly_salary: baseSalary,
          advance_amount: advanceTaken,
        }),
      });

      const result = await response.json();
      if (result.success) {
        alert("Attendance and advance saved successfully to MySQL database!");
        setAttendanceModalOpen(false);
      } else {
        alert("Failed to save: " + result.message);
      }
    } catch (err) {
      console.error("Error saving record:", err);
      alert("Server connection error while saving record.");
    }
  };

  const handleAddUserSubmit = async (e) => {
    e.preventDefault();
    if (!newUsername) {
      alert("Please enter a username.");
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/api/users/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: newUsername,
          role: newRole,
          email: newEmail || `${newUsername.toLowerCase()}@hotel.com`,
          password: newPassword || "12345",
          base_salary: newSalary
        }),
      });

      const result = await response.json();
      if (result.success) {
        alert("New user added successfully and saved to MySQL Workbench!");
        setAddUserModalOpen(false);
        setNewUsername("");
        setNewEmail("");
        setNewPassword("");
        fetchWorkers();
      } else {
        alert("Failed to add user: " + result.message);
      }
    } catch (err) {
      console.error("Error adding user:", err);
      alert("Server connection error while adding user.");
    }
  };

  const remainingAfterAdvance = Number(baseSalary) - Number(advanceTaken);

  return (
    <div style={{ padding: "20px", fontFamily: "sans-serif", backgroundColor: "#0b1329", minHeight: "100vh", color: "#fff", boxSizing: "border-box" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
        <div>
          <h2 style={{ margin: 0, fontSize: "1.3rem", fontWeight: "bold", color: "#ffffff" }}>User Management - Workers Directory</h2>
          <p style={{ margin: "4px 0 0 0", color: "#94a3b8", fontSize: "0.85rem" }}>Hotel Team Members & Staff Directory</p>
        </div>
        <button
          onClick={() => setAddUserModalOpen(true)}
          style={{
            backgroundColor: "#16a34a",
            color: "#fff",
            border: "none",
            borderRadius: "6px",
            padding: "10px 16px",
            fontSize: "0.9rem",
            fontWeight: "bold",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: "6px"
          }}
        >
          ➕ Add New User
        </button>
      </div>

      <div style={{ backgroundColor: "#0f1a36", borderRadius: "8px", overflow: "hidden", border: "1px solid #1e293b" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: "0.9rem" }}>
          <thead>
            <tr style={{ borderBottom: "1px solid #1e293b", color: "#94a3b8" }}>
              <th style={{ padding: "14px 16px" }}>Worker ID</th>
              <th style={{ padding: "14px 16px" }}>Full Name</th>
              <th style={{ padding: "14px 16px" }}>Job Role</th>
              <th style={{ padding: "14px 16px" }}>Employment Status</th>
              <th style={{ padding: "14px 16px" }}>Contact Info</th>
              <th style={{ padding: "14px 16px" }}>Join Date</th>
              <th style={{ padding: "14px 16px" }}>Actions</th>
              <th style={{ padding: "14px 16px" }}>Options</th>
            </tr>
          </thead>
          <tbody>
            {workers.length === 0 ? (
              <tr>
                <td colSpan="8" style={{ padding: "20px", textAlign: "center", color: "#94a3b8" }}>No workers found in database.</td>
              </tr>
            ) : (
              workers.map((worker) => (
                <tr key={worker.id} style={{ borderBottom: "1px solid #1e293b" }}>
                  <td style={{ padding: "14px 16px", color: "#e2e8f0" }}>C0{worker.id}</td>
                  <td style={{ padding: "14px 16px", fontWeight: "bold", color: "#ffffff" }}>{worker.name}</td>
                  <td style={{ padding: "14px 16px", color: "#e2e8f0" }}>{worker.role || "Cashier"}</td>
                  <td style={{ padding: "14px 16px" }}>
                    <span style={{ backgroundColor: "#16a34a", color: "#fff", padding: "4px 10px", borderRadius: "12px", fontSize: "0.75rem", fontWeight: "bold" }}>
                      Active
                    </span>
                  </td>
                  <td style={{ padding: "14px 16px", color: "#94a3b8" }}>{worker.contact || `${worker.name}@hotel.com`}</td>
                  <td style={{ padding: "14px 16px", color: "#e2e8f0" }}>{worker.joinDate || "18/01/2022"}</td>
                  <td style={{ padding: "14px 16px" }}>
                    <button 
                      onClick={() => handleRemoveWorker(worker.id)}
                      style={{ backgroundColor: "#dc2626", color: "#fff", border: "none", padding: "6px 12px", borderRadius: "4px", cursor: "pointer", fontSize: "0.8rem", fontWeight: "bold" }}
                    >
                      Remove
                    </button>
                  </td>
                  <td style={{ padding: "14px 16px" }}>
                    <button 
                      onClick={() => handleOpenModal(worker)}
                      style={{ backgroundColor: "#2563eb", color: "#fff", border: "none", padding: "6px 16px", borderRadius: "4px", cursor: "pointer", fontSize: "0.8rem", fontWeight: "bold" }}
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {addUserModalOpen && (
        <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, backgroundColor: "rgba(0,0,0,0.7)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000 }}>
          <div style={{ backgroundColor: "#ffffff", color: "#0f172a", borderRadius: "12px", width: "450px", padding: "24px", boxShadow: "0 20px 25px -5px rgba(0,0,0,0.3)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px", borderBottom: "1px solid #e2e8f0", paddingBottom: "10px" }}>
              <h3 style={{ margin: 0, fontSize: "1.1rem", fontWeight: "bold" }}>Add New Staff Member</h3>
              <button onClick={() => setAddUserModalOpen(false)} style={{ background: "none", border: "none", cursor: "pointer", color: "#64748b" }}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleAddUserSubmit} style={{ display: "flex", flexDirection: "column", gap: "14px", fontSize: "0.9rem" }}>
              <div>
                <label style={{ display: "block", fontSize: "0.8rem", color: "#64748b", marginBottom: "4px" }}>Full Name / Username</label>
                <input type="text" value={newUsername} onChange={(e) => setNewUsername(e.target.value)} placeholder="e.g. Rahul Sharma" style={{ width: "100%", padding: "8px", borderRadius: "6px", border: "1px solid #cbd5e1", boxSizing: "border-box" }} required />
              </div>

              <div>
                <label style={{ display: "block", fontSize: "0.8rem", color: "#64748b", marginBottom: "4px" }}>Job Role</label>
                <select value={newRole} onChange={(e) => setNewRole(e.target.value)} style={{ width: "100%", padding: "8px", borderRadius: "6px", border: "1px solid #cbd5e1", backgroundColor: "#fff" }}>
                  <option value="Cashier">Cashier</option>
                  <option value="Waiter">Waiter</option>
                  <option value="Supervisor">Supervisor</option>
                </select>
              </div>

              <div>
                <label style={{ display: "block", fontSize: "0.8rem", color: "#64748b", marginBottom: "4px" }}>Email / Contact Info</label>
                <input type="email" value={newEmail} onChange={(e) => setNewEmail(e.target.value)} placeholder="rahul@hotel.com" style={{ width: "100%", padding: "8px", borderRadius: "6px", border: "1px solid #cbd5e1", boxSizing: "border-box" }} />
              </div>

              <div>
                <label style={{ display: "block", fontSize: "0.8rem", color: "#64748b", marginBottom: "4px" }}>Password</label>
                <input type="text" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder="Default: 12345" style={{ width: "100%", padding: "8px", borderRadius: "6px", border: "1px solid #cbd5e1", boxSizing: "border-box" }} />
              </div>

              <div>
                <label style={{ display: "block", fontSize: "0.8rem", color: "#64748b", marginBottom: "4px" }}>Base Monthly Salary (₹)</label>
                <input type="number" value={newSalary} onChange={(e) => setNewSalary(e.target.value)} style={{ width: "100%", padding: "8px", borderRadius: "6px", border: "1px solid #cbd5e1", boxSizing: "border-box" }} />
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px", marginTop: "10px" }}>
                <button type="button" onClick={() => setAddUserModalOpen(false)} style={{ padding: "8px 16px", backgroundColor: "#f1f5f9", border: "1px solid #cbd5e1", borderRadius: "6px", fontWeight: "bold", cursor: "pointer" }}>
                  Cancel
                </button>
                <button type="submit" style={{ padding: "8px 16px", backgroundColor: "#16a34a", color: "#fff", border: "none", borderRadius: "6px", fontWeight: "bold", cursor: "pointer" }}>
                  Save User to Database
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {attendanceModalOpen && selectedWorker && (
        <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, backgroundColor: "rgba(0,0,0,0.7)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000 }}>
          <div style={{ backgroundColor: "#ffffff", color: "#0f172a", borderRadius: "12px", width: "550px", padding: "24px", boxShadow: "0 20px 25px -5px rgba(0,0,0,0.3)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px", borderBottom: "1px solid #e2e8f0", paddingBottom: "10px" }}>
              <h3 style={{ margin: 0, fontSize: "1.1rem", fontWeight: "bold" }}>ADVANCED EMPLOYEE & ATTENDANCE DETAILS</h3>
              <button onClick={() => setAttendanceModalOpen(false)} style={{ background: "none", border: "none", cursor: "pointer", color: "#64748b" }}>
                <X size={20} />
              </button>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "16px", fontSize: "0.9rem" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", backgroundColor: "#f8fafc", padding: "10px 14px", borderRadius: "8px", border: "1px solid #cbd5e1" }}>
                <span style={{ fontWeight: "600", color: "#0284c7" }}>Select Attendance Date:</span>
                <div style={{ display: "flex", alignItems: "center", gap: "8px", backgroundColor: "#fff", padding: "4px 10px", borderRadius: "6px", border: "1px solid #cbd5e1" }}>
                  <span>{attendanceDate}</span>
                  <Calendar size={16} color="#0284c7" />
                </div>
              </div>

              <div>
                <label style={{ display: "block", fontSize: "0.8rem", color: "#64748b", marginBottom: "4px" }}>Employment Status (Attendance)</label>
                <select 
                  value={employmentStatus} 
                  onChange={(e) => setEmploymentStatus(e.target.value)}
                  style={{ width: "100%", padding: "10px", borderRadius: "6px", border: "1px solid #cbd5e1", backgroundColor: "#fff", fontSize: "0.9rem" }}
                >
                  <option value="Present">Present</option>
                  <option value="Absent">Absent</option>
                  <option value="Half Day">Half Day</option>
                </select>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                <div>
                  <label style={{ display: "block", fontSize: "0.8rem", color: "#64748b", marginBottom: "4px" }}>Salary Start Date</label>
                  <input type="text" value={salaryStartDate} onChange={(e) => setSalaryStartDate(e.target.value)} style={{ width: "100%", padding: "8px", borderRadius: "6px", border: "1px solid #cbd5e1", boxSizing: "border-box" }} />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "0.8rem", color: "#64748b", marginBottom: "4px" }}>Advance Date</label>
                  <input type="text" value={advanceDate} onChange={(e) => setAdvanceDate(e.target.value)} style={{ width: "100%", padding: "8px", borderRadius: "6px", border: "1px solid #cbd5e1", boxSizing: "border-box" }} />
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                <div>
                  <label style={{ display: "block", fontSize: "0.8rem", color: "#64748b", marginBottom: "4px" }}>Base Monthly Salary (₹)</label>
                  <input type="number" value={baseSalary} onChange={(e) => setBaseSalary(e.target.value)} style={{ width: "100%", padding: "8px", borderRadius: "6px", border: "1px solid #cbd5e1", boxSizing: "border-box" }} />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "0.8rem", color: "#64748b", marginBottom: "4px" }}>Advance Taken (₹)</label>
                  <input type="number" value={advanceTaken} onChange={(e) => setAdvanceTaken(e.target.value)} style={{ width: "100%", padding: "8px", borderRadius: "6px", border: "1px solid #cbd5e1", boxSizing: "border-box" }} />
                </div>
              </div>

              <div style={{ backgroundColor: "#f8fafc", padding: "12px", borderRadius: "8px", border: "1px solid #e2e8f0", display: "flex", flexDirection: "column", gap: "6px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", color: "#64748b" }}><span>Full Name:</span> <strong style={{ color: "#0f172a" }}>{selectedWorker.name}</strong></div>
                <div style={{ display: "flex", justifyContent: "space-between", color: "#64748b" }}><span>Base Monthly Salary:</span> <span>₹ {Number(baseSalary).toLocaleString("en-IN")}</span></div>
                <div style={{ display: "flex", justifyContent: "space-between", color: "#16a34a", fontWeight: "bold", fontSize: "1rem", borderTop: "1px solid #cbd5e1", paddingTop: "6px", marginTop: "4px" }}>
                  <span>Remaining After Advance</span>
                  <span>₹ {remainingAfterAdvance.toLocaleString("en-IN")}</span>
                </div>
              </div>
            </div>

            <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px", marginTop: "20px" }}>
              <button onClick={() => setAttendanceModalOpen(false)} style={{ padding: "8px 16px", backgroundColor: "#f1f5f9", border: "1px solid #cbd5e1", borderRadius: "6px", fontWeight: "bold", cursor: "pointer" }}>
                Cancel
              </button>
              <button onClick={handleSaveAttendanceRecord} style={{ padding: "8px 16px", backgroundColor: "#16a34a", color: "#fff", border: "none", borderRadius: "6px", fontWeight: "bold", cursor: "pointer", display: "flex", alignItems: "center", gap: "6px" }}>
                <Save size={16} /> Save Daily Record
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ==========================================================================
    OVERVIEW SECTION COMPONENT (Top Selling Items & Analytics)
    ========================================================================== */
function OverviewSection({ stats, subTab, updateMainStats }) {
  const [reportModalOpen, setReportModalOpen] = useState(false);
  const [reportPeriod, setReportPeriod] = useState("Today");
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0]);
  const [selectedMonth, setSelectedMonth] = useState("August");
  const [selectedYear, setSelectedYear] = useState("2026");
  const [modalStats, setModalStats] = useState(stats);
  const [activeDisplayStats, setActiveDisplayStats] = useState(stats);
  const [extendedData, setExtendedData] = useState({ topSellingItems: [], monthFinancials: { revenue: 0, expense: 0 } });

  const [monthHover, setMonthHover] = useState(false);
  const [yearHover, setYearHover] = useState(false);

  const monthsList = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  const yearsList = ["2024", "2025", "2026", "2027", "2028"];

  useEffect(() => {
    setModalStats(stats);
    setActiveDisplayStats(stats);
  }, [stats]);

  useEffect(() => {
    fetch("http://localhost:5000/api/analytics/overview-extended")
      .then(res => res.json())
      .then(data => {
        if (data.success && data.data) {
          setExtendedData(data.data);
        }
      })
      .catch(err => console.error("Error loading extended analytics:", err));
  }, []);

  const handlePeriodChange = async (newPeriod, dateVal, monthVal, yearVal) => {
    setReportPeriod(newPeriod);
    try {
      const query = `?period=${newPeriod}&date=${dateVal || selectedDate}&month=${monthVal || selectedMonth}&year=${yearVal || selectedYear}`;
      const response = await fetch(`http://localhost:5000/api/analytics/payments${query}`);
      const result = await response.json();
      if (result.success && result.data) {
        setModalStats(result.data);
      }
    } catch (err) {
      console.error("Failed to load filtered analytics:", err);
    }
  };

  const handleApplyFilter = () => {
    setActiveDisplayStats(modalStats);
    if (updateMainStats) {
      updateMainStats(modalStats);
    }
    setReportModalOpen(false);
  };

  if (!subTab) {
    return (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "60vh", color: "#64748b", fontSize: "16px", fontWeight: "600" }}>
        Please select a report option from the sidebar dropdown to view analytics.
      </div>
    );
  }

  const cardStyle = {
    backgroundColor: "#ffffff",
    borderRadius: "10px",
    padding: "20px",
    border: "1px solid #e2e8f0",
    boxShadow: "0 1px 3px rgba(0,0,0,0.02)",
  };

  const rawCashiers = activeDisplayStats?.cashierBreakdown || [];
  const cashiers = rawCashiers.filter(
    (c) => c.cashier_name?.toLowerCase() !== "admin" && c.role_id !== 1
  );

  let activeData = null;
  if (subTab !== "Overall Report") {
    activeData = cashiers.find((c) => c.cashier_name === subTab);
  }

  const overallCashierBills = cashiers.reduce((sum, c) => sum + Number(c.total_bills || 0), 0);
  const overallCashierRevenue = cashiers.reduce((sum, c) => sum + Number(c.total_amount || 0), 0);

  const rev = activeDisplayStats?.revenueStats || {};
  const totalRevenue = activeData ? Number(activeData.total_amount || 0) : (overallCashierRevenue > 0 ? overallCashierRevenue : Number(rev.totalRevenue || 0));
  const totalBills = activeData ? Number(activeData.total_bills || 0) : (overallCashierBills > 0 ? overallCashierBills : Number(rev.totalBills || 0));
  const aov = totalBills > 0 ? totalRevenue / totalBills : Number(rev.aov || 0);
  const growthPercent = rev.growthPercent || "+0.0%";

  const tax = activeDisplayStats?.taxStats || {};
  const sgst = activeData ? Number(activeData.total_amount || 0) * 0.09 : Number(tax.total_sgst || 0);
  const cgst = activeData ? Number(activeData.total_amount || 0) * 0.09 : Number(tax.total_cgst || 0);

  // Modal specific calculated metrics based on period filter
  const modalRev = modalStats?.revenueStats || {};
  const modalTotalRevenue = Number(modalRev.totalRevenue || 0);
  const modalTotalBills = Number(modalRev.totalBills || 0);
  const modalAov = modalTotalBills > 0 ? modalTotalRevenue / modalTotalBills : 0;
  const modalTax = modalStats?.taxStats || {};
  const modalSgst = Number(modalTax.total_sgst || 0);
  const modalCgst = Number(modalTax.total_cgst || 0);

  const typeBreakdown = activeDisplayStats?.typeBreakdown || [];
  const cashAmount = activeData ? Number(activeData.cash_amount || 0) : Number((typeBreakdown.find((t) => t.payment_type === "Cash") || {}).total_amount || Number(rev.cash_amount || 0));
  const upiAmount = activeData ? Number(activeData.upi_amount || 0) : Number((typeBreakdown.find((t) => t.payment_type === "UPI") || {}).total_amount || Number(rev.upi_amount || 0));
  const partialAmount = activeData ? Number(activeData.partial_amount || 0) : Number((typeBreakdown.find((t) => t.payment_type === "Partial") || {}).total_amount || 0);

  const splitTotal = cashAmount + upiAmount + partialAmount;
  const cashPercent = splitTotal > 0 ? Math.round((cashAmount / splitTotal) * 100) : 0;
  const upiPercent = splitTotal > 0 ? Math.round((upiAmount / splitTotal) * 100) : 0;

  const cashAngle = (cashPercent / 100) * 360;
  const upiAngle = cashAngle + (upiPercent / 100) * 360;
  const donutGradient = `conic-gradient(#6366f1 0deg ${cashAngle}deg, #10b981 ${cashAngle}deg ${upiAngle}deg, #f59e0b ${upiAngle}deg 360deg)`;

  const filteredCashiersList = activeData ? [activeData] : cashiers;

  const maxCash = Math.max(...cashiers.map(c => Number(c.cash_amount || 0)), 1000);
  const maxUpi = Math.max(...cashiers.map(c => Number(c.upi_amount || 0)), 1000);
  const maxPartial = Math.max(...cashiers.map(c => Number(c.partial_amount || 0)), 1000);

  const stockAlerts = activeDisplayStats?.stockAlerts || [];
  const vendorDeductions = activeDisplayStats?.vendorSummary?.totalVendorDeductions || 0;
  const totalItemSalesQty = extendedData.topSellingItems.reduce((sum, i) => sum + Number(i.total_qty || 0), 0);

  return (
    <div style={{ display: "flex", flexDirection: "column", width: "100%", gap: "18px", fontFamily: "Inter, sans-serif" }}>
      <div style={{ display: "flex", justifyContent: "flex-end" }}>
        <button
          onClick={() => { setReportModalOpen(true); handlePeriodChange(reportPeriod, selectedDate, selectedMonth, selectedYear); }}
          style={{
            backgroundColor: "#2563eb",
            color: "#ffffff",
            border: "none",
            borderRadius: "6px",
            padding: "8px 16px",
            fontSize: "13px",
            fontWeight: "600",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: "6px"
          }}
        >
          📊 Report Overview
        </button>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "16px" }}>
        <div style={cardStyle}>
          <div style={{ fontSize: "14px", color: "#64748b", fontWeight: "600" }}>Total Revenue</div>
          <div style={{ fontSize: "24px", fontWeight: "bold", color: "#0f172a", marginTop: "6px" }}>
            ₹{totalRevenue.toLocaleString("en-IN", { minimumFractionDigits: 2 })} {subTab === "Overall Report" && <span style={{ fontSize: "14px", color: "#16a34a", fontWeight: "600" }}>({growthPercent})</span>}
          </div>
        </div>

        <div style={cardStyle}>
          <div style={{ fontSize: "14px", color: "#64748b", fontWeight: "600" }}>Day-over-Day Growth</div>
          <div style={{ fontSize: "24px", fontWeight: "bold", color: "#16a34a", marginTop: "6px" }}>+0.0%</div>
          <div style={{ fontSize: "12px", color: "#94a3b8", marginTop: "4px" }}>Compared to same day last week</div>
        </div>

        <div style={cardStyle}>
          <div style={{ fontSize: "14px", color: "#64748b", fontWeight: "600" }}>Average Order Value (AOV)</div>
          <div style={{ fontSize: "24px", fontWeight: "bold", color: "#0f172a", marginTop: "6px" }}>
            ₹{aov.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
          </div>
          <div style={{ fontSize: "12px", color: "#94a3b8", marginTop: "4px" }}>Based on current orders</div>
        </div>

        <div style={cardStyle}>
          <div style={{ fontSize: "14px", color: "#64748b", fontWeight: "600" }}>Total Orders</div>
          <div style={{ fontSize: "24px", fontWeight: "bold", color: "#0f172a", marginTop: "6px" }}>{totalBills}</div>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1.2fr 2fr", gap: "16px" }}>
        <div style={cardStyle}>
          <h4 style={{ margin: "0 0 16px 0", fontSize: "16px", color: "#0f172a", fontWeight: "700" }}>Top Selling Items</h4>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-around" }}>
            {(() => {
              const dynamicColors = ["#2563eb", "#16a34a", "#f59e0b", "#ec4899", "#8b5cf6"];
              let cumulativePercent = 0;
              const conicStops = extendedData.topSellingItems.map((item, idx) => {
                const percentage = totalItemSalesQty > 0 ? (Number(item.total_qty) / totalItemSalesQty) * 100 : 0;
                const startAngle = cumulativePercent * 3.6;
                cumulativePercent += percentage;
                const endAngle = cumulativePercent * 3.6;
                const color = dynamicColors[idx % dynamicColors.length];
                return `${color} ${startAngle}deg ${endAngle}deg`;
              }).join(", ");

              const topDonutGradient = extendedData.topSellingItems.length > 0 ? `conic-gradient(${conicStops})` : "#e2e8f0";

              return (
                <div style={{
                  width: "110px", height: "110px", borderRadius: "50%",
                  background: topDonutGradient, boxShadow: "inset 0 0 0 15px #fff"
                }}></div>
              );
            })()}
            <div style={{ fontSize: "12px", display: "flex", flexDirection: "column", gap: "6px" }}>
              {extendedData.topSellingItems.length === 0 ? (
                <div style={{ color: "#64748b" }}>No sales recorded yet</div>
              ) : (
                extendedData.topSellingItems.map((item, idx) => {
                  const percentage = totalItemSalesQty > 0 ? Math.round((Number(item.total_qty) / totalItemSalesQty) * 100) : 0;
                  return (
                    <div key={idx} style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                      <span style={{ width: "10px", height: "10px", backgroundColor: ["#2563eb", "#16a34a", "#f59e0b", "#ec4899", "#8b5cf6"][idx % 5], display: "inline-block", borderRadius: "2px" }}></span>
                      {item.product_name} ({percentage}%)
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>

        <div style={cardStyle}>
          <h4 style={{ margin: "0 0 12px 0", fontSize: "16px", color: "#334155", fontWeight: "700" }}>Payment Type Breakdown</h4>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-around", height: "120px" }}>
            <div style={{ width: "75px", height: "75px", borderRadius: "50%", background: donutGradient }}></div>
            <div style={{ fontSize: "13px", display: "flex", flexDirection: "column", gap: "5px" }}>
              <div style={{ color: "#6366f1", fontWeight: "700" }}>● Cash: ₹{cashAmount.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</div>
              <div style={{ color: "#10b981", fontWeight: "700" }}>● UPI: ₹{upiAmount.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</div>
              <div style={{ color: "#f59e0b", fontWeight: "700" }}>● Partial: ₹{partialAmount.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</div>
            </div>
          </div>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: "16px" }}>
        <div style={cardStyle}>
          <h4 style={{ margin: "0 0 12px 0", fontSize: "16px", color: "#334155", fontWeight: "700" }}>Cash Payments</h4>
          <div style={{ display: "flex", alignItems: "flex-end", height: "120px", gap: "12px", paddingBottom: "4px", justifyContent: "center" }}>
            {filteredCashiersList.map((c, idx) => {
              const val = Number(c.cash_amount || 0);
              const heightPx = Math.max(Math.round((val / maxCash) * 60), 4);
              return (
                <div key={idx} style={{ flex: 1, maxWidth: "60px", textAlign: "center" }}>
                  <span style={{ fontSize: "12px", fontWeight: "bold", display: "block" }}>₹{val.toLocaleString("en-IN")}</span>
                  <div style={{ backgroundColor: "#0f172a", width: "26px", margin: "0 auto", height: `${heightPx}px`, borderRadius: "3px 3px 0 0", marginTop: "6px" }}></div>
                  <span style={{ fontSize: "13px", color: "#64748b", fontWeight: "600", display: "block", marginTop: "4px" }}>{c.cashier_name}</span>
                </div>
              );
            })}
          </div>
        </div>

        <div style={cardStyle}>
          <h4 style={{ margin: "0 0 12px 0", fontSize: "16px", color: "#334155", fontWeight: "700" }}>UPI Payments</h4>
          <div style={{ display: "flex", alignItems: "flex-end", height: "120px", gap: "12px", paddingBottom: "4px", justifyContent: "center" }}>
            {filteredCashiersList.map((c, idx) => {
              const val = Number(c.upi_amount || 0);
              const heightPx = Math.max(Math.round((val / maxUpi) * 60), 4);
              return (
                <div key={idx} style={{ flex: 1, maxWidth: "60px", textAlign: "center" }}>
                  <span style={{ fontSize: "12px", fontWeight: "bold", display: "block" }}>₹{val.toLocaleString("en-IN")}</span>
                  <div style={{ backgroundColor: "#10b981", width: "26px", margin: "0 auto", height: `${heightPx}px`, borderRadius: "3px 3px 0 0", marginTop: "6px" }}></div>
                  <span style={{ fontSize: "13px", color: "#64748b", fontWeight: "600", display: "block", marginTop: "4px" }}>{c.cashier_name}</span>
                </div>
              );
            })}
          </div>
        </div>

        <div style={cardStyle}>
          <h4 style={{ margin: "0 0 12px 0", fontSize: "16px", color: "#334155", fontWeight: "700" }}>Partial Payments</h4>
          <div style={{ display: "flex", alignItems: "flex-end", height: "120px", gap: "12px", paddingBottom: "4px", justifyContent: "center" }}>
            {filteredCashiersList.map((c, idx) => {
              const val = Number(c.partial_amount || 0);
              const heightPx = Math.max(Math.round((val / maxPartial) * 60), 4);
              return (
                <div key={idx} style={{ flex: 1, maxWidth: "60px", textAlign: "center" }}>
                  <span style={{ fontSize: "12px", fontWeight: "bold", display: "block" }}>₹{val.toLocaleString("en-IN")}</span>
                  <div style={{ backgroundColor: "#f59e0b", width: "26px", margin: "0 auto", height: `${heightPx}px`, borderRadius: "3px 3px 0 0", marginTop: "6px" }}></div>
                  <span style={{ fontSize: "13px", color: "#64748b", fontWeight: "600", display: "block", marginTop: "4px" }}>{c.cashier_name}</span>
                </div>
              );
            })}
          </div>
        </div>

        <div style={cardStyle}>
          <div style={{ fontSize: "14px", color: "#64748b", fontWeight: "600" }}>SGST Collected</div>
          <div style={{ fontSize: "24px", fontWeight: "bold", color: "#0f172a", margin: "6px 0" }}>₹{sgst.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</div>
          <div style={{ height: "35px", backgroundColor: "#f8fafc", borderRadius: "4px", borderBottom: "2px solid #8b5cf6", marginTop: "8px" }}></div>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
        <div style={cardStyle}>
          <h4 style={{ margin: "0 0 10px 0", fontSize: "15px", fontWeight: "bold", color: "#0f172a" }}>Live Inventory & Vendor Alerts</h4>
          <div style={{ display: "flex", flexDirection: "column", gap: "10px", fontSize: "14px" }}>
            <div>
              <span style={{ color: stockAlerts.length > 0 ? "#dc2626" : "#16a34a", fontWeight: "700" }}>Critical Stock Alerts</span>
              {stockAlerts.length > 0 ? (
                stockAlerts.map((s, idx) => (
                  <div key={idx} style={{ color: "#64748b", fontSize: "13px" }}>• {s.product_name} only has {s.stock} left</div>
                ))
              ) : (
                <div style={{ color: "#64748b", fontSize: "13px" }}>• All item stock levels healthy</div>
              )}
            </div>
            <div>
              <span style={{ color: "#d97706", fontWeight: "700" }}>Pending Vendor Payables</span>
              <div style={{ color: "#64748b", fontSize: "13px" }}>• Total Deductions: ₹{vendorDeductions.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</div>
            </div>
          </div>
        </div>

        <div style={cardStyle}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
            <h4 style={{ margin: 0, fontSize: "15px", color: "#334155", fontWeight: "700" }}>Cash Drawer Reconciliation</h4>
          </div>
          <table style={{ width: "100%", fontSize: "14px", textAlign: "left", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ color: "#64748b", borderBottom: "1px solid #e2e8f0" }}>
                <th style={{ paddingBottom: "8px" }}>Cashier</th>
                <th style={{ paddingBottom: "8px" }}>Expected</th>
                <th style={{ paddingBottom: "8px" }}>Collected</th>
                <th style={{ paddingBottom: "8px" }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredCashiersList.length > 0 ? (
                filteredCashiersList.map((row, idx) => {
                  const expected = Number(row.expected_amount || 0);
                  const collected = Number(row.total_amount || 0);
                  const percentAchieved = expected > 0 ? Math.round((collected / expected) * 100) : 0;
                  const isMatched = expected > 0 && collected >= expected;

                  return (
                    <tr key={idx} style={{ borderBottom: "1px solid #f1f5f9" }}>
                      <td style={{ padding: "10px 0", fontWeight: "600" }}>{row.cashier_name}</td>
                      <td style={{ fontWeight: "bold", color: "#0284c7" }}>₹{expected.toLocaleString("en-IN")}</td>
                      <td>₹{collected.toLocaleString("en-IN")}</td>
                      <td style={{ color: isMatched ? "#16a34a" : expected === 0 ? "#94a3b8" : "#dc2626", fontWeight: "bold" }}>
                        {expected === 0 ? "Not Set" : `${percentAchieved}% Collected`}
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="4" style={{ padding: "12px 0", color: "#94a3b8" }}>No active sessions recorded</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {reportModalOpen && (
        <div style={{
          position: "fixed", top: 0, left: 0, width: "100vw", height: "100vh",
          backgroundColor: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000
        }}>
          <div style={{ backgroundColor: "#fff", borderRadius: "12px", padding: "24px", width: "520px", boxShadow: "0 10px 25px rgba(0,0,0,0.2)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px", borderBottom: "1px solid #e2e8f0", paddingBottom: "8px" }}>
              <h3 style={{ margin: 0, fontSize: "16px", fontWeight: "bold", color: "#0f172a" }}>📊 Comprehensive Report Overview</h3>
              <button onClick={() => setReportModalOpen(false)} style={{ background: "none", border: "none", cursor: "pointer", color: "#64748b" }}>
                <X size={20} />
              </button>
            </div>
            
            <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginBottom: "16px" }}>
              <div>
                <label style={{ fontSize: "13px", fontWeight: "600", color: "#334155", display: "block", marginBottom: "4px" }}>Report Period:</label>
                <select
                  value={reportPeriod}
                  onChange={(e) => {
                    const newPer = e.target.value;
                    setReportPeriod(newPer);
                    handlePeriodChange(newPer, selectedDate, selectedMonth, selectedYear);
                  }}
                  style={{ width: "100%", padding: "8px 12px", borderRadius: "6px", border: "1px solid #cbd5e1", fontSize: "14px", outline: "none", backgroundColor: "#fff" }}
                >
                  <option value="Today">Today</option>
                  <option value="Specific Date">Specific Date</option>
                  <option value="This Week">This Week</option>
                  <option value="Month">Month</option>
                  <option value="Year">Year</option>
                </select>
              </div>

              {reportPeriod === "Specific Date" && (
                <div>
                  <label style={{ fontSize: "13px", fontWeight: "600", color: "#334155", display: "block", marginBottom: "4px" }}>Select Date:</label>
                  <input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => {
                      setSelectedDate(e.target.value);
                      handlePeriodChange("Specific Date", e.target.value, selectedMonth, selectedYear);
                    }}
                    style={{ width: "100%", padding: "8px 12px", borderRadius: "6px", border: "1px solid #cbd5e1", fontSize: "14px", outline: "none", backgroundColor: "#fff", boxSizing: "border-box" }}
                  />
                </div>
              )}

              {reportPeriod === "Month" && (
                <div style={{ position: "relative" }}>
                  <label style={{ fontSize: "13px", fontWeight: "600", color: "#334155", display: "block", marginBottom: "4px" }}>Select Month:</label>
                  <div
                    onMouseEnter={() => setMonthHover(true)}
                    onMouseLeave={() => setMonthHover(false)}
                    style={{ position: "relative" }}
                  >
                    <div style={{ padding: "8px 12px", borderRadius: "6px", border: "1px solid #cbd5e1", fontSize: "14px", backgroundColor: "#fff", cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <span>{selectedMonth}</span>
                      <ChevronDown size={14} color="#64748b" />
                    </div>
                    {monthHover && (
                      <div style={{ position: "absolute", top: "100%", left: 0, width: "100%", backgroundColor: "#fff", border: "1px solid #cbd5e1", borderRadius: "6px", boxShadow: "0 4px 12px rgba(0,0,0,0.15)", zIndex: 10, maxHeight: "150px", overflowY: "auto" }}>
                        {monthsList.map((m, idx) => (
                          <div
                            key={idx}
                            onClick={() => { setSelectedMonth(m); setMonthHover(false); handlePeriodChange(reportPeriod, selectedDate, m, selectedYear); }}
                            style={{ padding: "8px 12px", fontSize: "13px", cursor: "pointer", backgroundColor: selectedMonth === m ? "#f1f5f9" : "#fff" }}
                            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#e2e8f0")}
                            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = selectedMonth === m ? "#f1f5f9" : "#fff")}
                          >
                            {m}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {reportPeriod === "Year" && (
                <div style={{ position: "relative" }}>
                  <label style={{ fontSize: "13px", fontWeight: "600", color: "#334155", display: "block", marginBottom: "4px" }}>Select Year:</label>
                  <div
                    onMouseEnter={() => setYearHover(true)}
                    onMouseLeave={() => setYearHover(false)}
                    style={{ position: "relative" }}
                  >
                    <div style={{ padding: "8px 12px", borderRadius: "6px", border: "1px solid #cbd5e1", fontSize: "14px", backgroundColor: "#fff", cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <span>{selectedYear}</span>
                      <ChevronDown size={14} color="#64748b" />
                    </div>
                    {yearHover && (
                      <div style={{ position: "absolute", top: "100%", left: 0, width: "100%", backgroundColor: "#fff", border: "1px solid #cbd5e1", borderRadius: "6px", boxShadow: "0 4px 12px rgba(0,0,0,0.15)", zIndex: 10 }}>
                        {yearsList.map((y, idx) => (
                          <div
                            key={idx}
                            onClick={() => { setSelectedYear(y); setYearHover(false); handlePeriodChange(reportPeriod, selectedDate, selectedMonth, y); }}
                            style={{ padding: "8px 12px", fontSize: "13px", cursor: "pointer", backgroundColor: selectedYear === y ? "#f1f5f9" : "#fff" }}
                            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#e2e8f0")}
                            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = selectedYear === y ? "#f1f5f9" : "#fff")}
                          >
                            {y}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "10px", fontSize: "14px", color: "#334155" }}>
              <div style={{ display: "flex", justifyContent: "space-between" }}><span>Selected Period:</span> <strong>{reportPeriod === "Specific Date" ? selectedDate : reportPeriod === "Month" ? `${selectedMonth} ${selectedYear}` : reportPeriod === "Year" ? selectedYear : reportPeriod}</strong></div>
              <div style={{ display: "flex", justifyContent: "space-between" }}><span>Total Revenue:</span> <strong>₹{modalTotalRevenue.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</strong></div>
              <div style={{ display: "flex", justifyContent: "space-between" }}><span>Total Orders:</span> <strong>{modalTotalBills}</strong></div>
              <div style={{ display: "flex", justifyContent: "space-between" }}><span>Average Order Value:</span> <strong>₹{modalAov.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</strong></div>
              <div style={{ display: "flex", justifyContent: "space-between" }}><span>Total SGST:</span> <strong>₹{modalSgst.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</strong></div>
              <div style={{ display: "flex", justifyContent: "space-between" }}><span>Total CGST:</span> <strong>₹{modalCgst.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</strong></div>
            </div>
            <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px", marginTop: "20px" }}>
              <button onClick={() => setReportModalOpen(false)} style={{ padding: "8px 16px", backgroundColor: "#f1f5f9", border: "1px solid #cbd5e1", borderRadius: "6px", cursor: "pointer", fontWeight: "600", color: "#334155" }}>
                Close
              </button>
              <button onClick={handleApplyFilter} style={{ padding: "8px 16px", backgroundColor: "#2563eb", color: "#fff", border: "none", borderRadius: "6px", cursor: "pointer", fontWeight: "600" }}>
                Apply Filter
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ==========================================================================
    4. MAIN ADMIN DASHBOARD COMPONENT
    ========================================================================== */
export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("Overview");
  const [overviewSubTab, setOverviewSubTab] = useState("Overall Report");
  const [overviewDropdownOpen, setOverviewDropdownOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [activeSessionOpen, setActiveSessionOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [checkingAuth, setCheckingAuth] = useState(true);

  // NOTIFICATION STATES FOR ADMIN BELL
  const [adminNotifications, setAdminNotifications] = useState([]);
  const [showAdminNotificationDropdown, setShowAdminNotificationDropdown] = useState(false);

  const fetchAdminNotifications = useCallback(() => {
    fetch("http://localhost:5000/api/notifications/Admin")
      .then(res => res.json())
      .then(data => {
        if (data.success) setAdminNotifications(data.data);
      })
      .catch(err => console.log("Admin notification fetch error:", err));
  }, []);

  useEffect(() => {
    fetchAdminNotifications();
    const interval = setInterval(fetchAdminNotifications, 10000);
    return () => clearInterval(interval);
  }, [fetchAdminNotifications]);

  const markAdminNotificationRead = (id) => {
    fetch(`http://localhost:5000/api/notifications/read/${id}`, { method: "PUT" })
      .then(() => fetchAdminNotifications());
  };

  const adminUnreadCount = adminNotifications.filter(n => n.is_read === 0).length;

  const [storageTrigger, setStorageTrigger] = useState(0);

  const [stats, setStats] = useState({
    revenueStats: { totalRevenue: 0, totalBills: 0, aov: 0, growthPercent: "+0.0%" },
    typeBreakdown: [],
    cashierBreakdown: [],
    taxStats: { total_sgst: 0, total_cgst: 0 },
    stockAlerts: [],
    vendorSummary: { totalVendorDeductions: 0 },
    cancelledOrdersCount: 0,
  });

  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (!storedUser) {
      navigate("/");
      return;
    }

    try {
      const parsedUser = JSON.parse(storedUser);
      if (parsedUser.role !== "Super Admin" && parsedUser.role_id !== 1) {
        localStorage.clear();
        navigate("/");
        return;
      }

      setCurrentUser(parsedUser);
      setCheckingAuth(false);
    } catch (e) {
      localStorage.clear();
      navigate("/");
    }
  }, [navigate]);

  useEffect(() => {
    const handleStorageChange = () => {
      setStorageTrigger((prev) => prev + 1);
    };
    window.addEventListener("storage", handleStorageChange);
    const interval = setInterval(() => {
      setStorageTrigger((prev) => prev + 1);
    }, 1500);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      clearInterval(interval);
    };
  }, []);

  const fetchAnalytics = useCallback(async () => {
    try {
      const response = await fetch("http://localhost:5000/api/analytics/payments");
      const result = await response.json();
      if (result.success && result.data) {
        setStats(result.data);
      }
    } catch (err) {
      console.error("Failed to load analytics:", err);
    }
  }, []);

  useEffect(() => {
    if (activeTab === "Overview" && !checkingAuth) {
      fetchAnalytics();
    }
  }, [activeTab, checkingAuth, fetchAnalytics, storageTrigger]);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  const renderActiveSection = () => {
    switch (activeTab) {
      case "Overview":
        return <OverviewSection stats={stats} subTab={overviewSubTab} updateMainStats={(newStats) => setStats(newStats)} refreshAnalytics={fetchAnalytics} />;
      case "Inventory Management":
        return <ItemManagementSection />;
      case "Vendor Management":
        return <VendorManagementSection />;
      case "Session Management":
        return <SessionManagementSection />;
      case "Attendance Management":
        return <AttendanceManagementSection />;
      case "Leave Management":
        return <LeaveManagementSection />;
      case "User Management":
        return <ManageUsersSection />;
      case "Manage Users":
        return <ManageUsersSection />;
      case "Manage Profile":
        return <ManageProfileSection currentUser={currentUser} />;
      case "Settings":
        return <SettingsSection currentUser={currentUser} setCurrentUser={setCurrentUser} />;
      default:
        return (
          <div style={{ padding: "24px", background: "#fff", borderRadius: "12px" }}>
            <h3>{activeTab} Section</h3>
            <p>Coming soon...</p>
          </div>
        );
    }
  };

  const rawCashiers = stats?.cashierBreakdown || [];
  const cashiers = rawCashiers.filter(
    (c) => c.cashier_name?.toLowerCase() !== "admin" && c.role_id !== 1
  );
  const totalBills = stats?.revenueStats?.totalBills || 0;
  
  const isCashier01Active = 
    localStorage.getItem("pos_logged_in_cashier01") === "true" ||
    localStorage.getItem("pos_active_session_cashier01") === "true" ||
    cashiers.some(c => c.cashier_name === "cashier01");

  const isCashier02Active = 
    localStorage.getItem("pos_logged_in_cashier02") === "true" ||
    localStorage.getItem("pos_active_session_cashier02") === "true" ||
    cashiers.some(c => c.cashier_name === "cashier02");

  const activeCashierCount = (isCashier01Active ? 1 : 0) + (isCashier02Active ? 1 : 0);

  if (checkingAuth) return null;

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <div style={styles.brandBox}>
          <img 
            src="/assets/images/logo.png" 
            alt="ERP Logo" 
            style={{ height: "38px", width: "38px", objectFit: "contain", borderRadius: "6px" }} 
          />
          <div>
            <h1 style={styles.brandTitle}>Super Admin POS</h1>
            <p style={styles.brandSubtitle}>Restaurant Management Portal</p>
          </div>
        </div>
        <div style={styles.searchWrapper}>
          <Search size={18} color="#94a3b8" />
          <input type="text" placeholder="Search menu or settings..." style={styles.searchInput} />
        </div>

        <div style={styles.headerRight}>
          <div 
            style={{ position: "relative" }}
            onMouseEnter={() => setActiveSessionOpen(true)}
            onMouseLeave={() => setActiveSessionOpen(false)}
          >
            <button style={styles.activeSessionBtn}>
              <Activity size={16} color="#16a34a" />
              <span>Active Session</span>
              <ChevronDown size={16} />
            </button>

            {activeSessionOpen && (
              <div style={styles.activeSessionDropdown}>
                <div style={{ padding: "14px 18px", borderBottom: "1px solid #e2e8f0", backgroundColor: "#f8fafc", fontWeight: "bold", fontSize: "14px", color: "#0f172a" }}>
                  Active Session Overview
                </div>
                <div style={{ padding: "14px", display: "flex", flexDirection: "column", gap: "10px", maxHeight: "320px", overflowY: "auto" }}>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px", fontSize: "13px" }}>
                    <div style={{ backgroundColor: "#f8fafc", padding: "10px", borderRadius: "6px", border: "1px solid #e2e8f0" }}>
                      <span style={{ color: "#64748b", display: "block", fontSize: "12px" }}>Active Users</span>
                      <strong style={{ color: "#0f172a", fontSize: "15px" }}>
                        {activeCashierCount === 0 
                          ? "0 logged in" 
                          : activeCashierCount === 1 
                          ? "1 logged in" 
                          : "2 logged in"}
                      </strong>
                    </div>
                    <div style={{ backgroundColor: "#f8fafc", padding: "10px", borderRadius: "6px", border: "1px solid #e2e8f0" }}>
                      <span style={{ color: "#64748b", display: "block", fontSize: "12px" }}>Active Orders</span>
                      <strong style={{ color: "#0f172a", fontSize: "15px" }}>{totalBills || 0}</strong>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Admin Notification Bell Component */}
          <div style={{ position: "relative", display: "inline-block" }}>
            <button 
              onClick={() => setShowAdminNotificationDropdown(!showAdminNotificationDropdown)}
              style={{ background: "none", border: "none", color: "#fff", cursor: "pointer", position: "relative", padding: "6px", display: "flex", alignItems: "center" }}
            >
              <Bell size={20} color="#94a3b8" />
              {adminUnreadCount > 0 && (
                <span style={{ position: "absolute", top: "-2px", right: "-2px", background: "#dc2626", color: "#fff", fontSize: "9px", padding: "2px 5px", borderRadius: "50%", fontWeight: "bold" }}>
                  {adminUnreadCount}
                </span>
              )}
            </button>

            {showAdminNotificationDropdown && (
              <div style={{ position: "absolute", right: 0, top: "40px", width: "320px", background: "#fff", color: "#0f172a", borderRadius: "8px", boxShadow: "0 4px 15px rgba(0,0,0,0.2)", zIndex: 1000, padding: "12px", maxHeight: "400px", overflowY: "auto", textAlign: "left" }}>
                <h4 style={{ margin: "0 0 10px 0", fontSize: "14px", borderBottom: "1px solid #e2e8f0", paddingBottom: "6px" }}>Admin Delay Escalations</h4>
                {adminNotifications.length === 0 ? (
                  <p style={{ fontSize: "12px", color: "#64748b", textAlign: "center" }}>No escalation alerts</p>
                ) : (
                  adminNotifications.map(n => (
                    <div 
                      key={n.id} 
                      onClick={() => markAdminNotificationRead(n.id)}
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

          <div 
            style={{ position: "relative" }}
            onMouseEnter={() => setDropdownOpen(true)}
            onMouseLeave={() => setDropdownOpen(false)}
          >
            <div style={styles.profileDivider}>
              <div style={styles.avatar}>
                <User size={16} color="#ffffff" />
              </div>
              <span style={{ fontSize: "14px", fontWeight: "600" }}>{currentUser?.username || "admin"}</span>
              <ChevronDown size={16} />
            </div>

            {dropdownOpen && (
              <div style={styles.dropdownMenu}>
                <div 
                  style={styles.dropdownItem} 
                  onClick={() => { setDropdownOpen(false); setActiveTab("Manage Profile"); }}
                >
                  <User size={16} /> Manage Profile
                </div>
                <div 
                  style={styles.dropdownItem} 
                  onClick={() => { setDropdownOpen(false); setActiveTab("User Management"); }}
                >
                  <Users size={16} /> Manage Users
                </div>
                <div style={{ height: "1px", backgroundColor: "#e2e8f0", margin: "4px 0" }} />
                <div style={{ ...styles.dropdownItem, color: "#ef4444" }} onClick={handleLogout}>
                  <LogOut size={16} /> Logout
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      <div style={styles.bodyWrapper}>
        <aside style={styles.sidebar}>
          <div 
            style={{ display: "flex", flexDirection: "column", gap: "4px" }}
            onMouseEnter={() => setOverviewDropdownOpen(true)}
            onMouseLeave={() => setOverviewDropdownOpen(false)}
          >
            <button
              onClick={() => { setActiveTab("Overview"); setOverviewSubTab("Overall Report"); }}
              style={{
                ...styles.sidebarBtn,
                backgroundColor: activeTab === "Overview" ? "#2563eb" : "transparent",
                color: activeTab === "Overview" ? "#ffffff" : "#94a3b8",
                justifyContent: "space-between",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
                <LayoutGrid size={20} />
                <span>Overview</span>
              </div>
              <ChevronDown size={16} />
            </button>

            {overviewDropdownOpen && (
              <div style={{ display: "flex", flexDirection: "column", paddingLeft: "34px", gap: "4px", backgroundColor: "#090d16", paddingBottom: "6px", paddingTop: "4px", borderRadius: "0 0 6px 6px" }}>
                <div
                  style={{ fontSize: "13px", color: overviewSubTab === "Overall Report" ? "#38bdf8" : "#94a3b8", cursor: "pointer", padding: "6px 0", fontWeight: overviewSubTab === "Overall Report" ? "bold" : "normal" }}
                  onClick={() => { setActiveTab("Overview"); setOverviewSubTab("Overall Report"); }}
                >
                  Overall Report
                </div>
                <div
                  style={{ fontSize: "13px", color: overviewSubTab === "cashier01" ? "#38bdf8" : "#94a3b8", cursor: "pointer", padding: "6px 0", fontWeight: overviewSubTab === "cashier01" ? "bold" : "normal" }}
                  onClick={() => { setActiveTab("Overview"); setOverviewSubTab("cashier01"); }}
                >
                  cashier01
                </div>
                <div
                  style={{ fontSize: "13px", color: overviewSubTab === "cashier02" ? "#38bdf8" : "#38bdf8", cursor: "pointer", padding: "6px 0", fontWeight: overviewSubTab === "cashier02" ? "bold" : "normal" }}
                  onClick={() => { setActiveTab("Overview"); setOverviewSubTab("cashier02"); }}
                >
                  cashier02
                </div>
              </div>
            )}
          </div>

          <button
            onClick={() => { setActiveTab("Inventory Management"); setOverviewDropdownOpen(false); }}
            style={{
              ...styles.sidebarBtn,
              backgroundColor: activeTab === "Inventory Management" ? "#2563eb" : "transparent",
              color: activeTab === "Inventory Management" ? "#ffffff" : "#94a3b8",
            }}
          >
            <Package size={20} />
            <span>Inventory Management</span>
          </button>

          <button
            onClick={() => { setActiveTab("Vendor Management"); setOverviewDropdownOpen(false); }}
            style={{
              ...styles.sidebarBtn,
              backgroundColor: activeTab === "Vendor Management" ? "#2563eb" : "transparent",
              color: activeTab === "Vendor Management" ? "#ffffff" : "#94a3b8",
            }}
          >
            <Truck size={20} />
            <span>Vendor Management</span>
          </button>

          <button
            onClick={() => { setActiveTab("User Management"); setOverviewDropdownOpen(false); }}
            style={{
              ...styles.sidebarBtn,
              backgroundColor: activeTab === "User Management" ? "#2563eb" : "transparent",
              color: activeTab === "User Management" ? "#ffffff" : "#94a3b8",
            }}
          >
            <Users size={20} />
            <span>User Management</span>
          </button>

          {/* Standalone Independent Menu Items */}
          <button
            onClick={() => { setActiveTab("Session Management"); setOverviewDropdownOpen(false); }}
            style={{
              ...styles.sidebarBtn,
              backgroundColor: activeTab === "Session Management" ? "#2563eb" : "transparent",
              color: activeTab === "Session Management" ? "#ffffff" : "#94a3b8",
            }}
          >
            <Clock size={20} />
            <span>Session Management</span>
          </button>

          <button
            onClick={() => { setActiveTab("Attendance Management"); setOverviewDropdownOpen(false); }}
            style={{
              ...styles.sidebarBtn,
              backgroundColor: activeTab === "Attendance Management" ? "#2563eb" : "transparent",
              color: activeTab === "Attendance Management" ? "#ffffff" : "#94a3b8",
            }}
          >
            <CheckSquare size={20} />
            <span>Attendance Management</span>
          </button>

          <button
            onClick={() => { setActiveTab("Leave Management"); setOverviewDropdownOpen(false); }}
            style={{
              ...styles.sidebarBtn,
              backgroundColor: activeTab === "Leave Management" ? "#2563eb" : "transparent",
              color: activeTab === "Leave Management" ? "#ffffff" : "#94a3b8",
            }}
          >
            <FileText size={20} />
            <span>Leave Management</span>
          </button>

          <button
            onClick={() => { setActiveTab("Settings"); setOverviewDropdownOpen(false); }}
            style={{
              ...styles.sidebarBtn,
              backgroundColor: activeTab === "Settings" ? "#2563eb" : "transparent",
              color: activeTab === "Settings" ? "#ffffff" : "#94a3b8",
            }}
          >
            <Settings size={20} />
            <span>Settings</span>
          </button>
        </aside>

        <main style={styles.mainContent}>{renderActiveSection()}</main>
      </div>
    </div>
  );
}

const styles = {
  container: { display: "flex", flexDirection: "column", height: "100vh", backgroundColor: "#f8fafc", fontFamily: "Inter, sans-serif" },
  header: { height: "65px", backgroundColor: "#0f172a", color: "#ffffff", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 24px", borderBottom: "1px solid #1e293b", zIndex: 10 },
  brandBox: { display: "flex", alignItems: "center", gap: "14px" },
  brandTitle: { fontSize: "18px", fontWeight: "bold", margin: 0 },
  brandSubtitle: { fontSize: "12px", color: "#94a3b8", margin: 0 },
  searchWrapper: { display: "flex", alignItems: "center", gap: "10px", backgroundColor: "#1e293b", border: "1px solid #334155", borderRadius: "6px", padding: "8px 14px", width: "320px" },
  searchInput: { border: "none", outline: "none", background: "transparent", color: "#ffffff", fontSize: "14px", width: "100%" },
  headerRight: { display: "flex", alignItems: "center", gap: "18px" },
  activeSessionBtn: { display: "flex", alignItems: "center", gap: "8px", backgroundColor: "#1e293b", border: "1px solid #334155", color: "#ffffff", padding: "8px 14px", borderRadius: "6px", fontSize: "14px", fontWeight: "600", cursor: "pointer" },
  activeSessionDropdown: { position: "absolute", right: 0, top: "46px", backgroundColor: "#ffffff", border: "1px solid #e2e8f0", borderRadius: "8px", boxShadow: "0 4px 16px rgba(0,0,0,0.15)", width: "280px", zIndex: 200 },
  iconBtn: { background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" },
  profileDivider: { display: "flex", alignItems: "center", gap: "10px", cursor: "pointer", padding: "6px 10px", borderRadius: "6px", backgroundColor: "#1e293b" },
  avatar: { width: "32px", height: "32px", borderRadius: "50%", backgroundColor: "#3b82f6", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center" },
  dropdownMenu: { position: "absolute", right: 0, top: "46px", backgroundColor: "#ffffff", border: "1px solid #e2e8f0", borderRadius: "8px", boxShadow: "0 4px 16px rgba(0,0,0,0.15)", width: "190px", padding: "6px 0", zIndex: 100 },
  dropdownItem: { display: "flex", alignItems: "center", gap: "10px", padding: "10px 16px", fontSize: "14px", color: "#334155", cursor: "pointer" },
  bodyWrapper: { display: "flex", flex: 1, overflow: "hidden" },
  sidebar: { width: "240px", backgroundColor: "#0f172a", padding: "18px 12px", display: "flex", flexDirection: "column", gap: "6px" },
  sidebarBtn: { display: "flex", alignItems: "center", gap: "14px", width: "100%", padding: "12px 14px", border: "none", borderRadius: "6px", fontSize: "14px", fontWeight: "600", cursor: "pointer", textAlign: "left" },
  mainContent: { flex: "1", padding: "24px", overflowY: "auto", backgroundColor: "#f8fafc" },
};