import React, { useState, useEffect, useCallback } from "react";
import { Search, Edit2, Trash2, Plus, X } from "lucide-react";

export default function ManageUserSection() {
  const [profiles, setProfiles] = useState([]);
  const [selectedProfile, setSelectedProfile] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  // Modal States
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  // Form States
  const [newProfile, setNewProfile] = useState({ username: "", email: "", phone: "", password: "", role_id: "2" });
  const [editProfileData, setEditProfileData] = useState({ id: "", username: "", email: "", phone: "", role_id: "2", password: "" });

  const fetchProfiles = useCallback(async () => {
    try {
      const res = await fetch("http://localhost:5000/api/users");
      const data = await res.json();
      if (data.success) {
        // Filter strictly to only show cashier01 and cashier02
        const filteredOnlyCashiers = data.data.filter(
          (u) => u.username === "cashier01" || u.username === "cashier02"
        );
        setProfiles(filteredOnlyCashiers);
        setSelectedProfile((prev) => {
          if (filteredOnlyCashiers.length > 0 && !prev) {
            return filteredOnlyCashiers[0];
          } else if (prev) {
            return filteredOnlyCashiers.find(p => p.id === prev.id) || filteredOnlyCashiers[0];
          }
          return null;
        });
      }
    } catch (err) {
      console.error("Error fetching profiles:", err);
    }
  }, []);

  useEffect(() => {
    fetchProfiles();
  }, [fetchProfiles]);

  const handleToggleStatus = async (user) => {
    const newStatus = user.status === 1 ? 0 : 1;
    try {
      const res = await fetch(`http://localhost:5000/api/users/status/${user.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      const data = await res.json();
      if (data.success) {
        fetchProfiles();
      }
    } catch (err) {
      console.error("Error updating status:", err);
    }
  };

  // Add New Profile Handler
  const handleAddSubmit = async (e) => {
    e.preventDefault();
    if (!newProfile.username || !newProfile.password) {
      alert("Please enter Name and Password.");
      return;
    }
    try {
      const res = await fetch("http://localhost:5000/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newProfile),
      });
      const data = await res.json();
      if (data.success) {
        alert("New profile added successfully!");
        setShowAddModal(false);
        setNewProfile({ username: "", email: "", phone: "", password: "", role_id: "2" });
        fetchProfiles();
      } else {
        alert("Failed to add profile: " + data.message);
      }
    } catch (err) {
      alert("Server connection error.");
    }
  };

  // Open Edit Modal Handler
  const handleOpenEdit = (user) => {
    setEditProfileData({
      id: user.id,
      username: user.username || "",
      email: user.email || "",
      phone: user.phone || "",
      role_id: String(user.role_id || "2"),
      password: "",
    });
    setShowEditModal(true);
  };

  // Edit Submit Handler
  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`http://localhost:5000/api/users/${editProfileData.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editProfileData),
      });
      const data = await res.json();
      if (data.success) {
        alert("Profile updated successfully!");
        setShowEditModal(false);
        fetchProfiles();
      } else {
        alert("Failed to update profile: " + data.message);
      }
    } catch (err) {
      alert("Server connection error.");
    }
  };

  // Remove Profile Handler
  const handleRemove = async (userId) => {
    if (!window.confirm("Are you sure you want to remove this profile?")) return;
    try {
      const res = await fetch(`http://localhost:5000/api/users/${userId}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success) {
        alert("Profile removed successfully!");
        fetchProfiles();
      } else {
        alert("Failed to remove profile: " + data.message);
      }
    } catch (err) {
      alert("Server connection error.");
    }
  };

  const filteredProfiles = profiles.filter((p) =>
    p.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "20px", width: "100%", fontFamily: "Inter, sans-serif", padding: "20px", boxSizing: "border-box" }}>
      
      {/* HEADER & SEARCH */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <h2 style={{ fontSize: "24px", fontWeight: "bold", color: "#0f172a", margin: 0 }}>Manage Users</h2>
          <p style={{ fontSize: "13px", color: "#64748b", margin: "4px 0 0 0" }}>Hotel Team Members</p>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <div style={{ position: "relative" }}>
            <Search size={16} style={{ position: "absolute", left: "10px", top: "10px", color: "#64748b" }} />
            <input
              type="text"
              placeholder="Search Profiles"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ padding: "8px 12px 8px 34px", borderRadius: "6px", border: "1px solid #cbd5e1", fontSize: "13px", width: "220px", backgroundColor: "#fff" }}
            />
          </div>
          <button 
            onClick={() => setShowAddModal(true)}
            style={{ display: "flex", alignItems: "center", gap: "6px", backgroundColor: "#1e293b", color: "#fff", border: "none", borderRadius: "6px", padding: "8px 14px", fontSize: "13px", fontWeight: "bold", cursor: "pointer" }}
          >
            <Plus size={16} /> Add New Profile
          </button>
        </div>
      </div>

      {/* MAIN CONTENT GRID */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: "20px" }}>
        
        {/* LEFT COLUMN: PROFILE LIST CARDS */}
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          {filteredProfiles.length === 0 ? (
            <div style={{ padding: "30px", textAlign: "center", color: "#64748b", backgroundColor: "#fff", borderRadius: "8px", border: "1px solid #e2e8f0" }}>
              No profiles found.
            </div>
          ) : (
            filteredProfiles.map((user) => {
              const isSelected = selectedProfile && selectedProfile.id === user.id;
              return (
                <div
                  key={user.id}
                  onClick={() => setSelectedProfile(user)}
                  style={{
                    backgroundColor: "#fff",
                    borderRadius: "8px",
                    border: isSelected ? "2px solid #3b82f6" : "1px solid #e2e8f0",
                    padding: "16px",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    cursor: "pointer",
                    boxShadow: isSelected ? "0 4px 12px rgba(59, 130, 246, 0.15)" : "none",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
                    <div style={{ width: "45px", height: "45px", borderRadius: "50%", backgroundColor: "#e2e8f0", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.2rem", overflow: "hidden" }}>
                      👤
                    </div>
                    <div>
                      <div style={{ fontWeight: "bold", fontSize: "14px", color: "#0f172a" }}>Name: {user.username}</div>
                      <div style={{ fontSize: "13px", color: "#475569", margin: "2px 0" }}>Role: {user.role || "Cashier"}</div>
                      <div style={{ fontSize: "12px", color: "#64748b" }}>{user.email || `${user.username.toLowerCase()}@hotel.com`}</div>
                      <div style={{ display: "flex", alignItems: "center", gap: "4px", marginTop: "4px", fontSize: "11px", color: user.status === 1 ? "#16a34a" : "#dc2626", fontWeight: "bold" }}>
                        <span>🟢</span> {user.status === 1 ? "Status ind: Active" : "Status ind: Inactive"}
                      </div>
                    </div>
                  </div>

                  <div style={{ display: "flex", alignItems: "center", gap: "16px" }} onClick={(e) => e.stopPropagation()}>
                    <div style={{ display: "flex", gap: "6px" }}>
                      <button onClick={() => handleOpenEdit(user)} style={{ backgroundColor: "#3b82f6", color: "#fff", border: "none", borderRadius: "4px", padding: "6px", cursor: "pointer" }}><Edit2 size={14} /></button>
                      <button onClick={() => handleRemove(user.id)} style={{ backgroundColor: "#ef4444", color: "#fff", border: "none", borderRadius: "4px", padding: "6px", cursor: "pointer" }}><Trash2 size={14} /></button>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                      <input
                        type="checkbox"
                        checked={user.status === 1}
                        onChange={() => handleToggleStatus(user)}
                        style={{ width: "16px", height: "16px", cursor: "pointer" }}
                      />
                      <span style={{ fontSize: "11px", fontWeight: "bold", color: "#475569" }}>Deactivate/Activate</span>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* RIGHT COLUMN: CURRENT FOCUS PANEL */}
        <div style={{ backgroundColor: "#fff", borderRadius: "8px", border: "1px solid #e2e8f0", padding: "20px", height: "fit-content", display: "flex", flexDirection: "column", gap: "14px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px", borderBottom: "1px solid #e2e8f0", paddingBottom: "12px" }}>
            <div style={{ width: "40px", height: "40px", borderRadius: "50%", backgroundColor: "#e2e8f0", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1rem" }}>
              👤
            </div>
            <div>
              <div style={{ fontSize: "11px", color: "#64748b", fontWeight: "bold" }}>Current Focus:</div>
              <div style={{ fontSize: "14px", fontWeight: "bold", color: "#0f172a" }}>{selectedProfile ? selectedProfile.username : "None selected"}</div>
            </div>
          </div>

          <div>
            <div style={{ fontSize: "12px", fontWeight: "bold", color: "#475569" }}>Contact</div>
            <div style={{ fontSize: "13px", color: "#0f172a", marginTop: "2px" }}>{selectedProfile?.phone || "+91 9876543210"}</div>
          </div>

          <div>
            <div style={{ fontSize: "12px", fontWeight: "bold", color: "#475569" }}>Address</div>
            <div style={{ fontSize: "13px", color: "#0f172a", marginTop: "2px" }}>Hotel Staff Quarters, Main Branch</div>
          </div>

          <div>
            <div style={{ fontSize: "12px", fontWeight: "bold", color: "#475569" }}>Contact email</div>
            <div style={{ fontSize: "13px", color: "#0f172a", marginTop: "2px" }}>{selectedProfile?.email || `${selectedProfile?.username || "staff"}@hotel.com`}</div>
          </div>

          <div>
            <div style={{ fontSize: "12px", fontWeight: "bold", color: "#475569" }}>Roles</div>
            <div style={{ fontSize: "13px", color: "#0f172a", marginTop: "2px" }}>{selectedProfile?.role || "Cashier"}</div>
          </div>

          <div>
            <div style={{ fontSize: "12px", fontWeight: "bold", color: "#475569" }}>Access Level</div>
            <div style={{ fontSize: "13px", color: "#0f172a", marginTop: "2px" }}>Retail Basic</div>
          </div>
        </div>

      </div>

      {/* ADD NEW PROFILE MODAL */}
      {showAddModal && (
        <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, backgroundColor: "rgba(0,0,0,0.6)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000 }}>
          <div style={{ backgroundColor: "#fff", borderRadius: "8px", width: "380px", padding: "20px", boxShadow: "0 10px 25px rgba(0,0,0,0.2)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "14px", borderBottom: "1px solid #e2e8f0", paddingBottom: "8px" }}>
              <h3 style={{ margin: 0, fontSize: "1.1rem" }}>Add New Profile</h3>
              <button onClick={() => setShowAddModal(false)} style={{ background: "none", border: "none", cursor: "pointer", color: "#64748b" }}><X size={18} /></button>
            </div>
            <form onSubmit={handleAddSubmit} style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              <div>
                <label style={{ fontSize: "11px", fontWeight: "bold", color: "#475569", display: "block", marginBottom: "4px" }}>Username</label>
                <input type="text" placeholder="Enter username" value={newProfile.username} onChange={(e) => setNewProfile({ ...newProfile, username: e.target.value })} required style={{ width: "100%", padding: "8px", borderRadius: "4px", border: "1px solid #cbd5e1", fontSize: "13px", boxSizing: "border-box" }} />
              </div>
              <div>
                <label style={{ fontSize: "11px", fontWeight: "bold", color: "#475569", display: "block", marginBottom: "4px" }}>Email</label>
                <input type="email" placeholder="Enter email" value={newProfile.email} onChange={(e) => setNewProfile({ ...newProfile, email: e.target.value })} style={{ width: "100%", padding: "8px", borderRadius: "4px", border: "1px solid #cbd5e1", fontSize: "13px", boxSizing: "border-box" }} />
              </div>
              <div>
                <label style={{ fontSize: "11px", fontWeight: "bold", color: "#475569", display: "block", marginBottom: "4px" }}>Phone</label>
                <input type="text" placeholder="Enter phone" value={newProfile.phone} onChange={(e) => setNewProfile({ ...newProfile, phone: e.target.value })} style={{ width: "100%", padding: "8px", borderRadius: "4px", border: "1px solid #cbd5e1", fontSize: "13px", boxSizing: "border-box" }} />
              </div>
              <div>
                <label style={{ fontSize: "11px", fontWeight: "bold", color: "#475569", display: "block", marginBottom: "4px" }}>Password</label>
                <input type="password" placeholder="Enter password" value={newProfile.password} onChange={(e) => setNewProfile({ ...newProfile, password: e.target.value })} required style={{ width: "100%", padding: "8px", borderRadius: "4px", border: "1px solid #cbd5e1", fontSize: "13px", boxSizing: "border-box" }} />
              </div>
              <div style={{ display: "flex", justifyContent: "flex-end", gap: "8px", marginTop: "10px" }}>
                <button type="button" onClick={() => setShowAddModal(false)} style={{ padding: "6px 12px", background: "#f1f5f9", border: "1px solid #cbd5e1", borderRadius: "4px", cursor: "pointer" }}>Cancel</button>
                <button type="submit" style={{ padding: "6px 14px", background: "#16a34a", color: "#fff", border: "none", borderRadius: "4px", fontWeight: "bold", cursor: "pointer" }}>Save</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EDIT PROFILE MODAL */}
      {showEditModal && (
        <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, backgroundColor: "rgba(0,0,0,0.6)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000 }}>
          <div style={{ backgroundColor: "#fff", borderRadius: "8px", width: "380px", padding: "20px", boxShadow: "0 10px 25px rgba(0,0,0,0.2)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "14px", borderBottom: "1px solid #e2e8f0", paddingBottom: "8px" }}>
              <h3 style={{ margin: 0, fontSize: "1.1rem" }}>Edit Profile</h3>
              <button onClick={() => setShowEditModal(false)} style={{ background: "none", border: "none", cursor: "pointer", color: "#64748b" }}><X size={18} /></button>
            </div>
            <form onSubmit={handleEditSubmit} style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              <div>
                <label style={{ fontSize: "11px", fontWeight: "bold", color: "#475569", display: "block", marginBottom: "4px" }}>Username</label>
                <input type="text" value={editProfileData.username} onChange={(e) => setEditProfileData({ ...editProfileData, username: e.target.value })} required style={{ width: "100%", padding: "8px", borderRadius: "4px", border: "1px solid #cbd5e1", fontSize: "13px", boxSizing: "border-box" }} />
              </div>
              <div>
                <label style={{ fontSize: "11px", fontWeight: "bold", color: "#475569", display: "block", marginBottom: "4px" }}>Email</label>
                <input type="email" value={editProfileData.email} onChange={(e) => setEditProfileData({ ...editProfileData, email: e.target.value })} style={{ width: "100%", padding: "8px", borderRadius: "4px", border: "1px solid #cbd5e1", fontSize: "13px", boxSizing: "border-box" }} />
              </div>
              <div>
                <label style={{ fontSize: "11px", fontWeight: "bold", color: "#475569", display: "block", marginBottom: "4px" }}>Phone</label>
                <input type="text" value={editProfileData.phone} onChange={(e) => setEditProfileData({ ...editProfileData, phone: e.target.value })} style={{ width: "100%", padding: "8px", borderRadius: "4px", border: "1px solid #cbd5e1", fontSize: "13px", boxSizing: "border-box" }} />
              </div>
              <div>
                <label style={{ fontSize: "11px", fontWeight: "bold", color: "#475569", display: "block", marginBottom: "4px" }}>New Password (Leave blank to keep)</label>
                <input type="password" placeholder="New password" value={editProfileData.password} onChange={(e) => setEditProfileData({ ...editProfileData, password: e.target.value })} style={{ width: "100%", padding: "8px", borderRadius: "4px", border: "1px solid #cbd5e1", fontSize: "13px", boxSizing: "border-box" }} />
              </div>
              <div style={{ display: "flex", justifyContent: "flex-end", gap: "8px", marginTop: "10px" }}>
                <button type="button" onClick={() => setShowEditModal(false)} style={{ padding: "6px 12px", background: "#f1f5f9", border: "1px solid #cbd5e1", borderRadius: "4px", cursor: "pointer" }}>Cancel</button>
                <button type="submit" style={{ padding: "6px 14px", background: "#3b82f6", color: "#fff", border: "none", borderRadius: "4px", fontWeight: "bold", cursor: "pointer" }}>Update</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}