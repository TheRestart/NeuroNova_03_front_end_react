/**
 * OHIF Viewer Page
 *
 * Orthanc의 DICOM 이미지를 OHIF Viewer로 시각화
 * Django Proxy를 통해 안전하게 Orthanc에 접근
 */

import React, { useEffect, useRef, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './ViewerPage.css';

function ViewerPage() {
  const { studyInstanceUID } = useParams();
  const navigate = useNavigate();
  const viewerContainerRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const displayStudyInfo = (metadata) => {
    if (!viewerContainerRef.current || !metadata || metadata.length === 0) return;

    const firstInstance = metadata[0];
    const studyInfo = {
      patientName: firstInstance['00100010']?.Value?.[0]?.Alphabetic || 'Unknown',
      patientID: firstInstance['00100020']?.Value?.[0] || 'Unknown',
      studyDate: firstInstance['00080020']?.Value?.[0] || 'Unknown',
      studyDescription: firstInstance['00081030']?.Value?.[0] || 'No description',
      modality: firstInstance['00080060']?.Value?.[0] || 'Unknown',
      instanceCount: metadata.length
    };

    viewerContainerRef.current.innerHTML = `
      <div class="study-info-panel">
        <h2>Study Information</h2>
        <div class="info-row">
          <span class="label">환자명:</span>
          <span class="value">${studyInfo.patientName}</span>
        </div>
        <div class="info-row">
          <span class="label">환자 ID:</span>
          <span class="value">${studyInfo.patientID}</span>
        </div>
        <div class="info-row">
          <span class="label">검사일:</span>
          <span class="value">${studyInfo.studyDate}</span>
        </div>
        <div class="info-row">
          <span class="label">검사 설명:</span>
          <span class="value">${studyInfo.studyDescription}</span>
        </div>
        <div class="info-row">
          <span class="label">Modality:</span>
          <span class="value">${studyInfo.modality}</span>
        </div>
        <div class="info-row">
          <span class="label">Instance 수:</span>
          <span class="value">${studyInfo.instanceCount}</span>
        </div>
        <div class="info-notice">
          <strong>Note:</strong> OHIF Viewer의 전체 기능을 사용하려면 <code>npm install</code>을 실행하여 필요한 패키지를 설치해주세요.
        </div>
      </div>
    `;
  };

  useEffect(() => {
    if (!studyInstanceUID) {
      setError('Study Instance UID가 필요합니다.');
      setLoading(false);
      return;
    }

    // Iframe 로드 시 로딩 해제 (약간의 지연)
    setTimeout(() => setLoading(false), 1000);

    // Auth Token이 필요하다면 URL 파라미터로 전달해야 함 (OpenID Connect 등이 아니면 헤더 주입 불가)
    // 현재는 Orthanc Direct Access (Public in dev?) 또는 Nginx Proxy가 쿠키 허용 여부 확인 필요
    // 여기서는 단순 Iframe 로드로 처리 (SAML/OIDC 없으므로)
  }, [studyInstanceUID]);

  const handleClose = () => {
    navigate('/uc05'); // RIS 테스트 페이지로 돌아가기
  };

  return (
    <div className="viewer-page">
      <div className="viewer-header">
        <h1>DICOM Viewer</h1>
        <button className="btn-close" onClick={handleClose}>
          ← 목록으로 돌아가기
        </button>
      </div>

      {loading && (
        <div className="viewer-loading">
          <div className="spinner"></div>
          <p>Loading study...</p>
        </div>
      )}

      {error && (
        <div className="viewer-error">
          <h2>오류 발생</h2>
          <p>{error}</p>
          <button className="btn" onClick={handleClose}>
            목록으로 돌아가기
          </button>
        </div>
      )}

      {!loading && !error && (
        <div className="viewer-container" ref={viewerContainerRef} style={{ height: 'calc(100vh - 100px)', width: '100%' }}>
          {/* OHIF Viewer Iframe Integration */}
          <iframe
            src={`http://localhost/pacs-viewer/viewer?StudyInstanceUIDs=${studyInstanceUID}`}
            title="OHIF Viewer"
            width="100%"
            height="100%"
            style={{ border: 'none' }}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          />
        </div>
      )}
    </div>
  );
}

export default ViewerPage;
