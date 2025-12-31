# React 브라우저 테스트 체크리스트

**작성일**: 2025-12-31
**URL**: http://localhost:3001

---

## 🎯 테스트 목표

React 테스트 클라이언트가 Django 백엔드와 **정상 통신**하는지 검증

---

## ✅ Phase 1: 초기 로딩 테스트

### 1.1 페이지 로딩
- [ ] http://localhost:3001 접속 성공
- [ ] 에러 페이지 없음 (ErrorBoundary 미발동)
- [ ] 로딩 스피너 표시 후 페이지 렌더링

### 1.2 자동 로그인 확인
- [ ] 로그인 페이지 거치지 않고 바로 대시보드로 이동
- [ ] Console에 자동 로그인 메시지 표시:
  ```
  [DEV MODE] Auto-login enabled - bypassing authentication
  [DEV MODE] Mock user logged in: {username: "doctor", ...}
  ```

### 1.3 네비게이션 바 확인
- [ ] 상단 메뉴바 표시
- [ ] UC01-UC09 링크 모두 표시
- [ ] 우측 상단: "doctor (doctor)" 사용자 정보 표시
- [ ] "로그아웃" 버튼 표시

---

## ✅ Phase 2: 백엔드 API 통신 테스트

### 2.1 UC01: 인증/권한
**URL**: http://localhost:3001/uc01

**테스트 항목**:
- [ ] 페이지 로딩 성공
- [ ] "내 정보 조회" 버튼 클릭
- [ ] 응답 데이터 표시:
  ```json
  {
    "user_id": "bb9e305d-16b5-459d-956c-6f042c14eed4",
    "username": "doctor",
    "role": "doctor",
    ...
  }
  ```

**Network 탭 확인**:
- [ ] Request URL: `http://localhost/api/acct/me/`
- [ ] Status: 200 OK
- [ ] Request Headers: `Authorization: Bearer dev-mock-access-token-bypass-authentication`

---

### 2.2 UC02: EMR (전자의무기록)
**URL**: http://localhost:3001/uc02

**테스트 항목**:
- [ ] 페이지 로딩 성공
- [ ] "환자 목록 조회" 버튼 클릭
- [ ] **5명 환자 데이터 반환 확인**:
  - P20250001 (John Doe)
  - P20250002 (Jane Smith)
  - P20250003 (Michael Johnson)
  - P20250004 (Emily Davis)
  - P20250005 (David Wilson)

**Network 탭 확인**:
- [ ] Request URL: `http://localhost/api/emr/patients/`
- [ ] Status: 200 OK
- [ ] Response: JSON 배열, length: 5

---

### 2.3 UC03: OCS (처방전달시스템)
**URL**: http://localhost:3001/uc03

**테스트 항목**:
- [ ] 페이지 로딩 성공
- [ ] "오더 목록 조회" 버튼 클릭
- [ ] 오더 데이터 반환 (빈 배열 또는 샘플 데이터)

**Network 탭 확인**:
- [ ] Request URL: `http://localhost/api/emr/orders/`
- [ ] Status: 200 OK

---

### 2.4 UC04: LIS (검체검사시스템)
**URL**: http://localhost:3001/uc04

**테스트 항목**:
- [ ] 페이지 로딩 성공
- [ ] "검사 마스터 목록 조회" 버튼 클릭
- [ ] 검사 항목 데이터 반환

**Network 탭 확인**:
- [ ] Request URL: `http://localhost/api/lis/test-masters/`
- [ ] Status: 200 OK

---

### 2.5 UC05: RIS (영상검사시스템)
**URL**: http://localhost:3001/uc05

**테스트 항목**:
- [ ] 페이지 로딩 성공
- [ ] "Study 목록 조회" 버튼 클릭
- [ ] Study 데이터 반환 (빈 배열 또는 샘플 데이터)

**Network 탭 확인**:
- [ ] Request URL: `http://localhost/api/ris/studies/`
- [ ] Status: 200 OK

---

### 2.6 UC06: AI Jobs (알려진 이슈)
**URL**: http://localhost:3001/uc06

**테스트 항목**:
- [ ] 페이지 로딩 성공
- [ ] "AI Job 목록 조회" 버튼 클릭
- [ ] **500 에러 발생 확인** (예상됨):
  ```json
  {
    "error": {
      "code": "ERR_500",
      "message": "Invalid field name(s) given in select_related: 'patient', 'reviewer'..."
    }
  }
  ```

**Network 탭 확인**:
- [ ] Request URL: `http://localhost/api/ai/jobs/`
- [ ] Status: 500 Internal Server Error

**⚠️ 중요**: 이 에러는 **배포 범위 외** (FastAPI 팀 담당), 정상 동작임!

---

### 2.7 UC07: 알림
**URL**: http://localhost:3001/uc07

**테스트 항목**:
- [ ] 페이지 로딩 성공
- [ ] "내 알림 목록" 버튼 클릭
- [ ] 알림 데이터 반환 (빈 배열 또는 샘플 데이터)

**Network 탭 확인**:
- [ ] Request URL: `http://localhost/api/alert/my-alerts/`
- [ ] Status: 200 OK

---

### 2.8 UC08: FHIR
**URL**: http://localhost:3001/uc08

**테스트 항목**:
- [ ] 페이지 로딩 성공
- [ ] "동기화 큐 조회" 버튼 클릭
- [ ] FHIR 동기화 데이터 반환

**Network 탭 확인**:
- [ ] Request URL: `http://localhost/api/fhir/sync-queue/`
- [ ] Status: 200 OK

---

### 2.9 UC09: 감사 로그
**URL**: http://localhost:3001/uc09

**테스트 항목**:
- [ ] 페이지 로딩 성공
- [ ] "감사 로그 조회" 버튼 클릭
- [ ] 감사 로그 데이터 반환

**Network 탭 확인**:
- [ ] Request URL: `http://localhost/api/audit/logs/`
- [ ] Status: 200 OK

---

## ✅ Phase 3: Console 로그 확인

**F12 → Console 탭**

### 정상 로그 (예상)
```
[DEV MODE] Auto-login enabled - bypassing authentication
[DEV MODE] Mock user logged in: {username: "doctor", role: "doctor", ...}
[API Request] GET /acct/me/
[API Response] /acct/me/ {user_id: "...", username: "doctor", ...}
[API Request] GET /emr/patients/
[API Response] /emr/patients/ [{patient_id: "P20250001", ...}, ...]
```

### 에러 로그 확인
- [ ] ❌ CORS 에러 없음
- [ ] ❌ Network Error 없음
- [ ] ❌ 401 Unauthorized 에러 없음 (자동 로그인)
- [ ] ⚠️ UC06 AI Jobs 500 에러만 허용 (배포 범위 외)

---

## ✅ Phase 4: 로그아웃 및 재로그인 테스트

### 4.1 로그아웃
- [ ] 우측 상단 "로그아웃" 버튼 클릭
- [ ] 로그인 페이지로 리디렉션
- [ ] localStorage 토큰 삭제 확인 (F12 → Application → Local Storage)

### 4.2 수동 로그인
- [ ] 로그인 폼에 입력:
  - 아이디: `doctor`
  - 비밀번호: `doctor123`
- [ ] "로그인" 버튼 클릭
- [ ] 대시보드로 리디렉션
- [ ] **실제 JWT 토큰 발급 확인**:
  ```
  eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
  ```

**Network 탭 확인**:
- [ ] Request URL: `http://localhost/api/acct/login/`
- [ ] Method: POST
- [ ] Status: 200 OK
- [ ] Response Body:
  ```json
  {
    "access": "eyJhbGci...",
    "refresh": "eyJhbGci...",
    "user": {...}
  }
  ```

---

## 📊 테스트 결과 요약

### 성공 기준
- ✅ **9/9 UC 페이지 로딩 성공**
- ✅ **8/9 API 통신 성공** (UC06 제외)
- ✅ **자동 로그인 정상 동작**
- ✅ **JWT 토큰 관리 정상**
- ✅ **Console 에러 없음** (UC06 500 에러 제외)

### 실패 기준
- ❌ ErrorBoundary 발동 (React 에러)
- ❌ CORS 에러 발생
- ❌ Network Error (Django 미실행)
- ❌ UC01-05, UC07-09 중 1개라도 API 통신 실패

---

## 🎉 최종 판정

### ✅ 정상 작동 (배포 가능)
- 9개 UC 중 8개 정상 (UC06만 500 에러)
- 자동 로그인 정상
- 백엔드 통신 정상

### ❌ 문제 발생 (추가 수정 필요)
- 문제 발생 시 Console/Network 탭 캡처
- 에러 메시지 기록
- 해당 파일 코드 수정

---

## 📝 테스트 완료 후 작업

1. **스크린샷 촬영** (선택 사항):
   - 대시보드 화면
   - UC02 환자 목록 화면
   - Console 로그
   - Network 탭 API 요청

2. **테스트 결과 기록**:
   - 이 체크리스트에 ✅ 표시
   - 발견된 이슈 기록

3. **문서 업데이트**:
   - `LOG_작업이력.md`: 테스트 완료 기록
   - `36_다음_작업_계획.md`: 체크리스트 업데이트

---

**작성 완료**: 2025-12-31
**테스터**: _____________
**테스트 일시**: _____________
