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
        title="2. 알림 생성 (관리자/시스템)"
        apiCall={(params) => alertAPI.createAlert(params)}
        defaultParams={{
          title: '',
          message: '',
          severity: 'INFO',
          user: '',
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
              { value: 'INFO', label: '정보' },
              { value: 'WARNING', label: '경고' },
              { value: 'CRITICAL', label: '위험' },
            ]
          },
          { name: 'user', label: '대상 사용자 ID (선택)', type: 'text', description: '특정 사용자에게만 전송' },
        ]}
      />

      <APITester
        title="3. 알림 상세 조회"
        apiCall={(params) => alertAPI.getAlert(params.alert_id)}
        defaultParams={{ alert_id: '' }}
        paramFields={[
          { name: 'alert_id', label: '알림 ID', type: 'text', required: true },
        ]}
      />

      <APITester
        title="4. 알림 수정 (상태 변경 등)"
        apiCall={(params) => alertAPI.updateAlert(params.alert_id, { read: params.read })}
        defaultParams={{ alert_id: '', read: true }}
        paramFields={[
          { name: 'alert_id', label: '알림 ID', type: 'text', required: true },
          { name: 'read', label: '읽음 처리', type: 'checkbox' },
        ]}
      />

      <APITester
        title="5. 전체 브로드캐스트 전송 (WebSocket)"
        apiCall={(params) => alertAPI.sendBroadcast(params)}
        defaultParams={{
          message: '',
          severity: 'INFO',
        }}
        paramFields={[
          { name: 'message', label: '메시지', type: 'text', required: true },
          {
            name: 'severity',
            label: '중요도',
            type: 'select',
            required: true,
            options: [
              { value: 'INFO', label: '정보' },
              { value: 'WARNING', label: '경고' },
              { value: 'CRITICAL', label: '위험' },
            ]
          },
        ]}
      />

      <APITester
        title="6. 알림 채널 생성"
        apiCall={(params) => alertAPI.createChannel(params)}
        defaultParams={{
          name: '',
          channel_type: 'websocket',
        }}
        paramFields={[
          { name: 'name', label: '채널 명', type: 'text', required: true },
          {
            name: 'channel_type',
            label: '채널 타입',
            type: 'select',
            required: true,
            options: [
              { value: 'websocket', label: 'WebSocket' },
              { value: 'email', label: 'Email' },
              { value: 'sms', label: 'SMS' },
            ]
          },
        ]}
      />
    </div>
  );
}

export default UC07AlertTest;
