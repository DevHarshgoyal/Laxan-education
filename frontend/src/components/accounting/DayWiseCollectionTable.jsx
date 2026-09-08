import React from 'react';
import { Receipt, Calendar, Users, CreditCard, Banknote, CheckCircle2 } from 'lucide-react';
import { formatCurrency, formatDisplayDate, getPaymentModeBadgeClass } from '../../utils/accountingUtils';
import SortIndicator from './SortIndicator';

export default function DayWiseCollectionTable({
  data,
  selectedRowId,
  onSelectRow,
  sortField,
  sortDirection,
  onSort
}) {
  return (
    <table className="modern-report-table">
      <thead>
        <tr>
          <th style={{ width: '60px' }}>
            <span className="th-content">#</span>
          </th>
          <th className="sortable" onClick={() => onSort('recno')}>
            <span className="th-content">
              <Receipt size={13} />
              <span>Receipt No</span>
              <SortIndicator currentField="recno" activeField={sortField} direction={sortDirection} />
            </span>
          </th>
          <th className="sortable" onClick={() => onSort('date')}>
            <span className="th-content">
              <Calendar size={13} />
              <span>Collection Date</span>
              <SortIndicator currentField="date" activeField={sortField} direction={sortDirection} />
            </span>
          </th>
          <th className="sortable" onClick={() => onSort('name')}>
            <span className="th-content">
              <Users size={13} />
              <span>Student Details</span>
              <SortIndicator currentField="name" activeField={sortField} direction={sortDirection} />
            </span>
          </th>
          <th className="sortable" onClick={() => onSort('pmode')}>
            <span className="th-content">
              <CreditCard size={13} />
              <span>Payment Mode</span>
              <SortIndicator currentField="pmode" activeField={sortField} direction={sortDirection} />
            </span>
          </th>
          <th className="sortable" onClick={() => onSort('amount')}>
            <span className="th-content right">
              <Banknote size={13} />
              <span>Amount Collected</span>
              <SortIndicator currentField="amount" activeField={sortField} direction={sortDirection} />
            </span>
          </th>
        </tr>
      </thead>
      <tbody>
        {data.map((row, idx) => {
          const pmode = String(row.pmode || 'Other').trim();
          const pmodeClass = getPaymentModeBadgeClass(pmode);

          return (
            <tr 
              key={row.id || idx}
              className={selectedRowId === row.id ? 'row-selected' : ''}
              onClick={() => onSelectRow(row.id)}
            >
              <td>
                <span className="cell-index-badge">
                  {String(idx + 1).padStart(2, '0')}
                </span>
              </td>
              <td>
                <span className="receipt-code-tag">
                  <Receipt size={12} color="#64748b" />
                  <span>#{row.recno}</span>
                </span>
              </td>
              <td>
                <div className="due-date-cell-flex">
                  <Calendar size={13} color="#64748b" />
                  <span className="date-text-primary">{formatDisplayDate(row.date)}</span>
                </div>
              </td>
              <td>
                <div className="student-info-col">
                  <span className="student-name-text">{row.name}</span>
                  <span className="student-sub-id">MID: #{row.memberid || row.id}</span>
                </div>
              </td>
              <td>
                <span className={`pmode-pill ${pmodeClass}`}>
                  {pmodeClass === 'cash' && <Banknote size={12} />}
                  {pmodeClass === 'bank' && <CreditCard size={12} />}
                  {pmodeClass === 'cheque' && <Receipt size={12} />}
                  {pmodeClass === 'other' && <CheckCircle2 size={12} />}
                  <span>{pmode}</span>
                </span>
              </td>
              <td style={{ textAlign: 'right' }}>
                <span className="amount-badge-collected">
                  {formatCurrency(row.amount)}
                </span>
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}
