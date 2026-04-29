import { Routes, Route, Navigate } from 'react-router-dom';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';

function App() {
  return (
    <Routes>
      {/* Registration page at root */}
      <Route path="/" element={<RegisterPage />} />

      {/* Dashboard — studentId comes directly from the URL */}
      <Route path="/profile/:studentId" element={<DashboardPage />} />

      {/* Catch-all: redirect unknown paths to home */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;

