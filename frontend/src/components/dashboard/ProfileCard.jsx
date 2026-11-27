import React, { useState, useEffect } from 'react';
import { BadgeCheck } from 'lucide-react';
import { apiRequest } from '../../api/client';
import { logger } from '../../utils/logger';
import '../../styles/ProfileCard.css';

const ProfileCard = ({ studentId }) => {
  const [profile, setProfile] = useState({ name: '', course: '', id: '', profile_id: '' });
  const [attendanceMetrics, setAttendanceMetrics] = useState({ total_attendance: 0, total_present: 0, total_absent: 0 });

  useEffect(() => {
    if (!studentId) return;

    // Fetch profile data
    apiRequest(`/api/profile?student_id=${studentId}`)
      .then(data => setProfile(data))
      .catch(err => logger.debug('ProfileCard', `Profile unavailable for ${studentId}: ${err.message}`));

    // Fetch attendance metrics
    apiRequest(`/api/attendance-metrics?member_id=${studentId}`)
      .then(data => setAttendanceMetrics(data))
      .catch(err => logger.debug('ProfileCard', `Metrics unavailable for ${studentId}: ${err.message}`));
  }, [studentId]);

  return (
    <div className="profile-container">
      <div className="card card-navy profile-card">
        <div className="profile-content d-flex justify-between">
          <div className="profile-info d-flex gap-4">
            <div className="avatar-container">
              <img
                src={profile.photo_url || "https://i.pravatar.cc/150?u=fallback"}
                alt={profile.name}
                className="avatar"
              />
              <div className="verified-badge"><BadgeCheck size={16} fill="white" color="#1a202c" /></div>
            </div>
            <div className="student-details d-flex flex-column justify-center">
              <h2 className="student-name fw-bold text-white">{profile.name}</h2>
              <p className="course-name fw-semibold text-gold">{profile.course}</p>
              <div className="meta-info d-flex gap-3 text-muted">
                <span>ID: {profile.profile_id || profile.id}</span>
                {/* <span>•</span>
                <span>DOB: {profile.dob}</span> */}
              </div>
            </div>
          </div>
          <div className="attendance-highlight d-flex flex-column align-center justify-center">
            <span className="attendance-percentage text-gold fw-bold">{attendanceMetrics.total_attendance || 0}%</span>
            <span className="attendance-label fw-bold">ATTENDANCE</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileCard;
