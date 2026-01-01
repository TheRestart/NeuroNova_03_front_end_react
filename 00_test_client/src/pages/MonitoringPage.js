import React, { useState, useEffect } from 'react';
import APITester from '../components/APITester';
import { monitoringAPI } from '../api/apiClient';

function MonitoringPage() {
  const [activeTab, setActiveTab] = useState('status');
  const [refreshKey, setRefreshKey] = useState(0);

  const handleRefresh = () => {
    setRefreshKey(prev => prev + 1);
  };

  const services = [
    { name: 'Prometheus', port: 9090, url: 'http://localhost:9090', icon: '📈' },
    { name: 'Grafana', port: 3000, url: 'http://localhost:3000', icon: '📊' },
    { name: 'Alertmanager', port: 9093, url: 'http://localhost:9093', icon: '🚨' },
  ];

  return (
    <div className="container" style={{ padding: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h1>🖥️ 시스템 모니터링</h1>
        <button onClick={handleRefresh} className="btn-primary">
          🔄 새로고침
        </button>
      </div>

      <div className="tabs" style={{ marginBottom: '20px', borderBottom: '1px solid #ddd' }}>
        <button
          onClick={() => setActiveTab('status')}
          style={{
            padding: '10px 20px',
            border: 'none',
            background: activeTab === 'status' ? '#007bff' : 'transparent',
            color: activeTab === 'status' ? 'white' : 'black',
            cursor: 'pointer',
            borderRadius: '5px 5px 0 0'
          }}
        >
          시스템 상태
        </button>
        <button
          onClick={() => setActiveTab('dashboards')}
          style={{
            padding: '10px 20px',
            border: 'none',
            background: activeTab === 'dashboards' ? '#007bff' : 'transparent',
            color: activeTab === 'dashboards' ? 'white' : 'black',
            cursor: 'pointer',
            borderRadius: '5px 5px 0 0'
          }}
        >
          Grafana 대시보드
        </button>
      </div>

      {activeTab === 'status' && (
        <div>
          <div className="status-cards" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px', marginBottom: '30px' }}>
            {services.map((service, index) => (
              <div key={index} className="card" style={{ padding: '20px', border: '1px solid #eee', borderRadius: '10px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
                <h3>{service.icon} {service.name}</h3>
                <p>Port: {service.port}</p>
                <div style={{ marginTop: '15px' }}>
                  <a href={service.url} target="_blank" rel="noopener noreferrer" className="btn-secondary" style={{ textDecoration: 'none', display: 'block', textAlign: 'center' }}>
                    웹 UI 열기 ↗
                  </a>
                </div>
              </div>
            ))}
          </div>

          <APITester
            key={`health-${refreshKey}`} // Force re-mount on refresh
            title="🔍 통합 헬스 체크"
            apiCall={() => monitoringAPI.checkAllHealth()}
            paramFields={[]}
          />
        </div>
      )}

      {activeTab === 'dashboards' && (
        <div className="dashboards">
           <div className="alert-box info">
             <p>ℹ️ Grafana 대시보드는 보안 설정(X-Frame-Options)으로 인해 임베딩이 차단될 수 있습니다. 아래 링크를 통해 직접 접속하세요.</p>
           </div>
           
           <div style={{ marginTop: '20px' }}>
             <h3>추천 대시보드</h3>
             <ul style={{ listStyle: 'none', padding: 0 }}>
               <li style={{ marginBottom: '10px' }}>
                 <a href="http://localhost:3000/d/neuronova-system" target="_blank" rel="noopener noreferrer" style={{ fontSize: '1.2em' }}>
                   📊 NeuroNova 시스템 상태 요약
                 </a>
               </li>
               <li style={{ marginBottom: '10px' }}>
                 <a href="http://localhost:3000/d/neuronova-ai" target="_blank" rel="noopener noreferrer" style={{ fontSize: '1.2em' }}>
                   🧠 AI 작업 처리 현황
                 </a>
               </li>
               <li style={{ marginBottom: '10px' }}>
                 <a href="http://localhost:3000/d/neuronova-db" target="_blank" rel="noopener noreferrer" style={{ fontSize: '1.2em' }}>
                   💾 데이터베이스 성능 모니터링
                 </a>
               </li>
             </ul>
           </div>
        </div>
      )}
    </div>
  );
}

export default MonitoringPage;
