import React, { useState, useEffect, useRef } from 'react';
import ResponseTable from './ResponseTable';

/**
 * 재사용 가능한 API 테스터 컴포넌트
 * @param {string} title - 테스트 제목
 * @param {function} apiCall - API 호출 함수
 * @param {object} defaultParams - 기본 파라미터
 * @param {array} paramFields - 입력 필드 정의
 */
function APITester({ title, apiCall, defaultParams = {}, paramFields = [], exampleData = null }) {
  const [params, setParams] = useState(defaultParams);
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [viewMode, setViewMode] = useState('table'); // 'json' or 'table'
  const [jsonCollapsed, setJsonCollapsed] = useState(false); // P-019 Fix: JSON 축소/확장
  const [displayLimit, setDisplayLimit] = useState(100); // P-019 Fix: 대용량 데이터 표시 제한
  const paramsRef = useRef(params); // P-014 Fix: 메모리 내 민감정보 추적

  // P-014 Fix: params 변경 시 ref 동기화
  useEffect(() => {
    paramsRef.current = params;
  }, [params]);

  // P-014 Fix: 컴포넌트 언마운트 시 비밀번호 필드 메모리 클린업
  useEffect(() => {
    return () => {
      const passwordFields = paramFields.filter(f => f.type === 'password').map(f => f.name);
      if (passwordFields.length > 0 && paramsRef.current) {
        // 비밀번호 필드를 빈 문자열로 덮어쓰기 (메모리 보안)
        passwordFields.forEach(field => {
          if (paramsRef.current[field]) {
            paramsRef.current[field] = '';
          }
        });
      }
    };
  }, [paramFields]);

  const handleParamChange = (field, value) => {
    setParams((prev) => ({ ...prev, [field]: value }));
  };

  const handleExampleInput = () => {
    // 예시 데이터가 있으면 기존 파라미터를 초기화하고 예시 데이터로 채움
    if (exampleData) {
      setParams(exampleData);
    } else {
      setParams(defaultParams);
    }
  };

  const handleTest = async (overrideParams = null) => {
    setLoading(true);
    setError(null);
    setResponse(null);

    try {
      const currentParams = overrideParams || params;
      const result = await apiCall(currentParams);

      // P-019 Fix: 대용량 응답 자동 감지 및 축소 표시
      const jsonSize = JSON.stringify(result.data).length;
      if (jsonSize > 50000) {
        setJsonCollapsed(true); // 50KB 이상이면 자동 축소
      } else {
        setJsonCollapsed(false);
      }

      setResponse(result.data);
    } catch (err) {
      // 비밀번호 로깅 방지: err.config에 민감정보 포함 가능성
      console.error('API Error:', {
        message: err.message,
        status: err.response?.status,
        statusText: err.response?.statusText,
        data: err.response?.data
        // err.config는 로깅하지 않음 (비밀번호 등 민감정보 포함 가능)
      });
      setError(err.response?.data || { message: err.message });
    } finally {
      setLoading(false);
    }
  };

  const handleLoadAndRun = () => {
    const dataToFill = exampleData || defaultParams;
    setParams(dataToFill);
    handleTest(dataToFill);
  };

  const handleClear = () => {
    // P-014 Fix: 비밀번호 필드 메모리 덮어쓰기
    const passwordFields = paramFields.filter(f => f.type === 'password').map(f => f.name);
    passwordFields.forEach(field => {
      if (params[field]) {
        params[field] = ''; // 메모리 덮어쓰기
      }
    });

    setParams(defaultParams);
    setResponse(null);
    setError(null);
  };

  return (
    <div className="card">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h3>{title}</h3>
        {exampleData && (
          <button
            className="btn btn-success"
            onClick={handleLoadAndRun}
            style={{ padding: '5px 15px', fontSize: '13px' }}
          >
            🚀 예시 입력 후 즉시 실행
          </button>
        )}
      </div>

      <div style={{ marginTop: '20px' }}>
        {paramFields.map((field) => (
          <div key={field.name} className="form-group">
            <label>
              {field.label}
              {field.required && <span style={{ color: 'red' }}> *</span>}
            </label>

            {field.type === 'textarea' ? (
              <textarea
                value={params[field.name] || ''}
                onChange={(e) => handleParamChange(field.name, e.target.value)}
                placeholder={field.placeholder}
                required={field.required}
              />
            ) : field.type === 'select' ? (
              <select
                value={params[field.name] || ''}
                onChange={(e) => handleParamChange(field.name, e.target.value)}
                required={field.required}
              >
                <option value="">선택하세요</option>
                {field.options.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            ) : (
              <input
                type={field.type || 'text'}
                value={params[field.name] || ''}
                onChange={(e) => handleParamChange(field.name, e.target.value)}
                placeholder={field.placeholder}
                required={field.required}
              />
            )}

            {field.description && (
              <small style={{ color: '#6c757d' }}>{field.description}</small>
            )}
          </div>
        ))}
      </div>

      <div style={{ marginTop: '20px', display: 'flex', gap: '10px' }}>
        <button
          className="btn btn-primary"
          onClick={() => handleTest()}
          disabled={loading}
        >
          {loading ? '실행 중...' : '테스트 실행'}
        </button>
        <button className="btn btn-secondary" onClick={handleExampleInput}>
          예시 입력
        </button>
        <button className="btn" onClick={handleClear}>
          초기화
        </button>
      </div>

      <div style={{ marginTop: '20px', borderTop: '1px solid #eee', paddingTop: '10px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
          <strong>✅ 응답 결과:</strong>
          {Array.isArray(response) && response.length > 0 && (
            <div className="btn-group">
              <button
                className={`btn ${viewMode === 'table' ? 'btn-primary' : 'btn-outline'}`}
                onClick={() => setViewMode('table')}
                style={{ fontSize: '12px', padding: '4px 8px' }}
              >
                📊 테이블
              </button>
              <button
                className={`btn ${viewMode === 'json' ? 'btn-primary' : 'btn-outline'}`}
                onClick={() => setViewMode('json')}
                style={{ fontSize: '12px', padding: '4px 8px' }}
              >
                📝 JSON
              </button>
            </div>
          )}
        </div>

        {/* P-019 Fix: 대용량 데이터 렌더링 최적화 */}
        {response && viewMode === 'table' ? (
          <ResponseTable data={response} title="API 응답 데이터" />
        ) : response && viewMode === 'json' ? (
          <div className="response-box success" style={{ overflowX: 'auto' }}>
            {(() => {
              const jsonString = JSON.stringify(response, null, 2);
              const isLarge = jsonString.length > 50000; // 50KB 이상

              if (isLarge && jsonCollapsed) {
                // 대용량 데이터 축소 표시
                return (
                  <div>
                    <div style={{ padding: '10px', background: '#fff3cd', border: '1px solid #ffc107', borderRadius: '4px', marginBottom: '10px' }}>
                      ⚠️ <strong>대용량 응답 ({(jsonString.length / 1024).toFixed(2)} KB)</strong> - 성능을 위해 축소 표시됨
                    </div>
                    <pre style={{ margin: 0, maxHeight: '200px', overflow: 'hidden' }}>
                      {jsonString.slice(0, 1000)}...
                    </pre>
                    <button
                      className="btn btn-sm btn-secondary"
                      onClick={() => setJsonCollapsed(false)}
                      style={{ marginTop: '10px' }}
                    >
                      🔽 전체 보기 (주의: 브라우저 느려질 수 있음)
                    </button>
                  </div>
                );
              } else if (isLarge) {
                // 대용량 데이터 전체 표시 (경고 포함)
                return (
                  <div>
                    <div style={{ padding: '10px', background: '#f8d7da', border: '1px solid #f5c6cb', borderRadius: '4px', marginBottom: '10px' }}>
                      ⚠️ <strong>대용량 응답 전체 표시 중 ({(jsonString.length / 1024).toFixed(2)} KB)</strong>
                      <button
                        className="btn btn-sm"
                        onClick={() => setJsonCollapsed(true)}
                        style={{ marginLeft: '10px' }}
                      >
                        🔼 축소
                      </button>
                    </div>
                    <pre style={{ margin: 0, maxHeight: '600px', overflow: 'auto' }}>{jsonString}</pre>
                  </div>
                );
              } else {
                // 일반 크기 데이터
                return <pre style={{ margin: 0 }}>{jsonString}</pre>;
              }
            })()}
            {Array.isArray(response) && (
              <div style={{ marginTop: '5px', fontSize: '12px', color: '#6c757d', textAlign: 'right' }}>
                총 {response.length}건 조회됨
              </div>
            )}
          </div>
        ) : null}
      </div>

      {error && (
        <div className="response-box error">
          <strong>❌ 에러 응답:</strong>
          {error.error ? (
            <div style={{ marginTop: '10px' }}>
              <div style={{ color: '#721c24', fontWeight: 'bold' }}>
                [{error.error.code}] {error.error.message}
              </div>
              {error.error.field && (
                <div style={{ fontSize: '13px', marginTop: '5px' }}>
                  <strong>Field:</strong> {error.error.field}
                </div>
              )}
              {error.error.detail && (
                <div style={{ fontSize: '13px', marginTop: '5px' }}>
                  <strong>Detail:</strong> {error.error.detail}
                </div>
              )}
              <small style={{ display: 'block', marginTop: '10px', color: '#6c757d' }}>
                {error.error.timestamp}
              </small>
            </div>
          ) : (
            <pre>{JSON.stringify(error, null, 2)}</pre>
          )}
        </div>
      )}
    </div>
  );
}

export default APITester;
