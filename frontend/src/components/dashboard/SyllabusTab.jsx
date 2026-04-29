import React, { useState, useEffect } from 'react';
import './SyllabusTab.css';

const SyllabusTab = ({ studentId }) => {
  const [subjects, setSubjects] = useState([]);

  useEffect(() => {
    if (!studentId) return;
    fetch(`${import.meta.env.VITE_API_URL}/api/syllabus?student_id=${studentId}`)
      .then(res => res.json())
      .then(data => setSubjects(data))
      .catch(err => console.error("Error fetching syllabus:", err));
  }, [studentId]);

  return (
    <div className="tab-content fade-in">
      <div className="card">
        <h3 className="section-title fw-bold">Syllabus Coverage</h3>
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
