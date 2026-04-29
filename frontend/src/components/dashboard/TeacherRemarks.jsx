import React, { useState, useEffect } from 'react';
import './TeacherRemarks.css';

const TeacherRemarks = ({ studentId }) => {
  const [remarks, setRemarks] = useState([]);

  useEffect(() => {
    if (!studentId) return;
    fetch(`${import.meta.env.VITE_API_URL}/api/remarks?student_id=${studentId}`)
      .then(res => res.json())
      .then(data => setRemarks(data))
      .catch(err => console.error("Error fetching remarks:", err));
  }, [studentId]);

  return (
    <div className="card">
      <h3 className="section-title fw-bold">Teacher Remarks</h3>
      <div className="remarks-list d-flex flex-column gap-3">
        {remarks.map((remark, idx) => (
          <div key={idx} className="remark-box">
            <span className="remark-label text-green fw-bold">Institute Note</span>
            <p className="remark-text text-muted">{remark.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TeacherRemarks;
