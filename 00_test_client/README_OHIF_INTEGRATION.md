# OHIF Viewer 통합 가이드

**작성일**: 2025-12-31
**버전**: v3.0

## 개요

React 테스트 클라이언트에 OHIF Viewer를 npm 패키지로 통합하여 단일 빌드로 배포할 수 있습니다.

## 아키텍처

```
사용자
  ↓
React App (Port 3000)
  ├── /dashboard - 대시보드
  ├── /uc05 - RIS 테스트 페이지 (Orthanc 환자 목록)
  └── /viewer/:studyInstanceUID - DICOM Viewer (OHIF)
      ↓
Django API (Port 8000)
  └── /api/ris/dicom-web/* - DICOM Web Proxy
      ↓
Orthanc PACS (Port 8042)
```

## 설치 방법

### 1. 패키지 설치

```bash
cd NeuroNova_03_front_end_react/00_test_client
npm install
```

설치되는 주요 패키지:
- `@ohif/core` - OHIF 코어 라이브러리
- `@ohif/ui` - OHIF UI 컴포넌트
- `@ohif/viewer` - OHIF Viewer
- `@ohif/extension-cornerstone` - Cornerstone 이미지 렌더링
- `@ohif/extension-default` - 기본 확장 기능
- `cornerstone-core`, `cornerstone-tools` - DICOM 이미지 렌더링 엔진
- `cornerstone-wado-image-loader` - WADO 이미지 로더
- `dicom-parser` - DICOM 파서

### 2. 환경 변수 설정

`.env` 파일 생성 (`.env.example` 참고):

```bash
# React Dev Server Port
PORT=3000

# API Base URL
REACT_APP_API_URL=http://localhost:8000/api

# DICOM Web API (Django Proxy를 통해 Orthanc 접근)
REACT_APP_DICOM_WEB_ROOT=http://localhost:8000/api/ris/dicom-web

# WSL 환경에서는:
# REACT_APP_API_URL=http://172.29.64.1:8000/api
# REACT_APP_DICOM_WEB_ROOT=http://172.29.64.1:8000/api/ris/dicom-web
```

## 실행 방법

### 개발 환경

#### 1. 백엔드 서비스 시작 (순서대로)

```bash
# Terminal 1: Redis
cd NeuroNova_02_back_end/07_redis
docker-compose up -d

# Terminal 2: Orthanc PACS
cd ../05_orthanc_pacs
docker-compose up -d

# Terminal 3: Django Server
cd ../02_django_server
python manage.py runserver
```

#### 2. React 클라이언트 시작

```bash
# Terminal 4: React App with OHIF
cd NeuroNova_03_front_end_react/00_test_client
npm start
```

브라우저에서 `http://localhost:3000` 접속

### 프로덕션 환경

```bash
# 빌드
npm run build

# build/ 폴더를 Nginx 정적 파일로 배포
# 예: /var/www/react-build
```

Nginx 설정 예시:
```nginx
server {
    listen 80;
    server_name yourdomain.com;

    # React App (OHIF 포함)
    location / {
        root /var/www/react-build;
        try_files $uri /index.html;
    }

    # Django API Proxy
    location /api/ {
        proxy_pass http://localhost:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

## 주요 기능

### 1. Orthanc 환자 목록 조회

**페이지**: `/uc05` (UC05: RIS 테스트)

기능:
- Orthanc에 저장된 환자 목록 표시
- 환자별 Study 수 표시
- "View Study" 버튼으로 DICOM Viewer 열기

### 2. DICOM Viewer

**페이지**: `/viewer/:studyInstanceUID`

기능:
- Study Instance UID로 DICOM 이미지 조회
- Study 메타데이터 표시 (환자명, 검사일, Modality 등)
- DICOM Web API를 통한 안전한 이미지 접근 (Django Proxy 경유)

**현재 구현 상태**:
- ✅ 라우팅 및 페이지 구조
- ✅ Django Proxy를 통한 Study 메타데이터 조회
- ✅ JWT 토큰 인증 통합
- ⏳ OHIF Viewer 전체 기능 (npm install 후 사용 가능)

### 3. 보안 구조

모든 DICOM 데이터 접근은 Django를 경유:
1. React에서 JWT 토큰과 함께 요청
2. Django에서 토큰 검증 및 권한 확인
3. Django → Orthanc 프록시
4. Nginx X-Accel-Redirect로 효율적인 파일 전송

## 파일 구조

```
00_test_client/
├── src/
│   ├── config/
│   │   └── ohif.config.js          # OHIF Viewer 설정
│   ├── pages/
│   │   ├── UC05RISTest.js          # RIS 테스트 (환자 목록 + View Images)
│   │   ├── ViewerPage.js           # DICOM Viewer 페이지
│   │   └── ViewerPage.css          # Viewer 스타일
│   ├── api/
│   │   └── apiClient.js            # API 클라이언트 (토큰 자동 갱신)
│   └── App.js                       # 라우팅 설정
├── package.json                     # OHIF 패키지 포함
├── .env.example                     # 환경 변수 예시
└── README_OHIF_INTEGRATION.md       # 이 문서
```

## API 엔드포인트

### Django RIS API

| 엔드포인트 | 메서드 | 설명 |
|-----------|--------|------|
| `/api/ris/test-orthanc-patients/` | GET | Orthanc 환자 목록 조회 (페이지네이션) |
| `/api/ris/test-orthanc-studies/` | GET | Orthanc Study 목록 조회 |
| `/api/ris/dicom-web/studies/:uid/metadata` | GET | Study 메타데이터 조회 (DICOM JSON) |
| `/api/ris/dicom-web/studies/:uid/...` | GET | DICOM-Web API (QIDO/WADO) |

## 개발 참고 사항

### OHIF Viewer 전체 기능 사용하기

현재 구조는 OHIF Viewer를 통합할 준비가 완료되었습니다. 실제 DICOM 이미지 렌더링을 위해:

1. `npm install` 실행 (패키지 설치)
2. `ViewerPage.js`의 TODO 섹션에서 OHIF 초기화 로직 구현
3. OHIF 문서 참고: https://docs.ohif.org/

### Cornerstone 이미지 렌더링

OHIF는 Cornerstone을 사용하여 DICOM 이미지를 렌더링합니다:
- HTML5 Canvas 기반
- WebGL 가속 지원
- Multi-planar reconstruction (MPR)
- 측정 도구 (거리, 각도, ROI 등)

### 커스터마이징

OHIF 설정 파일 (`src/config/ohif.config.js`)에서:
- Data source 설정 변경
- Extension 추가/제거
- Mode 커스터마이징
- UI 테마 변경

## 트러블슈팅

### 1. "서버에 연결할 수 없습니다" 오류

**원인**: Django 서버가 실행되지 않음

**해결**:
```bash
cd NeuroNova_02_back_end/02_django_server
python manage.py runserver
```

### 2. "Orthanc 환자가 없습니다" 메시지

**원인**: Orthanc에 DICOM 데이터가 업로드되지 않음

**해결**:
- Orthanc 웹 UI 접속: `http://localhost:8042`
- Upload 메뉴에서 DICOM 파일 업로드
- 또는 DICOM 전송 도구 사용 (예: dcm4che, Horos)

### 3. CORS 오류

**원인**: Django CORS 설정 누락

**해결** (`settings.py`):
```python
INSTALLED_APPS = [
    ...
    'corsheaders',
]

MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware',
    ...
]

CORS_ALLOWED_ORIGINS = [
    'http://localhost:3000',
]
```

### 4. 401 Unauthorized 오류

**원인**: JWT 토큰 만료 또는 누락

**해결**:
- 로그아웃 후 다시 로그인
- `apiClient.js`의 토큰 자동 갱신 로직 확인
- localStorage에 `access_token` 존재 확인

## 추가 개발 예정

- [ ] OHIF Viewer 완전 통합 (이미지 렌더링)
- [ ] AI 결과 오버레이 표시
- [ ] 측정 도구 커스터마이징
- [ ] 판독 워크플로우 통합
- [ ] HTJ2K 이미지 포맷 지원

## 참고 문서

- [OHIF 공식 문서](https://docs.ohif.org/)
- [Cornerstone 문서](https://cornerstonejs.org/)
- [DICOM Web 표준](https://www.dicomstandard.org/dicomweb)
- [07_서비스_구조_요약.md](../../01_doc/07_서비스_구조_요약.md) - v3.0 아키텍처
- [12_GCP_배포_가이드.md](../../01_doc/12_GCP_배포_가이드.md) - 프로덕션 배포

---

**작성**: NeuroNova Development Team
**최종 업데이트**: 2025-12-31
