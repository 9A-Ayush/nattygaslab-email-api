#!/bin/bash

echo "🚀 Setting up NattyGas Lab Email Service..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 16+ first."
    echo "Visit: https://nodejs.org/"
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 16 ]; then
    echo "❌ Node.js version 16+ required. Current version: $(node -v)"
    exit 1
fi

echo "✅ Node.js $(node -v) detected"

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Create .env file if it doesn't exist
if [ ! -f .env ]; then
    echo "📝 Creating .env file..."
    cp .env.example .env
    echo "⚠️  Please edit .env file with your email credentials before starting the server"
else
    echo "✅ .env file already exists"
fi

# Install PM2 globally (optional)
read -p "🔧 Install PM2 for production deployment? (y/n): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    npm install -g pm2
    echo "✅ PM2 installed globally"
fi

echo ""
echo "🎉 Setup complete!"
echo ""
echo "📋 Next steps:"
echo "1. Edit .env file with your email credentials"
echo "2. Run 'npm run dev' for development"
echo "3. Run 'npm start' for production"
echo ""
echo "📧 Email providers setup:"
echo "• Gmail: Enable 2FA and create App Password"
echo "• Outlook: Use regular credentials"
echo "• Custom SMTP: Configure host, port, and credentials"
echo ""
echo "🔗 Test the service:"
echo "curl http://localhost:3000/api/health"