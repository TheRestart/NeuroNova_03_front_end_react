import React from 'react';
import APITester from '../components/APITester';
import { aiAPI } from '../api/apiClient';

function UC06AITest() {
  return (
    <div className="container">
      <h1>UC06: AI 추론 및 진단 보조 테스트</h1>

      <APITester
        title="1. AI 모델 목록 조회"
        apiCall={() => aiAPI.getModels()}
        paramFields={[]}
      />

      <APITester
        title="2. 뇌졸중 위험도 예측"
        apiCall={(params) => aiAPI.predictStrokeRisk(params)}
        defaultParams={{
          patient_id: '',
          age: '',
          systolic_bp: '',
          diastolic_bp: '',
          glucose: '',
          cholesterol: '',
          smoking: false,
          diabetes: false,
        }}
        paramFields={[
          { name: 'patient_id', label: '환자 ID', type: 'text', required: true },
          { name: 'age', label: '나이', type: 'number', required: true, placeholder: '65' },
          { name: 'systolic_bp', label: '수축기 혈압', type: 'number', required: true, placeholder: '140' },
          { name: 'diastolic_bp', label: '이완기 혈압', type: 'number', required: true, placeholder: '90' },
          { name: 'glucose', label: '혈당', type: 'number', required: true, placeholder: '120' },
          { name: 'cholesterol', label: '콜레스테롤', type: 'number', required: true, placeholder: '200' },
          { name: 'smoking', label: '흡연', type: 'checkbox' },
          { name: 'diabetes', label: '당뇨병', type: 'checkbox' },
        ]}
      />

      <APITester
        title="3. 의료 영상 분석 (비동기)"
        apiCall={(params) => aiAPI.analyzeMedicalImage(params)}
        defaultParams={{
          study_id: '',
          model_name: 'brain_hemorrhage_detector',
          priority: 'normal',
        }}
        paramFields={[
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
        title="4. AI 분석 결과 조회"
        apiCall={(params) => aiAPI.getAnalysisResult(params.task_id)}
        defaultParams={{ task_id: '' }}
        paramFields={[
          { name: 'task_id', label: '태스크 ID', type: 'text', required: true, description: 'Celery task ID' },
        ]}
      />

      <APITester
        title="5. 임상 의사결정 지원"
        apiCall={(params) => aiAPI.getClinicalDecisionSupport(params)}
        defaultParams={{
          patient_id: '',
          symptoms: '',
          diagnosis_codes: '',
        }}
        paramFields={[
          { name: 'patient_id', label: '환자 ID', type: 'text', required: true },
          { name: 'symptoms', label: '증상', type: 'text', required: true, placeholder: '두통, 어지러움, 구토' },
          { name: 'diagnosis_codes', label: '진단 코드', type: 'text', placeholder: 'I63.9, G43.909' },
        ]}
      />
    </div>
  );
}

export default UC06AITest;
