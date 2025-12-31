# 개발 환경 자동 로그인 가이드

**목적**: 로그인 없이 빠르게 서비스 테스트
**대상**: 개발자, QA 엔지니어
**최종 수정일**: 2025-12-31

---

## 🎯 개요

개발 및 테스트 편의를 위해 **로그인 절차를 우회**하고 바로 서비스를 이용할 수 있습니다.

### 주요 기능
- ✅ 로그인 페이지 건너뛰기
- ✅ 가짜 JWT 토큰 자동 생성
- ✅ 역할별 사용자 선택 (doctor, nurse, admin 등)
- ✅ Django 인증 비활성화와 연동

---

## ⚡ 빠른 시작 (3분)

### Step 1: Django 백엔드 설정

**.env 파일 확인** (`NeuroNova_02_back_end/02_django_server/.env`):
```bash
# 보안 비활성화 (개발 전용)
ENABLE_SECURITY=False
```

이미 설정되어 있다면 **Skip!**

---

### Step 2: React 프론트엔드 설정

**.env.local 파일이 이미 생성됨**:
```bash
# 파일 위치: NeuroNova_03_front_end_react/00_test_client/.env.local

REACT_APP_DEV_AUTO_LOGIN=true
REACT_APP_DEV_MOCK_USER=doctor
```

---

### Step 3: React 서버 실행

```bash
# WSL Ubuntu-22.04 LTS에서 실행
cd NeuroNova_03_front_end_react/00_test_client
npm start

# 브라우저 자동 열림: http://localhost:3001
```

---

### Step 4: 자동 로그인 확인

브라우저 콘솔에 다음 메시지 확인:
```
[DEV MODE] Auto-login enabled - bypassing authentication
[DEV MODE] Mock user logged in: {username: "doctor", role: "doctor", ...}
```

✅ **로그인 페이지 없이 바로 대시보드 접근!**

---

## 🔧 고급 설정

### 역할별 사용자 변경

**.env.local 파일 수정**:
```bash
# 의사 (기본값)
REACT_APP_DEV_MOCK_USER=doctor

# 간호사
REACT_APP_DEV_MOCK_USER=nurse

# 관리자
REACT_APP_DEV_MOCK_USER=admin

# 환자
REACT_APP_DEV_MOCK_USER=patient

# 방사선사
REACT_APP_DEV_MOCK_USER=radiologist

# 검사실 기사
REACT_APP_DEV_MOCK_USER=labtech
```

**변경 후 React 서버 재시작 필요**:
```bash
# Ctrl+C로 중지 후 재시작
npm start
```

---

### 자동 로그인 비활성화

**.env.local 파일 수정**:
```bash
# false로 변경
REACT_APP_DEV_AUTO_LOGIN=false
```

또는 파일 삭제:
```bash
rm .env.local
```

---

## 🛠️ 동작 원리

### 1. Django 백엔드 (ENABLE_SECURITY=False)

**settings.py**:
```python
ENABLE_SECURITY = os.getenv('ENABLE_SECURITY', 'False') == 'True'

REST_FRAMEWORK = {
    'DEFAULT_PERMISSION_CLASSES': [
        'rest_framework.permissions.IsAuthenticated',
    ] if ENABLE_SECURITY else [
        'rest_framework.permissions.AllowAny',  # 🔓 인증 불필요
    ],
}
```

**결과**:
- 모든 API 엔드포인트가 JWT 토큰 없이 접근 가능
- 권한 검증 건너뛰기

---

### 2. React 프론트엔드 (devAutoLogin)

**App.js**:
```javascript
import { devAutoLogin, isDevAutoLoginEnabled } from './utils/devAutoLogin';

useEffect(() => {
  // 🔓 개발 환경 자동 로그인
  if (isDevAutoLoginEnabled()) {
    devAutoLogin();
  }

  // localStorage에서 토큰 확인
  const token = localStorage.getItem('access_token');
  if (token) {
    setIsAuthenticated(true);
  }
}, []);
```

**devAutoLogin 함수**:
```javascript
export const devAutoLogin = () => {
  // 가짜 토큰 생성
  const mockTokens = {
    access_token: 'dev-mock-access-token-bypass-authentication',
    refresh_token: 'dev-mock-refresh-token',
  };

  // 가짜 사용자 정보
  const mockUser = {
    user_id: 'dev-doctor-uuid',
    username: 'doctor',
    role: 'doctor',
    full_name: 'Dev Doctor',
  };

  // localStorage에 저장
  localStorage.setItem('access_token', mockTokens.access_token);
  localStorage.setItem('user', JSON.stringify(mockUser));
};
```

**결과**:
- 페이지 로드 시 자동으로 localStorage에 토큰 저장
- isAuthenticated=true → 대시보드로 리디렉션

---

## 📋 체크리스트

### 백엔드 설정
- [ ] Django `.env` 파일에서 `ENABLE_SECURITY=False` 확인
- [ ] Django 서버 실행 중 (`docker ps | grep django`)

### 프론트엔드 설정
- [ ] React `.env.local` 파일 존재
- [ ] `REACT_APP_DEV_AUTO_LOGIN=true` 설정
- [ ] `REACT_APP_DEV_MOCK_USER=doctor` (또는 원하는 역할)

### 테스트
- [ ] React 서버 실행: `npm start`
- [ ] 브라우저 자동 열림: http://localhost:3001
- [ ] 콘솔에 "[DEV MODE] Auto-login enabled" 메시지 확인
- [ ] 로그인 없이 바로 대시보드 접근
- [ ] UC02-UC09 메뉴 정상 작동

---

## ❓ FAQ

### Q1. 자동 로그인이 작동하지 않아요

**원인**: 환경변수가 React 빌드에 포함되지 않음

**해결**:
```bash
# 1. .env.local 파일 내용 확인
cat .env.local

# 2. REACT_APP_ 접두사 확인 (필수!)
# ✅ REACT_APP_DEV_AUTO_LOGIN=true (올바름)
# ❌ DEV_AUTO_LOGIN=true (작동 안 함)

# 3. React 서버 재시작
npm start
```

---

### Q2. API 호출이 401 Unauthorized 에러

**원인**: Django `ENABLE_SECURITY=True`로 설정됨

**해결**:
```bash
# 1. Django .env 파일 확인
cat NeuroNova_02_back_end/02_django_server/.env | grep ENABLE_SECURITY

# 2. ENABLE_SECURITY=False로 변경
# .env 파일 수정

# 3. Django 서버 재시작
docker restart neuronova-django-dev
```

---

### Q3. 특정 역할로 변경하고 싶어요

**방법 A: .env.local 수정 (권장)**
```bash
# .env.local 파일
REACT_APP_DEV_MOCK_USER=admin  # 또는 nurse, patient 등

# React 서버 재시작
npm start
```

**방법 B: 브라우저 콘솔에서 직접 변경**
```javascript
// F12 → Console
localStorage.setItem('user', JSON.stringify({
  user_id: 'admin-uuid',
  username: 'admin',
  role: 'admin',
  full_name: 'Admin User'
}));

// 페이지 새로고침
location.reload();
```

---

### Q4. 프로덕션 배포 시 주의사항은?

**절대 주의!**

1. **.env.local 파일 삭제**:
   ```bash
   rm .env.local
   ```

2. **.env.production 사용**:
   ```bash
   # REACT_APP_DEV_AUTO_LOGIN 설정 없음 (기본 false)
   REACT_APP_API_URL=/api
   ```

3. **Django ENABLE_SECURITY=True**:
   ```bash
   # 프로덕션 .env
   ENABLE_SECURITY=True
   DEBUG=False
   ```

4. **Git에 .env.local 커밋 금지**:
   ```bash
   # .gitignore에 이미 포함됨
   .env.local
   ```

---

## 🔒 보안 고려사항

### 왜 안전한가?

1. **환경변수 기반**:
   - `REACT_APP_DEV_AUTO_LOGIN`이 명시적으로 true여야만 작동
   - 프로덕션 빌드 시 환경변수 없음 → 기능 비활성화

2. **Django 이중 보안**:
   - `ENABLE_SECURITY=False`도 별도로 설정 필요
   - 한쪽만 설정해도 작동 안 함

3. **.env.local은 Git 무시**:
   - .gitignore에 포함
   - 로컬 개발 환경에서만 존재

### 프로덕션 체크리스트

- [ ] `ENABLE_SECURITY=True` (Django)
- [ ] `REACT_APP_DEV_AUTO_LOGIN` 환경변수 없음 (React)
- [ ] `.env.local` 파일 삭제
- [ ] `.env.production` 사용
- [ ] DEBUG=False (Django)

---

## 📝 추가 정보

### 관련 파일

- **React**:
  - `src/utils/devAutoLogin.js`: 자동 로그인 로직
  - `src/App.js`: devAutoLogin 호출
  - `.env.local`: 개발 환경변수

- **Django**:
  - `cdss_backend/settings.py`: ENABLE_SECURITY 설정
  - `.env`: 백엔드 환경변수

### 관련 문서

- [사용방법_설명문서.md](사용방법_설명문서.md): 전체 시스템 사용법
- [README.md](README.md): React 클라이언트 개요

---

**작성**: Claude AI
**최종 업데이트**: 2025-12-31
**버전**: 1.0

**🎉 이제 로그인 없이 바로 서비스를 테스트할 수 있습니다!**
