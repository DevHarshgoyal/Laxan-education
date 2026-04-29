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

  const totalMarks = tests.reduce((sum, test) => sum + test.marks, 0);
  const maxMarks = tests.reduce((sum, test) => sum + test.total, 0);
  const avgPct = maxMarks > 0 ? Math.round((totalMarks / maxMarks) * 100) : 0;

  return (
    <div className="tab-content fade-in">
      <div className="card">
        <h3 className="section-title fw-bold">Recent Test Performance</h3>
        <div className="table-responsive">
          <table className="marks-table">
            <thead>
              <tr>
                <th className="text-muted fw-semibold">TEST DATE</th>
                <th className="text-muted fw-semibold">MARKS</th>
                <th className="text-muted fw-semibold">TOTAL</th>
                <th className="text-muted fw-semibold">%</th>
              </tr>
            </thead>
            <tbody>
              {tests.map((test, idx) => {
                const pct = Math.round((test.marks / test.total) * 100);
                const color = getPercentageColor(pct);
                return (
                  <tr key={idx}>
                    <td className="fw-medium">{test.date}</td>
                    <td className="fw-bold">{test.marks}</td>
                    <td className="text-muted">{test.total}</td>
                    <td className="fw-bold" style={{ color }}>{pct}%</td>
                  </tr>
                );
              })}
              <tr style={{ borderTop: '2px solid rgba(0,0,0,0.1)', backgroundColor: 'var(--cream)' }}>
                <td className="fw-bold text-dark">Average</td>
                <td className="fw-bold">{totalMarks}</td>
                <td className="text-muted">{maxMarks}</td>
                <td className="fw-bold" style={{ color: getPercentageColor(avgPct) }}>{avgPct}%</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default MarksTab;
