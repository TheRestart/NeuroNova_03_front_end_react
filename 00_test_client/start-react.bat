@echo off
REM React 자동 시작 스크립트 (Windows)
REM
REM 사용법:
REM   더블클릭하거나 start-react.bat 실행

echo ========================================
echo React 클라이언트 자동 시작
echo ========================================
echo.

REM WSL 설치 확인
echo [1/3] WSL 환경 확인...
wsl --list --quiet >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] WSL이 설치되어 있지 않습니다.
    echo WSL 설치: https://aka.ms/wsl
    pause
    exit /b 1
)
echo [OK] WSL 설치 확인 완료
echo.

REM Ubuntu-22.04 확인
echo [2/3] Ubuntu-22.04 확인...
wsl --list | findstr "Ubuntu-22.04" >nul 2>&1
if %errorlevel% neq 0 (
    echo [WARNING] Ubuntu-22.04가 설치되어 있지 않습니다.
    echo 설치: wsl --install -d Ubuntu-22.04
    echo.
    echo 기본 WSL 배포판으로 계속 시도합니다...
    set WSL_DISTRO=
) else (
    echo [OK] Ubuntu-22.04 확인 완료
    set WSL_DISTRO=-d Ubuntu-22.04
)
echo.

REM React 시작
echo [3/3] React 개발 서버 시작...
echo.
echo [INFO] WSL 환경에서 npm start 실행 중...
echo [INFO] 브라우저에서 http://localhost:3001 접속하세요
echo [INFO] 종료하려면 Ctrl+C를 누르세요
echo.

REM WSL로 전환하여 React 시작
wsl %WSL_DISTRO% bash -c "cd /mnt/d/1222/NeuroNova_v1/NeuroNova_03_front_end_react/00_test_client && PORT=3001 npm start"

echo.
echo React 서버가 종료되었습니다.
pause
