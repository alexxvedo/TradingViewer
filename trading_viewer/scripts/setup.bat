@echo off
echo ===================================
echo    Trading Viewer Setup Script
echo ===================================
echo.

REM Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Node.js is not installed or not in PATH
    echo Please install Node.js from https://nodejs.org/
    pause
    exit /b 1
)

echo Node.js version:
node --version
echo.

REM Check if npm is available
npm --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: npm is not available
    pause
    exit /b 1
)

echo npm version:
npm --version
echo.

echo Installing dependencies...
npm install
if %errorlevel% neq 0 (
    echo ERROR: Failed to install dependencies
    pause
    exit /b 1
)

echo.
echo Building the application...
npm run build
if %errorlevel% neq 0 (
    echo ERROR: Failed to build the application
    pause
    exit /b 1
)

echo.
echo ===================================
echo    Setup completed successfully!
echo ===================================
echo.
echo To run the application:
echo   Development mode: npm run electron-dev
echo   Production mode:  npm run electron
echo   Build package:    npm run electron-pack
echo.
echo Don't forget to:
echo 1. Compile the Expert Advisors (.mq4/.mq5 files)
echo 2. Configure WebRequest permissions in MT4/MT5
echo 3. Add http://127.0.0.1:3001 to allowed URLs
echo.

pause 