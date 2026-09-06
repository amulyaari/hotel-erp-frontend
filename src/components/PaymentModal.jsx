import React, { useState, useEffect } from "react";

export default function PaymentModal({ isOpen, onClose, netTotal, cartItems, tableNumber, onCompletePayment }) {
  const [paymentMode, setPaymentMode] = useState("Cash"); // 'Cash', 'UPI', 'Partial'
  const [cashAmount, setCashAmount] = useState(netTotal);
  const [upiAmount, setUpiAmount] = useState(0);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    setCashAmount(netTotal);
    setUpiAmount(0);
    setErrorMsg("");
  }, [netTotal, isOpen]);

  if (!isOpen) return null;

  const handleModeChange = (mode) => {
    setPaymentMode(mode);
    setErrorMsg("");
    if (mode === "Cash") {
      setCashAmount(netTotal);
      setUpiAmount(0);
    } else if (mode === "UPI") {
      setCashAmount(0);
      setUpiAmount(netTotal);
    } else if (mode === "Partial") {
      const half = (netTotal / 2).toFixed(2);
      setCashAmount(parseFloat(half));
      setUpiAmount(parseFloat((netTotal - half).toFixed(2)));
    }
  };

  const handleCashChange = (val) => {
    const cash = parseFloat(val) || 0;
    setCashAmount(cash);
    if (paymentMode === "Partial") {
      setUpiAmount(Math.max(0, parseFloat((netTotal - cash).toFixed(2))));
    }
  };

  const handleConfirmPayment = () => {
    const totalPaid = (paymentMode === "UPI" ? 0 : (parseFloat(cashAmount) || 0)) + 
                      (paymentMode === "Cash" ? 0 : (parseFloat(upiAmount) || 0));

    if (totalPaid < netTotal) {
      setErrorMsg(`Insufficient payment! Remaining: ₹${(netTotal - totalPaid).toFixed(2)}`);
      return;
    }

    const orderData = {
      orderId: `ORD-${Date.now().toString().slice(-6)}`,
      timestamp: new Date().toLocaleString(),
      tableNumber: tableNumber || "T-01",
      items: cartItems,
      netTotal: netTotal,
      paymentMode: paymentMode,
      paymentDetails: {
        cashPaid: paymentMode === "UPI" ? 0 : parseFloat(cashAmount),
        upiPaid: paymentMode === "Cash" ? 0 : parseFloat(upiAmount),
        balanceReturned: paymentMode === "Cash" && totalPaid > netTotal ? (totalPaid - netTotal).toFixed(2) : 0,
      },
      status: "Completed",
    };

    onCompletePayment(orderData);
    onClose();
  };

  return (
    <div style={styles.overlay}>
      <div style={styles.modal}>
        <div style={styles.header}>
          <h3 style={{ margin: 0 }}>Complete Payment</h3>
          <button style={styles.closeBtn} onClick={onClose}>✕</button>
        </div>

        <div style={styles.body}>
          <div style={styles.totalBox}>
            <span style={{ fontSize: "14px", color: "#64748b" }}>Net Total:</span>
            <span style={{ fontSize: "18px", fontWeight: "bold", color: "#0f172a" }}>
              ₹{parseFloat(netTotal).toFixed(2)}
            </span>
          </div>

          {/* Payment Mode Selector Tabs */}
          <div style={styles.tabGroup}>
            {["Cash", "UPI", "Partial"].map((mode) => (
              <button
                key={mode}
                onClick={() => handleModeChange(mode)}
                style={{
                  ...styles.tabBtn,
                  backgroundColor: paymentMode === mode ? "#ffffff" : "#f1f5f9",
                  color: paymentMode === mode ? "#2563eb" : "#334155",
                  border: paymentMode === mode ? "1px solid #2563eb" : "1px solid #cbd5e1",
                }}
              >
                {mode.toUpperCase()}
              </button>
            ))}
          </div>

          {/* Conditional Input Rendering */}
          {paymentMode === "Cash" && (
            <div style={styles.inputGroup}>
              <label style={styles.label}>Cash Paid:</label>
              <input
                type="number"
                value={cashAmount}
                onChange={(e) => handleCashChange(e.target.value)}
                style={styles.input}
              />
              {cashAmount > netTotal && (
                <p style={{ color: "#2563eb", fontSize: "12px", margin: "4px 0 0 0" }}>
                  Change to Return: ₹{(cashAmount - netTotal).toFixed(2)}
                </p>
              )}
            </div>
          )}

          {paymentMode === "UPI" && (
            <div style={styles.inputGroup}>
              <label style={styles.label}>UPI Paid:</label>
              <input
                type="number"
                value={upiAmount}
                onChange={(e) => setUpiAmount(parseFloat(e.target.value) || 0)}
                style={styles.input}
              />
            </div>
          )}

          {paymentMode === "Partial" && (
            <div style={{ display: "flex", gap: "12px" }}>
              <div style={{ flex: 1 }}>
                <label style={styles.label}>Cash Paid:</label>
                <input
                  type="number"
                  value={cashAmount}
                  onChange={(e) => handleCashChange(e.target.value)}
                  style={styles.input}
                />
              </div>
              <div style={{ flex: 1 }}>
                <label style={styles.label}>UPI Paid:</label>
                <input
                  type="number"
                  value={upiAmount}
                  onChange={(e) => setUpiAmount(parseFloat(e.target.value) || 0)}
                  style={styles.input}
                />
              </div>
            </div>
          )}

          {errorMsg && <p style={styles.error}>{errorMsg}</p>}
        </div>

        <div style={styles.footer}>
          <button style={styles.cancelBtn} onClick={onClose}>Cancel</button>
          <button style={styles.confirmBtn} onClick={handleConfirmPayment}>
            Confirm & Print Bill
          </button>
        </div>
      </div>
    </div>
  );
}

const styles = {
  overlay: { position: "fixed", top: 0, left: 0, right: 0, bottom: 0, backgroundColor: "rgba(0,0,0,0.5)", display: "flex", justifyContent: "center", alignItems: "center", zIndex: 1000 },
  modal: { backgroundColor: "#fff", width: "420px", borderRadius: "12px", overflow: "hidden", boxShadow: "0 20px 25px -5px rgba(0,0,0,0.1)" },
  header: { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px 20px", backgroundColor: "#ffffff", borderBottom: "1px solid #e2e8f0" },
  closeBtn: { background: "none", border: "none", color: "#64748b", fontSize: "16px", cursor: "pointer" },
  body: { padding: "20px", display: "flex", flexDirection: "column", gap: "16px" },
  totalBox: { display: "flex", flexDirection: "column", gap: "4px" },
  tabGroup: { display: "flex", gap: "8px" },
  tabBtn: { flex: 1, padding: "8px", borderRadius: "6px", fontWeight: "bold", cursor: "pointer", fontSize: "13px" },
  inputGroup: { display: "flex", flexDirection: "column", gap: "6px" },
  label: { fontSize: "12px", fontWeight: "bold", color: "#334155" },
  input: { padding: "8px", borderRadius: "6px", border: "1px solid #cbd5e1", fontSize: "14px", outline: "none", boxSizing: "border-box", width: "100%" },
  error: { color: "#dc2626", fontSize: "12px", margin: 0, fontWeight: "bold" },
  footer: { display: "flex", gap: "8px", padding: "16px 20px", borderTop: "1px solid #e2e8f0", backgroundColor: "#ffffff" },
  cancelBtn: { flex: 1, padding: "10px", borderRadius: "6px", border: "1px solid #cbd5e1", background: "#fff", fontWeight: "bold", cursor: "pointer", color: "#334155" },
  confirmBtn: { flex: 2, padding: "10px", borderRadius: "6px", border: "none", background: "#16a34a", color: "#fff", fontWeight: "bold", cursor: "pointer" },
};