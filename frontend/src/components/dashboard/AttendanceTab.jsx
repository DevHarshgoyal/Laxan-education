import React, { useState, useEffect } from 'react';
import './AttendanceTab.css';

const AttendanceTab = ({ studentId }) => {
  const [calendarDays, setCalendarDays] = useState([]);

  useEffect(() => {
    if (!studentId) return;
    fetch(`${import.meta.env.VITE_API_URL}/api/attendance?student_id=${studentId}`)
      .then(res => res.json())
      .then(data => setCalendarDays(data.calendarDays || []))
      .catch(err => console.error("Error fetching attendance:", err));
  }, [studentId]);

  return (
    <div className="tab-content fade-in">
      <div className="card">
        <h3 className="section-title fw-bold">Overall Attendance</h3>
        <div className="attendance-overview d-flex align-center gap-4">
          <div className="progress-ring-container">
            <svg className="progress-ring" width="100" height="100">
              <circle className="progress-ring__circle bg" stroke="var(--cream)" strokeWidth="8" fill="transparent" r="40" cx="50" cy="50"/>
              <circle className="progress-ring__circle fg" stroke="var(--green)" strokeWidth="8" strokeDasharray="251.2" strokeDashoffset="20.096" fill="transparent" r="40" cx="50" cy="50"/>
            </svg>
            <div className="progress-ring-text d-flex flex-column align-center justify-center">
              <span className="text-green fw-bold" style={{ fontSize: '24px' }}>92%</span>
            </div>
          </div>
          <div className="attendance-stats d-flex flex-column gap-3" style={{ flex: 1 }}>
            <div className="stat-box present d-flex justify-between align-center">
              <span className="fw-medium text-dark">Present</span>
              <span className="fw-bold text-green">184 Days</span>
            </div>
            <div className="stat-box absent d-flex justify-between align-center">
              <span className="fw-medium text-dark">Absent</span>
              <span className="fw-bold text-red">16 Days</span>
            </div>
          </div>
        </div>
        
        <div className="monthly-chart mt-4">
          <h4 className="chart-title fw-semibold text-muted mb-2">Monthly Trend</h4>
          <div className="bars d-flex align-start justify-between" style={{ transform: 'rotate(180deg)' }}>
            {['Dec', 'Nov', 'Oct', 'Sep', 'Aug', 'Jul', 'Jun', 'May', 'Apr', 'Mar', 'Feb', 'Jan'].map((m, i) => {
              const h = i === 1 || i === 7 ? 60 : (i === 4 ? 40 : 80 + Math.random()*20);
              const color = h < 70 ? 'var(--gold)' : 'var(--green)';
              return (
                <div key={m} className="bar-col d-flex flex-column align-center gap-2">
                  <span className="bar-label" style={{ transform: 'rotate(180deg)' }}>{m}</span>
                  <div className="bar" style={{ height: `${h}px`, backgroundColor: color }}></div>
                </div>
              );
            })}
          </div>
        </div>
        
        <div className="d-flex justify-center mt-4">
          <a href="#" className="text-gold fw-semibold" style={{textDecoration: 'none', fontSize: '14px'}}>Click to view Attendance →</a>
        </div>
      </div>

      <div className="card">
        <h3 className="section-title fw-bold mb-3">Recent 20 Days</h3>
        <div className="calendar-grid">
          {calendarDays.map((day, idx) => (
            <div key={idx} className={`calendar-tile ${day.status === 'P' ? 'present-tile' : 'absent-tile'} d-flex flex-column align-center justify-center`}>
              <span className="status-letter fw-bold">{day.status}</span>
              <span className="day-name">{day.day}</span>
              <span className="date-number fw-semibold">{day.date}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AttendanceTab;
