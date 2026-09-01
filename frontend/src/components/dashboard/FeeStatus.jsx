import React, { useState, useEffect } from 'react';
import './FeeStatus.css';

const FeeStatus = ({ studentId }) => {
  const [feeData, setFeeData] = useState({ pctPaid: 0 });

  useEffect(() => {
    if (!studentId) return;
    fetch(`${import.meta.env.VITE_API_URL}/api/fees?member_id=${studentId}`)
      .then(res => res.json())
      .then(data => setFeeData(data))
      .catch(err => console.error("Error fetching fee data:", err));
  }, [studentId]);

  return (
    <div className="card card-navy fee-status-card">
      <h3 className="section-title fw-bold text-white mb-3">Fee Status</h3>
      
      <div className="fee-progress-container">
        <div className="d-flex justify-between text-muted fee-progress-labels">
          <span>Fee Percentage</span>
          <span className="text-gold fw-bold">{feeData.pctPaid || 0}% Paid</span>
        </div>
        <div className="progress-bar-bg fee-progress-bg">
          <div className="progress-bar-fill bg-gold" style={{ width: `${feeData.pctPaid || 0}%`, backgroundColor: 'var(--gold)' }}></div>
        </div>
      </div>
    </div>
  );
};

export default FeeStatus;
