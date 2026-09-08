import React, { useState, useEffect } from 'react';
import { apiRequest } from '../../api/client';
import { logger } from '../../utils/logger';
import './SyllabusTab.css';

const ALL_SUBJECTS = [
  { id: 'math', name: 'Mathematics', color: 'var(--gold)' },
  { id: 'english', name: 'English', color: 'var(--green)' },
  { id: 'reasoning', name: 'Reasoning', color: 'var(--blue)' },
  { id: 'polity', name: 'Polity', color: 'var(--purple)' },
  { id: 'geography', name: 'Geography', color: 'var(--cyan)' },
  { id: 'history', name: 'History', color: 'var(--gold)' },
  { id: 'economy', name: 'Economy', color: 'var(--green)' },
  { id: 'snt', name: 'S&T', color: 'var(--blue)' },
  { id: 'statics', name: 'Statics', color: 'var(--purple)' },
  { id: 'comp', name: 'Computer', color: 'var(--cyan)' },
];

const SyllabusTab = ({ studentId }) => {
  const [subjects, setSubjects] = useState([]);
  const [totalAttendance, setTotalAttendance] = useState(0);

  useEffect(() => {
    if (!studentId) return;
    apiRequest(`/api/syllabus?member_id=${studentId}`)
      .then(data => {
        if (!data || Object.keys(data).length === 0) return;
        setTotalAttendance(data.total_attendance || 0);
        
        // Check if fetched DB keys match the subject array ids
        const fetchedKeys = Object.keys(data);
        const transformedSubjects = ALL_SUBJECTS
          .filter(sub => fetchedKeys.includes(sub.id) && data[sub.id] !== null && data[sub.id] !== undefined)
          .map(sub => ({
            name: sub.name,
            pct: data[sub.id] || 0,
            color: sub.color
          }));
          
        setSubjects(transformedSubjects);
      })
      .catch(err => logger.debug('SyllabusTab', `Syllabus unavailable for ${studentId}: ${err.message}`));
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
