import React, { useState, useEffect } from 'react';
import apiClient from '../api/apiClient';
import './PatientDicomMappingPage.css';

/**
 * Patient-DICOM 매핑 관리 페이지
 *
 * 기능:
 * 1. Orthanc에서 DICOM Study 동기화 (RadiologyStudy 생성)
 * 2. 매칭되지 않은 Study 조회
 * 3. 수동 환자 매핑
 * 4. FHIR ImagingStudy 변환 및 동기화 상태 확인
 */
function PatientDicomMappingPage() {
  const [syncStatus, setSyncStatus] = useState({ synced_count: 0, total: 0 });
  const [unmatchedStudies, setUnmatchedStudies] = useState([]);
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedStudy, setSelectedStudy] = useState(null);
  const [selectedPatient, setSelectedPatient] = useState('');

  // 1. Orthanc Studies 동기화 (P-006 Fix: Timeout 처리 추가)
  const handleSyncStudies = async () => {
    try {
      setLoading(true);
      setError(null);

      // 긴 작업을 위한 긴 타임아웃 설정 (60초)
      const response = await apiClient.post('/ris/sync/', {}, {
        timeout: 60000 // 60초 타임아웃
      });

      if (response.data.success) {
        setSyncStatus(response.data.data);
        alert(`동기화 완료: ${response.data.data.synced_count}/${response.data.data.total} studies`);
        loadUnmatchedStudies(); // 동기화 후 매칭 안 된 Study 조회
      } else {
        throw new Error(response.data.message || '동기화 실패');
      }
    } catch (err) {
      console.error('Sync error:', err);

      // P-006 Fix: 타임아웃 발생 시 사용자 친화적 메시지
      if (err.code === 'ECONNABORTED' || err.message.includes('timeout')) {
        setError(
          '⚠️ 동기화 작업이 타임아웃되었습니다.\n' +
          '작업은 백그라운드에서 계속 진행됩니다.\n' +
          '잠시 후 "새로고침" 버튼을 눌러 결과를 확인하세요.'
        );
        // 30초 후 자동으로 결과 확인 시도
        setTimeout(() => {
          loadUnmatchedStudies();
        }, 30000);
      } else {
        setError(err.message || 'Orthanc 동기화 중 오류 발생');
      }
    } finally {
      setLoading(false);
    }
  };

  // 2. 매칭되지 않은 Studies 조회
  const loadUnmatchedStudies = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await apiClient.get('/ris/studies/', {
        params: { unmatched: true, limit: 50 }
      });

      if (response.data && response.data.results) {
        setUnmatchedStudies(response.data.results);
      }
    } catch (err) {
      console.error('Load unmatched studies error:', err);
      setError('매칭 안 된 Study 조회 실패');
    } finally {
      setLoading(false);
    }
  };

  // 3. 환자 목록 조회 (매핑용)
  const loadPatients = async () => {
    try {
      const response = await apiClient.get('/emr/patients/', {
        params: { limit: 100 }
      });

      if (response.data && response.data.results) {
        setPatients(response.data.results);
      }
    } catch (err) {
      console.error('Load patients error:', err);
    }
  };

  // 4. 수동 환자 매핑
  const handleManualMapping = async () => {
    if (!selectedStudy || !selectedPatient) {
      alert('Study와 환자를 모두 선택하세요');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const response = await apiClient.patch(`/ris/studies/${selectedStudy.study_id}/`, {
        patient_id: selectedPatient
      });

      if (response.data) {
        alert('환자 매핑 완료!');
        setSelectedStudy(null);
        setSelectedPatient('');
        loadUnmatchedStudies(); // 목록 새로고침
      }
    } catch (err) {
      console.error('Manual mapping error:', err);
      setError('수동 매핑 실패');
    } finally {
      setLoading(false);
    }
  };

  // 5. FHIR ImagingStudy 변환 테스트
  const handleFHIRConversion = async (study) => {
    try {
      setLoading(true);
      setError(null);

      // FHIR 변환 API 호출 (추후 구현)
      const response = await apiClient.post(`/fhir/convert/imaging-study/`, {
        study_id: study.study_id
      });

      if (response.data) {
        alert('FHIR ImagingStudy 변환 성공!\n\n' + JSON.stringify(response.data, null, 2));
      }
    } catch (err) {
      console.error('FHIR conversion error:', err);
      setError('FHIR 변환 실패 (API 미구현 가능)');
    } finally {
      setLoading(false);
    }
  };

  // 초기 로드
  useEffect(() => {
    loadUnmatchedStudies();
    loadPatients();
  }, []);

  return (
    <div className="container patient-dicom-mapping-page">
      <h1>🔗 Patient-DICOM-FHIR 매핑 관리</h1>

      {/* 에러 메시지 */}
      {error && (
        <div className="error-box">
          <strong>오류:</strong> {error}
        </div>
      )}

      {/* 1. Orthanc 동기화 섹션 */}
      <div className="section-card">
        <h2>📥 Orthanc DICOM Studies 동기화</h2>
        <p className="section-description">
          Orthanc PACS에서 DICOM Study 메타데이터를 가져와 Django DB에 저장하고 환자 자동 매칭을 수행합니다.
        </p>

        <div className="sync-status">
          <div className="stat-item">
            <span className="stat-label">마지막 동기화:</span>
            <span className="stat-value">{syncStatus.synced_count} / {syncStatus.total} studies</span>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            className="btn btn-primary btn-large"
            onClick={handleSyncStudies}
            disabled={loading}
          >
            {loading ? '동기화 중...' : '🔄 Orthanc Studies 동기화'}
          </button>
          <button
            className="btn btn-secondary btn-large"
            onClick={loadUnmatchedStudies}
            disabled={loading}
          >
            ♻️ 새로고침
          </button>
        </div>

        <div className="info-box" style={{ marginTop: '15px' }}>
          <strong>자동 매칭 알고리즘 (3단계):</strong>
          <ol>
            <li>Exact ID Match: PatientCache.patient_id 정확히 일치</li>
            <li>Substring Match: '0005' → 'P-2025-005' 포함 검색</li>
            <li>Name Match: 성명 기반 Fallback 매칭</li>
          </ol>
        </div>
      </div>

      {/* 2. 매칭되지 않은 Studies */}
      <div className="section-card">
        <h2>⚠️ 환자 매칭 안 된 DICOM Studies ({unmatchedStudies.length})</h2>

        {unmatchedStudies.length === 0 ? (
          <p className="success-box">모든 Study가 환자와 매칭되었습니다! ✅</p>
        ) : (
          <>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Study UID</th>
                  <th>환자명 (DICOM)</th>
                  <th>Study Date</th>
                  <th>Modality</th>
                  <th>Series/Instances</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {unmatchedStudies.map((study) => (
                  <tr key={study.study_id} className={selectedStudy?.study_id === study.study_id ? 'selected-row' : ''}>
                    <td title={study.study_instance_uid}>
                      {study.study_instance_uid.slice(0, 20)}...
                    </td>
                    <td>{study.patient_name || 'Unknown'}</td>
                    <td>{study.study_date || 'N/A'}</td>
                    <td>{study.modality || 'N/A'}</td>
                    <td>{study.num_series} / {study.num_instances}</td>
                    <td>
                      <button
                        className="btn btn-sm btn-secondary"
                        onClick={() => setSelectedStudy(study)}
                      >
                        수동 매핑
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        )}
      </div>

      {/* 3. 수동 매핑 패널 */}
      {selectedStudy && (
        <div className="section-card manual-mapping-panel">
          <h2>🔧 수동 환자 매핑</h2>

          <div className="mapping-details">
            <div className="selected-study">
              <h3>선택된 Study:</h3>
              <p><strong>Patient Name (DICOM):</strong> {selectedStudy.patient_name}</p>
              <p><strong>Study UID:</strong> {selectedStudy.study_instance_uid}</p>
              <p><strong>Date:</strong> {selectedStudy.study_date}</p>
            </div>

            <div className="patient-selector">
              <h3>매핑할 환자 선택:</h3>
              <select
                value={selectedPatient}
                onChange={(e) => setSelectedPatient(e.target.value)}
                className="form-select"
              >
                <option value="">-- 환자 선택 --</option>
                {patients.map((patient) => (
                  <option key={patient.patient_id} value={patient.patient_id}>
                    {patient.patient_id} - {patient.family_name} {patient.given_name} ({patient.ssn})
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="mapping-actions">
            <button
              className="btn btn-primary"
              onClick={handleManualMapping}
              disabled={!selectedPatient || loading}
            >
              ✅ 매핑 저장
            </button>
            <button
              className="btn btn-secondary"
              onClick={() => {
                setSelectedStudy(null);
                setSelectedPatient('');
              }}
            >
              ❌ 취소
            </button>
          </div>
        </div>
      )}

      {/* 4. FHIR 변환 정보 */}
      <div className="section-card">
        <h2>🌐 FHIR ImagingStudy 변환</h2>
        <p className="section-description">
          RadiologyStudy → FHIR ImagingStudy 리소스 변환 및 HAPI FHIR 서버 동기화
        </p>

        <div className="info-box">
          <strong>구현된 Converter:</strong>
          <ul>
            <li>✅ <code>ImagingStudyConverter.to_fhir()</code> - FHIR R4 표준 준수</li>
            <li>✅ StudyInstanceUID → DICOM UID 변환</li>
            <li>✅ WADO-RS Endpoint 자동 생성</li>
            <li>✅ Patient Reference 자동 연결</li>
          </ul>
        </div>

        <p style={{ marginTop: '15px', color: '#666' }}>
          <strong>참조:</strong> <code>fhir/converters_extended.py:306-376</code>
        </p>
      </div>

      {/* 5. 통계 및 매핑 체인 */}
      <div className="section-card">
        <h2>📊 Patient-DICOM-FHIR 매핑 체인</h2>

        <div className="mapping-chain">
          <div className="chain-step">
            <div className="step-number">1</div>
            <h3>Patient ↔ DICOM</h3>
            <p>RadiologyStudyService.sync_studies_from_orthanc()</p>
            <span className="status-badge success">구현 완료</span>
          </div>

          <div className="chain-arrow">→</div>

          <div className="chain-step">
            <div className="step-number">2</div>
            <h3>DICOM → FHIR</h3>
            <p>ImagingStudyConverter.to_fhir()</p>
            <span className="status-badge success">구현 완료</span>
          </div>

          <div className="chain-arrow">→</div>

          <div className="chain-step">
            <div className="step-number">3</div>
            <h3>FHIR Sync</h3>
            <p>HAPI FHIR Server Outbox Pattern</p>
            <span className="status-badge warning">검증 필요</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PatientDicomMappingPage;
