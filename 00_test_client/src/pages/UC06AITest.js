import React from 'react';
import APITester from '../components/APITester';
import { aiAPI } from '../api/apiClient';

function UC06AITest() {
  return (
    <div className="container">
      <h1>UC06: AI 추론 및 진단 보조 테스트</h1>

      <APITester
        title="1. AI Job 목록 조회"
        apiCall={(params) => aiAPI.getAIJobs(params)}
        defaultParams={{ limit: 10, offset: 0 }}
        paramFields={[
          { name: 'limit', label: '조회 개수', type: 'number', placeholder: '10' },
          { name: 'patient_id', label: '환자 ID (선택)', type: 'text' },
        ]}
      />

      <APITester
        title="2. AI 분석 요청 생성 (비동기)"
        apiCall={(params) => aiAPI.createAIJob(params)}
        defaultParams={{
          patient_id: '',
          study_id: '',
          model_name: 'brain_hemorrhage_detector',
          priority: 'normal',
        }}
        paramFields={[
          { name: 'patient_id', label: '환자 ID', type: 'text', required: true },
          { name: 'study_id', label: '영상 검사 ID', type: 'text', required: true },
          {
            name: 'model_name',
            label: 'AI 모델',
            type: 'select',
            required: true,
            options: [
              { value: 'brain_hemorrhage_detector', label: '뇌출혈 탐지' },
              { value: 'tumor_segmentation', label: '종양 세분화' },
              { value: 'fracture_detection', label: '골절 탐지' },
            ]
          },
          {
            name: 'priority',
            label: '우선순위',
            type: 'select',
            options: [
              { value: 'low', label: '낮음' },
              { value: 'normal', label: '보통' },
              { value: 'high', label: '높음' },
              { value: 'urgent', label: '긴급' },
            ]
          },
        ]}
      />

      <APITester
        title="3. AI Job 상세 및 결과 조회"
        apiCall={(params) => aiAPI.getAIJob(params.job_id)}
        defaultParams={{ job_id: '' }}
        paramFields={[
          { name: 'job_id', label: 'Job ID', type: 'text', required: true },
        ]}
      />

      <APITester
        title="4. AI 분석 결과 검토 (승인/반려)"
        apiCall={(params) => aiAPI.reviewAIJob(params.job_id, {
          review_status: params.review_status,
          review_comment: params.review_comment
        })}
        defaultParams={{
          job_id: '',
          review_status: 'APPROVED',
          review_comment: '',
        }}
        paramFields={[
          { name: 'job_id', label: 'Job ID', type: 'text', required: true },
          {
            name: 'review_status',
            label: '검토 상태',
            type: 'select',
            required: true,
            options: [
              { value: 'APPROVED', label: '승인' },
              { value: 'REJECTED', label: '반려' },
            ]
          },
          { name: 'review_comment', label: '검토 의견', type: 'textarea', placeholder: '판독 결과와 일치함' },
        ]}
      />
    </div>
  );
}

export default UC06AITest;
