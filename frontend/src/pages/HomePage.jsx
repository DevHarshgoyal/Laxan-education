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

          <div className="action-card card" style={{ borderLeftColor: 'var(--navy)' }}>
            <h3 className="action-title fw-bold">Accounting & Finances</h3>
            <p className="action-desc text-muted">View institutional fee collections, payment receipts, and dues schedule.</p>
            <button 
              onClick={() => navigate('/laxan/account')} 
              className="btn-secondary"
            >
              Open Accounting Portal
            </button>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
