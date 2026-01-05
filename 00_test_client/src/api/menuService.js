/**
 * Menu API Service
 *
 * 메뉴 관리 관련 API 호출
 */
import apiClient from './apiClient';

/**
 * 현재 사용자가 접근 가능한 메뉴 트리 조회
 * @returns {Promise<{menus: Array}>}
 */
export const getMyMenus = async () => {
    const response = await apiClient.get('/menus/my/');
    return response.data;
};
