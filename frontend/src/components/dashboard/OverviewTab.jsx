import React from 'react';
import FeeStatus from './FeeStatus';
import TeacherRemarks from './TeacherRemarks';

const OverviewTab = ({ studentId }) => {
  return (
    <div className="tab-content fade-in">
      <FeeStatus studentId={studentId} />
      <TeacherRemarks studentId={studentId} />
    </div>
  );
};

export default OverviewTab;
