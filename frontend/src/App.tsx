import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import JobTrackerPage from './pages/JobTrackerPage';
import JobDetailPage from './pages/JobDetailPage';
import AtsScorePage from './pages/AtsScorePage';
import ResumeBuilderPage from './pages/ResumeBuilderPage';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Public routes */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* Protected routes */}
          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/tracker" element={<JobTrackerPage />} />
            <Route path="/tracker/:id" element={<JobDetailPage />} />
            <Route path="/ats" element={<AtsScorePage />} />
            <Route path="/resume-builder" element={<ResumeBuilderPage />} />
          </Route>

          {/* Default redirect */}
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
