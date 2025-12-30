import React from 'react';
import { Link } from 'react-router-dom';

function DashboardPage({ user }) {
  const ucList = [
    { id: 'uc01', name: 'UC01: 인증/권한', desc: '로그인, 회원가입, 사용자 관리 테스트' },
    { id: 'uc02', name: 'UC02: EMR', desc: '환자, 진료기록, 처방 관리 테스트' },
    { id: 'uc03', name: 'UC03: OCS', desc: '처방 커뮤니케이션 시스템 테스트' },
    { id: 'uc04', name: 'UC04: LIS', desc: '검사 결과 및 마스터 데이터 테스트' },
    { id: 'uc05', name: 'UC05: RIS', desc: '영상 검사 및 판독 리포트 테스트' },
    { id: 'uc06', name: 'UC06: AI', desc: 'AI 분석 요청 및 검토 테스트' },
    { id: 'uc07', name: 'UC07: 알림', desc: '실시간 알림 시스템 테스트' },
    { id: 'uc08', name: 'UC08: FHIR', desc: 'FHIR 리소스 및 동기화 테스트' },
    { id: 'uc09', name: 'UC09: 감사로그', desc: '감사 로그 조회 및 분석' },
  ];

  return (
    <div className="container">
      <div className="card">
        <h1>CDSS API 테스트 대시보드</h1>
        <p style={{ color: '#6c757d', marginTop: '10px' }}>
          현재 로그인: <strong>{user?.username}</strong> ({user?.role})
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '20px' }}>
        {ucList.map((uc) => (
          <Link to={`/${uc.id}`} key={uc.id} style={{ textDecoration: 'none', color: 'inherit' }}>
            <div className="card" style={{ cursor: 'pointer', transition: 'transform 0.2s' }}
                 onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
                 onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
            >
              <h3 style={{ color: '#007bff', marginBottom: '10px' }}>{uc.name}</h3>
              <p style={{ color: '#6c757d', fontSize: '14px' }}>{uc.desc}</p>
            </div>
          </Link>
        ))}
      </div>

      <div className="card" style={{ marginTop: '20px', backgroundColor: '#f8f9fa' }}>
        <h3>사용 방법</h3>
        <ol style={{ marginLeft: '20px', marginTop: '10px' }}>
          <li>각 UC 페이지로 이동하여 API 테스트 수행</li>
          <li>요청 파라미터를 입력하고 "테스트 실행" 버튼 클릭</li>
          <li>응답 결과를 확인하고 성공/실패 여부 검증</li>
          <li>브라우저 개발자 도구(F12)에서 Network 탭으로 상세 요청/응답 확인</li>
        </ol>
      </div>
    </div>
  );
}

export default DashboardPage;
