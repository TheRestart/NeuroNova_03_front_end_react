import React from 'react';
import APITester from '../components/APITester';
import { emrAPI } from '../api/apiClient';

function UC02EMRTest() {
  return (
    <div className="container">
      <h1>UC02: EMR (전자의무기록) 테스트</h1>

      <APITester
        title="1. Health Check"
        apiCall={() => emrAPI.healthCheck()}
        paramFields={[]}
      />

      <APITester
        title="2. 환자 목록 조회"
        apiCall={(params) => emrAPI.getPatients(params)}
        defaultParams={{ limit: 10, offset: 0 }}
        paramFields={[
          { name: 'limit', label: '조회 개수', type: 'number', placeholder: '10' },
          { name: 'offset', label: 'Offset', type: 'number', placeholder: '0' },
        ]}
      />

      <APITester
        title="3. 환자 생성"
        apiCall={(params) => emrAPI.createPatient(params)}
        defaultParams={{
          family_name: '',
          given_name: '',
          birth_date: '',
          gender: 'male',
          phone: '',
          email: '',
        }}
        paramFields={[
          { name: 'family_name', label: '성', type: 'text', required: true },
          { name: 'given_name', label: '이름', type: 'text', required: true },
          { name: 'birth_date', label: '생년월일', type: 'date', required: true, description: 'YYYY-MM-DD' },
          {
            name: 'gender',
            label: '성별',
            type: 'select',
            required: true,
            options: [
              { value: 'male', label: '남성' },
              { value: 'female', label: '여성' },
              { value: 'other', label: '기타' },
            ]
          },
          { name: 'phone', label: '전화번호', type: 'text', placeholder: '010-1234-5678' },
          { name: 'email', label: '이메일', type: 'email', placeholder: 'patient@example.com' },
        ]}
      />

      <APITester
        title="4. 진료 기록 목록"
        apiCall={(params) => emrAPI.getEncounters(params)}
        defaultParams={{ limit: 10 }}
        paramFields={[
          { name: 'limit', label: '조회 개수', type: 'number', placeholder: '10' },
          { name: 'patient_id', label: '환자 ID (선택)', type: 'text', description: 'P-2025-000001 형식' },
        ]}
      />

      <APITester
        title="5. 처방 목록"
        apiCall={(params) => emrAPI.getOrders(params)}
        defaultParams={{ limit: 10 }}
        paramFields={[
          { name: 'limit', label: '조회 개수', type: 'number', placeholder: '10' },
        ]}
      />
    </div>
  );
}

export default UC02EMRTest;
