import React, { useState, useEffect, useCallback } from "react";
import { RefreshCw, Plus, Edit2, Trash2, Search, Check, X } from "lucide-react";

export default function VendorManagementSection() {
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Categories");

  const [isAdding, setIsAdding] = useState(false);

  // Helper to calculate next sequential ID (e.g. V001, V002, etc.)
  const getNextVendorId = (currentList) => {
    if (!currentList || currentList.length === 0) return "V001";
    const nums = currentList.map(v => {
      const parsed = parseInt((v.id || "").replace(/[^0-9]/g, ""), 10);
      return isNaN(parsed) ? 0 : parsed;
    });
    const maxNum = Math.max(...nums, 0);
    return `V${String(maxNum + 1).padStart(3, "0")}`;
  };

  const [newVendor, setNewVendor] = useState({
    id: "V001",
    supplier_name: "",
    product_type: "Chicken",
    supply_type: "Raw Material",
    contact: "",
    stock: "500 kg",
    status: "Active"
  });

  const [editingId, setEditingId] = useState(null);
  const [editFormData, setEditFormData] = useState({});

  const fetchVendors = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch("http://localhost:5000/api/vendors");
      const data = await res.json();
      
      let rawData = [];
      if (data.success && data.data) {
        rawData = data.data;
      } else if (Array.isArray(data)) {
        rawData = data;
      }

      const productTypes = ["Chicken", "Water", "Cool Drinks", "Mutton", "Water", "Chicken"];
      const supplyTypes = ["Raw Material", "Bottled Products", "Beverages", "Dry/Fresh Goods", "Bottled Products", "Raw Material"];

      let initialVendors = rawData.length > 0 ? rawData.map((v, index) => {
        const typeIndex = index % productTypes.length;
        const seqNum = index + 1;
        return {
          id: v.id || v.vendor_id || `V${String(seqNum).padStart(3, "0")}`,
          // Strictly sorted ascending: Supplier 1 -> V001, Supplier 2 -> V002...
          supplier_name: v.supplier_name || v.vendor_name || `Supplier ${seqNum}`,
          product_type: v.product_type || v.primary_product_type || productTypes[typeIndex],
          supply_type: v.supply_type || supplyTypes[typeIndex],
          contact: v.contact || v.phone || `900019000${seqNum}`,
          stock: v.stock || "50 kg",
          status: v.status || "Active"
        };
      }) : [
        { id: "V001", supplier_name: "Supplier 1", product_type: "Chicken", supply_type: "Raw Material", contact: "8073140796", stock: "50kg", status: "Active" },
        { id: "V002", supplier_name: "Supplier 2", product_type: "Water", supply_type: "Bottled Products", contact: "9000190001", stock: "20kg", status: "Active" },
        { id: "V003", supplier_name: "Supplier 3", product_type: "Cool Drinks", supply_type: "Beverages", contact: "9000190003", stock: "50pcs", status: "Active" },
        { id: "V004", supplier_name: "Supplier 4", product_type: "Mutton", supply_type: "Dry/Fresh Goods", contact: "9876543210", stock: "10000", status: "Active" },
        { id: "V005", supplier_name: "Supplier 5", product_type: "Water", supply_type: "Bottled Products", contact: "8907685341", stock: "80kg", status: "Active" },
        { id: "V006", supplier_name: "Supplier 6", product_type: "Chicken", supply_type: "Raw Material", contact: "9077896790", stock: "50kg", status: "Active" }
      ];

      // Sort vendors strictly ascending by ID (V001, V002, V003...)
      initialVendors.sort((a, b) => a.id.localeCompare(b.id, undefined, { numeric: true }));

      setVendors(initialVendors);
      setNewVendor(prev => ({ ...prev, id: getNextVendorId(initialVendors) }));
    } catch (err) {
      console.error("Error fetching vendors:", err);
      const fallback = [
        { id: "V001", supplier_name: "Supplier 1", product_type: "Chicken", supply_type: "Raw Material", contact: "8073140796", stock: "50kg", status: "Active" },
        { id: "V002", supplier_name: "Supplier 2", product_type: "Water", supply_type: "Bottled Products", contact: "9000190001", stock: "20kg", status: "Active" }
      ];
      setVendors(fallback);
      setNewVendor(prev => ({ ...prev, id: getNextVendorId(fallback) }));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchVendors();
  }, [fetchVendors]);

  const handleSaveNewVendor = async () => {
    if (!newVendor.supplier_name.trim()) {
      alert("Please enter a supplier name!");
      return;
    }

    try {
      await fetch("http://localhost:5000/api/vendors", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newVendor)
      });
      
      const updatedList = [...vendors, newVendor].sort((a, b) => a.id.localeCompare(b.id, undefined, { numeric: true }));
      setVendors(updatedList);
      
      setNewVendor({
        id: getNextVendorId(updatedList),
        supplier_name: "",
        product_type: "Chicken",
        supply_type: "Raw Material",
        contact: "",
        stock: "500 kg",
        status: "Active"
      });
      setIsAdding(false);
    } catch (err) {
      const updatedList = [...vendors, newVendor].sort((a, b) => a.id.localeCompare(b.id, undefined, { numeric: true }));
      setVendors(updatedList);
      setNewVendor({
        id: getNextVendorId(updatedList),
        supplier_name: "",
        product_type: "Chicken",
        supply_type: "Raw Material",
        contact: "",
        stock: "500 kg",
        status: "Active"
      });
      setIsAdding(false);
    }
  };

  const handleDeleteVendor = async (id) => {
    if (!window.confirm("Are you sure you want to remove this vendor?")) return;
    const filtered = vendors.filter(v => v.id !== id);
    setVendors(filtered);
    setNewVendor(prev => ({ ...prev, id: getNextVendorId(filtered) }));
  };

  const startEditing = (vendor) => {
    setEditingId(vendor.id);
    setEditFormData({ ...vendor });
  };

  const handleSaveEdit = (id) => {
    const updated = vendors.map(v => v.id === id ? editFormData : v);
    updated.sort((a, b) => a.id.localeCompare(b.id, undefined, { numeric: true }));
    setVendors(updated);
    setEditingId(null);
  };

  const filteredVendors = vendors.filter(v => {
    const matchesSearch = !searchQuery || 
      (v.supplier_name && v.supplier_name.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (v.id && v.id.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (v.product_type && v.product_type.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesCategory = selectedCategory === "All Categories" || 
      (v.supply_type && v.supply_type.toLowerCase() === selectedCategory.toLowerCase()) ||
      (v.product_type && v.product_type.toLowerCase() === selectedCategory.toLowerCase());

    return matchesSearch && matchesCategory;
  });

  return (
    <div style={{ padding: "24px", fontFamily: "Inter, sans-serif", backgroundColor: "#f8fafc", minHeight: "100vh", overflowY: "auto", boxSizing: "border-box" }}>
      
      {/* Top Banner Header */}
      <div style={{ backgroundColor: "#fff", padding: "20px 24px", borderRadius: "10px", border: "1px solid #e2e8f0", marginBottom: "20px", display: "flex", justifyContent: "space-between", alignItems: "center", boxShadow: "0 1px 3px rgba(0,0,0,0.05)" }}>
        <div>
          <h2 style={{ margin: 0, fontSize: "20px", color: "#0f172a", fontWeight: "bold" }}>Vendor Management</h2>
          <p style={{ margin: "4px 0 0 0", color: "#64748b", fontSize: "13px" }}>Manage food and drink suppliers for POS billing.</p>
        </div>
        <div style={{ display: "flex", gap: "10px" }}>
          <button 
            onClick={fetchVendors} 
            style={{ display: "flex", alignItems: "center", gap: "6px", backgroundColor: "#fff", color: "#0f172a", border: "1px solid #cbd5e1", padding: "8px 16px", borderRadius: "6px", fontWeight: "bold", fontSize: "13px", cursor: "pointer" }}
          >
            <RefreshCw size={15} /> Refresh
          </button>
          <button 
            onClick={() => {
              setNewVendor(prev => ({ ...prev, id: getNextVendorId(vendors), supplier_name: "" }));
              setIsAdding(true);
            }} 
            style={{ display: "flex", alignItems: "center", gap: "6px", backgroundColor: "#f97316", color: "#fff", border: "none", padding: "8px 16px", borderRadius: "6px", fontWeight: "bold", fontSize: "13px", cursor: "pointer" }}
          >
            <Plus size={16} /> + Add New Item
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div style={{ display: "flex", gap: "12px", marginBottom: "20px", alignItems: "center" }}>
        <div style={{ position: "relative", flex: 1, maxWidth: "400px" }}>
          <Search size={16} color="#64748b" style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)" }} />
          <input 
            type="text" 
            placeholder="Search vendor name..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ width: "100%", padding: "8px 12px 8px 36px", borderRadius: "6px", border: "1px solid #cbd5e1", backgroundColor: "#fff", fontSize: "13px", outline: "none", boxSizing: "border-box" }}
          />
        </div>

        <select 
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          style={{ padding: "8px 14px", borderRadius: "6px", border: "1px solid #cbd5e1", backgroundColor: "#fff", fontSize: "13px", fontWeight: "500", color: "#0f172a", outline: "none", cursor: "pointer" }}
        >
          <option>All Categories</option>
          <option>Chicken</option>
          <option>Mutton</option>
          <option>Water</option>
          <option>Cool Drinks</option>
          <option>Raw Material</option>
          <option>Beverages</option>
        </select>
      </div>

      {/* Vendor Table Grid */}
      <div style={{ backgroundColor: "#fff", borderRadius: "10px", border: "1px solid #e2e8f0", overflow: "hidden", boxShadow: "0 1px 3px rgba(0,0,0,0.05)" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13px", textAlign: "left" }}>
          <thead>
            <tr style={{ backgroundColor: "#f8fafc", color: "#64748b", borderBottom: "1px solid #e2e8f0", fontSize: "12px", fontWeight: "bold", textTransform: "uppercase" }}>
              <th style={{ padding: "12px 16px" }}>Vendor ID</th>
              <th style={{ padding: "12px 16px" }}>Supplier Name</th>
              <th style={{ padding: "12px 16px" }}>Primary Product Type</th>
              <th style={{ padding: "12px 16px" }}>Supply Type</th>
              <th style={{ padding: "12px 16px" }}>Contact</th>
              <th style={{ padding: "12px 16px" }}>Stock</th>
              <th style={{ padding: "12px 16px" }}>Status</th>
              <th style={{ padding: "12px 16px", textAlign: "right" }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="8" style={{ textAlign: "center", padding: "40px", color: "#94a3b8" }}>Loading vendors...</td>
              </tr>
            ) : filteredVendors.length === 0 && !isAdding ? (
              <tr>
                <td colSpan="8" style={{ textAlign: "center", padding: "40px", color: "#94a3b8" }}>No vendors found.</td>
              </tr>
            ) : (
              filteredVendors.map((v) => {
                const isEditing = editingId === v.id;
                return (
                  <tr key={v.id} style={{ borderBottom: "1px solid #f1f5f9" }}>
                    <td style={{ padding: "14px 16px", fontWeight: "bold", color: "#0f172a" }}>{v.id}</td>
                    
                    <td style={{ padding: "14px 16px", fontWeight: "500" }}>
                      {isEditing ? (
                        <input 
                          type="text" 
                          value={editFormData.supplier_name} 
                          onChange={(e) => setEditFormData({...editFormData, supplier_name: e.target.value})}
                          style={{ padding: "4px 8px", borderRadius: "4px", border: "1px solid #cbd5e1", width: "100%" }}
                        />
                      ) : v.supplier_name}
                    </td>

                    <td style={{ padding: "14px 16px" }}>
                      {isEditing ? (
                        <select 
                          value={editFormData.product_type}
                          onChange={(e) => setEditFormData({...editFormData, product_type: e.target.value})}
                          style={{ padding: "4px 8px", borderRadius: "4px", border: "1px solid #cbd5e1", width: "100%" }}
                        >
                          <option>Chicken</option>
                          <option>Water</option>
                          <option>Mutton</option>
                          <option>Cool Drinks</option>
                        </select>
                      ) : (
                        <span style={{ display: "inline-flex", alignItems: "center", gap: "6px", backgroundColor: "#f1f5f9", padding: "4px 10px", borderRadius: "6px", fontSize: "12px", fontWeight: "600", color: "#334155" }}>
                          📦 {v.product_type}
                        </span>
                      )}
                    </td>

                    <td style={{ padding: "14px 16px", color: "#475569" }}>
                      {isEditing ? (
                        <select 
                          value={editFormData.supply_type}
                          onChange={(e) => setEditFormData({...editFormData, supply_type: e.target.value})}
                          style={{ padding: "4px 8px", borderRadius: "4px", border: "1px solid #cbd5e1", width: "100%" }}
                        >
                          <option>Raw Material</option>
                          <option>Bottled Products</option>
                          <option>Dry/Fresh Goods</option>
                          <option>Beverages</option>
                        </select>
                      ) : v.supply_type}
                    </td>

                    <td style={{ padding: "14px 16px", color: "#475569" }}>
                      {isEditing ? (
                        <input 
                          type="text" 
                          value={editFormData.contact} 
                          onChange={(e) => setEditFormData({...editFormData, contact: e.target.value})}
                          style={{ padding: "4px 8px", borderRadius: "4px", border: "1px solid #cbd5e1", width: "100%" }}
                        />
                      ) : v.contact}
                    </td>

                    <td style={{ padding: "14px 16px", fontWeight: "600", color: "#0f172a" }}>
                      {isEditing ? (
                        <input 
                          type="text" 
                          value={editFormData.stock} 
                          onChange={(e) => setEditFormData({...editFormData, stock: e.target.value})}
                          style={{ padding: "4px 8px", borderRadius: "4px", border: "1px solid #cbd5e1", width: "100%" }}
                        />
                      ) : v.stock}
                    </td>

                    <td style={{ padding: "14px 16px" }}>
                      {isEditing ? (
                        <select 
                          value={editFormData.status}
                          onChange={(e) => setEditFormData({...editFormData, status: e.target.value})}
                          style={{ padding: "4px 8px", borderRadius: "4px", border: "1px solid #cbd5e1", width: "100%" }}
                        >
                          <option>Active</option>
                          <option>Inactive</option>
                          <option>Critical</option>
                        </select>
                      ) : (
                        <span style={{ 
                          color: v.status === "Active" ? "#16a34a" : v.status === "Critical" ? "#ea580c" : "#dc2626", 
                          fontWeight: "bold", 
                          fontSize: "12px" 
                        }}>
                          {v.status}
                        </span>
                      )}
                    </td>

                    <td style={{ padding: "14px 16px", textAlign: "right" }}>
                      {isEditing ? (
                        <div style={{ display: "flex", gap: "6px", justifyContent: "flex-end" }}>
                          <button onClick={() => handleSaveEdit(v.id)} style={{ background: "#16a34a", color: "#fff", border: "none", padding: "4px 8px", borderRadius: "4px", cursor: "pointer" }}><Check size={14}/></button>
                          <button onClick={() => setEditingId(null)} style={{ background: "#dc2626", color: "#fff", border: "none", padding: "4px 8px", borderRadius: "4px", cursor: "pointer" }}><X size={14}/></button>
                        </div>
                      ) : (
                        <div style={{ display: "flex", gap: "8px", justifyContent: "flex-end" }}>
                          <button 
                            onClick={() => startEditing(v)} 
                            style={{ 
                              display: "inline-flex", 
                              alignItem: "center", 
                              gap: "4px", 
                              backgroundColor: "#fff", 
                              color: "#0284c7", 
                              border: "1px solid #cbd5e1", 
                              padding: "4px 10px", 
                              borderRadius: "4px", 
                              cursor: "pointer", 
                              fontWeight: "bold", 
                              fontSize: "12px" 
                            }}
                          >
                            <Edit2 size={12} /> Edit
                          </button>
                          <button 
                            onClick={() => handleDeleteVendor(v.id)} 
                            style={{ 
                              display: "inline-flex", 
                              alignItem: "center", 
                              gap: "4px", 
                              backgroundColor: "#fff", 
                              color: "#dc2626", 
                              border: "1px solid #cbd5e1", 
                              padding: "4px 10px", 
                              borderRadius: "4px", 
                              cursor: "pointer", 
                              fontWeight: "bold", 
                              fontSize: "12px" 
                            }}
                          >
                            <Trash2 size={12} /> Remove
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })
            )}

            {/* Bottom Input Row for adding new vendor */}
            {isAdding && (
              <tr style={{ backgroundColor: "#fff", borderBottom: "1px solid #e2e8f0" }}>
                <td style={{ padding: "14px 16px" }}>
                  <input 
                    type="text" 
                    value={newVendor.id} 
                    disabled 
                    style={{ padding: "8px", borderRadius: "6px", border: "1px solid #cbd5e1", width: "70px", backgroundColor: "#f1f5f9", fontWeight: "bold" }}
                  />
                </td>
                <td style={{ padding: "14px 16px" }}>
                  <input 
                    type="text" 
                    placeholder="Supplier Name" 
                    value={newVendor.supplier_name}
                    onChange={(e) => setNewVendor({...newVendor, supplier_name: e.target.value})}
                    style={{ padding: "8px 12px", borderRadius: "6px", border: "1px solid #cbd5e1", width: "100%", fontSize: "13px", boxSizing: "border-box" }}
                  />
                </td>
                <td style={{ padding: "14px 16px" }}>
                  <select 
                    value={newVendor.product_type}
                    onChange={(e) => setNewVendor({...newVendor, product_type: e.target.value})}
                    style={{ padding: "8px 12px", borderRadius: "6px", border: "1px solid #cbd5e1", fontSize: "13px", backgroundColor: "#fff", width: "100%" }}
                  >
                    <option>Chicken</option>
                    <option>Water</option>
                    <option>Mutton</option>
                    <option>Cool Drinks</option>
                  </select>
                </td>
                <td style={{ padding: "14px 16px" }}>
                  <select 
                    value={newVendor.supply_type}
                    onChange={(e) => setNewVendor({...newVendor, supply_type: e.target.value})}
                    style={{ padding: "8px 12px", borderRadius: "6px", border: "1px solid #cbd5e1", fontSize: "13px", backgroundColor: "#fff", width: "100%" }}
                  >
                    <option>Raw Material</option>
                    <option>Bottled Products</option>
                    <option>Dry/Fresh Goods</option>
                    <option>Beverages</option>
                  </select>
                </td>
                <td style={{ padding: "14px 16px" }}>
                  <input 
                    type="text" 
                    placeholder="Contact" 
                    value={newVendor.contact}
                    onChange={(e) => setNewVendor({...newVendor, contact: e.target.value})}
                    style={{ padding: "8px 12px", borderRadius: "6px", border: "1px solid #cbd5e1", width: "100%", fontSize: "13px", boxSizing: "border-box" }}
                  />
                </td>
                <td style={{ padding: "14px 16px" }}>
                  <input 
                    type="text" 
                    placeholder="e.g. 500 kg" 
                    value={newVendor.stock}
                    onChange={(e) => setNewVendor({...newVendor, stock: e.target.value})}
                    style={{ padding: "8px 12px", borderRadius: "6px", border: "1px solid #cbd5e1", width: "100%", fontSize: "13px", boxSizing: "border-box" }}
                  />
                </td>
                <td style={{ padding: "14px 16px" }}>
                  <select 
                    value={newVendor.status}
                    onChange={(e) => setNewVendor({...newVendor, status: e.target.value})}
                    style={{ padding: "8px 12px", borderRadius: "6px", border: "1px solid #cbd5e1", fontSize: "13px", backgroundColor: "#fff" }}
                  >
                    <option>Active</option>
                    <option>Inactive</option>
                    <option>Critical</option>
                  </select>
                </td>
                <td style={{ padding: "14px 16px", textAlign: "right" }}>
                  <div style={{ display: "flex", gap: "6px", justifyContent: "flex-end" }}>
                    <button 
                      onClick={handleSaveNewVendor}
                      style={{ backgroundColor: "#2563eb", color: "#fff", border: "none", padding: "8px 14px", borderRadius: "6px", fontWeight: "bold", cursor: "pointer", fontSize: "12px" }}
                    >
                      Save Vendor
                    </button>
                    <button 
                      onClick={() => setIsAdding(false)}
                      style={{ backgroundColor: "#dc2626", color: "#fff", border: "none", padding: "8px 14px", borderRadius: "6px", fontWeight: "bold", cursor: "pointer", fontSize: "12px" }}
                    >
                      Cancel
                    </button>
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