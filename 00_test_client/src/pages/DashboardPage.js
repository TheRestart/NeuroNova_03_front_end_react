import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { emrAPI, authAPI, monitoringAPI } from '../api/apiClient';

function DashboardPage({ user }) {
  const navigate = useNavigate();
  const [systemStatus, setSystemStatus] = useState({
    backend: 'checking',
    db: 'checking',
    redis: 'checking',
    orthanc: 'checking',
    patientCount: null,
    loading: true,
  });

  useEffect(() => {
    checkSystemStatus();
    const interval = setInterval(checkSystemStatus, 30000); // 30초마다 갱신
    return () => clearInterval(interval);
  }, []);

  const checkSystemStatus = async () => {
    setSystemStatus(prev => ({ ...prev, loading: true }));
    try {
      // 1. Django Backend & DB Check (via Patient List)
      const emrRes = await emrAPI.getPatients({ limit: 1 });

      // 2. Monitoring API (Mocked or Real)
      const monitorRes = await monitoringAPI.checkAllHealth();

      setSystemStatus(prev => ({
        ...prev,
        backend: 'online',
        db: emrRes.data ? 'online' : 'offline',
        redis: monitorRes.redis || 'online', // Mock
        orthanc: monitorRes.orthanc || 'online', // Mock
        patientCount: emrRes.data ? emrRes.data.length : 0, // Pagination result check needed
        loading: false,
      }));
    } catch (error) {
      console.error("System Check Failed:", error);
      setSystemStatus(prev => ({
        ...prev,
        backend: 'offline',
        db: 'unknown',
        loading: false,
      }));
    }
  };

  const menuItems = [
    { id: 'dashboard', label: '대시보드', path: '/dashboard', icon: '📊' },
    { id: 'all-test', label: '전체 API 테스트', path: '/all-api-test', icon: '🚀' },
    { type: 'divider' },
    { id: 'uc01', label: 'UC01: 인증/권한', path: '/uc01', icon: '🔐' },
    { id: 'uc02', label: 'UC02: EMR', path: '/uc02', icon: '📋' },
    { id: 'uc03', label: 'UC03: OCS', path: '/uc03', icon: '💊' },
    { id: 'uc04', label: 'UC04: LIS', path: '/uc04', icon: '🔬' },
    { id: 'uc05', label: 'UC05: RIS', path: '/uc05', icon: '🩻' },
    { id: 'uc06', label: 'UC06: AI', path: '/uc06', icon: '🤖' },
    { id: 'uc07', label: 'UC07: 알림', path: '/uc07', icon: '🔔' },
    { id: 'uc08', label: 'UC08: FHIR', path: '/uc08', icon: '🏥' },
    { id: 'uc09', label: 'UC09: 감사로그', path: '/uc09', icon: '📜' },
    { type: 'divider' },
    { id: 'monitoring', label: '시스템 모니터링', path: '/monitoring', icon: '🖥️' },
  ];

  const handleLogout = () => {
    authAPI.logout();
    localStorage.removeItem('access_token');
    localStorage.removeItem('user');
    navigate('/login');
    window.location.reload();
  };

  const getStatusColor = (status) => status === 'online' ? '#10B981' : (status === 'checking' ? '#F59E0B' : '#EF4444');

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#F3F4F6' }}>
      {/* Sidebar */}
      <aside style={{
        width: '260px',
        background: '#1F2937',
        color: 'white',
        display: 'flex',
        flexDirection: 'column',
        position: 'fixed',
        height: '100%'
      }}>
        <div style={{ padding: '20px', borderBottom: '1px solid #374151' }}>
          <h2 style={{ margin: 0, fontSize: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
            🧠 NeuroNova
          </h2>
          <p style={{ margin: '5px 0 0 0', fontSize: '12px', color: '#9CA3AF' }}>CDSS Dev Client v0.1</p>
        </div>

        <nav style={{ flex: 1, overflowY: 'auto', padding: '10px 0' }}>
          {menuItems.map((item, idx) => (
            item.type === 'divider' ? (
              <hr key={idx} style={{ borderColor: '#374151', margin: '10px 0' }} />
            ) : (
              <Link
                key={item.id}
                to={item.path}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  padding: '12px 20px',
                  color: '#D1D5DB',
                  textDecoration: 'none',
                  transition: 'background 0.2s',
                  gap: '12px'
                }}
                onMouseEnter={(e) => { e.currentTarget.style.background = '#374151'; e.currentTarget.style.color = 'white'; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#D1D5DB'; }}
              >
                <span>{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            )
          ))}
        </nav>

        <div style={{ padding: '20px', borderTop: '1px solid #374151', background: '#111827' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
            <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#4B5563', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              👤
            </div>
            <div>
              <div style={{ fontSize: '14px', fontWeight: 'bold' }}>{user?.username || 'Guest'}</div>
              <div style={{ fontSize: '12px', color: '#9CA3AF' }}>{user?.role || 'No Role'}</div>
            </div>
          </div>
          <button
            onClick={handleLogout}
            style={{
              width: '100%',
              padding: '8px',
              background: '#EF4444',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '13px'
            }}
          >
            로그아웃
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main style={{ marginLeft: '260px', flex: 1, padding: '30px' }}>
        <header style={{ marginBottom: '30px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h1 style={{ margin: 0, fontSize: '24px', color: '#111827' }}>대시보드</h1>
          <div style={{ display: 'flex', gap: '15px' }}>
            <StatusBadge label="Backend" status={systemStatus.backend} color={getStatusColor(systemStatus.backend)} />
            <StatusBadge label="DB" status={systemStatus.db} color={getStatusColor(systemStatus.db)} />
            <StatusBadge label="PACS" status={systemStatus.orthanc} color={getStatusColor(systemStatus.orthanc)} />
          </div>
        </header>

        {/* Stats Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px', marginBottom: '30px' }}>
          <StatCard title="총 환자 수" value={systemStatus.patientCount ?? '-'} icon="👥" color="blue" />
          <StatCard title="오늘의 진료" value="-" icon="📅" color="green" />
          <StatCard title="대기 중인 검사" value="-" icon="⏳" color="orange" />
          <StatCard title="AI 분석 완료" value="-" icon="🤖" color="purple" />
        </div>

        {/* UC Links Grid */}
        <h2 style={{ fontSize: '18px', marginBottom: '15px', color: '#374151' }}>빠른 테스트 실행</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
          {/* Reusing existing cards logic or simplifying */}
          <QuickExecCard title="전체 API 테스트" desc="모든 UC에 대한 자동화된 API 테스트를 실행합니다." path="/all-api-test" color="#4F46E5" />
          <QuickExecCard title="환자 등록 (UC02)" desc="새로운 환자를 등록하고 EMR에 동기화합니다." path="/uc02" color="#10B981" />
          <QuickExecCard title="영상 판독 (UC05)" desc="MRI/CT 영상을 조회하고 판독문을 작성합니다." path="/uc05" color="#F59E0B" />
        </div>

        {/* System Error Message */}
        {systemStatus.backend === 'offline' && (
          <div style={{ marginTop: '30px', padding: '15px', background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: '6px', color: '#B91C1C' }}>
            <strong>⚠️ 시스템 경고:</strong> 백엔드 서버에 연결할 수 없습니다. Docker 컨테이너 상태를 확인해주세요.
          </div>
        )}
      </main>
    </div>
  );
}

// Sub-components for cleaner code
const StatusBadge = ({ label, status, color }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'white', padding: '6px 12px', borderRadius: '20px', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}>
    <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: color }}></div>
    <span style={{ fontSize: '13px', fontWeight: '500', color: '#374151' }}>{label}: {status.toUpperCase()}</span>
  </div>
);

const StatCard = ({ title, value, icon, color }) => (
  <div style={{ background: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', display: 'flex', alignItems: 'center', gap: '15px' }}>
    <div style={{ width: '48px', height: '48px', borderRadius: '8px', background: `${color === 'blue' ? '#EFF6FF' : color === 'green' ? '#ECFDF5' : '#F3E8FF'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px' }}>
      {icon}
    </div>
    <div>
      <div style={{ fontSize: '13px', color: '#6B7280' }}>{title}</div>
      <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#111827' }}>{value}</div>
    </div>
  </div>
);

const QuickExecCard = ({ title, desc, path, color }) => (
  <Link to={path} style={{ textDecoration: 'none' }}>
    <div style={{ background: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', borderTop: `4px solid ${color}`, minHeight: '100px', transition: 'transform 0.2s' }}
      onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
      onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
    >
      <h3 style={{ margin: '0 0 8px 0', fontSize: '16px', color: '#111827' }}>{title}</h3>
      <p style={{ margin: 0, fontSize: '13px', color: '#6B7280', lineHeight: '1.5' }}>{desc}</p>
    </div>
  </Link>
);

export default DashboardPage;
