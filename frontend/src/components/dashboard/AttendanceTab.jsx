import React, { useState, useEffect } from 'react';
import './AttendanceTab.css';

const AttendanceTab = ({ studentId }) => {
  const [calendarDays, setCalendarDays] = useState([]);
  const [attendanceMetrics, setAttendanceMetrics] = useState({ total_attendance: 0, total_present: 0, total_absent: 0 });
  
  const currentMonthName = new Date().toLocaleString('default', { month: 'short' });
  const currentYearInt = new Date().getFullYear();
  const currentYear = currentYearInt.toString();
  const [selectedMonth, setSelectedMonth] = useState(currentMonthName);
  const [selectedYear, setSelectedYear] = useState(currentYear);
  const [showDetailedAttendance, setShowDetailedAttendance] = useState(false);
  const [monthlyTrend, setMonthlyTrend] = useState([]);

  const yearsList = Array.from({ length: 10 }, (_, i) => (currentYearInt - 5 + i).toString());

  useEffect(() => {
    if (!studentId) return;

    // Fetch calendar days
    let url = `${import.meta.env.VITE_API_URL}/api/attendance?student_id=${studentId}&month=${selectedMonth}&year=${selectedYear}`;
    
    fetch(url)
      .then(res => res.json())
      .then(data => setCalendarDays(data.calendarDays || []))
      .catch(err => console.error("Error fetching attendance:", err));

    // Fetch overall attendance metrics
    fetch(`${import.meta.env.VITE_API_URL}/api/attendance-metrics?member_id=${studentId}`)
      .then(res => res.json())
      .then(data => setAttendanceMetrics(data))
      .catch(err => console.error("Error fetching attendance metrics:", err));

    // Fetch monthly trend
    fetch(`${import.meta.env.VITE_API_URL}/api/attendance-trend?student_id=${studentId}&year=${selectedYear}`)
      .then(res => res.json())
      .then(data => setMonthlyTrend(data || []))
      .catch(err => console.error("Error fetching attendance trend:", err));
  }, [studentId, selectedMonth, selectedYear]);

  const percentage = attendanceMetrics.total_attendance || 0;
  const progressOffset = 251.2 - (251.2 * percentage) / 100;

  return (
    <div className="tab-content fade-in">
      <div className="card">
        <h3 className="section-title fw-bold">Overall Attendance</h3>
        <div className="attendance-overview d-flex align-center gap-4">
          <div className="progress-ring-container">
            <svg className="progress-ring" width="100" height="100">
              <circle className="progress-ring__circle bg" stroke="var(--cream)" strokeWidth="8" fill="transparent" r="40" cx="50" cy="50"/>
              <circle className="progress-ring__circle fg" stroke="var(--green)" strokeWidth="8" strokeDasharray="251.2" strokeDashoffset={progressOffset} fill="transparent" r="40" cx="50" cy="50"/>
            </svg>
            <div className="progress-ring-text d-flex flex-column align-center justify-center">
              <span className="text-green fw-bold" style={{ fontSize: '24px' }}>{percentage}%</span>
            </div>
          </div>
          <div className="attendance-stats d-flex flex-column gap-3" style={{ flex: 1 }}>
            <div className="stat-box present d-flex justify-between align-center">
              <span className="fw-medium text-dark">Present</span>
              <span className="fw-bold text-green">{attendanceMetrics.total_present || 0} Days</span>
            </div>
            <div className="stat-box absent d-flex justify-between align-center">
              <span className="fw-medium text-dark">Absent</span>
              <span className="fw-bold text-red">{attendanceMetrics.total_absent || 0} Days</span>
            </div>
          </div>
        </div>
        
        <div className="monthly-chart mt-4">
          <h4 className="chart-title fw-semibold text-muted mb-2">Monthly Trend ({selectedYear})</h4>
          <div className="bars d-flex align-start justify-between" style={{ transform: 'rotate(180deg)' }}>
            {['Dec', 'Nov', 'Oct', 'Sep', 'Aug', 'Jul', 'Jun', 'May', 'Apr', 'Mar', 'Feb', 'Jan'].map((m) => {
              const monthData = monthlyTrend.find(d => d.month === m);
              let pct = 0;
              if (monthData && monthData.total_days > 0) {
                pct = (monthData.present_days / monthData.total_days) * 100;
              }
              const h = pct === 0 ? 5 : pct; // using pct directly for height (0-100 scale)
              const color = pct < 70 ? (pct === 0 ? 'rgba(0,0,0,0.1)' : 'var(--gold)') : 'var(--green)';
              return (
                <div key={m} className="bar-col d-flex flex-column align-center gap-2" title={`${Math.round(pct)}%`}>
                  <span className="bar-label" style={{ transform: 'rotate(180deg)' }}>{m}</span>
                  <div className="bar" style={{ height: `${h}px`, backgroundColor: color }}></div>
                </div>
              );
            })}
          </div>
        </div>
        
        <div className="d-flex justify-center mt-4">
          <a 
            href="#" 
            className="text-gold fw-semibold" 
            style={{textDecoration: 'none', fontSize: '14px'}}
            onClick={(e) => { e.preventDefault(); setShowDetailedAttendance(!showDetailedAttendance); }}
          >
            {showDetailedAttendance ? 'Hide Attendance ←' : 'Click to view Attendance →'}
          </a>
        </div>
      </div>

      {showDetailedAttendance && (
        <div className="card">
          <div className="d-flex justify-between align-center mb-3">
            <h3 className="section-title fw-bold m-0">
              {`${selectedMonth} ${selectedYear} Attendance`}
            </h3>
            <div className="d-flex gap-2">
              <select 
                className="form-select form-select-sm custom-select-premium" 
                value={selectedMonth} 
                onChange={e => setSelectedMonth(e.target.value)}
              >
                {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'].map(m => (
                  <option key={m} value={m}>{m}</option>
                ))}
              </select>
              <select 
                className="form-select form-select-sm custom-select-premium" 
                value={selectedYear} 
                onChange={e => setSelectedYear(e.target.value)}
              >
                {yearsList.map(y => (
                  <option key={y} value={y}>{y}</option>
                ))}
              </select>
            </div>
          </div>
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
      )}
    </div>
  );
};

export default AttendanceTab;
