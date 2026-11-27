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
  const handleKeyDownRow = (e, id) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onSelectRow(id);
    }
  };

  const handleKeyDownHeader = (e, field) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onSort(field);
    }
  };

  return (
    <table className="modern-report-table" aria-label="Day Wise Fee Collection Report">
      <thead>
        <tr>
          <th scope="col" style={{ width: '60px' }}>
            <span className="th-content">#</span>
          </th>
          <th 
            scope="col"
            className="sortable" 
            onClick={() => onSort('recno')}
            onKeyDown={(e) => handleKeyDownHeader(e, 'recno')}
            tabIndex={0}
            role="columnheader"
            aria-sort={sortField === 'recno' ? (sortDirection === 'asc' ? 'ascending' : 'descending') : 'none'}
          >
            <span className="th-content">
              <Receipt size={13} aria-hidden="true" />
              <span>Receipt No</span>
              <SortIndicator currentField="recno" activeField={sortField} direction={sortDirection} />
            </span>
          </th>
          <th 
            scope="col"
            className="sortable" 
            onClick={() => onSort('date')}
            onKeyDown={(e) => handleKeyDownHeader(e, 'date')}
            tabIndex={0}
            role="columnheader"
            aria-sort={sortField === 'date' ? (sortDirection === 'asc' ? 'ascending' : 'descending') : 'none'}
          >
            <span className="th-content">
              <Calendar size={13} aria-hidden="true" />
              <span>Collection Date</span>
              <SortIndicator currentField="date" activeField={sortField} direction={sortDirection} />
            </span>
          </th>
          <th 
            scope="col"
            className="sortable" 
            onClick={() => onSort('name')}
            onKeyDown={(e) => handleKeyDownHeader(e, 'name')}
            tabIndex={0}
            role="columnheader"
            aria-sort={sortField === 'name' ? (sortDirection === 'asc' ? 'ascending' : 'descending') : 'none'}
          >
            <span className="th-content">
              <Users size={13} aria-hidden="true" />
              <span>Student Details</span>
              <SortIndicator currentField="name" activeField={sortField} direction={sortDirection} />
            </span>
          </th>
          <th 
            scope="col"
            className="sortable" 
            onClick={() => onSort('pmode')}
            onKeyDown={(e) => handleKeyDownHeader(e, 'pmode')}
            tabIndex={0}
            role="columnheader"
            aria-sort={sortField === 'pmode' ? (sortDirection === 'asc' ? 'ascending' : 'descending') : 'none'}
          >
            <span className="th-content">
              <CreditCard size={13} aria-hidden="true" />
              <span>Payment Mode</span>
              <SortIndicator currentField="pmode" activeField={sortField} direction={sortDirection} />
            </span>
          </th>
          <th 
            scope="col"
            className="sortable" 
            onClick={() => onSort('amount')}
            onKeyDown={(e) => handleKeyDownHeader(e, 'amount')}
            tabIndex={0}
            role="columnheader"
            aria-sort={sortField === 'amount' ? (sortDirection === 'asc' ? 'ascending' : 'descending') : 'none'}
          >
            <span className="th-content right">
              <Banknote size={13} aria-hidden="true" />
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
              onKeyDown={(e) => handleKeyDownRow(e, row.id)}
              tabIndex={0}
              role="row"
              aria-selected={selectedRowId === row.id}
            >
              <td>
                <span className="cell-index-badge">
                  {String(idx + 1).padStart(2, '0')}
                </span>
              </td>
              <td>
                <span className="receipt-code-tag">
                  <Receipt size={12} color="#64748b" aria-hidden="true" />
                  <span>#{row.recno}</span>
                </span>
              </td>
              <td>
                <div className="due-date-cell-flex">
                  <Calendar size={13} color="#64748b" aria-hidden="true" />
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
                  {pmodeClass === 'cash' && <Banknote size={12} aria-hidden="true" />}
                  {pmodeClass === 'bank' && <CreditCard size={12} aria-hidden="true" />}
                  {pmodeClass === 'cheque' && <Receipt size={12} aria-hidden="true" />}
                  {pmodeClass === 'other' && <CheckCircle2 size={12} aria-hidden="true" />}
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
