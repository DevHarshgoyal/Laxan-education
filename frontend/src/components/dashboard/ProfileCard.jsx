import React, { useState, useEffect } from 'react';
import './ProfileCard.css';

const ProfileCard = ({ studentId }) => {
  const [profile, setProfile] = useState({ name: '', course: '', id: '', dob: '', attendance: 0 });

  useEffect(() => {
    if (!studentId) return;
    fetch(`${import.meta.env.VITE_API_URL}/api/profile?student_id=${studentId}`)
      .then(res => res.json())
      .then(data => setProfile(data))
      .catch(err => console.error("Error fetching profile:", err));
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
              <div className="verified-badge">✓</div>
            </div>
            <div className="student-details d-flex flex-column justify-center">
              <h2 className="student-name fw-bold text-white">{profile.name}</h2>
              <p className="course-name fw-semibold text-gold">{profile.course}</p>
              <div className="meta-info d-flex gap-3 text-muted">
                <span>ID: {profile.id}</span>
                <span>•</span>
                <span>DOB: {profile.dob}</span>
              </div>
            </div>
          </div>
          <div className="attendance-highlight d-flex flex-column align-center justify-center">
            <span className="attendance-percentage text-gold fw-bold">{profile.attendance}%</span>
            <span className="attendance-label fw-bold">ATTENDANCE</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileCard;
