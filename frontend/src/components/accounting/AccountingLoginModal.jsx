import React, { useState } from 'react';
import { User, KeyRound, AlertCircle, ArrowRight, ShieldCheck } from 'lucide-react';
import { logger } from '../../utils/logger';
import './AccountingLoginModal.css';

const AccountingLoginModal = ({ onLoginSuccess, onCancel }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username.trim() || !password) {
      setError('Please enter both username and password.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const apiUrl = import.meta.env.VITE_API_URL || import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';
      const res = await fetch(`${apiUrl}/api/accounting/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: username.trim(), password })
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Authentication failed');
      }

      // Save session in sessionStorage and localStorage
      const userWithToken = { ...data.user, token: data.token };
      sessionStorage.setItem('accounting_user', JSON.stringify(data.user));
      localStorage.setItem('accounting_user', JSON.stringify(data.user));
      if (data.token) {
        sessionStorage.setItem('accounting_token', data.token);
        localStorage.setItem('accounting_token', data.token);
      }
      onLoginSuccess(userWithToken);
    } catch (err) {
      logger.warn('AuthModal', `Login failed for user "${username.trim()}": ${err.message}`);
      setError(err.message || 'Login failed. Please verify credentials.');
    } finally {
      setLoading(false);
    }
  };

  const fillDefaultCredentials = (user, pass) => {
    setUsername(user);
    setPassword(pass);
    setError('');
  };

  return (
    <div className="login-modal-overlay">
      <div className="login-modal-card card-navy fade-in">
        <div className="login-modal-header">
          <div className="login-icon-badge">
            <ShieldCheck size={28} className="text-gold" />
          </div>
          <h2 className="login-title text-white fw-bold">Accounting Portal</h2>
          <p className="login-subtitle text-muted">
            Restricted access. Please authenticate to view institutional finances.
          </p>
        </div>

        {error && (
          <div className="login-error-banner d-flex align-center gap-2">
            <AlertCircle size={16} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label className="form-label text-muted">Username or Email</label>
            <div className="input-wrapper">
              <User size={18} className="input-icon text-muted" />
              <input
                type="text"
                placeholder="e.g. admin or accountant"
                className="modal-input"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                autoFocus
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label text-muted">Password</label>
            <div className="input-wrapper">
              <KeyRound size={18} className="input-icon text-muted" />
              <input
                type="password"
                placeholder="Enter your password"
                className="modal-input"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          {import.meta.env.DEV && (
            <div className="demo-accounts-hint">
              <span className="hint-label text-muted">Quick Fill Credentials (Dev Mode):</span>
              <div className="hint-buttons d-flex flex-wrap gap-2 mt-1">
                <button
                  type="button"
                  className="hint-chip"
                  onClick={() => fillDefaultCredentials('admin1', 'laxanadmin1@2026India')}
                >
                  Admin 1
                </button>
                <button
                  type="button"
                  className="hint-chip"
                  onClick={() => fillDefaultCredentials('accountant1', 'laxanaccountant1@2026India')}
                >
                  Accountant 1
                </button>
                <button
                  type="button"
                  className="hint-chip"
                  onClick={() => fillDefaultCredentials('admin2', 'laxanadmin2@2026India')}
                >
                  Admin 2
                </button>
                <button
                  type="button"
                  className="hint-chip"
                  onClick={() => fillDefaultCredentials('accountant2', 'laxanaccountant2@2026India')}
                >
                  Accountant 2
                </button>
              </div>
            </div>
          )}

          <div className="modal-actions d-flex gap-2 mt-4">
            <button
              type="button"
              className="modal-cancel-btn"
              onClick={onCancel}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="modal-submit-btn"
              disabled={loading}
            >
              <span>{loading ? 'Authenticating...' : 'Authenticate'}</span>
              <ArrowRight size={16} />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AccountingLoginModal;
