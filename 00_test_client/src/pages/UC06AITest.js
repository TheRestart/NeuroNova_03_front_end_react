import React from 'react';
import APITester from '../components/APITester';
import { aiAPI } from '../api/apiClient';

function UC06AITest() {
  return (
    <div className="container">
      <h1>UC06: AI 추론 및 진단 보조 테스트</h1>

      <div className="alert alert-info" style={{ marginBottom: '20px' }}>
        <h4>📌 AI 분석 결과 저장 전략</h4>
        <p>
          <strong>텍스트/숫자 결과:</strong> result_data (JSONField)에 MySQL 저장
        </p>
        <p>
          <strong>Seg 이미지:</strong> VM 임시 저장 → 의사 승인 → DICOM 변환 → Orthanc 업로드
        </p>
        <p>
          <strong>워크플로:</strong> AI 추론 → 의사 검토 → Seg 저장 승인 → PACS 연동
        </p>
      </div>

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
        exampleData={{
          patient_id: 'P-2025-001',
          study_id: 'STUDY-001',
          model_name: 'brain_hemorrhage_detector',
          priority: 'high',
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
        description="result_data: 텍스트/숫자 결과, segmentation_path: VM 임시 경로"
        apiCall={(params) => aiAPI.getAIJob(params.job_id)}
        defaultParams={{ job_id: '' }}
        paramFields={[
          { name: 'job_id', label: 'Job ID', type: 'text', required: true },
        ]}
        renderResult={(result) => {
          if (result && result.data) {
            const job = result.data;
            return (
              <div>
                <h4>AI Job 상세</h4>
                <table className="table">
                  <tbody>
                    <tr>
                      <th>Job ID</th>
                      <td>{job.job_id}</td>
                    </tr>
                    <tr>
                      <th>환자</th>
                      <td>{job.patient}</td>
                    </tr>
                    <tr>
                      <th>AI 모델</th>
                      <td>{job.model_name}</td>
                    </tr>
                    <tr>
                      <th>상태</th>
                      <td>
                        <span className={`badge ${
                          job.status === 'COMPLETED' ? 'badge-success' :
                          job.status === 'FAILED' ? 'badge-danger' :
                          job.status === 'RUNNING' ? 'badge-warning' :
                          'badge-secondary'
                        }`}>
                          {job.status}
                        </span>
                      </td>
                    </tr>
                    <tr>
                      <th>검토 상태</th>
                      <td>
                        {job.review_status ? (
                          <span className={`badge ${
                            job.review_status === 'APPROVED' ? 'badge-success' :
                            job.review_status === 'REJECTED' ? 'badge-danger' :
                            'badge-secondary'
                          }`}>
                            {job.review_status}
                          </span>
                        ) : '-'}
                      </td>
                    </tr>
                    <tr>
                      <th>완료 시간</th>
                      <td>{job.completed_at || '-'}</td>
                    </tr>
                  </tbody>
                </table>

                {job.result_data && (
                  <div className="alert alert-secondary">
                    <h5>📊 분석 결과 (result_data)</h5>
                    <pre>{JSON.stringify(job.result_data, null, 2)}</pre>
                  </div>
                )}

                {job.segmentation_path && (
                  <div className="alert alert-warning">
                    <h5>🖼️ Segmentation 이미지 (VM 임시 저장)</h5>
                    <p><strong>경로:</strong> {job.segmentation_path}</p>
                    <p className="text-muted">
                      ⚠️ 의사가 '승인' 버튼을 클릭하면 DICOM으로 변환되어 Orthanc에 업로드됩니다.
                    </p>
                  </div>
                )}

                {job.error_message && (
                  <div className="alert alert-danger">
                    <h5>❌ 에러 메시지</h5>
                    <p>{job.error_message}</p>
                  </div>
                )}
              </div>
            );
          }
          return <pre>{JSON.stringify(result, null, 2)}</pre>;
        }}
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

      <APITester
        title="5. Segmentation 이미지 저장 승인 (DICOM 변환 → Orthanc 업로드)"
        description="의사가 'seg_저장' 버튼 클릭 → VM 임시 파일 → DICOM 변환 → Orthanc 업로드"
        apiCall={(params) => aiAPI.approveSegmentation(params.job_id, {
          approved_by: params.approved_by,
          series_description: params.series_description,
          notes: params.notes,
        })}
        defaultParams={{
          job_id: '',
          approved_by: '',
          series_description: 'AI Segmentation Result',
          notes: '',
        }}
        exampleData={{
          job_id: 'AJ-2025-001',
          approved_by: 'user-doctor-001',
          series_description: 'Brain Tumor Segmentation (AI)',
          notes: 'AI 분석 결과 검토 완료, PACS 저장 승인',
        }}
        paramFields={[
          { name: 'job_id', label: 'Job ID', type: 'text', required: true, placeholder: 'AJ-2025-001' },
          { name: 'approved_by', label: '승인자 (의사 ID)', type: 'text', required: true, placeholder: 'user-doctor-001' },
          { name: 'series_description', label: 'Series Description', type: 'text', placeholder: 'AI Segmentation Result' },
          { name: 'notes', label: '승인 메모', type: 'textarea', placeholder: 'AI 분석 결과 검토 완료' },
        ]}
        renderResult={(result) => {
          if (result && result.data) {
            const approval = result.data;
            return (
              <div>
                <div className="alert alert-success">
                  <h5>✅ Segmentation 저장 승인 완료</h5>
                  <p><strong>Job ID:</strong> {approval.job_id}</p>
                  <p><strong>승인자:</strong> {approval.approved_by}</p>
                  {approval.orthanc_series_id && (
                    <p><strong>Orthanc Series ID:</strong> {approval.orthanc_series_id}</p>
                  )}
                  {approval.dicom_file_path && (
                    <p><strong>DICOM 파일:</strong> {approval.dicom_file_path}</p>
                  )}
                </div>

                <div className="alert alert-info">
                  <h5>📋 처리 워크플로</h5>
                  <ol>
                    <li>✓ VM 임시 저장소에서 Seg 이미지 로드</li>
                    <li>✓ DICOM Segmentation Object로 변환</li>
                    <li>✓ Orthanc PACS에 업로드 (DICOMweb STOW-RS)</li>
                    <li>✓ MySQL에 메타데이터 저장 (orthanc_series_id)</li>
                    <li>✓ OHIF Viewer에서 확인 가능</li>
                  </ol>
                  <p className="text-muted">
                    💡 이제 OHIF Viewer에서 원본 Study와 함께 Segmentation을 오버레이로 볼 수 있습니다.
                  </p>
                </div>
              </div>
            );
          }
          return <pre>{JSON.stringify(result, null, 2)}</pre>;
        }}
      />
    </div>
  );
}

export default UC06AITest;
