import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import Sidebar from './components/Sidebar';
import Forbidden from './components/Forbidden';
import ProtectedRoute from './components/ProtectedRoute';
import RISDashboard from './pages/ris/RISDashboard';
import { useAuthStore } from './stores/authStore';
import './styles/sidebar.css';

// Layout Component with Sidebar
const AppLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuthStore();

  if (!isAuthenticated) {
    return <>{children}</>;
  }

  return (
    <div className="app-layout">
      <Sidebar />
      <main className="main-content" style={{ marginLeft: '250px', padding: '20px' }}>
        {children}
      </main>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <Router>
      <AppLayout>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<Login />} />

          {/* 403 Forbidden */}
          <Route path="/403" element={<Forbidden />} />

          {/* Protected Routes */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute menuId="DASHBOARD">
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/ris/*"
            element={
              <ProtectedRoute menuId="RIS_WORKLIST">
                <RISDashboard />
              </ProtectedRoute>
            }
          />

          {/* 루트 경로는 대시보드로 리다이렉트 */}
          <Route path="/" element={<Navigate to="/dashboard" replace />} />

          {/* 404 페이지 - 로그인 페이지로 리다이렉트 */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </AppLayout>
    </Router>
  );
};

export default App;
