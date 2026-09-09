import React from 'react';
import { Calendar, Users, BookOpen } from 'lucide-react';
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
    <table className="modern-report-table" aria-label="Student Admission & Fee Register">
      <thead>
        <tr>
          <th scope="col" style={{ width: '60px' }}>
            <span className="th-content">#</span>
          </th>
          <th 
            scope="col"
            className="sortable" 
            onClick={() => onSort('id')}
            onKeyDown={(e) => handleKeyDownHeader(e, 'id')}
            tabIndex={0}
            role="columnheader"
            aria-sort={sortField === 'id' ? (sortDirection === 'asc' ? 'ascending' : 'descending') : 'none'}
          >
            <span className="th-content">
              <span>Student ID</span>
              <SortIndicator currentField="id" activeField={sortField} direction={sortDirection} />
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
              <span>Admission Date</span>
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
              <span>Student Name</span>
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
            onClick={() => onSort('finalFee')}
            onKeyDown={(e) => handleKeyDownHeader(e, 'finalFee')}
            tabIndex={0}
            role="columnheader"
            aria-sort={sortField === 'finalFee' ? (sortDirection === 'asc' ? 'ascending' : 'descending') : 'none'}
          >
            <span className="th-content right">
              <span>Final Fee</span>
              <SortIndicator currentField="finalFee" activeField={sortField} direction={sortDirection} />
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
                <span className="receipt-code-tag">
                  #{row.memberid || row.id}
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
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}
