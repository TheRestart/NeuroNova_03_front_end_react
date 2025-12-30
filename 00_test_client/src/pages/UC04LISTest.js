import React from 'react';
import APITester from '../components/APITester';
import { lisAPI } from '../api/apiClient';

function UC04LISTest() {
  return (
    <div className="container">
      <h1>UC04: LIS (검체검사시스템) 테스트</h1>

      <APITester
        title="1. 검사 결과 목록 조회"
        apiCall={(params) => lisAPI.getLabResults(params)}
        defaultParams={{ limit: 10, offset: 0 }}
        paramFields={[
          { name: 'limit', label: '조회 개수', type: 'number', placeholder: '10' },
          { name: 'offset', label: 'Offset', type: 'number', placeholder: '0' },
          { name: 'patient_id', label: '환자 ID (선택)', type: 'text', description: 'P-2025-000001 형식' },
        ]}
      />

      <APITester
        title="2. 검사 결과 생성"
        apiCall={(params) => lisAPI.createLabResult(params)}
        defaultParams={{
          patient_id: '',
          order_id: '',
          test_name: '',
          test_code: '',
          result_value: '',
          unit: '',
          reference_range: '',
          abnormal_flag: 'normal',
        }}
        paramFields={[
          { name: 'patient_id', label: '환자 ID', type: 'text', required: true },
          { name: 'order_id', label: '처방 ID', type: 'text', required: true },
          { name: 'test_name', label: '검사명', type: 'text', required: true, placeholder: '혈당' },
          { name: 'test_code', label: '검사 코드', type: 'text', placeholder: 'GLU' },
          { name: 'result_value', label: '결과값', type: 'text', required: true, placeholder: '95' },
          { name: 'unit', label: '단위', type: 'text', placeholder: 'mg/dL' },
          { name: 'reference_range', label: '참고 범위', type: 'text', placeholder: '70-110 mg/dL' },
          {
            name: 'abnormal_flag',
            label: '이상 여부',
            type: 'select',
            options: [
              { value: 'normal', label: '정상' },
              { value: 'high', label: '높음' },
              { value: 'low', label: '낮음' },
              { value: 'critical', label: '위험' },
            ]
          },
        ]}
      />

      <APITester
        title="3. 검사 결과 상세 조회"
        apiCall={(params) => lisAPI.getLabResultDetail(params.result_id)}
        defaultParams={{ result_id: '' }}
        paramFields={[
          { name: 'result_id', label: '결과 ID', type: 'text', required: true },
        ]}
      />

      <APITester
        title="4. 검사 항목 조회"
        apiCall={() => lisAPI.getTestCatalog()}
        paramFields={[]}
      />
    </div>
  );
}

export default UC04LISTest;
