#!/usr/bin/env pwsh

# Sideye Full Stack Production Startup Script
Write-Host "`n" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Sideye - Ayurveda Food Scanner" -ForegroundColor Cyan
Write-Host "  Production Server (Integrated)" -ForegroundColor Cyan
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

# Build frontend
Write-Host "[2/3] Building Frontend..." -ForegroundColor Yellow
npm run build
if ($LASTEXITCODE -ne 0) {
    Write-Host "✗ Frontend build failed" -ForegroundColor Red
    exit 1
}
Write-Host "✓ Frontend built successfully" -ForegroundColor Green

# Build backend
Write-Host "[3/3] Building Backend..." -ForegroundColor Yellow
Push-Location backend
npm run build
if ($LASTEXITCODE -ne 0) {
    Write-Host "✗ Backend build failed" -ForegroundColor Red
    Pop-Location
    exit 1
}
Pop-Location
Write-Host "✓ Backend built successfully" -ForegroundColor Green

Write-Host "`n"
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Starting Integrated Server..." -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "`n"

# Start server
Write-Host "Starting server on port 5000..." -ForegroundColor Cyan
$serverProcess = Start-Process -NoNewWindow -PassThru -FilePath pwsh -ArgumentList "-Command", "cd '$PWD'; node backend/dist/index.js"

Write-Host "`n"
Write-Host "========================================" -ForegroundColor Green
Write-Host "Sideye Server Running:" -ForegroundColor Green
Write-Host "  Frontend: http://localhost:5000" -ForegroundColor Green
Write-Host "  API: http://localhost:5000/api" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host "`n"

Write-Host "Press Ctrl+C to stop the server" -ForegroundColor Yellow
Write-Host "`n"

# Keep script running
$serverProcess.WaitForExit()
