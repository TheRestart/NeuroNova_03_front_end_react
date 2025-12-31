/**
 * 개발 환경 자동 로그인 유틸리티
 *
 * 목적: 로그인 없이 빠르게 서비스 테스트
 * 사용: REACT_APP_DEV_AUTO_LOGIN=true 환경변수 설정 시 자동 활성화
 *
 * 주의: 프로덕션 환경에서는 절대 사용 금지!
 */

const DEV_AUTO_LOGIN = process.env.REACT_APP_DEV_AUTO_LOGIN === 'true';
const DEV_MOCK_USER = process.env.REACT_APP_DEV_MOCK_USER || 'doctor';

/**
 * 개발 환경에서 자동으로 가짜 토큰을 localStorage에 저장
 * Django ENABLE_SECURITY=False 설정과 함께 사용
 */
export const devAutoLogin = () => {
  if (!DEV_AUTO_LOGIN) {
    return;
  }

  console.warn('[DEV MODE] Auto-login enabled - bypassing authentication');

  console.warn('[DEV MODE] Auto-login enabled - Attempting REAL login as admin');

  // 실제 로그인 시도 (비동기 처리)
  fetch('http://localhost/api/acct/login/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      username: 'admin',
      password: 'admin123'
    })
  })
    .then(response => response.json())
    .then(data => {
      if (data.access && data.refresh) {
        localStorage.setItem('access_token', data.access);
        localStorage.setItem('refresh_token', data.refresh);
        localStorage.setItem('user', JSON.stringify(data.user));
        console.log('[DEV MODE] Real admin logged in:', data.user);
        // 로그인 성공 후 페이지 리로드하여 상태 반영 (옵션)
        if (!window.location.pathname.includes('all-api-test')) {
          window.location.reload();
        }
      } else {
        console.error('[DEV MODE] Auto-login failed:', data);
      }
    })
    .catch(error => {
      console.error('[DEV MODE] Auto-login error:', error);
    });
};

/**
 * 개발 환경에서 자동 로그인 상태 확인
 */
export const isDevAutoLoginEnabled = () => {
  return DEV_AUTO_LOGIN;
};

/**
 * 개발 환경 자동 로그인 해제
 */
export const devAutoLogout = () => {
  if (!DEV_AUTO_LOGIN) {
    return;
  }

  localStorage.removeItem('access_token');
  localStorage.removeItem('refresh_token');
  localStorage.removeItem('user');

  console.log('[DEV MODE] Auto-logout complete');
};

export default {
  devAutoLogin,
  isDevAutoLoginEnabled,
  devAutoLogout,
};
