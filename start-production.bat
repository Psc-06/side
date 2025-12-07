@echo off
REM Sideye Full Stack Production Startup
echo.
echo ========================================
echo   Sideye - Ayurveda Food Scanner
echo   Production Server (Integrated)
echo ========================================
echo.

REM Check if Node.js is installed
node --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Node.js is not installed or not in PATH
    echo Please install Node.js from https://nodejs.org/
    pause
    exit /b 1
)

echo [1/3] Building Frontend...
call npm run build
if errorlevel 1 (
    echo ERROR: Frontend build failed
    pause
    exit /b 1
)
echo ✓ Frontend built successfully

echo.
echo [2/3] Building Backend...
cd backend
call npm run build
if errorlevel 1 (
    echo ERROR: Backend build failed
    pause
    exit /b 1
)
echo ✓ Backend built successfully
cd ..

echo.
echo [3/3] Starting Integrated Server...
echo.
start "Sideye Server" cmd /k "node backend/dist/index.js"

echo.
echo ========================================
echo Sideye Server is Starting...
echo.
echo Access the app at:
echo   http://localhost:5000
echo.
echo API endpoint:
echo   http://localhost:5000/api
echo.
echo Close the command window to stop the server.
echo ========================================
echo.

timeout /t 2
