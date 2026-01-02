# NeuroNova Frontend Work Log (00_test_client)

## 📅 프로젝트 개요
- **위치**: `NeuroNova_03_front_end_react/00_test_client`
- **목적**: NeuroNova CDSS 시스템의 전 영역(UC01~UC10)을 검증하는 통합 테스트 클라이언트

---

## 🛠️ 작업 이력

### 2026-01-02
#### 1. 하드코딩 URL 리팩토링
- **내용**: `localhost`가 포함된 하드코딩된 URL을 `process.env` 기반으로 전환.
- **대상 파일**:
  - `src/utils/devAutoLogin.js`
  - `src/pages/ViewerPage.js`
  - `src/pages/MonitoringPage.js`
  - `.env.example` 업데이트

#### 2. React Hooks 규칙 위반 수정 (ResponseTable.js)
- **증상**: 일반 함수 `renderArrayTable` 내에서 `useMemo` 호출로 인한 ESLint 에러.
- **조치**: `ArrayTable` 컴포넌트로 분리하여 상위에서 정규 컴포넌트로 호출하도록 수정.

#### 3. Viewer 연동 경로 수정
- **증상**: 뷰어가 Orthanc 직접 경로(`:8042`)를 호출하여 404 발생.
- **조치**: Nginx Proxy 경로(`http://localhost/pacs-viewer`) 및 DICOM Web API 경로로 수정.

#### 4. RIS Study 상세 조회 404 해결
- **내용**: `RadiologyStudyViewSet`의 `lookup_field`를 `study_instance_uid`로 변경하여 뷰어 연동 시 UUID 대신 DICOM UID로 조회 가능하게 수정.

#### 5. EMR 트랜잭션 레이스 컨디션 해결
- **내용**: 환자 및 처방 생성 시 DB 트랜잭션이 완료되기 전에 Celery Task가 시작되는 문제 해결 (`transaction.on_commit` 적용).

---

## 🔍 현재 이슈 및 조치 계획 (To-Do)

### UC01: 인증/권한
- [ ] Admin의 Patient 계정 생성(회원가입) 에러 분석

### UC02: EMR (환자 관리)
- [x] 환자 생성 시 OpenEMR/FHIR 동기화 트랜잭션 에러 해결 (on_commit 적용)

### UC03: OCS (처방 관리)
- [x] 처방 생성 트랜잭션 레이스 컨디션 해결 (on_commit 적용)
- [ ] 예시 입력 데이터 보강 (UI 상의 JSON 템플릿 개선)

### UC04: LIS (검체 검사)
- [/] 데이터 시딩 및 BRCA1 유전 검사 예제 생성 (진행 중)
- [ ] 유전 검사 결과 생성 시 필드명(`results` vs `result_details`) 확인 및 수정

### UC05: RIS (영상 검사)
- [x] Study 상세 조회(`/api/ris/studies/{uid}/`) 404 에러 원인 파악 및 수정 (Lookup Field 설정)
- [/] 데이터 시딩을 통한 MRI 환자 및 시리즈 로딩 검증 (진행 중)

---

## 📊 데이터 시딩 기록
- (향후 추가된 시딩 명령어나 스크립트 기록 예정)
