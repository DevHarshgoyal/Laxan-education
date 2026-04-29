import React, { useState, useEffect } from 'react';
import './FeeStatus.css';

const FeeStatus = ({ studentId }) => {
  const [feeData, setFeeData] = useState({ total: 0, paid: 0, pending: 0, pctPaid: 0 });

  useEffect(() => {
    if (!studentId) return;
    fetch(`${import.meta.env.VITE_API_URL}/api/fees?student_id=${studentId}`)
      .then(res => res.json())
      .then(data => setFeeData(data))
      .catch(err => console.error("Error fetching fee data:", err));
  }, [studentId]);

  return (
    <div className="card card-navy fee-status-card">
      <h3 className="section-title fw-bold text-white mb-3">Fee Status</h3>
      
      <div className="fee-progress-container mb-4">
        <div className="d-flex justify-between text-muted" style={{fontSize: '12px', marginBottom: '8px'}}>
          <span>Total Fee: ₹{feeData.total}</span>
          <span className="text-gold fw-bold">{feeData.pctPaid}% Paid</span>
        </div>
        <div className="progress-bar-bg fee-progress-bg">
          <div className="progress-bar-fill bg-gold" style={{ width: `${feeData.pctPaid}%`, backgroundColor: 'var(--gold)' }}></div>
        </div>
      </div>
      
      <div className="fee-details d-flex gap-3">
        <div className="fee-box paid-box flex-1">
          <span className="fee-label text-muted">Paid Amount</span>
          <span className="fee-amount text-gold fw-bold">₹{feeData.paid}</span>
        </div>
        <div className="fee-box pending-box flex-1">
          <span className="fee-label text-muted">Pending Amount</span>
          <span className="fee-amount text-red fw-bold">₹{feeData.pending}</span>
        </div>
      </div>
    </div>
  );
};

export default FeeStatus;
