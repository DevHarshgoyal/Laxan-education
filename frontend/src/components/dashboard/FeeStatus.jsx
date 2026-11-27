import React, { useState, useEffect } from 'react';
import { apiRequest } from '../../api/client';
import { logger } from '../../utils/logger';
import '../../styles/FeeStatus.css';

const FeeStatus = ({ studentId }) => {
  const [feeData, setFeeData] = useState({ pctPaid: 0 });

  useEffect(() => {
    if (!studentId) return;
    apiRequest(`/api/fees?member_id=${studentId}`)
      .then(data => setFeeData(data))
      .catch(err => logger.debug('FeeStatus', `Fee data unavailable for ${studentId}: ${err.message}`));
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
