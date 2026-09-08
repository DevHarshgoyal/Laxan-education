import React, { useState, useEffect } from 'react';
import { apiRequest } from '../../api/client';
import { logger } from '../../utils/logger';
import './TeacherRemarks.css';

const TeacherRemarks = ({ studentId }) => {
  const [remarks, setRemarks] = useState([]);

  useEffect(() => {
    if (!studentId) return;
    apiRequest(`/api/remarks?member_id=${studentId}`)
      .then(data => setRemarks(data || []))
      .catch(err => logger.debug('TeacherRemarks', `Remarks unavailable for ${studentId}: ${err.message}`));
  }, [studentId]);

  return (
    <div className="card">
      <h3 className="section-title fw-bold">Teacher Remarks</h3>
      <div className="remarks-list d-flex flex-column gap-3">
        {remarks.map((remark, idx) => (
          <div key={idx} className="remark-box">
            <div className="d-flex justify-between align-center mb-1">
              <span className="remark-label text-green fw-bold mb-0">Institute Note</span>
              {remark.date && <span className="remark-date text-muted">{new Date(remark.date).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })}</span>}
            </div>
            <p className="remark-text text-muted">{remark.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TeacherRemarks;
