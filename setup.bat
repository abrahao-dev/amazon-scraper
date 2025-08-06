@echo off
REM Amazon Scraper Setup Script for Windows
REM This script will help you set up the Amazon Scraper project

echo 🚀 Setting up Amazon Product Scraper...
echo ======================================

REM Check if Bun is installed
bun --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Bun is not installed. Please install Bun first:
    echo    powershell -c "irm bun.sh/install.ps1 ^| iex"
    echo    Then restart your terminal and run this script again.
    pause
    exit /b 1
)

echo ✅ Bun is installed

REM Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js is not installed. Please install Node.js first:
    echo    Visit: https://nodejs.org/
    pause
    exit /b 1
)

echo ✅ Node.js is installed

REM Install backend dependencies
echo.
echo 📦 Installing backend dependencies...
cd backend
bun install
if %errorlevel% neq 0 (
    echo ❌ Failed to install backend dependencies
    pause
    exit /b 1
)
echo ✅ Backend dependencies installed successfully

REM Install frontend dependencies
echo.
echo 📦 Installing frontend dependencies...
cd ..\frontend
npm install
if %errorlevel% neq 0 (
    echo ❌ Failed to install frontend dependencies
    pause
    exit /b 1
)
echo ✅ Frontend dependencies installed successfully

cd ..

echo.
echo 🎉 Setup completed successfully!
echo.
echo 📋 Next steps:
echo 1. Start the backend server:
echo    cd backend ^&^& bun run dev
echo.
echo 2. In a new terminal, start the frontend:
echo    cd frontend ^&^& npm run dev
echo.
echo 3. Open your browser and go to: http://localhost:5173
echo.
echo 📖 For more information, see the README.md file
echo.
echo Happy scraping! 🚀
pause