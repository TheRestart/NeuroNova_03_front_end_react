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

  // 가짜 JWT 토큰 생성 (Django가 검증하지 않음)
  const mockTokens = {
    access_token: 'dev-mock-access-token-bypass-authentication',
    refresh_token: 'dev-mock-refresh-token',
  };

  // 가짜 사용자 정보 생성
  const mockUser = {
    user_id: `dev-${DEV_MOCK_USER}-uuid`,
    username: DEV_MOCK_USER,
    role: DEV_MOCK_USER === 'doctor' ? 'doctor' : DEV_MOCK_USER,
    full_name: `Dev ${DEV_MOCK_USER.charAt(0).toUpperCase() + DEV_MOCK_USER.slice(1)}`,
    email: `${DEV_MOCK_USER}@dev.local`,
  };

  // localStorage에 저장
  localStorage.setItem('access_token', mockTokens.access_token);
  localStorage.setItem('refresh_token', mockTokens.refresh_token);
  localStorage.setItem('user', JSON.stringify(mockUser));

  console.log('[DEV MODE] Mock user logged in:', mockUser);
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
