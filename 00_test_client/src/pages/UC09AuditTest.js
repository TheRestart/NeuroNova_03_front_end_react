import React from 'react';
import APITester from '../components/APITester';
import { auditAPI } from '../api/apiClient';

function UC09AuditTest() {
  return (
    <div className="container">
      <h1>UC09: 감사 로그 및 보안 테스트</h1>

      <APITester
        title="1. 감사 로그 목록 조회"
        apiCall={(params) => auditAPI.getLogs(params)}
        defaultParams={{ limit: 20, offset: 0 }}
        paramFields={[
          { name: 'limit', label: '조회 개수', type: 'number', placeholder: '20' },
          { name: 'offset', label: 'Offset', type: 'number', placeholder: '0' },
          { name: 'user_id', label: '사용자 ID (선택)', type: 'text' },
          { name: 'action', label: '액션 (선택)', type: 'text' },
        ]}
      />

      <APITester
        title="2. 개별 감사 로그 조회"
        apiCall={(params) => auditAPI.getLog(params.log_id)}
        defaultParams={{ log_id: '' }}
        paramFields={[
          { name: 'log_id', label: '로그 ID', type: 'text', required: true },
        ]}
      />

      <APITester
        title="3. 감사 로그 생성 (수동)"
        apiCall={(params) => auditAPI.createLog(params)}
        defaultParams={{
          action: 'TEST_ACCESS',
          resource_type: 'PATIENT',
          resource_id: '',
          details: 'Manual test entry',
        }}
        paramFields={[
          { name: 'action', label: '액션', type: 'text', required: true },
          { name: 'resource_type', label: '리소스 타입', type: 'text', required: true },
          { name: 'resource_id', label: '리소스 ID', type: 'text' },
          { name: 'details', label: '상세 내용', type: 'text' },
        ]}
      />

      <APITester
        title="4. 데이터 무결성 검증 목록"
        apiCall={(params) => auditAPI.getIntegrityLogs(params)}
        defaultParams={{ limit: 10 }}
        paramFields={[
          { name: 'limit', label: '조회 개수', type: 'number' },
        ]}
      />

      <APITester
        title="5. 데이터 무결성 검증 실행"
        apiCall={(params) => auditAPI.verifyIntegrity(params)}
        defaultParams={{
          resource_type: 'RadiologyStudy',
          resource_id: '',
        }}
        paramFields={[
          { name: 'resource_type', label: '리소스 타입', type: 'text', required: true, placeholder: 'RadiologyStudy' },
          { name: 'resource_id', label: '리소스 ID', type: 'text', required: true },
        ]}
      />
    </div>
  );
}

export default UC09AuditTest;
