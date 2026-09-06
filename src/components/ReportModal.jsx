import React, { useEffect, useState } from 'react';
import './ReportModal.css';

const ReportModal = ({ onClose }) => {
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/reports/daily-summary')
      .then((res) => res.json())
      .then((data) => {
        setReport(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching report:', err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="modal-overlay">
        <div className="report-card">Loading report data...</div>
      </div>
    );
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="report-card" onClick={(e) => e.stopPropagation()}>
        <div className="report-header">
          <h3>DAILY SUMMARY REPORT - [{new Date().toLocaleDateString()}]</h3>
          <button className="close-btn" onClick={onClose}>✕</button>
        </div>

        <div className="report-section total-bill-box">
          <h2>TOTAL BILL:</h2>
          <h1>₹ {report?.totalBill?.toLocaleString('en-IN', { minimumFractionDigits: 2 }) || '0.00'}</h1>
        </div>

        <div className="report-section">
          <h4>Revenue by MOP:</h4>
          <ul>
            <li>• Cash: <span>₹ {report?.mop?.cash?.toLocaleString('en-IN') || '0.00'}</span></li>
            <li>• UPI: <span>₹ {report?.mop?.upi?.toLocaleString('en-IN') || '0.00'}</span></li>
            <li>• Partial: <span>₹ {report?.mop?.partial?.toLocaleString('en-IN') || '0.00'}</span></li>
          </ul>
        </div>

        <div className="report-section">
          <h4>Expenses:</h4>
          <ul>
            <li className="red-text">• Vendor Payouts: <span>₹ {report?.expenses?.vendor?.toLocaleString('en-IN') || '0.00'}</span></li>
          </ul>
        </div>

        <div className="report-section">
          <h4>Cash Flow (Today):</h4>
          <ul>
            <li>• Quick Amount Needed: <span>₹ {report?.quickAmountNeeded?.toLocaleString('en-IN') || '0.00'}</span></li>
          </ul>
        </div>

        <div className="chart-section">
          <p className="chart-title">Today's Transaction Breakdown (₹)</p>
          <div className="bar-chart">
            <div className="bar-item">
              <span className="bar-val">₹{report?.mop?.cash || 0}</span>
              <div className="bar cash-bar" style={{ height: '70px' }}></div>
              <span className="bar-label">Revenue (Cash)</span>
            </div>
            <div className="bar-item">
              <span className="bar-val">₹{report?.mop?.upi || 0}</span>
              <div className="bar upi-bar" style={{ height: '90px' }}></div>
              <span className="bar-label">Revenue (UPI)</span>
            </div>
            <div className="bar-item">
              <span className="bar-val">₹{report?.expenses?.vendor || 0}</span>
              <div className="bar expense-bar" style={{ height: '30px' }}></div>
              <span className="bar-label">Expenses (Vendor)</span>
            </div>
          </div>
        </div>

        <div className="report-footer">
          <button className="btn-print" onClick={() => window.print()}>🖨 PRINT REPORT</button>
          <button className="btn-close" onClick={onClose}>CLOSE</button>
        </div>
      </div>
    </div>
  );
};

export default ReportModal;