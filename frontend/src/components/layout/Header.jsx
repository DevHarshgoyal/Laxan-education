import React from 'react';
import './Header.css';

const Header = () => {
  return (
    <header className="header d-flex justify-between align-center">
      <div className="header-left d-flex align-center gap-3">
        <div className="logo-icon d-flex justify-center align-center">
          🎓
        </div>
        <h1 className="header-title text-white fw-bold">Laxan Education</h1>
        <span className="badge text-navy fw-bold">2025–26</span>
      </div>
      <div className="header-right">
        <div className="bell-icon d-flex justify-center align-center">
          🔔
        </div>
      </div>
    </header>
  );
};

export default Header;
