# WSL에서 React 테스트 클라이언트 실행 가이드

## WSL 환경 설정

### 1. WSL에서 프로젝트 접근

Windows 파일 시스템은 WSL에서 `/mnt/` 경로로 접근 가능합니다:

```bash
# WSL 터미널 열기
wsl

# Windows D 드라이브의 프로젝트 폴더로 이동
cd /mnt/d/1222/NeuroNova_v1/NeuroNova_03_front_end_react/00_test_client
```

### 2. Node.js 및 npm 설치 (WSL 내부)

WSL Ubuntu에서 Node.js를 설치합니다:

```bash
# nvm (Node Version Manager) 설치
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash

# 터미널 재시작 또는 설정 적용
source ~/.bashrc

# Node.js LTS 버전 설치
nvm install --lts
nvm use --lts

# 설치 확인
node --version
npm --version
```

### 3. React 앱 실행

```bash
# 프로젝트 디렉토리에서
cd /mnt/d/1222/NeuroNova_v1/NeuroNova_03_front_end_react/00_test_client

# 의존성 설치
npm install

# 개발 서버 시작
npm start
```

## 네트워크 설정

### WSL2와 Windows 간 네트워크 통신

WSL2는 별도의 IP를 사용하므로 `localhost` 연결이 필요합니다.

#### 옵션 1: Django를 0.0.0.0에서 실행 (권장)

Windows에서 Django 서버 실행 시:

```bash
# Windows PowerShell 또는 CMD
cd D:\1222\NeuroNova_v1\NeuroNova_02_back_end\02_django_server
venv\Scripts\activate
python manage.py runserver 0.0.0.0:8000
```

이렇게 하면 WSL에서 Windows의 `localhost:8000`으로 접근 가능합니다.

#### 옵션 2: WSL에서 Windows IP로 접근

WSL에서 Windows 호스트의 IP를 확인:

```bash
# Windows IP 확인
cat /etc/resolv.conf | grep nameserver | awk '{print $2}'
```

`package.json`의 proxy 수정 (임시):

```json
{
  "proxy": "http://<WINDOWS_IP>:8000"
}
```

## Docker 연결

### WSL에서 Docker Desktop 사용

WSL2에서 Docker Desktop의 Docker 데몬을 사용할 수 있습니다.

**Docker Desktop 설정 확인:**

1. Docker Desktop 실행
2. Settings → Resources → WSL Integration
3. "Enable integration with my default WSL distro" 체크
4. 사용하는 WSL 배포판 선택

**WSL에서 Docker 명령 확인:**

```bash
# WSL 터미널에서
docker --version
docker ps

# Orthanc PACS 상태 확인
docker ps | grep orthanc
```

## 전체 실행 흐름

### 터미널 1: Django (Windows)

```powershell
# PowerShell 또는 CMD
cd D:\1222\NeuroNova_v1\NeuroNova_02_back_end\02_django_server
venv\Scripts\activate
python manage.py runserver 0.0.0.0:8000
```

### 터미널 2: React (WSL)

```bash
# WSL 터미널
cd /mnt/d/1222/NeuroNova_v1/NeuroNova_03_front_end_react/00_test_client
npm start
```

### 터미널 3: Docker (Windows 또는 WSL)

```bash
# Docker Desktop에서 직접 관리하거나
# WSL에서 Docker 명령 실행
cd /mnt/d/1222/NeuroNova_v1/NeuroNova_02_back_end/05_orthanc_pacs
docker-compose up -d
```

## 브라우저 접속

WSL에서 `npm start` 실행 시 브라우저가 자동으로 열리지 않을 수 있습니다.

**수동으로 브라우저 열기:**

Windows 브라우저에서 다음 URL 접속:
```
http://localhost:3000
```

## 성능 최적화

### /mnt/ 경로의 성능 문제

Windows 파일 시스템(`/mnt/d/`)에서 실행 시 성능이 느릴 수 있습니다.

**더 빠른 방법: WSL 파일 시스템으로 복사**

```bash
# WSL 홈 디렉토리로 프로젝트 복사
cp -r /mnt/d/1222/NeuroNova_v1 ~/NeuroNova_v1

# WSL 파일 시스템에서 실행
cd ~/NeuroNova_v1/NeuroNova_03_front_end_react/00_test_client
npm install
npm start
```

**주의:** 이 방법은 Windows와 WSL 파일이 분리되므로 동기화가 필요합니다.

## 파일 변경 감지 문제 해결

WSL에서 `/mnt/` 경로의 파일 변경을 감지하지 못할 수 있습니다.

**해결 방법: Polling 모드 활성화**

`package.json`에 환경변수 추가:

```json
{
  "scripts": {
    "start": "CHOKIDAR_USEPOLLING=true react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test",
    "eject": "react-scripts eject"
  }
}
```

또는 `.env` 파일 생성:

```env
CHOKIDAR_USEPOLLING=true
```

## 문제 해결

### 포트 충돌
```
Something is already running on port 3000
```

**해결:**
```bash
# WSL에서 포트 사용 프로세스 찾기
lsof -ti:3000 | xargs kill -9

# 또는 다른 포트 사용
PORT=3001 npm start
```

### WSL 네트워크 재설정
```bash
# WSL 종료 (Windows PowerShell에서)
wsl --shutdown

# WSL 다시 시작
wsl
```

### npm 설치 오류
```bash
# npm 캐시 정리
npm cache clean --force

# node_modules 삭제 후 재설치
rm -rf node_modules package-lock.json
npm install
```

## VS Code WSL 통합

VS Code에서 WSL을 직접 사용할 수 있습니다:

1. **Remote - WSL 확장 설치**
2. VS Code에서 `Ctrl+Shift+P` → "WSL: Open Folder in WSL"
3. 프로젝트 폴더 선택
4. VS Code 터미널이 자동으로 WSL 사용

이렇게 하면 Windows에서 개발하지만 WSL 환경에서 실행됩니다.

## 요약

### 권장 설정

```
┌─────────────────────────────────────────┐
│  Windows (호스트)                        │
│  ├─ Docker Desktop (GUI 관리)           │
│  ├─ Django Server (0.0.0.0:8000)        │
│  └─ VS Code with Remote-WSL             │
└─────────────────────────────────────────┘
              ↕
┌─────────────────────────────────────────┐
│  WSL2 (Ubuntu)                          │
│  ├─ Node.js & npm                       │
│  ├─ React Dev Server (:3000)            │
│  └─ Docker CLI (Desktop 공유)            │
└─────────────────────────────────────────┘
```

이 구성으로 Windows와 WSL의 장점을 모두 활용할 수 있습니다!

---

**버전**: 1.0
**최종 업데이트**: 2025-12-30
