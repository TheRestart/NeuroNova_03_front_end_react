import React from 'react';
import APITester from '../components/APITester';
import { fhirAPI } from '../api/apiClient';

function UC08FHIRTest() {
  return (
    <div className="container">
      <h1>UC08: FHIR R4 표준 인터페이스 테스트</h1>

      <APITester
        title="1. FHIR 메타데이터 조회"
        apiCall={() => fhirAPI.getMetadata()}
        paramFields={[]}
      />

      <APITester
        title="2. Patient 리소스 검색"
        apiCall={(params) => fhirAPI.searchPatients(params)}
        defaultParams={{
          family: '',
          given: '',
          birthdate: '',
          _count: 10,
        }}
        paramFields={[
          { name: 'family', label: '성 (Family Name)', type: 'text', placeholder: 'Kim' },
          { name: 'given', label: '이름 (Given Name)', type: 'text', placeholder: 'Minsoo' },
          { name: 'birthdate', label: '생년월일', type: 'date', description: 'YYYY-MM-DD' },
          { name: '_count', label: '결과 개수', type: 'number', placeholder: '10' },
        ]}
      />

      <APITester
        title="3. Patient 리소스 조회"
        apiCall={(params) => fhirAPI.getPatient(params.patient_id)}
        defaultParams={{ patient_id: '' }}
        paramFields={[
          { name: 'patient_id', label: 'Patient ID', type: 'text', required: true, description: 'FHIR 리소스 ID' },
        ]}
      />

      <APITester
        title="4. Observation 리소스 검색"
        apiCall={(params) => fhirAPI.searchObservations(params)}
        defaultParams={{
          patient: '',
          code: '',
          date: '',
          _count: 10,
        }}
        paramFields={[
          { name: 'patient', label: 'Patient ID', type: 'text', description: 'FHIR 리소스 ID' },
          { name: 'code', label: '관찰 코드', type: 'text', placeholder: '8480-6 (수축기 혈압)' },
          { name: 'date', label: '날짜', type: 'date', description: 'YYYY-MM-DD' },
          { name: '_count', label: '결과 개수', type: 'number', placeholder: '10' },
        ]}
      />

      <APITester
        title="5. Condition 리소스 검색"
        apiCall={(params) => fhirAPI.searchConditions(params)}
        defaultParams={{
          patient: '',
          code: '',
          _count: 10,
        }}
        paramFields={[
          { name: 'patient', label: 'Patient ID', type: 'text', description: 'FHIR 리소스 ID' },
          { name: 'code', label: '진단 코드', type: 'text', placeholder: 'I63.9 (뇌경색)' },
          { name: '_count', label: '결과 개수', type: 'number', placeholder: '10' },
        ]}
      />

      <APITester
        title="6. MedicationRequest 리소스 검색"
        apiCall={(params) => fhirAPI.searchMedicationRequests(params)}
        defaultParams={{
          patient: '',
          status: '',
          _count: 10,
        }}
        paramFields={[
          { name: 'patient', label: 'Patient ID', type: 'text', description: 'FHIR 리소스 ID' },
          {
            name: 'status',
            label: '상태',
            type: 'select',
            options: [
              { value: '', label: '전체' },
              { value: 'active', label: 'Active' },
              { value: 'completed', label: 'Completed' },
              { value: 'cancelled', label: 'Cancelled' },
            ]
          },
          { name: '_count', label: '결과 개수', type: 'number', placeholder: '10' },
        ]}
      />

      <APITester
        title="7. DiagnosticReport 리소스 검색"
        apiCall={(params) => fhirAPI.searchDiagnosticReports(params)}
        defaultParams={{
          patient: '',
          category: '',
          _count: 10,
        }}
        paramFields={[
          { name: 'patient', label: 'Patient ID', type: 'text', description: 'FHIR 리소스 ID' },
          {
            name: 'category',
            label: '카테고리',
            type: 'select',
            options: [
              { value: '', label: '전체' },
              { value: 'LAB', label: 'Laboratory' },
              { value: 'RAD', label: 'Radiology' },
              { value: 'PATH', label: 'Pathology' },
            ]
          },
          { name: '_count', label: '결과 개수', type: 'number', placeholder: '10' },
        ]}
      />

      <APITester
        title="8. Bundle 생성 (Transaction)"
        apiCall={(params) => fhirAPI.createBundle(JSON.parse(params.bundle))}
        defaultParams={{
          bundle: JSON.stringify({
            resourceType: 'Bundle',
            type: 'transaction',
            entry: [
              {
                request: { method: 'POST', url: 'Patient' },
                resource: {
                  resourceType: 'Patient',
                  name: [{ family: 'Test', given: ['Bundle'] }],
                  gender: 'unknown',
                }
              }
            ]
          }, null, 2)
        }}
        paramFields={[
          { name: 'bundle', label: 'FHIR Bundle JSON', type: 'text', required: true, description: 'JSON 형식' },
        ]}
      />

      <APITester
        title="9. FHIR 서버 헬스 체크"
        apiCall={() => fhirAPI.healthCheck()}
        paramFields={[]}
      />
    </div>
  );
}

export default UC08FHIRTest;
