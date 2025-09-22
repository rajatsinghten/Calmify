#!/bin/bash

# Saneyar Mental Health Platform - Quick Setup Script
# This script helps you get started quickly with the platform

echo "🏥 Saneyar Mental Health Platform - Quick Setup"
echo "================================================"

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js v18+ from https://nodejs.org/"
    exit 1
fi

NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "❌ Node.js version 18+ is required. Current version: $(node -v)"
    exit 1
fi

echo "✅ Node.js $(node -v) detected"

# Check if MongoDB is running locally
if command -v mongosh &> /dev/null; then
    if mongosh --eval "db.adminCommand('ping')" --quiet >/dev/null 2>&1; then
        echo "✅ Local MongoDB is running"
        MONGODB_LOCAL=true
    else
        echo "⚠️  Local MongoDB is not running"
        MONGODB_LOCAL=false
    fi
else
    echo "⚠️  MongoDB client not found locally"
    MONGODB_LOCAL=false
fi

# Check if Redis is running locally
if command -v redis-cli &> /dev/null; then
    if redis-cli ping >/dev/null 2>&1; then
        echo "✅ Local Redis is running"
        REDIS_LOCAL=true
    else
        echo "⚠️  Local Redis is not running"
        REDIS_LOCAL=false
    fi
else
    echo "⚠️  Redis client not found locally"
    REDIS_LOCAL=false
fi

echo ""
echo "🔧 Setting up environment..."

# Copy .env.example to .env if it doesn't exist
if [ ! -f .env ]; then
    cp .env.example .env
    echo "✅ Created .env file from .env.example"
else
    echo "⚠️  .env file already exists"
fi

# Generate secure JWT secrets
echo "🔐 Generating secure secrets..."

JWT_SECRET=$(node -e "console.log(require('crypto').randomBytes(64).toString('hex'))")
JWT_REFRESH_SECRET=$(node -e "console.log(require('crypto').randomBytes(64).toString('hex'))")
SESSION_SECRET=$(node -e "console.log(require('crypto').randomBytes(32).toString('hex'))")
ENCRYPTION_KEY=$(node -e "console.log(require('crypto').randomBytes(16).toString('hex'))")

# Update .env with generated secrets
if [[ "$OSTYPE" == "darwin"* ]]; then
    # macOS
    sed -i '' "s/JWT_SECRET=.*/JWT_SECRET=$JWT_SECRET/" .env
    sed -i '' "s/JWT_REFRESH_SECRET=.*/JWT_REFRESH_SECRET=$JWT_REFRESH_SECRET/" .env
    sed -i '' "s/SESSION_SECRET=.*/SESSION_SECRET=$SESSION_SECRET/" .env
    sed -i '' "s/MESSAGE_ENCRYPTION_KEY=.*/MESSAGE_ENCRYPTION_KEY=$ENCRYPTION_KEY/" .env
else
    # Linux
    sed -i "s/JWT_SECRET=.*/JWT_SECRET=$JWT_SECRET/" .env
    sed -i "s/JWT_REFRESH_SECRET=.*/JWT_REFRESH_SECRET=$JWT_REFRESH_SECRET/" .env
    sed -i "s/SESSION_SECRET=.*/SESSION_SECRET=$SESSION_SECRET/" .env
    sed -i "s/MESSAGE_ENCRYPTION_KEY=.*/MESSAGE_ENCRYPTION_KEY=$ENCRYPTION_KEY/" .env
fi

echo "✅ Generated and updated secure secrets in .env"

# Install dependencies
echo ""
echo "📦 Installing dependencies..."
npm install

if [ $? -eq 0 ]; then
    echo "✅ Dependencies installed successfully"
else
    echo "❌ Failed to install dependencies"
    exit 1
fi

echo ""
echo "🗄️  Database Setup Options:"
echo "1. Use local MongoDB (recommended for development)"
echo "2. Use MongoDB Atlas (cloud, recommended for production)"
echo "3. I'll configure it manually later"

read -p "Choose an option (1-3): " db_choice

case $db_choice in
    1)
        if [ "$MONGODB_LOCAL" = true ]; then
            echo "✅ Using local MongoDB"
        else
            echo "❌ Local MongoDB is not running. Please start MongoDB first:"
            echo "   macOS: brew services start mongodb-community"
            echo "   Linux: sudo systemctl start mongod"
            echo "   Windows: Start MongoDB service"
        fi
        ;;
    2)
        echo ""
        echo "📋 MongoDB Atlas Setup Instructions:"
        echo "1. Go to https://www.mongodb.com/atlas"
        echo "2. Create a free account and cluster"
        echo "3. Create a database user in 'Database Access'"
        echo "4. Add your IP to 'Network Access' (0.0.0.0/0 for development)"
        echo "5. Get connection string from 'Connect' -> 'Connect your application'"
        echo "6. Update MONGODB_URI in your .env file"
        echo ""
        read -p "Press Enter when you've completed these steps..."
        ;;
    3)
        echo "⏭️  Skipping database setup. Remember to configure MONGODB_URI in .env"
        ;;
esac

echo ""
echo "🚀 Setup Summary:"
echo "=================="
echo "✅ Environment file created"
echo "✅ Secure secrets generated"
echo "✅ Dependencies installed"

if [ "$MONGODB_LOCAL" = true ]; then
    echo "✅ MongoDB is ready"
else
    echo "⚠️  MongoDB needs configuration"
fi

if [ "$REDIS_LOCAL" = true ]; then
    echo "✅ Redis is ready"
else
    echo "⚠️  Redis needs installation/configuration"
fi

echo ""
echo "🎯 Next Steps:"
echo "1. Configure your .env file with external service API keys (optional)"
echo "2. Start the development server: npm run dev"
echo "3. Access the API at: http://localhost:3000"
echo "4. View API docs at: http://localhost:3000/api-docs"

echo ""
echo "🔧 Optional External Services:"
echo "- OpenAI API (for AI chatbot): Add OPENAI_API_KEY to .env"
echo "- Twilio (for SMS alerts): Add TWILIO_* credentials to .env"
echo "- AWS SNS (for notifications): Add AWS_* credentials to .env"

echo ""
echo "📚 Documentation:"
echo "- Full setup guide: README.md"
echo "- API documentation: API_DOCUMENTATION.md"
echo "- MongoDB Atlas guide: https://www.mongodb.com/docs/atlas/"

echo ""
echo "🚨 Crisis Management System:"
echo "The platform includes advanced crisis detection and response systems."
echo "Ensure you have proper mental health protocols in place before production use."

echo ""
echo "✨ Setup complete! Run 'npm run dev' to start the development server."