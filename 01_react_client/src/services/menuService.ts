/**
 * Menu API Service
 * 
 * 메뉴 관리 관련 API 호출
 */
import apiClient from './apiClient';
import { MenuResponse } from '../types/menu';

/**
 * 현재 사용자가 접근 가능한 메뉴 트리 조회
 */
export const getMyMenus = async (): Promise<MenuResponse> => {
  const response = await apiClient.get<MenuResponse>('/menus/my/');
  return response.data;
};
