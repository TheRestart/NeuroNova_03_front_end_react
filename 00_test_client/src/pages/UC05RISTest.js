import React, { useState } from 'react';
import APITester from '../components/APITester';
import { risAPI } from '../api/apiClient';

function UC05RISTest() {
  const [selectedStudy, setSelectedStudy] = useState(null);

  const handleViewInOHIF = (studyInstanceUID) => {
    // OHIF Viewer URL 생성 (Orthanc DICOMweb 기반)
    const ohifViewerUrl = `http://localhost:3000/viewer?StudyInstanceUIDs=${studyInstanceUID}`;
    window.open(ohifViewerUrl, '_blank');
  };

  return (
    <div className="container">
      <h1>UC05: RIS (영상검사시스템) 테스트</h1>

      <div className="alert alert-info" style={{ marginBottom: '20px' }}>
        <h4>📌 Orthanc + OHIF Viewer 연동 안내</h4>
        <p>
          <strong>현재 Orthanc에 업로드된 환자:</strong> sample_dicoms (sub-0004, sub-0005)
        </p>
        <p>
          <strong>OHIF Viewer 접속:</strong> <a href="http://localhost:3000" target="_blank" rel="noopener noreferrer">http://localhost:3000</a>
        </p>
        <p>
          <strong>Orthanc 웹:</strong> <a href="http://localhost:8042" target="_blank" rel="noopener noreferrer">http://localhost:8042</a>
        </p>
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
