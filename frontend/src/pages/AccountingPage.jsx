import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, LogOut, Wallet } from 'lucide-react';
import AccountingLoginModal from '../components/accounting/AccountingLoginModal';
import ReportTablesView from '../components/accounting/ReportTablesView';
import './AccountingPage.css';

export default function AccountingPage() {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const savedUser = sessionStorage.getItem('accounting_user');
      const token = sessionStorage.getItem('accounting_token');
      return savedUser && token ? JSON.parse(savedUser) : null;
    } catch {
      return null;
    }
  });

  const handleLogout = () => {
    sessionStorage.removeItem('accounting_user');
    sessionStorage.removeItem('accounting_token');
    setCurrentUser(null);
  };

  const handleLoginSuccess = (user) => {
    setCurrentUser(user);
  };

  const handleGoHome = () => {
    handleLogout();
    navigate('/');
  };

  // Expand container width and automatically log out when leaving the account section
  useEffect(() => {
    document.body.classList.add('accounting-active');

    const clearSession = () => {
      sessionStorage.removeItem('accounting_user');
      sessionStorage.removeItem('accounting_token');
    };

    const handleUnauthorized = () => {
      handleLogout();
    };

    window.addEventListener('accounting:unauthorized', handleUnauthorized);
    window.addEventListener('pagehide', clearSession);
    window.addEventListener('beforeunload', clearSession);

    return () => {
      document.body.classList.remove('accounting-active');
      clearSession();
      window.removeEventListener('accounting:unauthorized', handleUnauthorized);
      window.removeEventListener('pagehide', clearSession);
      window.removeEventListener('beforeunload', clearSession);
    };
  }, []);

  return (
    <div className="accounting-page-wrapper">
      {/* ── Protected Login Modal ── */}
      {!currentUser && (
        <AccountingLoginModal
          onLoginSuccess={handleLoginSuccess}
          onCancel={handleGoHome}
        />
      )}

      {/* ── Top Navigation Bar ── */}
      <header className="accounting-topbar">
        <div className="topbar-inner">
          <div className="topbar-left">
            <button onClick={handleGoHome} className="topbar-back-btn" title="Back to Home">
              <ArrowLeft size={18} />
              <span>Home</span>
            </button>
            <div className="topbar-title-group">
              <div className="topbar-badge-icon">
                <Wallet size={18} className="text-gold" />
              </div>
              <div className="topbar-text-group">
                <h1 className="topbar-heading">Accounting Reports</h1>
                <span className="topbar-subheading">Institutional Financial Portal</span>
              </div>
            </div>
          </div>

          <div className="topbar-right">
            {currentUser && (
              <div className="user-profile-badge">
                <span className="user-dot"></span>
                <span className="user-name">{currentUser.username}</span>
                <span className="user-role">({currentUser.role})</span>
              </div>
            )}
            <button onClick={handleLogout} className="topbar-logout-btn" title="Log Out">
              <LogOut size={16} />
              <span className="logout-text">Logout</span>
            </button>
          </div>
        </div>
      </header>

      {/* ── Institutional Report Tables View ── */}
      <main className="accounting-main-container">
        <ReportTablesView />
      </main>
    </div>
  );
}
