import React, { useState } from 'react';
import APITester from '../components/APITester';
import { monitoringAPI } from '../api/apiClient';

function MonitoringPage() {
  const [activeTab, setActiveTab] = useState('overview');
  const [refreshKey, setRefreshKey] = useState(0);

  const handleRefresh = () => {
    setRefreshKey(prev => prev + 1);
  };

  return (
    <div className="container">
      <header style={{ marginBottom: '30px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ margin: '0 0 10px 0' }}>🖥️ 시스템 모니터링</h1>
          <p style={{ margin: 0, color: '#666' }}>CDSS 전체 아키텍처 상태 및 서비스 헬스 체크</p>
        </div>
        <button onClick={handleRefresh} className="btn btn-primary">🔄 상태 새로고침</button>
      </header>

      {/* Tabs */}
      <div style={{ display: 'flex', borderBottom: '1px solid #ddd', marginBottom: '30px' }}>
        <TabButton id="overview" label="시스템 개요 (Overview)" activeTab={activeTab} onClick={setActiveTab} />
        <TabButton id="health" label="통합 헬스 체크 (API)" activeTab={activeTab} onClick={setActiveTab} />
        <TabButton id="dashboards" label="Grafana 대시보드" activeTab={activeTab} onClick={setActiveTab} />
      </div>

      {/* Tab Content */}
      <div className="tab-content">

        {/* 1. System Overview (Visual Diagram) */}
        {activeTab === 'overview' && (
          <div className="animate-fade-in">
            <div className="card" style={{ textAlign: 'center', padding: '40px 20px', background: '#f8f9fa' }}>
              <h3 style={{ marginBottom: '40px' }}>Architecture Status Map</h3>

              {/* Visual Architecture Diagram */}
              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '30px', flexWrap: 'wrap' }}>

                {/* Client */}
                <ServiceNode name="React Client" icon="💻" status="online" port="3001" desc="사용자 인터페이스" />

                <Arrow />

                {/* Proxy */}
                <ServiceNode name="Nginx Proxy" icon="🛡️" status="online" port="80" desc="보안 및 라우팅" />

                <Arrow />

                {/* Backend Group */}
                <div style={{ padding: '20px', border: '2px dashed #ccc', borderRadius: '15px', background: 'white' }}>
                  <div style={{ marginBottom: '15px', fontWeight: 'bold', color: '#666' }}>Docker Backend Network</div>
                  <div style={{ display: 'flex', gap: '20px' }}>
                    <ServiceNode name="Django API" icon="🐍" status="online" port="8000" desc="비즈니스 로직" type="core" />
                  </div>
                  <div style={{ display: 'flex', gap: '20px', marginTop: '20px', justifyContent: 'center' }}>
                    <ServiceNode name="MySQL" icon="🐬" status="online" port="3306" desc="메인 DB" type="db" />
                    <ServiceNode name="Redis" icon="⚡" status="online" port="6379" desc="캐시/큐" type="db" />
                  </div>
                </div>

                <Arrow direction="down" />

                {/* Integrations */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  <ServiceNode name="Orthanc PACS" icon="🩻" status="online" port="8042" desc="의료 영상 저장소" type="external" />
                  <ServiceNode name="HAPI FHIR" icon="🔥" status="unknown" port="8080" desc="표준 데이터 저장소" type="external" />
                </div>
              </div>

              <p style={{ marginTop: '40px', color: '#666', fontSize: '14px' }}>
                * 위 상태는 마지막 헬스 체크 결과를 기반으로 시각화되었습니다.
              </p>
            </div>
          </div>
        )}

        {/* 2. Health Check API */}
        {activeTab === 'health' && (
          <div className="animate-fade-in">
            <APITester
              key={`health-${refreshKey}`}
              title="🔍 통합 헬스 체크 (Deep Check)"
              apiCall={() => monitoringAPI.checkAllHealth()}
              paramFields={[]}
            />
          </div>
        )}

        {/* 3. Grafana Dashboards */}
        {activeTab === 'dashboards' && (
          <div className="animate-fade-in grid-col-2" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
            <DashboardCard
              title="System Resources"
              desc="CPU, Memory, Disk Usage 등 서버 리소스 현황"
              url="http://localhost:3000/d/neuronova-system"
              icon="📊"
            />
            <DashboardCard
              title="AI Inference Jobs"
              desc="AI 분석 요청 처리 속도 및 성공률 모니터링"
              url="http://localhost:3000/d/neuronova-ai"
              icon="🧠"
            />
            <DashboardCard
              title="Database Metrics"
              desc="MySQL 쿼리 성능 및 Connection Pool 상태"
              url="http://localhost:3000/d/neuronova-db"
              icon="💾"
            />
            <DashboardCard
              title="Prometheus Explorer"
              desc="Raw Metrics 데이터 탐색 및 쿼리 작성"
              url="http://localhost:9090"
              icon="📈"
              isExternal
            />
          </div>
        )}
      </div>
    </div>
  );
}

/* --- Components --- */

const TabButton = ({ id, label, activeTab, onClick }) => (
  <button
    onClick={() => onClick(id)}
    style={{
      padding: '12px 24px',
      border: 'none',
      background: 'transparent',
      borderBottom: activeTab === id ? '3px solid #007bff' : '3px solid transparent',
      color: activeTab === id ? '#007bff' : '#666',
      fontWeight: activeTab === id ? 'bold' : 'normal',
      cursor: 'pointer',
      fontSize: '15px'
    }}
  >
    {label}
  </button>
);

const ServiceNode = ({ name, icon, status, port, desc, type }) => {
  const getColor = () => status === 'online' ? '#10B981' : (status === 'unknown' ? '#9CA3AF' : '#EF4444');
  const getBg = () => {
    if (type === 'core') return '#E0F2FE';
    if (type === 'db') return '#FEF3C7';
    if (type === 'external') return '#F3E8FF';
    return 'white';
  }

  return (
    <div style={{
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      padding: '15px', borderRadius: '12px', background: getBg(),
      border: `2px solid ${getColor()}`, boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)',
      minWidth: '140px'
    }}>
      <div style={{ fontSize: '32px', marginBottom: '5px' }}>{icon}</div>
      <div style={{ fontWeight: 'bold', color: '#1F2937' }}>{name}</div>
      <div style={{ fontSize: '11px', color: '#6B7280' }}>Port: {port}</div>
      <div style={{ fontSize: '11px', color: '#059669', marginTop: '5px' }}>● {status.toUpperCase()}</div>
      <div style={{ fontSize: '10px', color: '#9CA3AF', marginTop: '5px' }}>{desc}</div>
    </div>
  );
};

const Arrow = ({ direction = 'right' }) => (
  <div style={{ fontSize: '24px', color: '#9CA3AF' }}>
    {direction === 'right' ? '➝' : '💩'}
    {/* Note: Down arrow char might be broken in some fonts, simplifying layout to horizontal/flex-wrap */}
    {direction === 'right' ? '→' : '↓'}
  </div>
);

const DashboardCard = ({ title, desc, url, icon, isExternal }) => (
  <a href={url} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', color: 'inherit' }}>
    <div className="card" style={{
      padding: '25px', display: 'flex', alignItems: 'flex-start', gap: '15px',
      transition: 'transform 0.2s', border: '1px solid #eee'
    }}
      onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-5px)'; e.currentTarget.style.boxShadow = '0 10px 15px -3px rgba(0,0,0,0.1)'; }}
      onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 1px 3px 0 rgba(0,0,0,0.1)'; }}
    >
      <div style={{ fontSize: '40px', background: '#F3F4F6', width: '70px', height: '70px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {icon}
      </div>
      <div>
        <h3 style={{ margin: '0 0 8px 0', color: '#2563EB' }}>
          {title} {isExternal && '↗'}
        </h3>
        <p style={{ margin: 0, color: '#6B7280', lineHeight: '1.5', fontSize: '14px' }}>
          {desc}
        </p>
      </div>
    </div>
  </a>
);

export default MonitoringPage;
