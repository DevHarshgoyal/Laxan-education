import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/layout/Header';
import './RegisterPage.css';

const COURSES = [
  'SSC Combo',
  'SSC GK',
  'SSC Maths',
  'IBPS PO',
  'IBPS Clerk',
  'RRB NTPC',
  'RRB Group D',
  'UPSC CSE Foundation',
  'State PSC',
  'English Speaking',
];

const initialForm = {
  student_id: '',
  name: '',
  course_name: '',
  dob: '',
  gender: '',
  phone: '',
  email: '',
  address: '',
};

export default function RegisterPage() {
  const navigate = useNavigate();
  const fileRef = useRef(null);

  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(null);
  const [photo, setPhoto] = useState(null); // base64 for preview
  const [photoFile, setPhotoFile] = useState(null); // raw File for upload

  // ── Photo handler ────────────────────────────────────────
  function handlePhoto(e) {
    const file = e.target.files[0];
    if (!file) return;
    setPhotoFile(file); // store raw File for FormData upload
    const reader = new FileReader();
    reader.onload = ev => setPhoto(ev.target.result); // preview only
    reader.readAsDataURL(file);
  }

  // ── Validation ───────────────────────────────────────────
  function validate() {
    const e = {};
    if (!form.student_id.trim()) e.student_id = 'Student ID is required.';
    if (!form.name.trim()) e.name = 'Full name is required.';
    if (!form.course_name) e.course_name = 'Please select a course.';
    if (!form.dob) e.dob = 'Date of birth is required.';
    if (!form.gender) e.gender = 'Please select a gender.';
    if (form.phone && !/^\d{10}$/.test(form.phone))
      e.phone = 'Enter a valid 10-digit phone number.';
    if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      e.email = 'Enter a valid email address.';
    return e;
  }

  // ── Handlers ─────────────────────────────────────────────
  function handleChange(e) {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: undefined }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length) {
      setErrors(validationErrors);
      return;
    }
    setLoading(true);
    setErrors({});
    try {
      const dobFormatted = formatDob(form.dob);
      const payload = { ...form, dob: dobFormatted };

      const body = new FormData();
      Object.entries(payload).forEach(([key, value]) => {
        if (value !== null && value !== undefined) body.append(key, value);
      });
      if (photoFile) body.append('photo', photoFile);

      const API_BASE = import.meta.env.VITE_API_URL || '/api';
      const response = await fetch(`${API_BASE}/register`, {
        method: 'POST',
        body,
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Registration failed. Please try again.');
      }

      setSuccess(data.student);
    } catch (err) {
      setErrors({ api: err.message });
    } finally {
      setLoading(false);
    }
  }

  function handleGoToDashboard() {
    navigate(`/profile/${success.student_id}`);
  }

  // ── Helpers ──────────────────────────────────────────────
  function formatDob(isoDate) {
    if (!isoDate) return '';
    const d = new Date(isoDate);
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`;
  }

  // ── Success Screen ───────────────────────────────────────
  if (success) {
    return (
      <div className="rp-wrapper">
        <Header />
        <div className="rp-page-body">
          <div className="rp-success-card">
            <div className="rp-success-icon">🎓</div>
            <h2 className="rp-success-title">Registration Successful!</h2>
            <p className="rp-success-msg">
              Welcome to Laxan Education, <strong>{success.name}</strong>.
            </p>

            <div className="rp-id-badge">
              <span className="rp-id-label">Your Student ID</span>
              <span className="rp-id-value">{success.student_id}</span>
            </div>

            <div className="rp-success-details">
              <div className="rp-detail-row">
                <span className="rp-detail-label">Course</span>
                <span className="rp-detail-val">{success.course_name}</span>
              </div>
              <div className="rp-detail-row">
                <span className="rp-detail-label">Date of Birth</span>
                <span className="rp-detail-val">{success.dob}</span>
              </div>
              <div className="rp-detail-row">
                <span className="rp-detail-label">Gender</span>
                <span className="rp-detail-val">{success.gender}</span>
              </div>
            </div>

            <p className="rp-save-note">
              📌 Save your Student ID — you'll need it to log in.
            </p>
            <button
              id="go-to-dashboard-btn"
              className="rp-submit-btn"
              onClick={handleGoToDashboard}
            >
              View My Dashboard →
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ── Form ─────────────────────────────────────────────────
  return (
    <div className="rp-wrapper">
      {/* Reuse the shared app header */}
      <Header />

      <div className="rp-page-body">
        <form
          className="rp-form"
          onSubmit={handleSubmit}
          noValidate
          id="student-registration-form"
        >
          {/* ── Card ── */}
          <div className="rp-form-card">

            <h2 className="rp-card-title">Student Registration</h2>

            {/* ── Photo Upload ── */}
            <div className="rp-field">
              <span className="rp-label rp-label--caps">Photo</span>
              <div
                className="rp-photo-zone"
                onClick={() => fileRef.current?.click()}
                role="button"
                tabIndex={0}
                onKeyDown={e => e.key === 'Enter' && fileRef.current?.click()}
              >
                {photo ? (
                  <img src={photo} alt="Preview" className="rp-photo-preview" />
                ) : (
                  <>
                    <span className="rp-photo-icon">📷</span>
                    <span className="rp-photo-hint">Tap to Upload Photo</span>
                    <button type="button" className="rp-browse-btn">Browse…</button>
                  </>
                )}
                <input
                  ref={fileRef}
                  type="file"
                  accept="image/*"
                  style={{ display: 'none' }}
                  onChange={handlePhoto}
                />
              </div>
            </div>

            {/* ── Student ID ── */}
            <div className="rp-field">
              <label htmlFor="student_id" className="rp-label rp-label--caps">
                Student ID <span className="rp-required">*</span>
              </label>
              <div className="rp-input-wrap">
                <span className="rp-input-icon">🆔</span>
                <input
                  id="student_id"
                  name="student_id"
                  type="text"
                  className={`rp-input rp-input--icon ${errors.student_id ? 'rp-input--error' : ''}`}
                  placeholder="e.g. LX-2025-0001"
                  value={form.student_id}
                  onChange={handleChange}
                />
              </div>
              {errors.student_id && <p className="rp-error">{errors.student_id}</p>}
            </div>

            {/* ── Full Name ── */}
            <div className="rp-field">
              <label htmlFor="name" className="rp-label rp-label--caps">
                Full Name <span className="rp-required">*</span>
              </label>
              <div className="rp-input-wrap">
                <span className="rp-input-icon">👤</span>
                <input
                  id="name"
                  name="name"
                  type="text"
                  className={`rp-input rp-input--icon ${errors.name ? 'rp-input--error' : ''}`}
                  placeholder="Enter Full Name"
                  value={form.name}
                  onChange={handleChange}
                  autoComplete="name"
                />
              </div>
              {errors.name && <p className="rp-error">{errors.name}</p>}
            </div>

            {/* ── Gender ── */}
            <div className="rp-field">
              <label htmlFor="gender" className="rp-label rp-label--caps">
                Gender <span className="rp-required">*</span>
              </label>
              <div className="rp-input-wrap">
                <span className="rp-input-icon">⚥</span>
                <select
                  id="gender"
                  name="gender"
                  className={`rp-input rp-input--icon rp-select ${errors.gender ? 'rp-input--error' : ''}`}
                  value={form.gender}
                  onChange={handleChange}
                >
                  <option value="">— Select Gender —</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              {errors.gender && <p className="rp-error">{errors.gender}</p>}
            </div>

            {/* ── DOB ── */}
            <div className="rp-field">
              <label htmlFor="dob" className="rp-label rp-label--caps">
                Date of Birth <span className="rp-required">*</span>
              </label>
              <div className="rp-input-wrap">
                <span className="rp-input-icon">📅</span>
                <input
                  id="dob"
                  name="dob"
                  type="date"
                  className={`rp-input rp-input--icon ${errors.dob ? 'rp-input--error' : ''}`}
                  value={form.dob}
                  onChange={handleChange}
                  max={new Date().toISOString().split('T')[0]}
                />
              </div>
              {errors.dob && <p className="rp-error">{errors.dob}</p>}
            </div>

            {/* ── Course ── */}
            <div className="rp-field">
              <label htmlFor="course_name" className="rp-label rp-label--caps">
                Course <span className="rp-required">*</span>
              </label>
              <div className="rp-input-wrap">
                <span className="rp-input-icon">🎓</span>
                <select
                  id="course_name"
                  name="course_name"
                  className={`rp-input rp-input--icon rp-select ${errors.course_name ? 'rp-input--error' : ''}`}
                  value={form.course_name}
                  onChange={handleChange}
                >
                  <option value="">Select Course</option>
                  {COURSES.map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
              {errors.course_name && <p className="rp-error">{errors.course_name}</p>}
            </div>

            {/* ── Phone ── */}
            <div className="rp-field">
              <label htmlFor="phone" className="rp-label rp-label--caps">Phone Number</label>
              <div className="rp-input-wrap">
                <span className="rp-input-icon">📞</span>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  className={`rp-input rp-input--icon ${errors.phone ? 'rp-input--error' : ''}`}
                  placeholder="10-digit mobile number"
                  value={form.phone}
                  onChange={handleChange}
                  maxLength={10}
                  autoComplete="tel"
                />
              </div>
              {errors.phone && <p className="rp-error">{errors.phone}</p>}
            </div>

            {/* ── Email ── */}
            <div className="rp-field">
              <label htmlFor="email" className="rp-label rp-label--caps">Email Address</label>
              <div className="rp-input-wrap">
                <span className="rp-input-icon">✉️</span>
                <input
                  id="email"
                  name="email"
                  type="email"
                  className={`rp-input rp-input--icon ${errors.email ? 'rp-input--error' : ''}`}
                  placeholder="you@example.com"
                  value={form.email}
                  onChange={handleChange}
                  autoComplete="email"
                />
              </div>
              {errors.email && <p className="rp-error">{errors.email}</p>}
            </div>

            {/* ── Address ── */}
            <div className="rp-field">
              <label htmlFor="address" className="rp-label rp-label--caps">Address</label>
              <textarea
                id="address"
                name="address"
                className="rp-input rp-textarea"
                placeholder="House no., Street, City, State"
                value={form.address}
                onChange={handleChange}
                rows={2}
              />
            </div>

          </div>{/* /rp-form-card */}

          {/* API Error */}
          {errors.api && (
            <div className="rp-api-error">⚠️ {errors.api}</div>
          )}

          {/* Buttons */}
          <div className="rp-btn-row">
            <button
              id="register-submit-btn"
              type="submit"
              className="rp-submit-btn"
              disabled={loading}
            >
              {loading ? <span className="rp-spinner" /> : 'Register'}
            </button>
            <button
              type="button"
              className="rp-cancel-btn"
              onClick={() => { setForm(initialForm); setErrors({}); setPhoto(null); }}
            >
              Cancel
            </button>
          </div>

          <p className="rp-footnote">
            Fields marked <span className="rp-required">*</span> are mandatory.
          </p>
        </form>
      </div>

      {/* Footer */}
      <footer className="rp-footer">
        Laxan Education · 2025–26 · Designed by Shros
      </footer>
    </div>
  );
}
