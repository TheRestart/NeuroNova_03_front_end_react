# React 서버 실행 방법 (간단 가이드)

**작성일**: 2025-12-31
**환경**: WSL Ubuntu-22.04 LTS

---

## ⚡ 빠른 실행 (3단계)

### 1단계: WSL Ubuntu-22.04 터미널 열기

**Windows PowerShell 또는 CMD에서**:
```powershell
wsl -d Ubuntu-22.04
```

**또는 Windows Terminal**:
- 새 탭 → "Ubuntu-22.04" 선택

---

### 2단계: 프로젝트 디렉토리 이동

```bash
cd /mnt/d/1222/NeuroNova_v1/NeuroNova_03_front_end_react/00_test_client
```

---

### 3단계: React 개발 서버 실행

```bash
PORT=3001 npm start
```

**또는**:
```bash
npm run dev
```

---

## 📱 브라우저 접속

서버 실행 후 자동으로 브라우저가 열립니다.

수동 접속:
```
http://localhost:3001
```

---

## 🔓 자동 로그인

`.env.local` 설정에 따라 자동으로 **doctor** 계정으로 로그인됩니다.

```bash
REACT_APP_DEV_AUTO_LOGIN=true
REACT_APP_DEV_MOCK_USER=doctor
```

---

## ✅ 정상 동작 확인

### 1. 페이지 로딩 확인
- ✅ 에러 없이 로딩
- ✅ 자동으로 대시보드로 리디렉션

### 2. 네비게이션 확인
- ✅ 상단 메뉴: UC01-UC09 링크 표시
- ✅ 우측 상단: "doctor (doctor)" 사용자 정보 표시

### 3. API 통신 확인
- ✅ UC02 (EMR) → 환자 목록 조회 → 5명 환자 데이터 반환
- ✅ UC03 (OCS) → 오더 목록 조회
- ✅ UC04 (LIS) → 검사 목록 조회
- ✅ UC05 (RIS) → 영상 검사 목록 조회
- ✅ UC09 (Audit) → 감사 로그 조회

### 4. Console 확인 (F12 → Console 탭)
```
[DEV MODE] Auto-login enabled - bypassing authentication
[DEV MODE] Mock user logged in: {username: "doctor", ...}
[API Request] POST /acct/token/refresh/ ...
```

---

## 🛑 서버 중지

**Ctrl + C** (터미널에서)

---

## 🔧 문제 해결

### 문제 1: "npm: command not found"

**원인**: Git Bash에서 실행했거나 Node.js 미설치

**해결**:
```bash
# WSL Ubuntu-22.04에서만 실행!
wsl -d Ubuntu-22.04

# Node.js 설치 확인
node --version  # v20.19.6 이상
npm --version   # 10.8.2 이상
```

---

### 문제 2: "EADDRINUSE: address already in use"

**원인**: 포트 3001이 이미 사용 중

**해결**:
```bash
# 포트 사용 중인 프로세스 종료
lsof -ti:3001 | xargs kill -9

# 또는 다른 포트 사용
PORT=3002 npm start
```

---

### 문제 3: API 연결 실패 (Network Error)

**원인**: Django 컨테이너 미실행

**해결**:
```bash
# Docker 컨테이너 상태 확인
docker ps --format "table {{.Names}}\t{{.Status}}"

# Django API 테스트
curl http://localhost/api/acct/login/ -X POST \
  -H "Content-Type: application/json" \
  -d '{"username":"doctor","password":"doctor123"}'
```

---

### 문제 4: 자동 로그인 안됨

**원인**: `.env.local` 설정 오류

**해결**:
```bash
# .env.local 확인
cat .env.local

# 필수 설정:
# REACT_APP_DEV_AUTO_LOGIN=true
# REACT_APP_DEV_MOCK_USER=doctor
# REACT_APP_API_URL=http://localhost/api
```

---

## 📚 상세 가이드

더 자세한 내용은 다음 문서 참조:
- [React_테스트_실행_가이드.md](../../01_doc/90_작업이력/React_테스트_실행_가이드.md)
- [api_test.html](public/api_test.html) - 브라우저 전용 API 테스트 페이지

---

**작성 완료**: 2025-12-31
