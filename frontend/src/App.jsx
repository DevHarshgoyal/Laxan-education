import { Routes, Route, Navigate } from 'react-router-dom';
import HomePage from './pages/HomePage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import AccountingPage from './pages/AccountingPage';

function App() {
  return (
    <Routes>
      {/* Home page at root */}
      <Route path="/" element={<HomePage />} />

      {/* Registration page */}
      <Route path="/laxan/register" element={<RegisterPage />} />

      {/* Dashboard — studentId comes directly from the URL */}
      <Route path="/profile/:studentId" element={<DashboardPage />} />

      {/* Accounting & Finances Reports */}
      <Route path="/laxan/account" element={<AccountingPage />} />
      <Route path="/account" element={<Navigate to="/laxan/account" replace />} />
      <Route path="/accounting" element={<Navigate to="/laxan/account" replace />} />

      {/* Catch-all: redirect unknown paths to home */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;

