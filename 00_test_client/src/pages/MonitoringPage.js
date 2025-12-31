import React from 'react';

const MonitoringPage = () => {
    const services = [
        { name: 'Grafana', url: 'http://localhost:3002', desc: '시스템 시각화 (Dashboards)', icon: '📊', creds: 'admin / admin123' },
        { name: 'Prometheus', url: 'http://localhost:9090', desc: '메트릭 수집', icon: '📈' },
        { name: 'cAdvisor', url: 'http://localhost:8081', desc: '컨테이너 리소스 모니터링', icon: '🐳' },
        { name: 'Flower (Celery)', url: 'http://localhost:5555', desc: 'Celery 워커 모니터링', icon: '🌸' },
        { name: 'Adminer', url: 'http://localhost:8083', desc: 'MySQL DB 관리', icon: '🐬', creds: 'root / root' },
        { name: 'Redis Commander', url: 'http://localhost:8082', desc: 'Redis 캐시 관리', icon: '🔴' },
        { name: 'Orthanc', url: 'http://localhost:8042', desc: 'PACS 서버 (DICOM)', icon: '🏥', creds: 'admin / admin123' },
        { name: 'HAPI FHIR', url: 'http://localhost:8080', desc: 'FHIR R4 서버', icon: '🔥' },
        { name: 'Django Admin', url: 'http://localhost:8000/admin', desc: '백엔드 Admin', icon: '🔧', creds: 'admin / admin123' },
        { name: 'Nginx Status', url: 'http://localhost/stub_status', desc: '웹서버 상태', icon: '🌐' },
    ];

    return (
        <div style={{ padding: '20px' }}>
            <h2>🖥️ 시스템 모니터링 및 관리 대시보드</h2>
            <p>실행 중인 14개 마이크로서비스 상태 및 관리자 패널 바로가기</p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px', marginTop: '20px' }}>
                {services.map((svc, idx) => (
                    <div key={idx} style={{
                        border: '1px solid #ddd',
                        borderRadius: '10px',
                        padding: '20px',
                        textAlign: 'center',
                        boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                        backgroundColor: '#fff',
                        transition: 'transform 0.2s'
                    }}>
                        <div style={{ fontSize: '3rem', marginBottom: '10px' }}>{svc.icon}</div>
                        <h3>{svc.name}</h3>
                        <p style={{ color: '#666', fontSize: '0.9rem', marginBottom: '10px' }}>{svc.desc}</p>
                        {svc.creds && (
                            <div style={{ marginBottom: '15px', fontSize: '0.8rem', backgroundColor: '#f0f0f0', padding: '5px', borderRadius: '4px' }}>
                                🔑 {svc.creds}
                            </div>
                        )}

                        <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
                            <a href={svc.url} target="_blank" rel="noopener noreferrer"
                                style={{
                                    display: 'inline-block',
                                    padding: '8px 16px',
                                    backgroundColor: '#007bff',
                                    color: 'white',
                                    textDecoration: 'none',
                                    borderRadius: '5px',
                                    fontSize: '0.9rem'
                                }}>
                                Open Console ↗️
                            </a>
                            {svc.name === 'Grafana' && (
                                <button style={{
                                    padding: '8px 16px',
                                    backgroundColor: '#28a745',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '5px',
                                    cursor: 'pointer',
                                    fontSize: '0.9rem'
                                }} onClick={() => alert('Grafana 임베딩 기능 준비 중')}>
                                    Embed View
                                </button>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            <div style={{ marginTop: '40px', padding: '20px', backgroundColor: '#f8f9fa', borderRadius: '10px' }}>
                <h3>🔍 서비스 연결 상태 확인 (Health Check)</h3>
                <p>각 서비스 포트로의 연결 상태를 실시간으로 확인합니다. (구현 예정)</p>
            </div>
        </div>
    );
};

export default MonitoringPage;
