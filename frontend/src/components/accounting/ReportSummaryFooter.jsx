import React from 'react';
import { Wallet, Users, Banknote, Receipt, CreditCard, BookOpen } from 'lucide-react';
import { formatCurrency } from '../../utils/accountingUtils';

export default function ReportSummaryFooter({ activeReport, aggregates }) {
  if (!aggregates || aggregates.count === 0) return null;

  return (
    <div className="report-summary-footer">
      {/* KPI Cards for Remaining Fees */}
      {activeReport === 'remaining-fees' && (
        <div className="kpi-cards-grid">
          <div className="kpi-card">
            <div className="kpi-icon-badge red">
              <Wallet size={20} />
            </div>
            <div className="kpi-content">
              <span className="kpi-label">Total Outstanding Dues</span>
              <span className="kpi-value text-danger">
                {formatCurrency(aggregates.totalRemainFee)}
              </span>
              <span className="kpi-subtext">Sum of all pending student fee installments</span>
            </div>
          </div>

          <div className="kpi-card">
            <div className="kpi-icon-badge gold">
              <Users size={20} />
            </div>
            <div className="kpi-content">
              <span className="kpi-label">Accounts With Dues</span>
              <span className="kpi-value">{aggregates.count} Students</span>
              <span className="kpi-subtext">Active accounts pending clearance</span>
            </div>
          </div>
        </div>
      )}

      {/* KPI Cards for Day Wise Collection */}
      {activeReport === 'day-wise' && (
        <div className="kpi-cards-grid">
          <div className="kpi-card">
            <div className="kpi-icon-badge green">
              <Banknote size={20} />
            </div>
            <div className="kpi-content">
              <span className="kpi-label">Total Collected Revenue</span>
              <span className="kpi-value" style={{ color: '#059669' }}>
                {formatCurrency(aggregates.totalAmount)}
              </span>
              <span className="kpi-subtext">{aggregates.count} fee receipts in date range</span>
            </div>
          </div>

          <div className="kpi-card">
            <div className="kpi-icon-badge green">
              <Receipt size={20} />
            </div>
            <div className="kpi-content">
              <span className="kpi-label">Cash Received</span>
              <span className="kpi-value">{formatCurrency(aggregates.cashAmount)}</span>
              <span className="kpi-subtext">
                {aggregates.totalAmount > 0 
                  ? `${((aggregates.cashAmount / aggregates.totalAmount) * 100).toFixed(1)}% of total intake`
                  : 'Physical cash received'}
              </span>
            </div>
          </div>

          <div className="kpi-card">
            <div className="kpi-icon-badge blue">
              <CreditCard size={20} />
            </div>
            <div className="kpi-content">
              <span className="kpi-label">Bank & Digital Transfer</span>
              <span className="kpi-value">{formatCurrency(aggregates.bankAmount)}</span>
              <span className="kpi-subtext">
                {aggregates.totalAmount > 0 
                  ? `${((aggregates.bankAmount / aggregates.totalAmount) * 100).toFixed(1)}% of total intake`
                  : 'UPI / Bank / Cheque'}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* KPI Cards for Student List */}
      {activeReport === 'student-list' && (
        <div className="kpi-cards-grid">
          <div className="kpi-card">
            <div className="kpi-icon-badge gold">
              <Users size={20} />
            </div>
            <div className="kpi-content">
              <span className="kpi-label">Total Admissions</span>
              <span className="kpi-value">{aggregates.totalAdmissions} Students</span>
              <span className="kpi-subtext">Registered candidates in range</span>
            </div>
          </div>

          <div className="kpi-card">
            <div className="kpi-icon-badge blue">
              <BookOpen size={20} />
            </div>
            <div className="kpi-content">
              <span className="kpi-label">Total Course Fee Value</span>
              <span className="kpi-value">{formatCurrency(aggregates.totalFinalFee)}</span>
              <span className="kpi-subtext">Cumulative contracted tuition fee</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
