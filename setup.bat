@echo off
echo 🚀 Setting up NattyGas Lab Email Service...

REM Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js is not installed. Please install Node.js 16+ first.
    echo Visit: https://nodejs.org/
    pause
    exit /b 1
)

echo ✅ Node.js detected: 
node --version

REM Install dependencies
echo 📦 Installing dependencies...
npm install

REM Create .env file if it doesn't exist
if not exist .env (
    echo 📝 Creating .env file...
    copy .env.example .env
    echo ⚠️  Please edit .env file with your email credentials before starting the server
) else (
    echo ✅ .env file already exists
)

REM Ask about PM2 installation
set /p install_pm2="🔧 Install PM2 for production deployment? (y/n): "
if /i "%install_pm2%"=="y" (
    npm install -g pm2
    echo ✅ PM2 installed globally
)

echo.
echo 🎉 Setup complete!
echo.
echo 📋 Next steps:
echo 1. Edit .env file with your email credentials
echo 2. Run 'npm run dev' for development
echo 3. Run 'npm start' for production
echo.
echo 📧 Email providers setup:
echo • Gmail: Enable 2FA and create App Password
echo • Outlook: Use regular credentials
echo • Custom SMTP: Configure host, port, and credentials
echo.
echo 🔗 Test the service:
echo curl http://localhost:3000/api/health

pause