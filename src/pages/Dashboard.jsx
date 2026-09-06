import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import POSBilling from "./POSBilling";
import OpenBillsDashboard from "./OpenBillsDashboard";
import "../styles/Dashboard.css";

export default function Dashboard() {
  const navigate = useNavigate();
  const [subTab, setSubTab] = useState("new_billing");

  // State to hold the currently resumed bill data to pass into POSBilling
  const [resumedBill, setResumedBill] = useState(null);

  // State for Order History Modal
  const [showOrderHistory, setShowOrderHistory] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedHistoryDate, setSelectedHistoryDate] = useState(new Date().toISOString().slice(0, 10));
  const [transactionsData, setTransactionsData] = useState({
    totalOrders: 0,
    totalSales: 0,
    cashTotal: 0,
    upiTotal: 0,
    transactions: []
  });

  const fetchTransactions = (dateStr) => {
    const targetDate = dateStr || selectedHistoryDate;
    fetch(`http://localhost:5000/api/transactions/today?date=${targetDate}`)
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setTransactionsData(data.data);
        }
      })
      .catch(err => console.error("Error fetching transactions:", err));
  };

  // Dataset for Open Bills synced live with backend KOTs and open billing
  const [openBillsList, setOpenBillsList] = useState([]);

  const fetchOpenBills = () => {
    fetch("http://localhost:5000/api/open-bills")
      .then(res => res.json())
      .then(data => {
        if (data.success && data.data) {
          setOpenBillsList(data.data);
        }
      })
      .catch(err => console.error("Error fetching open bills:", err));
  };

  useEffect(() => {
    fetchOpenBills();
  }, []);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");

    if (!storedUser) {
      alert("Unauthorized access! Please login first.");
      navigate("/");
      return;
    }

    try {
      JSON.parse(storedUser);
    } catch (err) {
      localStorage.clear();
      navigate("/");
    }
  }, [navigate]);

  // Catch redirected order from Captain Dashboard or Pay button from Open Bills Dashboard
  useEffect(() => {
    const checkResumedBill = () => {
      // Check for resumed bill from Open Bills Pay button
      const resumedData = localStorage.getItem("resumed_bill_data");
      if (resumedData) {
        try {
          const parsedBill = JSON.parse(resumedData);
          if (parsedBill && parsedBill.items) {
            const formattedItems = parsedBill.items.map((item, idx) => ({
              id: item.id || idx + 1,
              name: item.name || item.product_name || item.item_name,
              price: Number(item.price) || 0,
              qty: item.qty || item.quantity || 1,
              total: (Number(item.price) || 0) * (item.qty || item.quantity || 1)
            }));

            const subtotal = formattedItems.reduce((acc, curr) => acc + curr.total, 0);

            setResumedBill({
              id: parsedBill.id,
              customer: parsedBill.customer || "Open Bill Customer",
              table: parsedBill.table || "N/A",
              items: formattedItems,
              amount: subtotal
            });

            setSubTab("new_billing"); // Switch to New Billing view automatically and load into current bill
          }
        } catch (e) {
          console.error("Error parsing resumed bill data:", e);
        }
      }
    };

    checkResumedBill();
    window.addEventListener("storage", checkResumedBill);

    // Check for redirected order from Captain Dashboard
    const savedCart = localStorage.getItem("pos_current_cart");
    const savedTable = localStorage.getItem("pos_selected_table");

    if (savedCart) {
      try {
        const parsedCart = JSON.parse(savedCart);
        if (parsedCart.length > 0) {
          const formattedItems = parsedCart.map(item => ({
            id: item.id,
            name: item.product_name || item.name,
            price: Number(item.price),
            qty: item.qty || 1,
            total: Number(item.price) * (item.qty || 1)
          }));

          const subtotal = formattedItems.reduce((acc, curr) => acc + curr.total, 0);

          setResumedBill({
            id: `Table-${savedTable || "General"}`,
            customer: "Captain Order",
            table: savedTable || "None",
            items: formattedItems,
            amount: subtotal
          });
          
          setSubTab("new_billing"); 
        }
      } catch (e) {
        console.error("Error parsing captain cart for billing:", e);
      }
    }

    return () => {
      window.removeEventListener("storage", checkResumedBill);
      localStorage.removeItem("pos_current_cart");
      localStorage.removeItem("pos_selected_table");
    };
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  const filteredTransactions = transactionsData.transactions.filter(tx => 
    tx.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
    tx.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
    tx.phone.includes(searchQuery)
  );

  return (
    <div className="erp-layout" style={{ display: "flex", height: "100vh", width: "100vw", overflow: "hidden" }}>
      <main className="erp-main-content" style={{ padding: "0px", flex: 1, backgroundColor: "#f8fafc", width: "100%" }}>
        <div style={{ display: "flex", flexDirection: "column", height: "100vh", width: "100%" }}>
          
          {/* SUB-ITEMS TOOLBAR */}
          <div style={{ display: "flex", gap: "8px", borderBottom: "2px solid #e2e8f0", padding: "8px 12px", backgroundColor: "#fff", alignItems: "center" }}>
            <button
              onClick={() => setSubTab("new_billing")}
              style={{
                padding: "7px 14px",
                borderRadius: "4px",
                border: "none",
                backgroundColor: subTab === "new_billing" ? "#0284c7" : "#e2e8f0",
                color: subTab === "new_billing" ? "#fff" : "#334155",
                fontWeight: "bold",
                cursor: "pointer",
                fontSize: "0.85rem",
              }}
            >
              💳 New Billing
            </button>
            <button
              onClick={() => { setSubTab("open_bills"); fetchOpenBills(); }}
              style={{
                padding: "7px 14px",
                borderRadius: "4px",
                border: "none",
                backgroundColor: subTab === "open_bills" ? "#0284c7" : "#e2e8f0",
                color: subTab === "open_bills" ? "#fff" : "#334155",
                fontWeight: "bold",
                cursor: "pointer",
                fontSize: "0.85rem",
              }}
            >
              📄 Open Bills ({openBillsList.length})
            </button>

            {/* ORDER HISTORY BUTTON */}
            <button
              onClick={() => { setShowOrderHistory(true); fetchTransactions(); }}
              style={{
                padding: "7px 14px",
                backgroundColor: "#1e3a8a",
                color: "#fff",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
                fontWeight: "bold",
                fontSize: "0.85rem",
                display: "flex",
                alignItems: "center",
                gap: "6px"
              }}
            >
              📋 Order History
            </button>

            <button
              onClick={handleLogout}
              title="Logout"
              style={{
                marginLeft: "auto",
                padding: "7px 14px",
                backgroundColor: "#ef4444",
                color: "#fff",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
                fontWeight: "bold",
                fontSize: "0.85rem",
              }}
            >
              🚪 Logout
            </button>
          </div>

          {/* DYNAMIC COMPONENT CALLS */}
          {subTab === "new_billing" && (
            <POSBilling
              openBillsList={openBillsList}
              setOpenBillsList={setOpenBillsList}
              resumedBill={resumedBill}
              clearResumedBill={() => setResumedBill(null)}
            />
          )}
          {subTab === "open_bills" && (
            <OpenBillsDashboard
              openBillsList={openBillsList}
              setOpenBillsList={setOpenBillsList}
            />
          )}

          {/* ORDER HISTORY MODAL POPUP */}
          {showOrderHistory && (
            <div style={{ position: "fixed", top: 0, left: 0, width: "100vw", height: "100vh", backgroundColor: "rgba(0,0,0,0.6)", display: "flex", justifyContent: "center", alignItems: "center", zIndex: 1000 }}>
              <div style={{ backgroundColor: "#1e293b", color: "#f8fafc", width: "650px", maxHeight: "88vh", borderRadius: "12px", padding: "24px", display: "flex", flexDirection: "column", boxShadow: "0 10px 25px rgba(0,0,0,0.5)" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid #334155", paddingBottom: "12px", marginBottom: "16px" }}>
                  <h3 style={{ margin: 0, fontSize: "16px" }}>Transactions (cashier01)</h3>
                  <button onClick={() => setShowOrderHistory(false)} style={{ background: "none", border: "none", color: "#94a3b8", fontSize: "18px", cursor: "pointer" }}>✕</button>
                </div>

                <div style={{ display: "flex", gap: "10px", marginBottom: "16px" }}>
                  <input 
                    type="text" 
                    placeholder="Search by Order ID, Customer, Phone..." 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    style={{ flex: 1, padding: "10px 12px", borderRadius: "6px", border: "1px solid #475569", backgroundColor: "#0f172a", color: "#fff", outline: "none" }}
                  />
                  <input 
                    type="date" 
                    value={selectedHistoryDate}
                    onChange={(e) => {
                      setSelectedHistoryDate(e.target.value);
                      fetchTransactions(e.target.value);
                    }}
                    style={{ padding: "10px 14px", borderRadius: "6px", border: "1px solid #475569", backgroundColor: "#0f172a", color: "#fff", outline: "none", cursor: "pointer" }}
                  />
                </div>

                <div style={{ backgroundColor: "#0f172a", padding: "14px", borderRadius: "8px", marginBottom: "16px", display: "flex", justifyContent: "space-between", alignItems: "center", border: "1px solid #334155" }}>
                  <div>
                    <span style={{ fontSize: "12px", color: "#94a3b8" }}>TOTAL SALES ({transactionsData.totalOrders} Orders) →</span>
                    <h2 style={{ margin: "4px 0 0 0", color: "#4ade80" }}>₹{transactionsData.totalSales.toFixed(2)}</h2>
                  </div>
                  <div style={{ fontSize: "12px", textAlign: "right", color: "#cbd5e1", lineHeight: "1.5" }}>
                    <div>💵 Cash: <strong>₹{transactionsData.cashTotal.toFixed(2)}</strong></div>
                    <div>📱 UPI: <strong>₹{transactionsData.upiTotal.toFixed(2)}</strong></div>
                    <div><strong>→ Total: ₹{transactionsData.totalSales.toFixed(2)}</strong></div>
                  </div>
                </div>

                <div style={{ flex: 1, overflowY: "auto", display: "flex", flexDirection: "column", gap: "10px", paddingRight: "4px" }}>
                  {filteredTransactions.length === 0 ? (
                    <div style={{ textAlign: "center", color: "#64748b", padding: "40px" }}>No matching transactions found.</div>
                  ) : (
                    filteredTransactions.map((tx, idx) => (
                      <div key={idx} style={{ backgroundColor: "#0f172a", padding: "14px", borderRadius: "8px", border: "1px solid #334155", display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                        <div style={{ fontSize: "13px", lineHeight: "1.4" }}>
                          <strong style={{ color: "#38bdf8", fontSize: "14px" }}>{tx.id}</strong><br/>
                          <span style={{ color: "#94a3b8" }}>Timing: {tx.timing} | Type: {tx.type}</span><br/>
                          <span style={{ color: "#cbd5e1" }}>Customer: <strong>{tx.customer}</strong> | Phone: {tx.phone}</span><br/>
                          <span style={{ color: "#34d399", fontSize: "12px" }}>📦 {tx.itemsSummary}</span>
                        </div>
                        <div style={{ textAlign: "right", display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "4px" }}>
                          <strong style={{ color: "#f8fafc", fontSize: "14px" }}>Amount: ₹{tx.amount.toFixed(2)}</strong>
                          <span style={{ fontSize: "11px", backgroundColor: "#166534", color: "#bbf7d0", padding: "2px 8px", borderRadius: "4px", fontWeight: "bold" }}>{tx.status}</span>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                <button onClick={() => setShowOrderHistory(false)} style={{ marginTop: "16px", padding: "10px", backgroundColor: "#334155", color: "#fff", border: "none", borderRadius: "6px", fontWeight: "bold", cursor: "pointer" }}>
                  Save and Close
                </button>
              </div>
            </div>
          )}

        </div>
      </main>
    </div>
  );
}