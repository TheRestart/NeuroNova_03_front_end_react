import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { risAPI } from '../api/apiClient';

function ViewerPage() {
  const { studyInstanceUID } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const viewerRef = useRef(null);

  useEffect(() => {
    // OHIF 스크립트 로드 및 초기화 시뮬레이션
    // 실제 OHIF 연동은 복잡하므로, 여기서는 Iframe 또는 Mock UI로 구현
    // OHIF Viewer가 별도 포트(예: 3000/pacs-viewer)에 배포되어 있다면 iframe 사용
    // 현재 아키텍처는 React 내 통합이므로, Cornerstone Image Loader 설정 필요

    // 임시 구현: Cornerstone 초기화 및 이미지 로드 로직은 복잡도가 높으므로
    // 우선 Iframe 방식으로 Orthanc Viewer 또는 OHIF Standalone Viewer 연결 시도

    // TODO: 실제 Cornerstone + OHIF Extension 연동 코드 추가
    // 여기서는 개념 증명(PoC) 레벨의 간단한 뷰어 UI 표시

    const loadViewer = async () => {
      try {
        setLoading(true);
        // DICOM 메타데이터 조회 확인
        const study = await risAPI.getStudy(studyInstanceUID);
        console.log("Loaded Study:", study);

        setTimeout(() => {
          setLoading(false);
        }, 1000);
      } catch (err) {
        console.error("Failed to load study:", err);
        setError("DICOM 데이터를 불러오는데 실패했습니다. Orthanc 서버 상태를 확인하세요.");
        setLoading(false);
      }
    };

    if (studyInstanceUID) {
      loadViewer();
    }
  }, [studyInstanceUID]);

  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
      <div style={{ padding: '10px', background: '#333', color: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <button onClick={() => navigate('/uc05')} style={{ background: 'transparent', border: '1px solid white', color: 'white', padding: '5px 10px', cursor: 'pointer' }}>
          &larr; 돌아가기
        </button>
        <span>NeuroNova PACS Viewer - {studyInstanceUID}</span>
        <span>User: Doctor</span>
      </div>

      <div style={{ flex: 1, background: 'black', position: 'relative', overflow: 'hidden' }}>
        {loading && (
          <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', color: 'white' }}>
            <h2>☢️ DICOM 영상 로딩 중...</h2>
            <p>잠시만 기다려주세요.</p>
          </div>
        )}

        {error && (
          <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', color: '#ff6b6b', textAlign: 'center' }}>
            <h2>⚠️ 로딩 실패</h2>
            <p>{error}</p>
            <button onClick={() => window.location.reload()} style={{ marginTop: '10px', padding: '5px 10px' }}>다시 시도</button>
          </div>
        )}

        {!loading && !error && (
          <div style={{ width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            {/* 실제 OHIF Viewer 캔버스가 들어갈 자리 */}
            {/* 임시 플레이스홀더: Orthanc Stone Web Viewer Iframe */}
            <iframe
              src={`http://localhost:8042/web-viewer/?study=${studyInstanceUID}`}
              title="DICOM Viewer"
              style={{ width: '100%', height: '100%', border: 'none' }}
            // Orthanc가 iframe 허용 설정이 되어있어야 함
            />

            {/* 
               참고: 실제 OHIF React Component 통합은 @ohif/viewer 패키지가 필요하며 
               eject된 create-react-app 설정이 필요할 수 있어 복잡함.
               여기서는 Orthanc Web Viewer를 Iframe으로 임베딩하여 '기능 구현'을 우선 달성함.
               추후 @ohif/viewer 직접 통합으로 고도화 가능.
            */}
          </div>
        )}
      </div>
    </div>
  );
}

export default ViewerPage;
