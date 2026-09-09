import React, { useState, useEffect } from 'react';
import { 
  ChevronDown, 
  ChevronRight 
} from 'lucide-react';
import { apiRequest } from '../../api/client';
import { logger } from '../../utils/logger';
import '../../styles/MarksTab.css';

const SUBJECT_CONFIG = [
  { key: 'math_per', name: 'Mathematics', short: 'Math', color: '#3b82f6' },
  { key: 'eng_per', name: 'English', short: 'Eng', color: '#10b981' },
  { key: 'reas_per', name: 'Reasoning', short: 'Reas', color: '#8b5cf6' },
  { key: 'gs_per', name: 'General Studies', short: 'GS', color: '#f59e0b' }
];

const MarksTab = ({ studentId }) => {
  const [tests, setTests] = useState([]);
  const [expandedRowId, setExpandedRowId] = useState(null);

  useEffect(() => {
    if (!studentId) return;
    apiRequest(`/api/marks?student_id=${studentId}`)
      .then(data => {
        const sorted = Array.isArray(data) 
          ? [...data].sort((a, b) => new Date(b.date) - new Date(a.date)) 
          : [];
        setTests(sorted);
      })
      .catch(err => logger.debug('MarksTab', `Marks data unavailable for ${studentId}: ${err.message}`));
  }, [studentId]);

  const toggleRow = (rowId) => {
    setExpandedRowId(prev => (prev === rowId ? null : rowId));
  };

  const getPercentageColor = (pct) => {
    if (pct === null || pct === undefined || isNaN(pct)) return '#888';
    const val = parseFloat(pct);
    if (val >= 90) return '#10b981'; // green
    if (val >= 80) return '#3b82f6'; // blue
    if (val >= 70) return '#f59e0b'; // gold
    return '#ef4444'; // red
  };

  const totalPercent = tests.reduce((sum, test) => sum + parseFloat(test.percent || 0), 0);
  const avgPct = tests.length > 0 ? (totalPercent / tests.length) : 0;

  const formatDate = (dateString) => {
    try {
      const d = new Date(dateString);
      if (isNaN(d.getTime())) return dateString;
      return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
    } catch {
      return dateString;
    }
  };

  return (
    <div className="tab-content fade-in">
      <div className="card marks-card">
        <div className="marks-header d-flex justify-between align-center mb-3">
          <div>
            <h3 className="section-title fw-bold m-0">Recent Test Performance</h3>
            <p className="section-subtitle text-muted m-0">Click any test row to view graphical analysis</p>
          </div>
        </div>

        <div className="table-responsive">
          <table className="marks-table">
            <thead>
              <tr>
                <th className="text-muted fw-semibold text-start">TEST DATE</th>
                <th className="text-muted fw-semibold text-end">OVERALL %</th>
                <th className="expand-col text-center" style={{ width: '40px' }}></th>
              </tr>
            </thead>
            <tbody>
              {tests.map((test, idx) => {
                const rowKey = test.id !== undefined && test.id !== null ? test.id : idx;
                const isExpanded = expandedRowId === rowKey;
                const pct = parseFloat(test.percent || 0);
                const overallColor = getPercentageColor(pct);

                // Collect subject percentages
                const subjectsData = SUBJECT_CONFIG.map(sub => {
                  const val = test[sub.key];
                  const numericVal = (val !== null && val !== undefined) ? parseFloat(val) : null;
                  return {
                    ...sub,
                    value: numericVal
                  };
                });

                return (
                  <React.Fragment key={rowKey}>
                    <tr 
                      className={`test-row ${isExpanded ? 'active-row' : ''}`}
                      onClick={() => toggleRow(rowKey)}
                      title="Click to expand test details"
                    >
                      <td className="fw-medium text-start">
                        <span className="test-date-text">{formatDate(test.date)}</span>
                      </td>
                      <td className="fw-bold text-end">
                        <span className="score-pill" style={{ backgroundColor: `${overallColor}18`, color: overallColor }}>
                          {isNaN(pct) ? '0%' : `${pct}%`}
                        </span>
                      </td>
                      <td className="expand-col text-center">
                        <button className="expand-btn" aria-label="Toggle details">
                          {isExpanded ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
                        </button>
                      </td>
                    </tr>

                    {/* Expandable Details Section */}
                    {isExpanded && (
                      <tr className="expanded-details-tr">
                        <td colSpan={3} className="expanded-details-td">
                          <div className="graphical-chart-wrapper fade-in-down">
                            <div className="bar-chart-container d-flex flex-column gap-3">
                              {subjectsData.map((sub, cIdx) => {
                                const rawVal = sub.value !== null ? sub.value : 0;
                                const barWidth = Math.max(0, Math.min(rawVal, 100));
                                return (
                                  <div key={cIdx} className="chart-bar-row">
                                    <div className="chart-bar-label d-flex align-center gap-1">
                                      <span className="fw-medium">{sub.short}</span>
                                    </div>
                                    <div className="chart-bar-track">
                                      <div 
                                        className="chart-bar-fill" 
                                        style={{ 
                                          width: `${barWidth}%`, 
                                          background: `linear-gradient(90deg, ${sub.color}aa 0%, ${sub.color} 100%)` 
                                        }}
                                      >
                                        {barWidth > 15 && (
                                          <span className="chart-bar-val-inside">{rawVal}%</span>
                                        )}
                                      </div>
                                      {barWidth <= 15 && (
                                        <span className="chart-bar-val-outside text-muted">{rawVal}%</span>
                                      )}
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })}

              {/* Table Footer / Summary */}
              <tr className="summary-row">
                <td className="fw-bold text-dark text-start">Average Overall</td>
                <td className="fw-bold text-end">
                  <span className="score-pill" style={{ backgroundColor: `${getPercentageColor(avgPct)}18`, color: getPercentageColor(avgPct) }}>
                    {avgPct.toFixed(2)}%
                  </span>
                </td>
                <td className="expand-col"></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default MarksTab;
