import React from 'react';
import APITester from '../components/APITester';
import { alertAPI } from '../api/apiClient';

function UC07AlertTest() {
  return (
    <div className="container">
      <h1>UC07: 알림 및 이벤트 관리 테스트</h1>

      <APITester
        title="1. 내 알림 목록 조회"
        apiCall={(params) => alertAPI.getMyAlerts(params)}
        defaultParams={{
          limit: 10,
          offset: 0,
          read: '',
        }}
        paramFields={[
          { name: 'limit', label: '조회 개수', type: 'number', placeholder: '10' },
          { name: 'offset', label: 'Offset', type: 'number', placeholder: '0' },
          {
            name: 'read',
            label: '읽음 상태',
            type: 'select',
            options: [
              { value: '', label: '전체' },
              { value: 'true', label: '읽음' },
              { value: 'false', label: '읽지 않음' },
            ]
          },
        ]}
      />

      <APITester
        title="2. 알림 생성 (관리자 전용)"
        apiCall={(params) => alertAPI.createAlert(params)}
        defaultParams={{
          title: '',
          message: '',
          severity: 'info',
          target_user_id: '',
          target_role: '',
        }}
        paramFields={[
          { name: 'title', label: '제목', type: 'text', required: true },
          { name: 'message', label: '메시지', type: 'text', required: true },
          {
            name: 'severity',
            label: '중요도',
            type: 'select',
            required: true,
            options: [
              { value: 'info', label: '정보' },
              { value: 'warning', label: '경고' },
              { value: 'critical', label: '위험' },
              { value: 'emergency', label: '긴급' },
            ]
          },
          { name: 'target_user_id', label: '대상 사용자 ID (선택)', type: 'text', description: '특정 사용자에게만 전송' },
          { name: 'target_role', label: '대상 역할 (선택)', type: 'text', placeholder: 'doctor, nurse, admin', description: '특정 역할 모두에게 전송' },
        ]}
      />

      <APITester
        title="3. 알림 읽음 처리"
        apiCall={(params) => alertAPI.markAsRead(params.alert_id)}
        defaultParams={{ alert_id: '' }}
        paramFields={[
          { name: 'alert_id', label: '알림 ID', type: 'text', required: true },
        ]}
      />

      <APITester
        title="4. 읽지 않은 알림 개수"
        apiCall={() => alertAPI.getUnreadCount()}
        paramFields={[]}
      />

      <APITester
        title="5. 시스템 이벤트 조회 (관리자 전용)"
        apiCall={(params) => alertAPI.getSystemEvents(params)}
        defaultParams={{
          limit: 20,
          event_type: '',
        }}
        paramFields={[
          { name: 'limit', label: '조회 개수', type: 'number', placeholder: '20' },
          {
            name: 'event_type',
            label: '이벤트 타입',
            type: 'select',
            options: [
              { value: '', label: '전체' },
              { value: 'patient_admitted', label: '환자 입원' },
              { value: 'critical_result', label: '위험 검사 결과' },
              { value: 'ai_alert', label: 'AI 경고' },
              { value: 'system_error', label: '시스템 오류' },
            ]
          },
        ]}
      />

      <APITester
        title="6. 위험 검사 결과 알림 (자동 발생)"
        apiCall={(params) => alertAPI.triggerCriticalLabAlert(params)}
        defaultParams={{
          patient_id: '',
          test_name: '',
          result_value: '',
        }}
        paramFields={[
          { name: 'patient_id', label: '환자 ID', type: 'text', required: true },
          { name: 'test_name', label: '검사명', type: 'text', required: true, placeholder: 'Troponin I' },
          { name: 'result_value', label: '결과값', type: 'text', required: true, placeholder: '15.2 ng/mL' },
        ]}
      />
    </div>
  );
}

export default UC07AlertTest;
