/**
 * Protected Route Component
 * 
 * 인증 및 권한 검사를 통한 라우트 보호
 */
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';

interface ProtectedRouteProps {
  children: React.ReactElement;
  menuId?: string;              // 메뉴 ID 기반 접근 제어
  permission?: string;          // 권한 코드 기반 접근 제어
  requireAuth?: boolean;        // 인증만 필요 (기본: true)
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  menuId,
  permission,
  requireAuth = true,
}) => {
  const { isAuthenticated, isAuthReady, hasMenuAccess, checkPermission } = useAuthStore();

  // Auth 초기화 대기
  if (!isAuthReady) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-gray-500">Loading...</div>
      </div>
    );
  }

  // 인증 확인
  if (requireAuth && !isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // 메뉴 접근 권한 확인
  if (menuId && !hasMenuAccess(menuId)) {
    console.warn(`[ProtectedRoute] Access denied to menu: ${menuId}`);
    return <Navigate to="/403" replace />;
  }

  // 권한 코드 확인
  if (permission && !checkPermission(permission)) {
    console.warn(`[ProtectedRoute] Missing permission: ${permission}`);
    return <Navigate to="/403" replace />;
  }

  return children;
};

export default ProtectedRoute;
