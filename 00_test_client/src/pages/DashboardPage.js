import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { emrAPI } from '../api/apiClient';

function DashboardPage({ user }) {
  const [systemStatus, setSystemStatus] = useState({
    backend: 'checking',
    apiUrl: process.env.REACT_APP_API_URL || 'http://localhost/api',
    autoLogin: process.env.REACT_APP_DEV_AUTO_LOGIN === 'true',
    patientCount: null,
    loading: true,
  });

  useEffect(() => {
    checkSystemStatus();
  }, []);

  const checkSystemStatus = async () => {
    setSystemStatus(prev => ({ ...prev, loading: true }));

    try {
      // 환자 목록 조회로 백엔드 상태 확인
      const response = await emrAPI.getPatients();

      setSystemStatus(prev => ({
        ...prev,
        backend: 'online',
        patientCount: response.data.length,
        loading: false,
      }));
    } catch (error) {
      setSystemStatus(prev => ({
        ...prev,
        backend: 'offline',
        loading: false,
      }));
    }
  };

  const ucList = [
    { id: 'uc01', name: 'UC01: 인증/권한', desc: '로그인, 회원가입, 사용자 관리 테스트', icon: '🔐' },
    { id: 'uc02', name: 'UC02: EMR', desc: '환자, 진료기록, 처방 관리 테스트', icon: '📋' },
    { id: 'uc03', name: 'UC03: OCS', desc: '처방 커뮤니케이션 시스템 테스트', icon: '💊' },
    { id: 'uc04', name: 'UC04: LIS', desc: '검사 결과 및 마스터 데이터 테스트', icon: '🔬' },
    { id: 'uc05', name: 'UC05: RIS', desc: '영상 검사 및 판독 리포트 테스트', icon: '🩻' },
    { id: 'uc06', name: 'UC06: AI', desc: 'AI 분석 요청 및 검토 테스트', icon: '🤖' },
    { id: 'uc07', name: 'UC07: 알림', desc: '실시간 알림 시스템 테스트', icon: '🔔' },
    { id: 'uc08', name: 'UC08: FHIR', desc: 'FHIR 리소스 및 동기화 테스트', icon: '🏥' },
    { id: 'uc09', name: 'UC09: 감사로그', desc: '감사 로그 조회 및 분석', icon: '📊' },
  ];

  const getStatusColor = (status) => {
    if (status === 'online') return '#28a745';
    if (status === 'offline') return '#dc3545';
    return '#ffc107';
  };

  const getStatusText = (status) => {
    if (status === 'online') return '정상';
    if (status === 'offline') return '오프라인';
    return '확인 중...';
  };

  return (
    <div className="container">
      <div className="card">
        <h1>🏥 CDSS API 테스트 대시보드</h1>
        <p style={{ color: '#6c757d', marginTop: '10px' }}>
          현재 로그인: <strong>{user?.username}</strong> ({user?.role})
        </p>
      </div>

      {/* 시스템 상태 요약 */}
      <div className="card" style={{
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        marginBottom: '20px',
      }}>
        <h2 style={{ marginBottom: '20px', color: 'white' }}>⚙️ 시스템 상태</h2>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '20px',
        }}>
          {/* Django 백엔드 상태 */}
          <div style={{
            background: 'rgba(255, 255, 255, 0.15)',
            padding: '20px',
            borderRadius: '8px',
          }}>
            <div style={{ fontSize: '14px', opacity: 0.9, marginBottom: '8px' }}>Django 백엔드</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{
                width: '12px',
                height: '12px',
                borderRadius: '50%',
                background: getStatusColor(systemStatus.backend),
                boxShadow: `0 0 10px ${getStatusColor(systemStatus.backend)}`,
              }}></div>
              <div style={{ fontSize: '24px', fontWeight: 'bold' }}>
                {getStatusText(systemStatus.backend)}
              </div>
            </div>
            <div style={{ fontSize: '12px', opacity: 0.8, marginTop: '8px' }}>
              {systemStatus.apiUrl}
            </div>
          </div>

          {/* 샘플 데이터 */}
          <div style={{
            background: 'rgba(255, 255, 255, 0.15)',
            padding: '20px',
            borderRadius: '8px',
          }}>
            <div style={{ fontSize: '14px', opacity: 0.9, marginBottom: '8px' }}>샘플 환자 데이터</div>
            <div style={{ fontSize: '32px', fontWeight: 'bold' }}>
              {systemStatus.loading ? '...' : systemStatus.patientCount !== null ? `${systemStatus.patientCount}명` : 'N/A'}
            </div>
            <div style={{ fontSize: '12px', opacity: 0.8, marginTop: '8px' }}>
              {systemStatus.patientCount === 5 ? '✅ 정상 (P20250001~05)' : systemStatus.patientCount ? '⚠️ 비정상 데이터 수' : ''}
            </div>
          </div>

          {/* 자동 로그인 모드 */}
          <div style={{
            background: 'rgba(255, 255, 255, 0.15)',
            padding: '20px',
            borderRadius: '8px',
          }}>
            <div style={{ fontSize: '14px', opacity: 0.9, marginBottom: '8px' }}>개발 모드</div>
            <div style={{ fontSize: '24px', fontWeight: 'bold' }}>
              {systemStatus.autoLogin ? '🔓 자동 로그인' : '🔒 일반 모드'}
            </div>
            <div style={{ fontSize: '12px', opacity: 0.8, marginTop: '8px' }}>
              {systemStatus.autoLogin ? 'REACT_APP_DEV_AUTO_LOGIN=true' : 'REACT_APP_DEV_AUTO_LOGIN=false'}
            </div>
          </div>

          {/* 새로고침 버튼 */}
          <div style={{
            background: 'rgba(255, 255, 255, 0.15)',
            padding: '20px',
            borderRadius: '8px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
          }}>
            <button
              onClick={checkSystemStatus}
              disabled={systemStatus.loading}
              style={{
                background: 'rgba(255, 255, 255, 0.9)',
                color: '#667eea',
                border: 'none',
                padding: '12px 20px',
                borderRadius: '6px',
                cursor: systemStatus.loading ? 'not-allowed' : 'pointer',
                fontWeight: 'bold',
                fontSize: '14px',
                transition: 'all 0.3s ease',
              }}
              onMouseEnter={(e) => {
                if (!systemStatus.loading) {
                  e.currentTarget.style.background = 'white';
                  e.currentTarget.style.transform = 'scale(1.05)';
                }
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.9)';
                e.currentTarget.style.transform = 'scale(1)';
              }}
            >
              {systemStatus.loading ? '확인 중...' : '🔄 상태 새로고침'}
            </button>
          </div>
        </div>
      </div>

      {/* 전체 API 테스트 바로가기 */}
      <Link to="/all-api-test" style={{ textDecoration: 'none' }}>
        <div className="card" style={{
          background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
          color: 'white',
          cursor: 'pointer',
          transition: 'transform 0.3s ease',
          border: 'none',
        }}
        onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.02)'}
        onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <h2 style={{ color: 'white', marginBottom: '10px' }}>🚀 전체 API 자동 테스트</h2>
              <p style={{ fontSize: '14px', opacity: 0.9, margin: 0 }}>
                14개 API 엔드포인트를 한 번에 순차 테스트하고 결과 리포트를 생성합니다
              </p>
            </div>
            <div style={{ fontSize: '48px' }}>→</div>
          </div>
        </div>
      </Link>

      {/* UC 테스트 카드 그리드 */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '20px' }}>
        {ucList.map((uc) => (
          <Link to={`/${uc.id}`} key={uc.id} style={{ textDecoration: 'none', color: 'inherit' }}>
            <div className="card" style={{
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              border: '2px solid #e9ecef',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-8px)';
              e.currentTarget.style.boxShadow = '0 10px 25px rgba(0,0,0,0.1)';
              e.currentTarget.style.borderColor = '#667eea';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)';
              e.currentTarget.style.borderColor = '#e9ecef';
            }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '10px' }}>
                <div style={{ fontSize: '36px' }}>{uc.icon}</div>
                <h3 style={{ color: '#007bff', margin: 0 }}>{uc.name}</h3>
              </div>
              <p style={{ color: '#6c757d', fontSize: '14px', margin: 0 }}>{uc.desc}</p>
            </div>
          </Link>
        ))}
      </div>

      {/* 사용 방법 */}
      <div className="card" style={{ marginTop: '20px', backgroundColor: '#f8f9fa' }}>
        <h3>📖 사용 방법</h3>
        <ol style={{ marginLeft: '20px', marginTop: '10px', lineHeight: '1.8' }}>
          <li><strong>빠른 테스트</strong>: "전체 API 자동 테스트" 카드를 클릭하여 모든 API를 한 번에 테스트</li>
          <li><strong>개별 테스트</strong>: 각 UC 페이지로 이동하여 특정 API만 상세 테스트</li>
          <li>요청 파라미터를 입력하고 "테스트 실행" 버튼 클릭</li>
          <li>응답 결과를 확인하고 성공/실패 여부 검증</li>
          <li>브라우저 개발자 도구(F12)에서 Network 탭으로 상세 요청/응답 확인</li>
        </ol>
      </div>

      {/* 경고 메시지 */}
      {systemStatus.backend === 'offline' && (
        <div className="card" style={{
          marginTop: '20px',
          background: '#fff3cd',
          border: '1px solid #ffc107',
        }}>
          <h3 style={{ color: '#856404', marginBottom: '10px' }}>⚠️ Django 백엔드 오프라인</h3>
          <p style={{ color: '#856404', margin: 0 }}>
            Django 서버가 실행되지 않았습니다. Docker 컨테이너를 확인하세요:
          </p>
          <pre style={{
            background: '#f8f9fa',
            padding: '15px',
            borderRadius: '5px',
            marginTop: '10px',
            fontSize: '13px',
            overflow: 'auto',
          }}>
            docker ps --format "table {'{{'}}.Names{{'}}'}}\t{'{{'}}.Status{{'}}'}}"
          </pre>
        </div>
      )}
    </div>
  );
}

export default DashboardPage;
