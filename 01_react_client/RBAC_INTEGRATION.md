# RBAC Integration Guide

**작업일**: 2026-01-05
**상태**: ✅ React Frontend 통합 완료

---

## 통합 완료 항목

### 1. Types 정의

#### 📁 `src/types/menu.ts`
- `MenuNode`: 메뉴 트리 구조 타입
- `MenuResponse`: API 응답 타입

#### 📁 `src/types/rbac.ts`
- `Permission`: 권한 타입
- `Role`: 역할 타입
- `UserPermissionsResponse`: 권한 조회 응답 타입

### 2. API 서비스

#### 📁 `src/services/rbacService.ts`
- `getMyPermissions()`: 현재 사용자 권한 조회
- `updateUserPermissions()`: 사용자 권한 업데이트 (관리자용)

#### 📁 `src/services/menuService.ts`
- `getMyMenus()`: 접근 가능한 메뉴 트리 조회

#### 📁 `src/services/permissionSocket.ts`
- `connectPermissionSocket()`: 권한 변경 WebSocket 연결

### 3. 상태 관리

#### 📁 `src/stores/authStore.ts` (확장)
**추가된 상태:**
- `menus: MenuNode[]`: 사용자 메뉴 트리
- `permissions: string[]`: 사용자 권한 코드 배열
- `wsConnection: WebSocket | null`: WebSocket 연결
- `isAuthReady: boolean`: 인증 초기화 완료 여부

**추가된 액션:**
- `refreshMenusAndPermissions()`: 메뉴 및 권한 재조회
- `hasMenuAccess(menuId)`: 메뉴 접근 권한 확인
- `checkPermission(permission)`: 권한 코드 확인

**WebSocket 통합:**
- 로그인 시 자동 연결
- 권한 변경 시 자동 메뉴/권한 재조회
- 로그아웃 시 연결 종료

### 4. 컴포넌트

#### 📁 `src/components/ProtectedRoute.tsx`
**Props:**
- `menuId?: string`: 메뉴 ID 기반 접근 제어
- `permission?: string`: 권한 코드 기반 접근 제어
- `requireAuth?: boolean`: 인증만 필요 (기본: true)

**동작:**
- 인증 확인 → 로그인 페이지 리다이렉트
- 메뉴 접근 권한 확인 → 403 페이지 리다이렉트
- 권한 코드 확인 → 403 페이지 리다이렉트

#### 📁 `src/components/Sidebar.tsx`
**기능:**
- 권한 기반 동적 메뉴 렌더링
- 역할별 메뉴 라벨 표시 (DOCTOR vs NURSE)
- 계층 구조 메뉴 (그룹 토글)
- Active 링크 하이라이팅

#### 📁 `src/components/Forbidden.tsx`
- 403 Forbidden 페이지
- 이전 페이지 / 대시보드 이동 버튼

#### 📁 `src/styles/sidebar.css`
- Sidebar 스타일링

### 5. 앱 통합

#### 📁 `src/App.tsx`
**변경사항:**
- `AppLayout` 컴포넌트 추가 (Sidebar 통합)
- 인증 상태에 따라 Sidebar 표시/숨김
- ProtectedRoute에 `menuId` prop 추가
- `/403` 경로 추가

#### 📁 `src/index.tsx`
**변경사항:**
- 앱 시작 시 `checkAuth()` 호출
- 인증 초기화 후 렌더링

---

## 사용 방법

### 1. 환경 변수 설정

`.env` 파일 생성:
```bash
cp .env.example .env
```

`.env` 내용:
```env
REACT_APP_API_URL=http://localhost:8000/api
REACT_APP_WS_URL=ws://localhost:8000
NODE_ENV=development
```

### 2. 의존성 설치

```bash
npm install
# 또는
yarn install
```

### 3. 개발 서버 실행

```bash
npm start
# 또는
yarn start
```

### 4. Protected Route 사용 예시

```tsx
import ProtectedRoute from './components/ProtectedRoute';

// 메뉴 ID 기반 접근 제어
<Route
  path="/patients"
  element={
    <ProtectedRoute menuId="PATIENT_LIST">
      <PatientListPage />
    </ProtectedRoute>
  }
/>

// 권한 코드 기반 접근 제어
<Route
  path="/admin/users"
  element={
    <ProtectedRoute permission="VIEW_USER_LIST">
      <UserManagementPage />
    </ProtectedRoute>
  }
/>

// 인증만 필요
<Route
  path="/profile"
  element={
    <ProtectedRoute>
      <ProfilePage />
    </ProtectedRoute>
  }
/>
```

### 5. 권한 체크 Hook 사용

```tsx
import { useAuthStore } from './stores/authStore';

function MyComponent() {
  const { hasMenuAccess, checkPermission, permissions } = useAuthStore();

  // 메뉴 접근 권한 확인
  if (hasMenuAccess('PATIENT_LIST')) {
    // 환자 목록 표시
  }

  // 권한 코드 확인
  if (checkPermission('CREATE_ORDER')) {
    // 오더 생성 버튼 표시
  }

  // 현재 권한 목록
  console.log('My permissions:', permissions);
}
```

---

## API 엔드포인트

### Backend Django

- `GET /api/rbac/permissions/me/`: 현재 사용자 권한 조회
- `POST /api/rbac/permissions/user/<id>/`: 특정 사용자 권한 업데이트
- `GET /api/menus/my/`: 현재 사용자 메뉴 트리 조회
- `WS /ws/permissions/`: 권한 변경 실시간 알림

### 응답 예시

**GET /api/menus/my/**
```json
{
  "menus": [
    {
      "id": "DASHBOARD",
      "path": "/dashboard",
      "icon": "dashboard",
      "groupLabel": null,
      "breadcrumbOnly": false,
      "labels": {
        "DEFAULT": "대시보드",
        "DOCTOR": "의사 대시보드",
        "NURSE": "간호사 대시보드"
      },
      "children": []
    },
    {
      "id": "PATIENT",
      "path": null,
      "icon": "people",
      "groupLabel": "환자 관리",
      "breadcrumbOnly": false,
      "labels": {
        "DEFAULT": "환자",
        "DOCTOR": "환자 목록",
        "NURSE": "담당 환자"
      },
      "children": [
        {
          "id": "PATIENT_LIST",
          "path": "/patients",
          "labels": { "DEFAULT": "환자 목록" }
        }
      ]
    }
  ]
}
```

**GET /api/rbac/permissions/me/**
```json
{
  "permissions": [
    "VIEW_PATIENT",
    "CREATE_ORDER",
    "VIEW_DASHBOARD"
  ]
}
```

---

## 트러블슈팅

### WebSocket 연결 실패
- Backend Django 서버가 실행 중인지 확인
- `.env` 파일의 `REACT_APP_WS_URL` 확인
- CORS 설정 확인 (Django settings.py)

### 메뉴가 표시되지 않음
- Backend에서 메뉴 데이터가 시딩되었는지 확인
- 사용자에게 Role이 할당되었는지 확인
- Browser Console에서 API 응답 확인

### 권한 확인이 작동하지 않음
- Backend에서 Permission 데이터가 시딩되었는지 확인
- Role-Permission 매핑이 올바른지 확인
- `authStore.permissions` 배열 확인

---

## 다음 단계

- [ ] Backend 마이그레이션 실행
- [ ] Permission/Role/Menu 시딩 데이터 생성
- [ ] 실제 페이지에 ProtectedRoute 적용
- [ ] 통합 테스트

---

**작성**: Claude AI Assistant
**참조**: [brain_tumor_dev_통합_완료_보고서_20260105.md](../../01_doc/brain_tumor_dev_통합_완료_보고서_20260105.md)
