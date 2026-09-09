import React from 'react';
import { Users, BookOpen, Wallet, Calendar } from 'lucide-react';
import { formatCurrency, formatDisplayDate, getCourseBadgeClass } from '../../utils/accountingUtils';
import SortIndicator from './SortIndicator';

export default function RemainingFeesTable({
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
    <table className="modern-report-table" aria-label="Remaining Fee Outstanding Report">
      <thead>
        <tr>
          <th scope="col" style={{ width: '60px' }}>
            <span className="th-content">#</span>
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
            onClick={() => onSort('course')}
            onKeyDown={(e) => handleKeyDownHeader(e, 'course')}
            tabIndex={0}
            role="columnheader"
            aria-sort={sortField === 'course' ? (sortDirection === 'asc' ? 'ascending' : 'descending') : 'none'}
          >
            <span className="th-content">
              <BookOpen size={13} aria-hidden="true" />
              <span>Course</span>
              <SortIndicator currentField="course" activeField={sortField} direction={sortDirection} />
            </span>
          </th>
          <th 
            scope="col"
            className="sortable" 
            onClick={() => onSort('remainFee')}
            onKeyDown={(e) => handleKeyDownHeader(e, 'remainFee')}
            tabIndex={0}
            role="columnheader"
            aria-sort={sortField === 'remainFee' ? (sortDirection === 'asc' ? 'ascending' : 'descending') : 'none'}
          >
            <span className="th-content right">
              <Wallet size={13} aria-hidden="true" />
              <span>Remaining Fee</span>
              <SortIndicator currentField="remainFee" activeField={sortField} direction={sortDirection} />
            </span>
          </th>
          <th 
            scope="col"
            className="sortable" 
            onClick={() => onSort('nextDueDate')}
            onKeyDown={(e) => handleKeyDownHeader(e, 'nextDueDate')}
            tabIndex={0}
            role="columnheader"
            aria-sort={sortField === 'nextDueDate' ? (sortDirection === 'asc' ? 'ascending' : 'descending') : 'none'}
          >
            <span className="th-content">
              <Calendar size={13} aria-hidden="true" />
              <span>Next Due Date</span>
              <SortIndicator currentField="nextDueDate" activeField={sortField} direction={sortDirection} />
            </span>
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
                  <Calendar size={14} color="#64748b" aria-hidden="true" />
                  <span className="date-text-primary">
                    {formatDisplayDate(row.nextDueDate)}
                  </span>
                </div>
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}
