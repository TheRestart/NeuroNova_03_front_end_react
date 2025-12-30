# CDSS API 테스트 클라이언트

NeuroNova CDSS 백엔드 API를 테스트하기 위한 임시 React 애플리케이션입니다.
팀원의 본격적인 React 통합 작업 전에 각 UC(Use Case) 기능을 검증하는 용도로 사용됩니다.

## 📋 목차

- [기능 개요](#기능-개요)
- [사전 요구사항](#사전-요구사항)
- [설치 방법](#설치-방법)
- [실행 방법](#실행-방법)
- [테스트 계정](#테스트-계정)
- [UC 테스트 페이지](#uc-테스트-페이지)
- [문제 해결](#문제-해결)

## 🎯 기능 개요

이 테스트 클라이언트는 다음 9개 UC(Use Case)의 API 엔드포인트를 테스트할 수 있습니다:

- **UC01**: 인증/권한 (Authentication & Authorization)
- **UC02**: EMR - 전자의무기록 (Electronic Medical Records)
- **UC03**: OCS - 처방전달시스템 (Order Communication System)
- **UC04**: LIS - 검체검사시스템 (Laboratory Information System)
- **UC05**: RIS - 영상검사시스템 (Radiology Information System)
- **UC06**: AI 추론 및 진단 보조 (AI Inference & Clinical Decision Support)
- **UC07**: 알림 및 이벤트 관리 (Alert & Event Management)
- **UC08**: FHIR R4 표준 인터페이스 (FHIR R4 Standard Interface)
- **UC09**: 감사 로그 및 보안 (Audit Log & Security)

## 📦 사전 요구사항

### 1. Node.js 및 npm 설치
```bash
# Node.js 버전 확인 (v14 이상 권장)
node --version
npm --version
```

### 2. Django 백엔드 서버 실행
테스트 클라이언트를 사용하기 전에 Django 백엔드 서버가 실행 중이어야 합니다.

```bash
# Django 프로젝트 디렉토리로 이동
cd NeuroNova_02_back_end/01_django_server

# 가상환경 활성화
# Windows:
venv\Scripts\activate
# Mac/Linux:
source venv/bin/activate

# Django 서버 실행
python manage.py runserver
```

Django 서버가 `http://localhost:8000`에서 실행되어야 합니다.

### 3. Docker 서비스 실행 (선택)
RIS(영상검사) 테스트를 위해서는 Orthanc PACS가 필요합니다.

```bash
# Orthanc PACS 디렉토리로 이동
cd NeuroNova_02_back_end/05_orthanc_pacs

# Docker Compose로 Orthanc 실행
docker-compose up -d
```

## 🚀 설치 방법

```bash
# 프로젝트 디렉토리로 이동
cd NeuroNova_03_front_end_react/00_test_client

# 의존성 패키지 설치
npm install
```

설치되는 주요 패키지:
- `react@18.2.0` - React 프레임워크
- `react-dom@18.2.0` - React DOM 렌더링
- `react-router-dom@6.20.0` - 클라이언트 사이드 라우팅
- `axios@1.6.0` - HTTP 클라이언트
- `react-scripts@5.0.1` - Create React App 빌드 도구

## 🏃 실행 방법

### 1. 개발 서버 시작

```bash
# React 개발 서버 실행
npm start
```

브라우저가 자동으로 열리고 `http://localhost:3000`으로 이동합니다.

### 2. 전체 실행 순서 (권장)

**터미널 1 - Django 백엔드:**
```bash
cd NeuroNova_02_back_end/01_django_server
venv\Scripts\activate
python manage.py runserver
```

**터미널 2 - React 프론트엔드:**
```bash
cd NeuroNova_03_front_end_react/00_test_client
npm start
```

**터미널 3 - Docker (선택):**
```bash
cd NeuroNova_02_back_end/05_orthanc_pacs
docker-compose up -d
```

## 👤 테스트 계정

로그인 페이지에서 "빠른 로그인" 버튼을 사용하거나 아래 계정 정보를 직접 입력할 수 있습니다:

| 역할 | 사용자명 | 비밀번호 | 권한 |
|------|----------|----------|------|
| 관리자 | `admin` | `admin123!@#` | 모든 기능 접근 가능 |
| 의사 | `doctor` | `doctor123!@#` | EMR, OCS, LIS, RIS, AI 접근 |
| 간호사 | `nurse` | `nurse123!@#` | EMR, OCS 접근 |
| 환자 | `patient` | `patient123!@#` | 본인 정보만 조회 |
| 방사선사 | `radiologist` | `rib123!@#` | RIS 접근 |
| 검사실 기사 | `labtech` | `lab123!@#` | LIS 접근 |

**계정 생성 방법 (필요시):**
```bash
# Django 서버 디렉토리에서
cd NeuroNova_02_back_end/02_django_server
venv\Scripts\python manage.py create_test_users
```

## 🧪 UC 테스트 페이지

### UC01: 인증/권한
- 사용자 목록 조회 (관리자 전용)
- 내 정보 조회
- 회원가입 (환자 역할)

### UC02: EMR (전자의무기록)
- Health Check
- 환자 목록 조회
- 환자 생성
- 진료 기록 목록
- 처방 목록

### UC03: OCS (처방전달시스템)
- 처방 목록 조회
- 처방 생성
- 처방 상세 조회
- 처방 상태 업데이트

### UC04: LIS (검체검사시스템)
- 검사 결과 목록 조회
- 검사 결과 생성
- 검사 결과 상세 조회
- 검사 항목 조회

### UC05: RIS (영상검사시스템)
- 영상 검사 목록 조회
- 영상 검사 생성
- 영상 검사 상세 조회
- DICOM 이미지 업로드
- 판독 보고서 작성

### UC06: AI 추론 및 진단 보조
- AI 모델 목록 조회
- 뇌졸중 위험도 예측
- 의료 영상 분석 (비동기)
- AI 분석 결과 조회
- 임상 의사결정 지원

### UC07: 알림 및 이벤트 관리
- 내 알림 목록 조회
- 알림 생성 (관리자 전용)
- 알림 읽음 처리
- 읽지 않은 알림 개수
- 시스템 이벤트 조회
- 위험 검사 결과 알림

### UC08: FHIR R4 표준 인터페이스
- FHIR 메타데이터 조회
- Patient 리소스 검색/조회
- Observation 리소스 검색
- Condition 리소스 검색
- MedicationRequest 리소스 검색
- DiagnosticReport 리소스 검색
- Bundle 생성

### UC09: 감사 로그 및 보안
- 감사 로그 조회 (관리자 전용)
- 환자 접근 이력 조회
- 내 활동 이력 조회
- 보안 이벤트 조회
- 데이터 무결성 검증
- 감사 로그 내보내기
- 규정 준수 보고서 생성

## 🔧 문제 해결

### CORS 오류
```
Access to XMLHttpRequest at 'http://localhost:8000/...' has been blocked by CORS policy
```

**해결 방법:**
1. Django `settings.py`에서 CORS 설정 확인:
   ```python
   CORS_ALLOWED_ORIGINS = [
       "http://localhost:3000",
   ]
   CORS_ALLOW_CREDENTIALS = True
   ```

2. `django-cors-headers` 패키지 설치 확인:
   ```bash
   pip install django-cors-headers
   ```

### 프록시 오류
```
Proxy error: Could not proxy request
```

**해결 방법:**
1. Django 서버가 `http://localhost:8000`에서 실행 중인지 확인
2. `package.json`의 proxy 설정 확인:
   ```json
   "proxy": "http://localhost:8000"
   ```

### 인증 토큰 오류
```
401 Unauthorized - Token is invalid or expired
```

**해결 방법:**
1. 로그아웃 후 다시 로그인
2. 브라우저 개발자 도구(F12) → Application → Local Storage → 토큰 삭제
3. 페이지 새로고침 (F5)

### 포트 충돌
```
Something is already running on port 3000
```

**해결 방법:**
1. 다른 포트 사용:
   ```bash
   PORT=3001 npm start
   ```

2. 또는 기존 프로세스 종료:
   ```bash
   # Windows
   netstat -ano | findstr :3000
   taskkill /PID <PID> /F

   # Mac/Linux
   lsof -ti:3000 | xargs kill -9
   ```

### Docker Orthanc 연결 실패
```
Network Error - Failed to connect to Orthanc
```

**해결 방법:**
1. Orthanc 컨테이너 상태 확인:
   ```bash
   docker ps
   ```

2. Orthanc 재시작:
   ```bash
   cd NeuroNova_02_back_end/05_orthanc_pacs
   docker-compose restart
   ```

3. Orthanc 웹 인터페이스 접속 테스트:
   ```
   http://localhost:8042/app/explorer.html
   ```

## 📝 API 응답 확인

각 API 테스터는 다음 정보를 표시합니다:

- **요청 정보**: HTTP 메서드, 엔드포인트, 요청 파라미터
- **응답 상태**: HTTP 상태 코드 (200, 201, 400, 401, 403, 404, 500 등)
- **응답 데이터**: JSON 형식의 응답 본문
- **에러 메시지**: 실패 시 상세 오류 정보

## 🔐 보안 참고사항

⚠️ **주의**: 이 애플리케이션은 **개발 및 테스트 전용**입니다.

- JWT 토큰이 `localStorage`에 저장됩니다 (운영 환경에서는 httpOnly 쿠키 권장)
- 하드코딩된 테스트 계정이 포함되어 있습니다
- HTTPS가 아닌 HTTP를 사용합니다
- 운영 환경에 배포하지 마세요

## 📚 추가 문서

- [Django 백엔드 배포 가이드](../../NeuroNova_02_back_end/01_doc/11_배포_가이드.md)
- [API 명세서 (Swagger)](http://localhost:8000/swagger/)
- [FHIR R4 표준](https://www.hl7.org/fhir/R4/)

## 🤝 기여

이슈 발견 시 팀 리더에게 보고하거나 Git 이슈로 등록해주세요.

---

**버전**: 0.1.0
**최종 업데이트**: 2025-12-30
**작성자**: NeuroNova Development Team
