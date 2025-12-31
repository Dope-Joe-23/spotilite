@echo off
REM Spotilite Project Setup Script for Windows

echo.
echo ========================================
echo Spotilite - Setup Script
echo ========================================
echo.

REM Check if npm is installed
where npm >nul 2>nul
if %errorlevel% neq 0 (
    echo Error: npm is not installed. Please install Node.js and npm.
    exit /b 1
)

REM Check if python is installed
where python >nul 2>nul
if %errorlevel% neq 0 (
    echo Error: Python is not installed. Please install Python 3.10 or higher.
    exit /b 1
)

echo Installing dependencies...
echo.

REM Install root dependencies
echo [1/3] Installing root dependencies...
call npm install
if %errorlevel% neq 0 (
    echo Error installing root dependencies
    exit /b 1
)

REM Install backend dependencies
echo [2/3] Installing backend dependencies...
cd backend
call pip install -r requirements.txt
if %errorlevel% neq 0 (
    echo Error installing backend dependencies
    cd ..
    exit /b 1
)

REM Install frontend dependencies
echo [3/3] Installing frontend dependencies...
cd ..\frontend
call npm install
if %errorlevel% neq 0 (
    echo Error installing frontend dependencies
    cd ..
    exit /b 1
)

cd ..

echo.
echo ========================================
echo Setup Complete!
echo ========================================
echo.
echo Next steps:
echo 1. Run migrations: npm run migrate
echo 2. Create admin user: cd backend ^&^& python manage.py createsuperuser
echo 3. Start development: npm run dev
echo.
echo Frontend: http://localhost:5173
echo Backend: http://localhost:8000
echo Admin: http://localhost:8000/admin
echo.
