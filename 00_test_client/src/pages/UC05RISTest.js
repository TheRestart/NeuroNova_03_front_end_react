import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import APITester from '../components/APITester';
import { risAPI } from '../api/apiClient';
import apiClient from '../api/apiClient';

function UC05RISTest() {
  const navigate = useNavigate();
  const [orthancPatients, setOrthancPatients] = useState([]);
  const [loadingPatients, setLoadingPatients] = useState(false);
  const [patientsError, setPatientsError] = useState(null);

  // Orthanc 환자 목록 로드
  useEffect(() => {
    loadOrthancPatients();
  }, []);

  const loadOrthancPatients = async () => {
    try {
      setLoadingPatients(true);
      setPatientsError(null);

      const response = await apiClient.get('/ris/test/patients/', {
        params: { page: 1, page_size: 10 }
      });

      if (response.data.success) {
        setOrthancPatients(response.data.data.patients || []);
      } else {
        setPatientsError(response.data.message || 'Orthanc 환자 조회 실패');
      }
    } catch (error) {
      console.error('Orthanc patients fetch error:', error);
      setPatientsError(error.message || 'Orthanc 서버 연결 실패');
    } finally {
      setLoadingPatients(false);
    }
  };

  const handleViewImages = (studyInstanceUID) => {
    if (!studyInstanceUID) {
      alert('Study Instance UID가 없습니다.');
      return;
    }
    // DICOM Viewer 페이지로 이동
    navigate(`/viewer/${studyInstanceUID}`);
  };

  const handleViewInOHIF = (studyInstanceUID) => {
    // OHIF Viewer (Internal Route)
    navigate(`/viewer/${studyInstanceUID}`);
  };

  return (
    <div className="container">
      <h1>UC05: RIS (영상검사시스템) 테스트</h1>

      {/* Orthanc 환자 목록 섹션 */}
      <div className="api-tester">
        <h2 className="section-title">🏥 Orthanc 환자 목록 (MRI 포함)</h2>

        {loadingPatients && <p>Loading patients...</p>}

        {patientsError && (
          <div className="error-box">
            <strong>오류:</strong> {patientsError}
            <button
              className="btn btn-secondary"
              onClick={loadOrthancPatients}
              style={{ marginLeft: '10px' }}
            >
              재시도
            </button>
          </div>
        )}

        {!loadingPatients && !patientsError && orthancPatients.length === 0 && (
          <p className="info-box">Orthanc에 등록된 환자가 없습니다.</p>
        )}

        {!loadingPatients && orthancPatients.length > 0 && (
          <div className="orthanc-patients-table">
            <table className="data-table">
              <thead>
                <tr>
                  <th>환자명</th>
                  <th>생년월일</th>
                  <th>성별</th>
                  <th>Study 수</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {orthancPatients.map((patient, index) => (
                  <tr key={patient.patient_id || index}>
                    <td>{patient.patient_name}</td>
                    <td>{patient.patient_birth_date || 'N/A'}</td>
                    <td>{patient.patient_sex || 'N/A'}</td>
                    <td>{patient.study_count}</td>
                    <td>
                      {patient.studies && patient.studies.length > 0 ? (
                        <div>
                          {patient.studies.map((studyId, idx) => (
                            <button
                              key={idx}
                              className="btn btn-primary btn-sm"
                              onClick={() => handleViewInOHIF(studyId)}
                              style={{ marginRight: '5px', marginBottom: '5px' }}
                            >
                              View Study {idx + 1}
                            </button>
                          ))}
                        </div>
                      ) : (
                        <span className="text-muted">No studies</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <APITester
        title="1. 영상 검사 오더 목록 조회"
        apiCall={(params) => risAPI.getRadiologyOrders(params)}
        defaultParams={{ limit: 10, offset: 0 }}
        paramFields={[
          { name: 'limit', label: '조회 개수', type: 'number', placeholder: '10' },
          { name: 'offset', label: 'Offset', type: 'number', placeholder: '0' },
          { name: 'patient_id', label: '환자 ID (선택)', type: 'text' },
        ]}
      />

      <APITester
        title="2. 영상 검사 오더 생성"
        apiCall={(params) => risAPI.createRadiologyOrder(params)}
        defaultParams={{
          patient_id: '',
          order_id: '',
          modality: 'CT',
          body_site: '',
          study_description: '',
        }}
        exampleData={{
          patient_id: 'P-2025-000001',
          order_id: 'O-2025-000001',
          modality: 'MRI',
          body_site: 'Brain',
          study_description: 'Fast MRI for stroke protocol',
        }}
        paramFields={[
          { name: 'patient_id', label: '환자 ID', type: 'text', required: true },
          { name: 'order_id', label: '처방 ID', type: 'text', required: true },
          {
            name: 'modality',
            label: '촬영 방식',
            type: 'select',
            required: true,
            options: [
              { value: 'CT', label: 'CT (컴퓨터 단층촬영)' },
              { value: 'MRI', label: 'MRI (자기공명영상)' },
              { value: 'X-Ray', label: 'X-Ray (엑스레이)' },
              { value: 'US', label: 'US (초음파)' },
              { value: 'PET', label: 'PET (양전자방출단층촬영)' },
            ]
          },
          { name: 'body_site', label: '검사 부위', type: 'text', required: true, placeholder: '뇌' },
          { name: 'study_description', label: '검사 설명', type: 'text', placeholder: 'Brain CT without contrast' },
        ]}
      />

      <APITester
        title="3. Study 목록 조회 (Orthanc 연동)"
        apiCall={(params) => risAPI.getStudies(params)}
        defaultParams={{ limit: 10, offset: 0 }}
        paramFields={[
          { name: 'limit', label: '조회 개수', type: 'number', placeholder: '10' },
          { name: 'offset', label: 'Offset', type: 'number', placeholder: '0' },
        ]}
        renderResult={(result) => {
          if (result && result.data && Array.isArray(result.data.results)) {
            return (
              <div>
                <h4>Study 목록 ({result.data.results.length}개)</h4>
                <table className="table">
                  <thead>
                    <tr>
                      <th>Study ID</th>
                      <th>Patient Name</th>
                      <th>Study Date</th>
                      <th>Modality</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {result.data.results.map((study) => (
                      <tr key={study.study_id}>
                        <td>{study.study_instance_uid || study.study_id}</td>
                        <td>{study.patient_name}</td>
                        <td>{study.study_date}</td>
                        <td>{study.modality}</td>
                        <td>
                          <button
                            className="btn btn-primary btn-sm"
                            onClick={() => handleViewInOHIF(study.study_instance_uid)}
                          >
                            OHIF Viewer로 보기
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            );
          }
          return <pre>{JSON.stringify(result, null, 2)}</pre>;
        }}
      />

      <APITester
        title="4. Study 상세 조회 + OHIF Viewer 열기"
        apiCall={(params) => risAPI.getStudy(params.studyId)}
        defaultParams={{ studyId: '' }}
        paramFields={[
          { name: 'studyId', label: 'Study ID', type: 'text', required: true },
        ]}
        renderResult={(result) => {
          if (result && result.data) {
            const study = result.data;
            return (
              <div>
                <h4>Study 상세 정보</h4>
                <table className="table">
                  <tbody>
                    <tr>
                      <th>Study Instance UID</th>
                      <td>{study.study_instance_uid}</td>
                    </tr>
                    <tr>
                      <th>Patient Name</th>
                      <td>{study.patient_name}</td>
                    </tr>
                    <tr>
                      <th>Study Date</th>
                      <td>{study.study_date}</td>
                    </tr>
                    <tr>
                      <th>Modality</th>
                      <td>{study.modality}</td>
                    </tr>
                    <tr>
                      <th>Series Count</th>
                      <td>{study.num_series}</td>
                    </tr>
                    <tr>
                      <th>Instances Count</th>
                      <td>{study.num_instances}</td>
                    </tr>
                  </tbody>
                </table>
                <button
                  className="btn btn-success"
                  onClick={() => handleViewInOHIF(study.study_instance_uid)}
                >
                  🖼️ OHIF Viewer로 영상 보기
                </button>
              </div>
            );
          }
          return <pre>{JSON.stringify(result, null, 2)}</pre>;
        }}
      />

      <APITester
        title="5. 판독 보고서 작성"
        apiCall={(params) => risAPI.createReport({
          study: params.studyId,
          findings: params.findings,
          impression: params.impression,
          status: 'FINAL'
        })}
        defaultParams={{
          studyId: '',
          findings: '',
          impression: '',
        }}
        paramFields={[
          { name: 'studyId', label: 'Study ID', type: 'text', required: true },
          { name: 'findings', label: '소견', type: 'text', required: true, placeholder: '뇌실질에 특이 소견 없음' },
          { name: 'impression', label: '판독 결과', type: 'text', required: true, placeholder: 'Normal brain CT' },
        ]}
      />
    </div>
  );
}

export default UC05RISTest;
