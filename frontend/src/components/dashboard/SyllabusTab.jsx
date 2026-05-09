import React, { useState, useEffect } from 'react';
import './SyllabusTab.css';

const SyllabusTab = ({ studentId }) => {
  const [subjects, setSubjects] = useState([]);
  const [totalAttendance, setTotalAttendance] = useState(0);

  useEffect(() => {
    if (!studentId) return;
    fetch(`${import.meta.env.VITE_API_URL}/api/syllabus?member_id=${studentId}`)
      .then(res => res.json())
      .then(data => {
        if (!data || Object.keys(data).length === 0) return;
        setTotalAttendance(data.total_attendance || 0);
        const transformedSubjects = [
          { name: 'Mathematics', pct: data.math || 0, color: 'var(--gold)' },
          { name: 'English', pct: data.english || 0, color: 'var(--green)' },
          { name: 'Reasoning', pct: data.reasoning || 0, color: 'var(--blue)' },
          { name: 'Polity', pct: data.polity || 0, color: 'var(--purple)' },
          { name: 'Geography', pct: data.geography || 0, color: 'var(--cyan)' },
          { name: 'History', pct: data.history || 0, color: 'var(--gold)' },
          { name: 'Economy', pct: data.economy || 0, color: 'var(--green)' },
          { name: 'S&T', pct: data.snt || 0, color: 'var(--blue)' },
          { name: 'Statics', pct: data.statics || 0, color: 'var(--purple)' },
          { name: 'Computer', pct: data.comp || 0, color: 'var(--cyan)' },
        ];
        setSubjects(transformedSubjects);
      })
      .catch(err => console.error("Error fetching syllabus:", err));
  }, [studentId]);

  return (
    <div className="tab-content fade-in">
      <div className="card">
        <div className="d-flex justify-between align-center mb-4">
          <h3 className="section-title fw-bold m-0">Syllabus Coverage</h3>
          {/* <span className="fw-bold text-primary">Attendance: {totalAttendance}%</span> */}
        </div>
        <div className="syllabus-list d-flex flex-column gap-4">
          {subjects.map((sub, idx) => (
            <div key={idx} className="subject-item">
              <div className="d-flex justify-between align-center mb-2">
                <span className="fw-medium text-dark">{sub.name}</span>
                <span className="fw-bold" style={{ color: sub.color }}>{sub.pct}%</span>
              </div>
              <div className="progress-bar-bg">
                <div
                  className="progress-bar-fill"
                  style={{ width: `${sub.pct}%`, backgroundColor: sub.color }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SyllabusTab;
