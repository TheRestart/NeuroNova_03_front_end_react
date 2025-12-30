import React from 'react';
import APITester from '../components/APITester';
import { risAPI } from '../api/apiClient';

function UC05RISTest() {
  return (
    <div className="container">
      <h1>UC05: RIS (영상검사시스템) 테스트</h1>

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
      />

      <APITester
        title="4. Study 상세 조회"
        apiCall={(params) => risAPI.getStudy(params.studyId)}
        defaultParams={{ studyId: '' }}
        paramFields={[
          { name: 'studyId', label: 'Study ID', type: 'text', required: true },
        ]}
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
