import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import './HomePage.css';

export default function HomePage() {
  const navigate = useNavigate();
  const [studentId, setStudentId] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    if (studentId.trim()) {
      navigate(`/profile/${studentId.trim()}`);
    }
  };

  return (
    <div className="home-wrapper">
      <Header />

      <div className="home-body">
        <div className="home-hero card card-navy">
          <h2 className="hero-title fw-bold text-white">Welcome to Laxan Education</h2>
          <p className="hero-subtitle text-muted">Manage student profiles, attendance, and performance seamlessly.</p>
        </div>

        <div className="home-actions">
          <div className="action-card card">
            <h3 className="action-title fw-bold">Student Portal</h3>
            <p className="action-desc text-muted">Find an existing student by their ID to view their dashboard.</p>
            <form onSubmit={handleSearch} className="search-form">
              <input
                type="text"
                placeholder="Enter Student ID (e.g., LX-2025-0142)"
                className="search-input"
                value={studentId}
                onChange={(e) => setStudentId(e.target.value)}
              />
              <button type="submit" className="btn-primary">View Dashboard</button>
            </form>
          </div>

          {/* <div className="action-card card">
            <h3 className="action-title fw-bold">New Admission</h3>
            <p className="action-desc text-muted">Register a new student into the system.</p>
            <button 
              onClick={() => navigate('/laxan/register')} 
              className="btn-secondary"
            >
              Register Student
            </button>
          </div> */}
        </div>
      </div>

      <Footer />
    </div>
  );
}
