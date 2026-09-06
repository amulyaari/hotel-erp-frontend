import React, { useState, useEffect } from "react";
import { CheckCircle, Save, Sliders, Calendar, PlusCircle } from "lucide-react";

export default function SettingsSection({ currentUser, setCurrentUser }) {
  // General Restaurant Config State
  const [taxRate, setTaxRate] = useState("18");
  const [currency, setCurrency] = useState("₹ (INR)");

  // Cashier Targets State
  const [cashiersList, setCashiersList] = useState([]);
  const [expectedTargets, setExpectedTargets] = useState([]);
  const [targetForm, setTargetForm] = useState({
    user_id: "",
    expected_amount: "",
    target_date: new Date().toISOString().split("T")[0],
  });

  const [message, setMessage] = useState({ type: "", text: "" });

  useEffect(() => {
    fetchConfigurations();
    fetchCashiers();
    fetchExpectedTargets();
  }, []);

  const fetchConfigurations = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/configurations");
      const data = await res.json();
      if (data.success && data.data) {
        if (data.data.default_tax_rate) setTaxRate(data.data.default_tax_rate);
        if (data.data.currency_symbol) setCurrency(data.data.currency_symbol);
      }
    } catch (err) {
      console.error("Failed to load configurations:", err);
    }
  };

  const fetchCashiers = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/users");
      const data = await res.json();
      if (data.success) {
        const cashiers = data.data.filter(u => u.role_id !== 1 && u.role?.toLowerCase() !== "admin");
        setCashiersList(cashiers);
        if (cashiers.length > 0) {
          setTargetForm(prev => ({ ...prev, user_id: String(cashiers[0].id) }));
        }
      }
    } catch (err) {
      console.error("Failed to load cashiers list:", err);
    }
  };

  const fetchExpectedTargets = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/cashier/expected-targets");
      const data = await res.json();
      if (data.success) {
        setExpectedTargets(data.data);
      }
    } catch (err) {
      console.error("Failed to load cashier expected targets:", err);
    }
  };

  const handleSaveGeneralSettings = async (e) => {
    e.preventDefault();
    setMessage({ type: "", text: "" });

    try {
      const response = await fetch("http://localhost:5000/api/configurations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          default_tax_rate: taxRate,
          currency_symbol: currency,
        }),
      });

      const result = await response.json();
      if (result.success) {
        setMessage({ type: "success", text: "Restaurant configurations saved successfully in database!" });
      } else {
        setMessage({ type: "error", text: result.message || "Failed to save configurations." });
      }
    } catch (err) {
      setMessage({ type: "error", text: "Server connection error." });
    }
  };

  const handleSaveTarget = async (e) => {
    e.preventDefault();
    setMessage({ type: "", text: "" });

    if (!targetForm.user_id || !targetForm.expected_amount || !targetForm.target_date) {
      alert("Please fill in all target fields.");
      return;
    }

    const selectedCashierObj = cashiersList.find(c => String(c.id) === String(targetForm.user_id));

    try {
      const response = await fetch("http://localhost:5000/api/cashier/set-target", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: targetForm.user_id,
          cashier_name: selectedCashierObj ? selectedCashierObj.username : "Cashier",
          expected_amount: parseFloat(targetForm.expected_amount),
          target_date: targetForm.target_date,
        }),
      });

      const result = await response.json();
      if (result.success) {
        setMessage({ type: "success", text: "Cashier expected target saved/updated successfully in orders table!" });
        setTargetForm(prev => ({ ...prev, expected_amount: "" }));
        fetchExpectedTargets();
      } else {
        setMessage({ type: "error", text: result.message || "Failed to save target." });
      }
    } catch (err) {
      setMessage({ type: "error", text: "Server error connecting to database." });
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "20px", maxWidth: "900px", margin: "0 auto", width: "100%", fontFamily: "Inter, sans-serif" }}>
      
      {/* HEADER CARD */}
      <div style={{ backgroundColor: "#ffffff", borderRadius: "12px", padding: "20px 24px", border: "1px solid #e2e8f0" }}>
        <h2 style={{ fontSize: "20px", fontWeight: "bold", color: "#0f172a", margin: 0 }}>System Settings</h2>
        <p style={{ fontSize: "13px", color: "#64748b", margin: "4px 0 0 0" }}>Manage global taxes, and dynamic cashier targets.</p>
      </div>

      {message.text && (
        <div style={{ padding: "12px 16px", borderRadius: "8px", fontSize: "13px", backgroundColor: message.type === "success" ? "#f0fdf4" : "#fef2f2", color: message.type === "success" ? "#166534" : "#991b1b", border: `1px solid ${message.type === "success" ? "#bbf7d0" : "#fecaca"}`, display: "flex", alignItems: "center", gap: "8px" }}>
          {message.type === "success" && <CheckCircle size={18} />}
          <span>{message.text}</span>
        </div>
      )}

      {/* GENERAL RESTAURANT CONFIG CARD */}
      <div style={{ backgroundColor: "#ffffff", borderRadius: "12px", border: "1px solid #e2e8f0", padding: "24px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "18px", borderBottom: "1px solid #f1f5f9", paddingBottom: "12px" }}>
          <Sliders size={20} color="#d97706" />
          <h3 style={{ fontSize: "16px", fontWeight: "bold", color: "#0f172a", margin: 0 }}>Restaurant Configurations</h3>
        </div>

        <form onSubmit={handleSaveGeneralSettings} style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
            <div>
              <label style={{ display: "block", fontSize: "12px", fontWeight: "600", color: "#334155", marginBottom: "6px" }}>Default GST Tax Rate (%)</label>
              <input 
                type="number" 
                value={taxRate} 
                onChange={(e) => setTaxRate(e.target.value)} 
                style={{ width: "100%", padding: "10px 12px", borderRadius: "6px", border: "1px solid #cbd5e1", fontSize: "13px", outline: "none", boxSizing: "border-box" }} 
              />
            </div>
            <div>
              <label style={{ display: "block", fontSize: "12px", fontWeight: "600", color: "#334155", marginBottom: "6px" }}>Currency Symbol</label>
              <select 
                value={currency} 
                onChange={(e) => setCurrency(e.target.value)} 
                style={{ width: "100%", padding: "10px 12px", borderRadius: "6px", border: "1px solid #cbd5e1", fontSize: "13px", outline: "none", backgroundColor: "#fff", cursor: "pointer", boxSizing: "border-box" }}
              >
                <option value="₹ (INR)">₹ (INR)</option>
                <option value="$ (USD)">$ (USD)</option>
                <option value="€ (EUR)">€ (EUR)</option>
              </select>
            </div>
          </div>

          <button 
            type="submit" 
            style={{ backgroundColor: "#0f172a", color: "#ffffff", padding: "10px 16px", borderRadius: "6px", border: "none", fontSize: "13px", fontWeight: "600", cursor: "pointer", marginTop: "6px", display: "inline-flex", alignItems: "center", gap: "6px", alignSelf: "flex-start" }}
          >
            <Save size={16} />
            <span>Save System Configurations</span>
          </button>
        </form>
      </div>

      {/* DYNAMIC CASHIER EXPECTED TARGETS SECTION & FORM */}
      <div style={{ backgroundColor: "#ffffff", borderRadius: "12px", border: "1px solid #e2e8f0", padding: "24px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "16px", borderBottom: "1px solid #f1f5f9", paddingBottom: "12px" }}>
          <Calendar size={20} color="#16a34a" />
          <h3 style={{ fontSize: "16px", fontWeight: "bold", color: "#0f172a", margin: 0 }}>Cashier Expected Targets Overview</h3>
        </div>
        <p style={{ fontSize: "12px", color: "#64748b", margin: "0 0 16px 0" }}>Assign or update date-specific collection targets for cashiers. It updates the orders table dynamically.</p>

        {/* ADD TARGET FORM */}
        <form onSubmit={handleSaveTarget} style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr auto", gap: "10px", alignItems: "center", marginBottom: "20px", backgroundColor: "#f8fafc", padding: "14px", borderRadius: "8px", border: "1px solid #e2e8f0" }}>
          <div>
            <label style={{ display: "block", fontSize: "11px", fontWeight: "600", color: "#334155", marginBottom: "4px" }}>Select Cashier</label>
            <select
              value={targetForm.user_id}
              onChange={(e) => setTargetForm({ ...targetForm, user_id: e.target.value })}
              style={{ width: "100%", padding: "8px 10px", borderRadius: "6px", border: "1px solid #cbd5e1", fontSize: "12px", outline: "none", backgroundColor: "#fff", cursor: "pointer" }}
            >
              {cashiersList.map((c) => (
                <option key={c.id} value={c.id}>{c.username}</option>
              ))}
            </select>
          </div>

          <div>
            <label style={{ display: "block", fontSize: "11px", fontWeight: "600", color: "#334155", marginBottom: "4px" }}>Shift Date</label>
            <input
              type="date"
              value={targetForm.target_date}
              onChange={(e) => setTargetForm({ ...targetForm, target_date: e.target.value })}
              required
              style={{ width: "100%", padding: "8px 10px", borderRadius: "6px", border: "1px solid #cbd5e1", fontSize: "12px", outline: "none", boxSizing: "border-box" }}
            />
          </div>

          <div>
            <label style={{ display: "block", fontSize: "11px", fontWeight: "600", color: "#334155", marginBottom: "4px" }}>Expected Amount (₹)</label>
            <input
              type="number"
              placeholder="e.g. 5000"
              value={targetForm.expected_amount}
              onChange={(e) => setTargetForm({ ...targetForm, expected_amount: e.target.value })}
              required
              style={{ width: "100%", padding: "8px 10px", borderRadius: "6px", border: "1px solid #cbd5e1", fontSize: "12px", outline: "none", boxSizing: "border-box" }}
            />
          </div>

          <button 
            type="submit" 
            style={{ backgroundColor: "#16a34a", color: "#fff", border: "none", borderRadius: "6px", padding: "9px 14px", fontSize: "12px", fontWeight: "bold", cursor: "pointer", display: "inline-flex", alignItems: "center", gap: "6px", marginTop: "16px" }}
          >
            <PlusCircle size={16} />
            <span>Set Target</span>
          </button>
        </form>

        {/* TARGETS TABLE WITH ALL FIELDS */}
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13px", textAlign: "left" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid #e2e8f0", backgroundColor: "#f8fafc", color: "#334155" }}>
                <th style={{ padding: "10px 14px" }}>ID</th>
                <th style={{ padding: "10px 14px" }}>Shift Date</th>
                <th style={{ padding: "10px 14px" }}>Cashier Name</th>
                <th style={{ padding: "10px 14px", textAlign: "right" }}>Expected Target Amount</th>
              </tr>
            </thead>
            <tbody>
              {expectedTargets.length > 0 ? (
                expectedTargets.map((row, idx) => (
                  <tr key={row.id || idx} style={{ borderBottom: "1px solid #f1f5f9" }}>
                    <td style={{ padding: "10px 14px", fontWeight: "bold", color: "#334155" }}>{row.id}</td>
                    <td style={{ padding: "10px 14px", color: "#64748b" }}>{row.order_date ? new Date(row.order_date).toLocaleDateString() : "—"}</td>
                    <td style={{ padding: "10px 14px", fontWeight: "600" }}>{row.cashier_name}</td>
                    <td style={{ padding: "10px 14px", fontWeight: "bold", color: "#0284c7", textAlign: "right" }}>
                      ₹ {Number(row.expected_amount || 0).toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" style={{ padding: "16px", textAlign: "center", color: "#94a3b8" }}>No cashier expected targets recorded recently.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}