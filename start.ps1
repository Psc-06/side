#!/usr/bin/env pwsh

# Sideye Full Stack Startup Script
Write-Host "`n" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Sideye - Ayurveda Food Scanner" -ForegroundColor Cyan
Write-Host "  Full Stack Startup" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "`n"

# Check Node.js
Write-Host "[1/3] Checking Node.js..." -ForegroundColor Yellow
try {
    $nodeVersion = node --version
    Write-Host "✓ Node.js: $nodeVersion" -ForegroundColor Green
}
catch {
    Write-Host "✗ Node.js is not installed or not in PATH" -ForegroundColor Red
    Write-Host "Please install from https://nodejs.org/" -ForegroundColor Red
    exit 1
}

# Check npm
Write-Host "[2/3] Checking npm..." -ForegroundColor Yellow
try {
    $npmVersion = npm --version
    Write-Host "✓ npm: $npmVersion" -ForegroundColor Green
}
catch {
    Write-Host "✗ npm is not installed or not in PATH" -ForegroundColor Red
    exit 1
}

Write-Host "`n"
Write-Host "[3/3] Starting servers..." -ForegroundColor Yellow
Write-Host "`n"

# Start backend
Write-Host "Starting Backend Server on http://localhost:5000" -ForegroundColor Cyan
$backendProcess = Start-Process -NoNewWindow -PassThru -FilePath pwsh -ArgumentList "-Command", "cd backend; npm run dev"

# Wait a bit for backend to start
Start-Sleep -Seconds 3

# Start frontend
Write-Host "Starting Frontend Server on http://localhost:5173" -ForegroundColor Cyan
$frontendProcess = Start-Process -NoNewWindow -PassThru -FilePath pwsh -ArgumentList "-Command", "npm run dev"

Write-Host "`n"
Write-Host "========================================" -ForegroundColor Green
Write-Host "Servers Running:" -ForegroundColor Green
Write-Host "  Backend:  http://localhost:5000" -ForegroundColor Green
Write-Host "  Frontend: http://localhost:5173" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host "`n"

Write-Host "Press Ctrl+C to stop the servers" -ForegroundColor Yellow
Write-Host "`n"

# Keep script running
$backendProcess.WaitForExit()
