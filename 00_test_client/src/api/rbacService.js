/**
 * RBAC API Service
 * 
 * 권한 관리 관련 API 호출
 */
import apiClient from './apiClient';

/**
 * 현재 사용자의 권한 목록 조회
 * @returns {Promise<{permissions: string[]}>}
 */
export const getMyPermissions = async () => {
  const response = await apiClient.get('/rbac/permissions/me/');
  return response.data;
};

/**
 * 특정 사용자의 권한 업데이트 (관리자용)
 * @param {number} userId
 * @param {string[]} permissions
 * @returns {Promise<void>}
 */
export const updateUserPermissions = async (userId, permissions) => {
  await apiClient.post(`/rbac/permissions/user/${userId}/`, {
    permissions
  });
};
