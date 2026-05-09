import React, { useState, useEffect } from 'react';
import './MarksTab.css';

const MarksTab = ({ studentId }) => {
  const [tests, setTests] = useState([]);

  useEffect(() => {
    if (!studentId) return;
    fetch(`${import.meta.env.VITE_API_URL}/api/marks?student_id=${studentId}`)
      .then(res => res.json())
      .then(data => setTests(data))
      .catch(err => console.error("Error fetching marks:", err));
  }, [studentId]);

  const getPercentageColor = (pct) => {
    if (pct >= 90) return 'var(--green)';
    if (pct >= 80) return 'var(--blue)';
    if (pct >= 70) return 'var(--gold)';
    return 'var(--red)';
  };

  const totalPercent = tests.reduce((sum, test) => sum + parseFloat(test.percent || 0), 2);
  const avgPct = tests.length > 0 ? (totalPercent / tests.length) : 0;

  const formatDate = (dateString) => {
    try {
      const d = new Date(dateString);
      if (isNaN(d.getTime())) return dateString;
      return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: '2-digit' });
    } catch {
      return dateString;
    }
  };

  return (
    <div className="tab-content fade-in">
      <div className="card">
        <h3 className="section-title fw-bold">Recent Test Performance</h3>
        <div className="table-responsive">
          <table className="marks-table">
            <thead>
              <tr>
                <th className="text-muted fw-semibold">TEST DATE</th>
                <th className="text-muted fw-semibold text-end">%</th>
              </tr>
            </thead>
            <tbody>
              {tests.map((test, idx) => {
                const pct = parseFloat(test.percent || 0);
                const color = getPercentageColor(pct);
                return (
                  <tr key={idx}>
                    <td className="fw-medium">{formatDate(test.date)}</td>
                    <td className="fw-bold text-end" style={{ color }}>{pct}%</td>
                  </tr>
                );
              })}
              <tr style={{ borderTop: '2px solid rgba(0,0,0,0.1)', backgroundColor: 'var(--cream)' }}>
                <td className="fw-bold text-dark">Average</td>
                <td className="fw-bold text-end" style={{ color: getPercentageColor(avgPct) }}>{avgPct}%</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default MarksTab;
