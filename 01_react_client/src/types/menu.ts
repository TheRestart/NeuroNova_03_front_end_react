/**
 * Menu Types
 * 
 * Backend API 응답과 매칭되는 메뉴 타입 정의
 */

export interface MenuNode {
  id: string;                          // 메뉴 ID (예: DASHBOARD, PATIENT_LIST)
  path?: string;                       // React Router 경로
  icon?: string;                       // 아이콘 이름
  groupLabel?: string;                 // 그룹 라벨
  breadcrumbOnly: boolean;             // 사이드바 숨김 여부
  labels: Record<string, string>;      // 역할별 라벨 (예: {DOCTOR: "환자 목록", NURSE: "담당 환자"})
  children?: MenuNode[];               // 자식 메뉴
}

export interface MenuResponse {
  menus: MenuNode[];
}
