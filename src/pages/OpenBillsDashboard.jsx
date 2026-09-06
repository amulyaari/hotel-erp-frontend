import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";

export default function OpenBillsDashboard() {
  const navigate = useNavigate();
  const [openBillsList, setOpenBillsList] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchOpenBills = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch("http://localhost:5000/api/open-bills");
      const data = await res.json();
      if (data.success) {
        const normalizedBills = data.data.map(bill => {
          const finalItems = Array.isArray(bill.items) ? bill.items.map(i => {
            const name = i.product_name || "Item";
            const qty = Number(i.qty) || 1;
            const price = Number(i.price) || 0;
            return {
              product_name: name,
              name: name,
              qty: qty,
              price: price,
              total: qty * price
            };
          }) : [];

          const computedAmount = finalItems.reduce((acc, curr) => acc + (curr.total || 0), 0);

          // Fall back directly to the bill.amount sent by the backend if computed items total comes out to 0
          const finalAmount = computedAmount > 0 ? computedAmount : Number(bill.amount || 0);

          return {
            ...bill,
            amount: finalAmount,
            items: finalItems,
            itemsSummary: finalItems.map(i => `${i.qty}x ${i.product_name}`).join(", ")
          };
        });
        setOpenBillsList(normalizedBills);
      }
    } catch (err) {
      console.error("Error fetching open bills:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOpenBills();
  }, [fetchOpenBills]);

  // Handle clicking on an open bill row to resume it in POS billing instantly
  const handleRowClick = (bill) => {
    localStorage.setItem("resumed_bill_data", JSON.stringify(bill));
    
    // Dispatch custom storage event so the parent dashboard switches views instantly
    window.dispatchEvent(new Event("storage"));
    
    // Switch to New Billing tab securely
    const posTabButton = Array.from(document.querySelectorAll("button")).find(
      (el) => el.textContent.includes("New Billing") || el.textContent.includes("POS")
    );
    
    if (posTabButton) {
      posTabButton.click();
    } else {
      navigate("/dashboard");
    }
  };

  // Handle going back to POS billing securely
  const handleBackClick = () => {
    const posTabButton = Array.from(document.querySelectorAll("button")).find(
      (el) => el.textContent.includes("New Billing") || el.textContent.includes("POS")
    );
    
    if (posTabButton) {
      posTabButton.click();
    } else {
      navigate("/dashboard");
    }
  };

  return (
    <div style={{ padding: "20px", backgroundColor: "#f8fafc", minHeight: "100vh", fontFamily: "sans-serif" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
        <div>
          <h2 style={{ margin: 0, color: "#0f172a" }}>Open Bills Dashboard (Payment Pending)</h2>
          <p style={{ margin: "4px 0 0 0", fontSize: "0.85rem", color: "#16a34a", fontWeight: "bold" }}>
            ⚡ System Online - Live Database Sync
          </p>
        </div>
        <div style={{ display: "flex", gap: "10px" }}>
          <button
            onClick={handleBackClick}
            style={{ padding: "8px 16px", backgroundColor: "#0284c7", color: "#fff", border: "none", borderRadius: "6px", fontWeight: "bold", cursor: "pointer" }}
          >
            ← Back to POS Billing
          </button>
          <button
            onClick={fetchOpenBills}
            style={{ padding: "8px 16px", backgroundColor: "#0284c7", color: "#fff", border: "none", borderRadius: "6px", fontWeight: "bold", cursor: "pointer" }}
          >
            🔄 Refresh
          </button>
        </div>
      </div>

      <div style={{ backgroundColor: "#fff", borderRadius: "8px", border: "1px solid #cbd5e1", overflow: "hidden", boxShadow: "0 4px 6px -1px rgba(0,0,0,0.05)" }}>
        
        {/* TABLE HEADER - 7 columns layout without Actions */}
        <div style={{ display: "grid", gridTemplateColumns: "50px 100px 160px 120px 100px 1fr 120px", padding: "10px 12px", backgroundColor: "#f1f5f9", fontWeight: "bold", fontSize: "0.8rem" }}>
          <span></span>
          <span>Table</span>
          <span>Date & Time</span>
          <span>Customer</span>
          <span>Bill #</span>
          <span>Items</span>
          <span>Amount</span>
        </div>

        {loading ? (
          <p style={{ textAlign: "center", padding: "30px", color: "#64748b" }}>Loading open bills...</p>
        ) : openBillsList.length === 0 ? (
          <p style={{ textAlign: "center", padding: "30px", color: "#64748b" }}>No open bills found</p>
        ) : (
          openBillsList.map((bill) => {
            // Automatically parses live timestamp into local browser date & time matching your current system time
            const orderDate = bill.created_at ? new Date(bill.created_at) : new Date();
            const formattedDate = !isNaN(orderDate.getTime()) ? orderDate.toLocaleDateString() : (bill.dateStr || "");
            const formattedTime = !isNaN(orderDate.getTime()) ? orderDate.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : (bill.timeStr || "");

            return (
              <div 
                key={bill.id} 
                onClick={() => handleRowClick(bill)}
                style={{ 
                  display: "grid", 
                  gridTemplateColumns: "50px 100px 160px 120px 100px 1fr 120px", 
                  padding: "10px 12px", 
                  borderBottom: "1px solid #e2e8f0", 
                  alignItems: "center", 
                  fontSize: "0.85rem",
                  cursor: "pointer",
                  transition: "background-color 0.2s"
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#f1f5f9"}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "transparent"}
              >
                <input type="checkbox" onClick={(e) => e.stopPropagation()} />
                
                {/* Table displayed in Bill # column position */}
                <span><strong style={{ color: bill.table === "PARCEL" ? "#d97706" : "#0284c7" }}>{bill.table}</strong></span>

                <span style={{ color: "#64748b", fontSize: "0.78rem" }}>{formattedDate} {formattedTime}</span>
                <span>{bill.customer}</span>

                {/* Bill # displayed in Table column position */}
                <span style={{ fontWeight: "bold", color: "#0f172a" }}>{bill.id}</span>

                <span style={{ color: "#475569", fontSize: "0.8rem" }}>{bill.itemsSummary}</span>
                <span style={{ fontWeight: "bold", color: "#16a34a" }}>₹{Number(bill.amount).toFixed(2)}</span>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}