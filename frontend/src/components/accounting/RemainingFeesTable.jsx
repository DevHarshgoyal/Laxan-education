import React from 'react';
import { Users, BookOpen, Wallet, Calendar, Clock } from 'lucide-react';
import { formatCurrency, formatDisplayDate, isDateOverdue, getCourseBadgeClass } from '../../utils/accountingUtils';
import SortIndicator from './SortIndicator';

export default function RemainingFeesTable({
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
          <th className="sortable" onClick={() => onSort('name')}>
            <span className="th-content">
              <Users size={13} />
              <span>Student Details</span>
              <SortIndicator currentField="name" activeField={sortField} direction={sortDirection} />
            </span>
          </th>
          <th className="sortable" onClick={() => onSort('course')}>
            <span className="th-content">
              <BookOpen size={13} />
              <span>Course</span>
              <SortIndicator currentField="course" activeField={sortField} direction={sortDirection} />
            </span>
          </th>
          <th className="sortable" onClick={() => onSort('remainFee')}>
            <span className="th-content right">
              <Wallet size={13} />
              <span>Remaining Fee</span>
              <SortIndicator currentField="remainFee" activeField={sortField} direction={sortDirection} />
            </span>
          </th>
          <th className="sortable" onClick={() => onSort('nextDueDate')}>
            <span className="th-content">
              <Calendar size={13} />
              <span>Next Due Date</span>
              <SortIndicator currentField="nextDueDate" activeField={sortField} direction={sortDirection} />
            </span>
          </th>
          <th style={{ width: '110px' }}>
            <span className="th-content">Status</span>
          </th>
        </tr>
      </thead>
      <tbody>
        {data.map((row, idx) => {
          const overdue = isDateOverdue(row.nextDueDate);
          const courseName = row.course ? row.course.toUpperCase() : 'COMBO';
          const courseClass = getCourseBadgeClass(courseName);

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
                <div className="student-info-col">
                  <span className="student-name-text">{row.name}</span>
                  <span className="student-sub-id">ID: #{row.memberid || row.id}</span>
                </div>
              </td>
              <td>
                <span className={`course-pill ${courseClass}`}>
                  {courseName}
                </span>
              </td>
              <td style={{ textAlign: 'right' }}>
                <span className="amount-badge-due">
                  {formatCurrency(row.remainFee)}
                </span>
              </td>
              <td>
                <div className="due-date-cell-flex">
                  <Calendar size={14} color="#64748b" />
                  <span className="date-text-primary">
                    {formatDisplayDate(row.nextDueDate)}
                  </span>
                  {overdue ? (
                    <span className="status-tag-overdue">Overdue</span>
                  ) : (
                    <span className="status-tag-ok">Upcoming</span>
                  )}
                </div>
              </td>
              <td>
                <span className="status-tag-overdue" style={{ background: '#fff1f2', color: '#e11d48', borderColor: '#ffe4e6' }}>
                  <Clock size={11} />
                  <span>Pending</span>
                </span>
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}
