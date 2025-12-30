import React, { useState } from 'react';

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

  const handleParamChange = (field, value) => {
    setParams((prev) => ({ ...prev, [field]: value }));
  };

  const handleExampleInput = () => {
    // exampleData가 있으면 그것을 사용, 없으면 defaultParams 사용
    const dataToFill = exampleData || defaultParams;
    setParams({ ...params, ...dataToFill });
  };

  const handleTest = async () => {
    setLoading(true);
    setError(null);
    setResponse(null);

    try {
      const result = await apiCall(params);
      setResponse(result.data);
    } catch (err) {
      console.error('API Error:', err);
      setError(err.response?.data || { message: err.message });
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setParams(defaultParams);
    setResponse(null);
    setError(null);
  };

  return (
    <div className="card">
      <h3>{title}</h3>

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
          onClick={handleTest}
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

      {response && (
        <div className="response-box success">
          <strong>✅ 성공 응답:</strong>
          <pre>{JSON.stringify(response, null, 2)}</pre>
        </div>
      )}

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
