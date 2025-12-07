@echo off
REM Sideye Full Stack Startup Script
echo.
echo ========================================
echo   Sideye - Ayurveda Food Scanner
echo   Full Stack Startup
echo ========================================
echo.

REM Check if Node.js is installed
node --version > nul 2>&1
if errorlevel 1 (
    echo ERROR: Node.js is not installed or not in PATH
    echo Please install Node.js from https://nodejs.org/
    pause
    exit /b 1
)

echo [1/3] Checking Node.js...
node --version
echo.

REM Check if npm is installed
npm --version > nul 2>&1
if errorlevel 1 (
    echo ERROR: npm is not installed or not in PATH
    pause
    exit /b 1
)

echo [2/3] Starting Backend Server...
echo Starting on http://localhost:5000
start "Sideye Backend" cmd /k "cd backend && npm run dev"
timeout /t 3

echo.
echo [3/3] Starting Frontend Development Server...
echo Starting on http://localhost:5173
start "Sideye Frontend" cmd /k "npm run dev"

echo.
echo ========================================
echo Servers Starting...
echo.
echo Backend:  http://localhost:5000
echo Frontend: http://localhost:5173
echo.
echo Close the command windows to stop the servers.
echo ========================================
echo.

pause
