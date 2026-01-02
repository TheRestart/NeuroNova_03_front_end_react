import React from 'react';
import APITester from '../components/APITester';
import { lisAPI } from '../api/apiClient';

function UC04LISTest() {
  return (
    <div className="container">
      <h1>UC04: LIS (검체검사시스템) 테스트</h1>

      <div className="alert alert-info" style={{ marginBottom: '20px' }}>
        <h4>📌 LIS 데이터 저장 전략</h4>
        <p>
          <strong>저장소:</strong> MySQL only (OpenEMR, FHIR 연동 없음)
        </p>
        <p>
          <strong>유전 정보:</strong> result_details (JSONField)에 저장
        </p>
        <p>
          <strong>응답 시간:</strong> ~50ms (외부 API 호출 없음, 빠른 조회)
        </p>
      </div>

      <APITester
        title="1. 검사 결과 목록 조회"
        apiCall={(params) => lisAPI.getLabResults(params)}
        defaultParams={{ limit: 10, offset: 0 }}
        paramFields={[
          { name: 'limit', label: '조회 개수', type: 'number', placeholder: '10' },
          { name: 'offset', label: 'Offset', type: 'number', placeholder: '0' },
          { name: 'patient_id', label: '환자 ID (선택)', type: 'text', description: 'sub-0004 형식' },
        ]}
      />

      <APITester
        title="2. 검사 결과 생성"
        apiCall={(params) => lisAPI.createLabResult(params)}
        defaultParams={{
          patient: '',
          order: '',
          test_master: '',
          result_value: '',
          result_unit: '',
        }}
        exampleData={{
          patient: 'sub-0004',
          order: 'O-2026-0001',
          test_master: '883-9',
          result_value: 'A+',
          result_unit: '',
        }}
        paramFields={[
          { name: 'patient', label: '환자 ID', type: 'text', required: true, placeholder: 'sub-0004' },
          { name: 'order', label: '처방 ID', type: 'text', required: true, placeholder: 'O-2026-0001' },
          { name: 'test_master', label: '검사 코드', type: 'text', required: true, placeholder: '883-9' },
          { name: 'result_value', label: '결과값', type: 'text', required: true, placeholder: '95' },
          { name: 'result_unit', label: '단위', type: 'text', placeholder: 'mg/dL' },
        ]}
      />

      <APITester
        title="3. 검사 결과 상세 조회 (유전 정보 포함)"
        description="result_details 필드에 유전 정보 JSON 저장"
        apiCall={(params) => lisAPI.getLabResult(params.result_id)}
        defaultParams={{ result_id: '' }}
        exampleData={{ result_id: 'LR-GENE-001' }}
        paramFields={[
          { name: 'result_id', label: '결과 ID', type: 'text', required: true },
        ]}
        renderResult={(result) => {
          if (result && (result.data || result.result_id)) {
            const labResult = result.data || result;
            return (
              <div>
                <h4>검사 결과 상세</h4>
                <table className="table">
                  <tbody>
                    <tr>
                      <th>Result ID</th>
                      <td>{labResult.result_id}</td>
                    </tr>
                    <tr>
                      <th>환자</th>
                      <td>{labResult.patient}</td>
                    </tr>
                    <tr>
                      <th>검사명</th>
                      <td>{labResult.test_name || labResult.test_master?.test_name || '-'}</td>
                    </tr>
                    <tr>
                      <th>결과값</th>
                      <td>
                        {labResult.result_value} {labResult.result_unit}
                        {labResult.is_abnormal && (
                          <span className="badge badge-danger" style={{ marginLeft: '10px' }}>
                            이상
                          </span>
                        )}
                      </td>
                    </tr>
                    <tr>
                      <th>보고 일시</th>
                      <td>{labResult.reported_at}</td>
                    </tr>
                  </tbody>
                </table>

                {(labResult.result_details) && (
                  <div className="alert alert-secondary">
                    <h5>🧬 유전 정보 (result_details)</h5>
                    <pre>{JSON.stringify(labResult.result_details, null, 2)}</pre>
                  </div>
                )}
              </div>
            );
          }
          return <pre>{JSON.stringify(result, null, 2)}</pre>;
        }}
      />

      <APITester
        title="3-1. 유전 검사 결과 생성 예제 (BRCA1)"
        description="유전 정보를 results (JSON)에 저장하는 예제"
        apiCall={(params) => lisAPI.createLabResult({
          patient: params.patient_id,
          order: params.order_id,
          test_master: 'GENE-BRCA1',
          result_value: params.result_value,
          results: {
            gene: params.gene,
            variant: params.variant,
            zygosity: params.zygosity,
            pathogenicity: params.pathogenicity,
            clinical_significance: params.clinical_significance,
          },
          reported_by: 'user-tech-001',
        })}
        defaultParams={{
          patient_id: '',
          order_id: '',
          result_value: 'Positive',
          gene: 'BRCA1',
          variant: 'c.5266dupC',
          zygosity: 'heterozygous',
          pathogenicity: 'pathogenic',
          clinical_significance: 'High risk for breast/ovarian cancer',
        }}
        exampleData={{
          patient_id: 'sub-0005',
          order_id: 'O-2025-001',
          result_value: 'Positive',
          gene: 'BRCA1',
          variant: 'c.5266dupC',
          zygosity: 'heterozygous',
          pathogenicity: 'pathogenicity',
          clinical_significance: 'High risk for breast/ovarian cancer',
        }}
        paramFields={[
          { name: 'patient_id', label: '환자 ID', type: 'text', required: true },
          { name: 'order_id', label: '처방 ID', type: 'text', required: true },
          {
            name: 'result_value', label: '결과값', type: 'select', options: [
              { value: 'Positive', label: 'Positive (양성)' },
              { value: 'Negative', label: 'Negative (음성)' },
            ]
          },
          { name: 'gene', label: '유전자', type: 'text', placeholder: 'BRCA1' },
          { name: 'variant', label: '변이', type: 'text', placeholder: 'c.5266dupC' },
          {
            name: 'zygosity', label: '접합성', type: 'select', options: [
              { value: 'heterozygous', label: 'Heterozygous (이형접합)' },
              { value: 'homozygous', label: 'Homozygous (동형접합)' },
            ]
          },
          {
            name: 'pathogenicity', label: '병원성', type: 'select', options: [
              { value: 'pathogenic', label: 'Pathogenic (병원성)' },
              { value: 'benign', label: 'Benign (양성)' },
              { value: 'VUS', label: 'VUS (의미불명)' },
            ]
          },
          { name: 'clinical_significance', label: '임상적 의미', type: 'text' },
        ]}
      />

      <APITester
        title="4. 검사 마스터 목록 조회"
        apiCall={() => lisAPI.getTestMasters()}
        paramFields={[]}
      />
    </div>
  );
}

export default UC04LISTest;
