import React, { useState, useEffect } from 'react';
import { apiRequest } from '../../api/client';
import { logger } from '../../utils/logger';
import './FeeStatus.css';

const FeeStatus = ({ studentId }) => {
  const [feeData, setFeeData] = useState({
    pctPaid: 0,
    totalAmount: 0,
    paidAmount: 0,
    pendingAmount: 0,
    nextDueDate: null,
    payments: [],
    dues: []
  });
  const [showHistory, setShowHistory] = useState(false);

  useEffect(() => {
    if (!studentId) return;
    apiRequest(`/api/fees?member_id=${studentId}`)
      .then(data => setFeeData(data))
      .catch(err => logger.debug('FeeStatus', `Fee data unavailable for ${studentId}: ${err.message}`));
  }, [studentId]);

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    return isNaN(d.getTime()) ? dateStr : d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
  };

  const hasExtraData = (feeData.totalAmount > 0) || (feeData.payments && feeData.payments.length > 0) || (feeData.dues && feeData.dues.length > 0);

  return (
    <div className="card card-navy fee-status-card">
      <div className="d-flex justify-between align-center mb-3">
        <h3 className="section-title fw-bold text-white mb-0">Fee Status</h3>
        {feeData.nextDueDate && (
          <span className="fee-due-badge">
            Next Due: {formatDate(feeData.nextDueDate)}
          </span>
        )}
      </div>
      
      <div className="fee-progress-container">
        <div className="d-flex justify-between text-muted fee-progress-labels">
          <span>Payment Progress</span>
          <span className="text-gold fw-bold">{feeData.pctPaid || 0}% Paid</span>
        </div>
        <div className="progress-bar-bg fee-progress-bg">
          <div className="progress-bar-fill bg-gold" style={{ width: `${feeData.pctPaid || 0}%`, backgroundColor: 'var(--gold)' }}></div>
        </div>
      </div>

      {hasExtraData && (
        <>
          <div className="fee-details d-flex gap-2 mt-3">
            <div className="fee-box flex-1">
              <span className="fee-label text-muted">Total Fee</span>
              <span className="fee-amount text-white fw-bold">₹{(feeData.totalAmount || 0).toLocaleString('en-IN')}</span>
            </div>
            <div className="fee-box flex-1">
              <span className="fee-label text-muted">Paid</span>
              <span className="fee-amount text-green fw-bold">₹{(feeData.paidAmount || 0).toLocaleString('en-IN')}</span>
            </div>
            <div className="fee-box flex-1">
              <span className="fee-label text-muted">Pending</span>
              <span className="fee-amount text-gold fw-bold">₹{(feeData.pendingAmount || 0).toLocaleString('en-IN')}</span>
            </div>
          </div>

          {((feeData.payments && feeData.payments.length > 0) || (feeData.dues && feeData.dues.length > 0)) && (
            <div className="fee-history-section mt-3">
              <button 
                className="fee-toggle-btn" 
                onClick={() => setShowHistory(!showHistory)}
              >
                <span>{showHistory ? 'Hide Transactions & Dues' : 'View Receipts & Scheduled Dues'}</span>
                <span className="fee-toggle-icon">{showHistory ? '▲' : '▼'}</span>
              </button>

              {showHistory && (
                <div className="fee-history-content mt-2 fade-in">
                  {feeData.payments && feeData.payments.length > 0 && (
                    <div className="fee-receipts-block mb-3">
                      <div className="fee-subheading text-muted mb-2">Payment Receipts</div>
                      <div className="fee-items-list">
                        {feeData.payments.map((p, idx) => (
                          <div key={p.id || idx} className="fee-item-row">
                            <div className="fee-item-left">
                              <span className="fee-item-title text-white">{p.recno || `Receipt #${idx + 1}`}</span>
                              <span className="fee-item-sub text-muted">{formatDate(p.feesdate)} • {p.pmode || 'Online'}</span>
                            </div>
                            <span className="fee-item-amt text-green fw-bold">+₹{Number(p.amount || 0).toLocaleString('en-IN')}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {feeData.dues && feeData.dues.length > 0 && (
                    <div className="fee-dues-block">
                      <div className="fee-subheading text-muted mb-2">Upcoming Dues</div>
                      <div className="fee-items-list">
                        {feeData.dues.map((d, idx) => (
                          <div key={d.id || idx} className="fee-item-row">
                            <div className="fee-item-left">
                              <span className="fee-item-title text-white">Due Installment</span>
                              <span className="fee-item-sub text-muted">Due Date: {formatDate(d.nextduedate)}</span>
                            </div>
                            <div className="text-right">
                              <div className="fee-item-amt text-gold fw-bold">₹{Number(d.amount || 0).toLocaleString('en-IN')}</div>
                              <span className={`fee-status-tag ${d.status === 'Paid' ? 'status-paid' : 'status-pending'}`}>{d.status || 'Pending'}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default FeeStatus;
