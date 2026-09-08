import React from 'react';
import { Calendar, Users, BookOpen, CheckCircle2 } from 'lucide-react';
import { formatCurrency, formatDisplayDate, getCourseBadgeClass } from '../../utils/accountingUtils';
import SortIndicator from './SortIndicator';

export default function StudentListTable({
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
          <th className="sortable" onClick={() => onSort('id')}>
            <span className="th-content">
              <span>Student ID</span>
              <SortIndicator currentField="id" activeField={sortField} direction={sortDirection} />
            </span>
          </th>
          <th className="sortable" onClick={() => onSort('date')}>
            <span className="th-content">
              <Calendar size={13} />
              <span>Admission Date</span>
              <SortIndicator currentField="date" activeField={sortField} direction={sortDirection} />
            </span>
          </th>
          <th className="sortable" onClick={() => onSort('name')}>
            <span className="th-content">
              <Users size={13} />
              <span>Student Name</span>
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
          <th className="sortable" onClick={() => onSort('finalFee')}>
            <span className="th-content right">
              <span>Final Fee</span>
              <SortIndicator currentField="finalFee" activeField={sortField} direction={sortDirection} />
            </span>
          </th>
          <th style={{ width: '110px' }}>
            <span className="th-content">Status</span>
          </th>
        </tr>
      </thead>
      <tbody>
        {data.map((row, idx) => {
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
                <span className="receipt-code-tag">
                  #{row.memberid || row.id}
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
                </div>
              </td>
              <td>
                <span className={`course-pill ${courseClass}`}>
                  {courseName}
                </span>
              </td>
              <td style={{ textAlign: 'right' }}>
                <span className="amount-badge-standard">
                  {formatCurrency(row.finalFee)}
                </span>
              </td>
              <td>
                <span className="status-tag-ok">
                  <CheckCircle2 size={11} />
                  <span>Enrolled</span>
                </span>
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}
