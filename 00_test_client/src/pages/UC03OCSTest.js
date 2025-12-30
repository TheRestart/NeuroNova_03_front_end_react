import React from 'react';
import APITester from '../components/APITester';
import { ocsAPI } from '../api/apiClient';

function UC03OCSTest() {
  return (
    <div className="container">
      <h1>UC03: OCS (처방전달시스템) 테스트</h1>

      <APITester
        title="1. 처방 목록 조회"
        apiCall={(params) => ocsAPI.getOrders(params)}
        defaultParams={{ limit: 10, offset: 0 }}
        paramFields={[
          { name: 'limit', label: '조회 개수', type: 'number', placeholder: '10' },
          { name: 'offset', label: 'Offset', type: 'number', placeholder: '0' },
          { name: 'patient_id', label: '환자 ID (선택)', type: 'text', description: 'P-2025-000001 형식' },
        ]}
      />

      <APITester
        title="2. 처방 생성"
        apiCall={(params) => ocsAPI.createOrder(params)}
        defaultParams={{
          patient_id: '',
          encounter_id: '',
          order_type: 'medication',
          medication_name: '',
          dosage: '',
          frequency: '',
          duration_days: '',
          instructions: '',
        }}
        paramFields={[
          { name: 'patient_id', label: '환자 ID', type: 'text', required: true, description: 'P-2025-000001 형식' },
          { name: 'encounter_id', label: '진료 ID', type: 'text', required: true, description: 'E-2025-000001 형식' },
          {
            name: 'order_type',
            label: '처방 타입',
            type: 'select',
            required: true,
            options: [
              { value: 'medication', label: '약물' },
              { value: 'procedure', label: '시술' },
              { value: 'lab', label: '검사' },
              { value: 'imaging', label: '영상' },
            ]
          },
          { name: 'medication_name', label: '약물명', type: 'text', required: true },
          { name: 'dosage', label: '용량', type: 'text', placeholder: '500mg' },
          { name: 'frequency', label: '복용 빈도', type: 'text', placeholder: '1일 3회' },
          { name: 'duration_days', label: '처방 기간 (일)', type: 'number', placeholder: '7' },
          { name: 'instructions', label: '복용 지시사항', type: 'text', placeholder: '식후 30분' },
        ]}
      />

      <APITester
        title="3. 처방 상세 조회"
        apiCall={(params) => ocsAPI.getOrderDetail(params.order_id)}
        defaultParams={{ order_id: '' }}
        paramFields={[
          { name: 'order_id', label: '처방 ID', type: 'text', required: true, description: 'O-2025-000001 형식' },
        ]}
      />

      <APITester
        title="4. 처방 상태 업데이트"
        apiCall={(params) => ocsAPI.updateOrderStatus(params.order_id, { status: params.status })}
        defaultParams={{ order_id: '', status: 'confirmed' }}
        paramFields={[
          { name: 'order_id', label: '처방 ID', type: 'text', required: true },
          {
            name: 'status',
            label: '상태',
            type: 'select',
            required: true,
            options: [
              { value: 'pending', label: '대기' },
              { value: 'confirmed', label: '확인됨' },
              { value: 'in_progress', label: '진행중' },
              { value: 'completed', label: '완료' },
              { value: 'cancelled', label: '취소' },
            ]
          },
        ]}
      />
    </div>
  );
}

export default UC03OCSTest;
