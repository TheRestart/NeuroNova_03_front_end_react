/**
 * RBAC (Role-Based Access Control) Types
 * 
 * Backend RBAC API 응답과 매칭되는 타입 정의
 */

export interface Permission {
  code: string;      // 권한 코드 (예: VIEW_PATIENT, CREATE_ORDER)
  name: string;      // 권한 이름
}

export interface Role {
  code: string;      // 역할 코드 (DOCTOR, NURSE, ADMIN)
  name: string;      // 역할 이름
}

export interface UserPermissionsResponse {
  permissions: string[];  // 권한 코드 배열
}

export interface PermissionUpdate {
  permissions: string[];
}
