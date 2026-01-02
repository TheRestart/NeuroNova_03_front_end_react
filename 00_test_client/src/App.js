import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import AllAPITest from './pages/AllAPITest';
import UC01AuthTest from './pages/UC01AuthTest';
import UC02EMRTest from './pages/UC02EMRTest';
import UC03OCSTest from './pages/UC03OCSTest';
import UC04LISTest from './pages/UC04LISTest';
import UC05RISTest from './pages/UC05RISTest';
import UC06AITest from './pages/UC06AITest';
import UC07AlertTest from './pages/UC07AlertTest';
import UC08FHIRTest from './pages/UC08FHIRTest';
import UC09AuditTest from './pages/UC09AuditTest';
import ViewerPage from './pages/ViewerPage';
import MonitoringPage from './pages/MonitoringPage';
import DoctorWorkstation from './pages/DoctorWorkstation';
import PatientDicomMappingPage from './pages/PatientDicomMappingPage';
import { devAutoLogin, isDevAutoLoginEnabled } from './utils/devAutoLogin';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return !!localStorage.getItem('access_token');
  });
  const [user, setUser] = useState(null);

  useEffect(() => {
    // 🔓 개발 환경 자동 로그인 (REACT_APP_DEV_AUTO_LOGIN=true 시)
    if (isDevAutoLoginEnabled()) {
      devAutoLogin();
    }

    // 로컬 스토리지에서 토큰 및 사용자 정보 확인
    const checkAuth = () => {
      const token = localStorage.getItem('access_token');
      const userData = localStorage.getItem('user');

      if (token && userData) {
        setIsAuthenticated(true);
        setUser(JSON.parse(userData));
      }
    };

    // 초기 인증 상태 확인
    checkAuth();

    // localStorage 변경 감지 (devAutoLogin 후 상태 자동 업데이트)
    const interval = setInterval(() => {
      const token = localStorage.getItem('access_token');
      const userData = localStorage.getItem('user');

      if (token && userData && !isAuthenticated) {
        setIsAuthenticated(true);
        setUser(JSON.parse(userData));
      }
    }, 100); // 100ms마다 체크

    // 5초 후 interval 정리 (초기 로그인 완료 후)
    const timeout = setTimeout(() => {
      clearInterval(interval);
    }, 5000);

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, [isAuthenticated]);

  const handleLogin = (token, userData) => {
    localStorage.setItem('access_token', token);
    localStorage.setItem('user', JSON.stringify(userData));
    setIsAuthenticated(true);
    setUser(userData);
  };

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user');
    setIsAuthenticated(false);
    setUser(null);
  };

  return (
    <Router>
      <div className="App">
        {isAuthenticated && (
          <nav className="nav">
            <ul className="nav-links">
              <li><Link to="/doctor-workstation" style={{ fontWeight: 'bold', backgroundColor: 'var(--accent-color)', color: 'white' }}>👨‍⚕️ WORKSTATION</Link></li>
              <li><Link to="/dashboard">대시보드</Link></li>
              <li><Link to="/all-api-test" style={{ fontWeight: 'bold', color: '#ff6b6b' }}>🚀 전체 API 테스트</Link></li>
              <li><Link to="/uc01">UC01: 인증/권한</Link></li>
              <li><Link to="/uc02">UC02: EMR</Link></li>
              <li><Link to="/uc03">UC03: OCS</Link></li>
              <li><Link to="/uc04">UC04: LIS</Link></li>
              <li><Link to="/uc05">UC05: RIS</Link></li>
              <li><Link to="/uc06">UC06: AI</Link></li>
              <li><Link to="/uc07">UC07: 알림</Link></li>
              <li><Link to="/uc08">UC08: FHIR</Link></li>
              <li><Link to="/uc09">UC09: 감사로그</Link></li>
              <li><Link to="/patient-dicom-mapping" style={{ fontWeight: 'bold', color: '#9c27b0' }}>🔗 매핑관리</Link></li>
              <li><Link to="/monitoring">🖥️ 시스템</Link></li>
              <li style={{ marginLeft: 'auto' }}>
                <span style={{ color: '#6c757d', marginRight: '10px' }}>
                  {user?.username} ({user?.role})
                </span>
                <button className="btn btn-danger" onClick={handleLogout}>
                  로그아웃
                </button>
              </li>
            </ul>
          </nav>
        )}

        <Routes>
          <Route
            path="/login"
            element={
              isAuthenticated ? (
                <Navigate to="/dashboard" replace />
              ) : (
                <LoginPage onLogin={handleLogin} />
              )
            }
          />
          {/* ... existing routes ... */}

          <Route
            path="/doctor-workstation"
            element={
              isAuthenticated ? (
                <DoctorWorkstation user={user} />
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />

          <Route
            path="/dashboard"
            element={
              isAuthenticated ? (
                <DashboardPage user={user} />
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />

          <Route
            path="/monitoring"
            element={
              isAuthenticated ? <MonitoringPage /> : <Navigate to="/login" replace />
            }
          />

          <Route
            path="/all-api-test"
            element={
              isAuthenticated ? <AllAPITest /> : <Navigate to="/login" replace />
            }
          />

          <Route
            path="/uc01"
            element={
              isAuthenticated ? <UC01AuthTest /> : <Navigate to="/login" replace />
            }
          />

          <Route
            path="/uc02"
            element={
              isAuthenticated ? <UC02EMRTest /> : <Navigate to="/login" replace />
            }
          />

          <Route
            path="/uc03"
            element={
              isAuthenticated ? <UC03OCSTest /> : <Navigate to="/login" replace />
            }
          />

          <Route
            path="/uc04"
            element={
              isAuthenticated ? <UC04LISTest /> : <Navigate to="/login" replace />
            }
          />

          <Route
            path="/uc05"
            element={
              isAuthenticated ? <UC05RISTest /> : <Navigate to="/login" replace />
            }
          />

          <Route
            path="/uc06"
            element={
              isAuthenticated ? <UC06AITest /> : <Navigate to="/login" replace />
            }
          />

          <Route
            path="/uc07"
            element={
              isAuthenticated ? <UC07AlertTest /> : <Navigate to="/login" replace />
            }
          />

          <Route
            path="/uc08"
            element={
              isAuthenticated ? <UC08FHIRTest /> : <Navigate to="/login" replace />
            }
          />

          <Route
            path="/uc09"
            element={
              isAuthenticated ? <UC09AuditTest /> : <Navigate to="/login" replace />
            }
          />

          <Route
            path="/viewer/:studyInstanceUID"
            element={
              isAuthenticated ? <ViewerPage /> : <Navigate to="/login" replace />
            }
          />

          <Route
            path="/patient-dicom-mapping"
            element={
              isAuthenticated ? <PatientDicomMappingPage /> : <Navigate to="/login" replace />
            }
          />

          <Route path="/" element={<Navigate to="/login" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
