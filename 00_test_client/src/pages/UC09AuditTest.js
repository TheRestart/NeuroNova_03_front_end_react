import React from 'react';
import APITester from '../components/APITester';
import { auditAPI } from '../api/apiClient';

function UC09AuditTest() {
  return (
    <div className="container">
      <h1>UC09: 감사 로그 및 보안 테스트</h1>

      <APITester
        title="1. 감사 로그 조회 (관리자 전용)"
        apiCall={(params) => auditAPI.getAuditLogs(params)}
        defaultParams={{
          limit: 20,
          offset: 0,
          user_id: '',
          action: '',
          start_date: '',
          end_date: '',
        }}
        paramFields={[
          { name: 'limit', label: '조회 개수', type: 'number', placeholder: '20' },
          { name: 'offset', label: 'Offset', type: 'number', placeholder: '0' },
          { name: 'user_id', label: '사용자 ID (선택)', type: 'text' },
          {
            name: 'action',
            label: '액션 타입',
            type: 'select',
            options: [
              { value: '', label: '전체' },
              { value: 'login', label: '로그인' },
              { value: 'logout', label: '로그아웃' },
              { value: 'create', label: '생성' },
              { value: 'read', label: '조회' },
              { value: 'update', label: '수정' },
              { value: 'delete', label: '삭제' },
            ]
          },
          { name: 'start_date', label: '시작 날짜', type: 'date' },
          { name: 'end_date', label: '종료 날짜', type: 'date' },
        ]}
      />

      <APITester
        title="2. 환자 접근 이력 조회"
        apiCall={(params) => auditAPI.getPatientAccessLog(params.patient_id)}
        defaultParams={{ patient_id: '' }}
        paramFields={[
          { name: 'patient_id', label: '환자 ID', type: 'text', required: true, description: 'P-2025-000001 형식' },
        ]}
      />

      <APITester
        title="3. 내 활동 이력 조회"
        apiCall={(params) => auditAPI.getMyActivity(params)}
        defaultParams={{
          limit: 20,
          start_date: '',
          end_date: '',
        }}
        paramFields={[
          { name: 'limit', label: '조회 개수', type: 'number', placeholder: '20' },
          { name: 'start_date', label: '시작 날짜', type: 'date' },
          { name: 'end_date', label: '종료 날짜', type: 'date' },
        ]}
      />

      <APITester
        title="4. 보안 이벤트 조회 (관리자 전용)"
        apiCall={(params) => auditAPI.getSecurityEvents(params)}
        defaultParams={{
          limit: 20,
          severity: '',
        }}
        paramFields={[
          { name: 'limit', label: '조회 개수', type: 'number', placeholder: '20' },
          {
            name: 'severity',
            label: '심각도',
            type: 'select',
            options: [
              { value: '', label: '전체' },
              { value: 'info', label: '정보' },
              { value: 'warning', label: '경고' },
              { value: 'critical', label: '위험' },
            ]
          },
        ]}
      />

      <APITester
        title="5. 데이터 무결성 검증 (관리자 전용)"
        apiCall={(params) => auditAPI.verifyDataIntegrity(params)}
        defaultParams={{
          resource_type: 'patient',
          resource_id: '',
        }}
        paramFields={[
          {
            name: 'resource_type',
            label: '리소스 타입',
            type: 'select',
            required: true,
            options: [
              { value: 'patient', label: 'Patient' },
              { value: 'encounter', label: 'Encounter' },
              { value: 'order', label: 'Order' },
              { value: 'observation', label: 'Observation' },
            ]
          },
          { name: 'resource_id', label: '리소스 ID', type: 'text', required: true },
        ]}
      />

      <APITester
        title="6. 감사 로그 내보내기 (관리자 전용)"
        apiCall={(params) => auditAPI.exportAuditLogs(params)}
        defaultParams={{
          start_date: '',
          end_date: '',
          format: 'csv',
        }}
        paramFields={[
          { name: 'start_date', label: '시작 날짜', type: 'date', required: true },
          { name: 'end_date', label: '종료 날짜', type: 'date', required: true },
          {
            name: 'format',
            label: '파일 형식',
            type: 'select',
            options: [
              { value: 'csv', label: 'CSV' },
              { value: 'json', label: 'JSON' },
              { value: 'xlsx', label: 'Excel' },
            ]
          },
        ]}
      />

      <APITester
        title="7. 규정 준수 보고서 생성"
        apiCall={(params) => auditAPI.generateComplianceReport(params)}
        defaultParams={{
          report_type: 'hipaa',
          start_date: '',
          end_date: '',
        }}
        paramFields={[
          {
            name: 'report_type',
            label: '보고서 타입',
            type: 'select',
            required: true,
            options: [
              { value: 'hipaa', label: 'HIPAA Compliance' },
              { value: 'gdpr', label: 'GDPR Compliance' },
              { value: 'access_control', label: 'Access Control' },
            ]
          },
          { name: 'start_date', label: '시작 날짜', type: 'date', required: true },
          { name: 'end_date', label: '종료 날짜', type: 'date', required: true },
        ]}
      />
    </div>
  );
}

export default UC09AuditTest;
