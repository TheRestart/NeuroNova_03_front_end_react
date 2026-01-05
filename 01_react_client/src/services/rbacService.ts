/**
 * RBAC API Service
 * 
 * 권한 관리 관련 API 호출
 */
import apiClient from './apiClient';
import { UserPermissionsResponse, PermissionUpdate } from '../types/rbac';

/**
 * 현재 사용자의 권한 목록 조회
 */
export const getMyPermissions = async (): Promise<UserPermissionsResponse> => {
  const response = await apiClient.get<UserPermissionsResponse>('/rbac/permissions/me/');
  return response.data;
};

/**
 * 특정 사용자의 권한 업데이트 (관리자용)
 */
export const updateUserPermissions = async (
  userId: number,
  permissions: string[]
): Promise<void> => {
  await apiClient.post<void>(`/rbac/permissions/user/${userId}/`, {
    permissions
  });
};
