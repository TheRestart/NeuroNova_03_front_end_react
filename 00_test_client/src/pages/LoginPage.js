import React, { useState } from 'react';
import { authAPI } from '../api/apiClient';

function LoginPage({ onLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await authAPI.login(username, password);
      const { access, refresh, user } = response.data;

      // 리프레시 토큰도 저장
      localStorage.setItem('refresh_token', refresh);

      // 부모 컴포넌트에 로그인 성공 알림
      onLogin(access, user);
    } catch (err) {
      console.error('Login error:', err);
      setError(
        err.response?.data?.error?.message ||
        err.response?.data?.detail ||
        '로그인에 실패했습니다. 아이디와 비밀번호를 확인해주세요.'
      );
    } finally {
      setLoading(false);
    }
  };

  // 테스트 계정으로 빠른 로그인 (개발 환경 전용)
  // WARNING: 프로덕션 환경에서는 이 기능을 비활성화해야 합니다
  const quickLogin = async (role) => {
    // 프로덕션 환경에서는 Quick Login 비활성화
    if (process.env.NODE_ENV === 'production') {
      setError('Quick Login은 개발 환경에서만 사용 가능합니다.');
      return;
    }

    const testAccounts = {
      admin: { username: 'admin', password: 'admin123' },
      doctor: { username: 'doctor', password: 'doctor123' },
      nurse: { username: 'nurse', password: 'nurse123' },
      patient: { username: 'patient', password: 'patient123' },
      rib: { username: 'radiologist', password: 'radiologist123' },
      lab: { username: 'labtech', password: 'labtech123' },
    };

    const account = testAccounts[role];
    if (!account) return;

    // 입력 필드에 값 설정
    setUsername(account.username);
    setPassword(account.password);
    setError('');
    setLoading(true);

    try {
      // 즉시 로그인 시도
      const response = await authAPI.login(account.username, account.password);
      const { access, refresh, user } = response.data;

      localStorage.setItem('refresh_token', refresh);
      onLogin(access, user);
    } catch (err) {
      console.error('Quick login error:', err);
      setError(
        err.response?.data?.error?.message ||
        err.response?.data?.detail ||
        '로그인에 실패했습니다. 아이디와 비밀번호를 확인해주세요.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container" style={{ maxWidth: '500px', marginTop: '100px' }}>
      <div className="card">
        <h1 style={{ textAlign: 'center', marginBottom: '30px' }}>
          CDSS API 테스트 클라이언트
        </h1>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>아이디</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="username"
              required
            />
          </div>

          <div className="form-group">
            <label>비밀번호</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="password"
              required
            />
          </div>

          <button type="submit" className="btn btn-primary" disabled={loading} style={{ width: '100%' }}>
            {loading ? '로그인 중...' : '로그인'}
          </button>

          {process.env.NODE_ENV === 'development' && (
            <div style={{
              marginTop: '15px',
              padding: '12px',
              backgroundColor: '#fff3cd',
              border: '1px solid #ffc107',
              borderRadius: '8px',
              fontSize: '0.9rem',
              color: '#856404',
              textAlign: 'center',
              boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
            }}>
              <p style={{ margin: '0 0 5px 0', fontSize: '0.8rem', opacity: 0.8 }}>⚠️ DEVELOPMENT MODE ONLY</p>
              <span style={{ fontSize: '1.2rem' }}>🔑</span> <strong>admin / admin123</strong>
            </div>
          )}
        </form>

        {process.env.NODE_ENV === 'development' && (
          <>
            <hr style={{ margin: '30px 0' }} />
            <div>
              <div style={{
                backgroundColor: '#fff3cd',
                border: '1px solid #ffc107',
                padding: '8px 12px',
                borderRadius: '4px',
                marginBottom: '15px',
                fontSize: '0.85rem',
                color: '#856404'
              }}>
                ⚠️ <strong>개발 전용:</strong> Quick Login은 프로덕션에서 자동 비활성화됩니다.
              </div>
              <h3 style={{ fontSize: '16px', marginBottom: '15px' }}>테스트 계정 빠른 로그인 (클릭 시 자동 로그인)</h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <button
                  className="btn btn-primary"
                  onClick={() => quickLogin('admin')}
                  disabled={loading}
                >
                  Admin
                </button>
                <button
                  className="btn btn-primary"
                  onClick={() => quickLogin('doctor')}
                  disabled={loading}
                >
                  Doctor
                </button>
                <button
                  className="btn btn-primary"
                  onClick={() => quickLogin('nurse')}
                  disabled={loading}
                >
                  Nurse
                </button>
                <button
                  className="btn btn-primary"
                  onClick={() => quickLogin('patient')}
                  disabled={loading}
                >
                  Patient
                </button>
                <button
                  className="btn btn-primary"
                  onClick={() => quickLogin('rib')}
                  disabled={loading}
                >
                  Radiologist
                </button>
                <button
                  className="btn btn-primary"
                  onClick={() => quickLogin('lab')}
                  disabled={loading}
                >
                  Lab Tech
                </button>
              </div>
            </div>
          </>
        )}

        <div style={{ marginTop: '20px', padding: '15px', backgroundColor: '#f8f9fa', borderRadius: '4px', fontSize: '12px' }}>
          <strong>참고:</strong> 테스트 계정이 없으면 Django 서버에서 생성해주세요.
          <pre style={{ marginTop: '10px', fontSize: '11px' }}>
            {`python manage.py create_test_users`}
          </pre>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
