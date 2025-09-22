# Saneyar Mental Health Platform

A comprehensive mental health platform providing crisis detection, counselor matching, AI-powered support, and real-time communication for mental health services.

## 🚀 Features

- **🚨 Crisis Detection**: Advanced AI-powered crisis detection with immediate intervention
- **👥 Smart Counselor Matching**: Intelligent pairing based on specializations and availability  
- **🤖 AI Chatbot**: Mental health assessments and coping strategies
- **📊 Real-time Dashboard**: Live monitoring for administrators and supervisors
- **🔒 Privacy & Security**: HIPAA-compliant with end-to-end encryption
- **📱 Multi-platform**: Web, mobile, and API access
- **🌍 Crisis Resources**: Integrated emergency hotlines and resources
- **📈 Analytics**: Comprehensive reporting and compliance tracking

## 📋 Prerequisites

Before setting up the project, ensure you have:

- **Node.js** (v18.0.0 or higher)
- **MongoDB** (v5.0 or higher)
- **Redis** (v6.0 or higher) - for session management and caching
- **Git** for version control

### Optional Services (for full functionality)
- **Twilio Account** - for SMS notifications
- **AWS Account** - for SNS notifications
- **OpenAI API Key** - for AI chatbot functionality

## 🛠️ Installation & Setup

### 1. Clone the Repository

```bash
git clone https://github.com/your-org/saneyar-platform.git
cd saneyar-platform
```

### 2. Install Dependencies

```bash
# Install backend dependencies
npm install

# If you have a frontend directory
cd frontend
npm install
cd ..
```

### 3. Environment Configuration

Create a `.env` file in the root directory:

```bash
cp .env.example .env
```

Configure your environment variables:

```env
# =====================================
# SERVER CONFIGURATION
# =====================================
NODE_ENV=development
PORT=3000
API_VERSION=v1

# =====================================
# DATABASE CONFIGURATION
# =====================================
# MongoDB Connection String
# Replace with your MongoDB Atlas connection string or local MongoDB
MONGODB_URI=mongodb://localhost:27017/saneyar_platform

# Alternative for MongoDB Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/saneyar_platform?retryWrites=true&w=majority

# Database Options
DB_MAX_POOL_SIZE=10
DB_SOCKET_TIMEOUT_MS=45000

# =====================================
# REDIS CONFIGURATION
# =====================================
REDIS_URL=redis://localhost:6379
REDIS_PASSWORD=
REDIS_SESSION_PREFIX=saneyar_sess:

# =====================================
# SECURITY & AUTHENTICATION
# =====================================
# JWT Secret (generate a secure random string)
JWT_SECRET=your-super-secure-jwt-secret-key-here-change-this
JWT_REFRESH_SECRET=your-refresh-token-secret-here-change-this
JWT_EXPIRES_IN=24h
JWT_REFRESH_EXPIRES_IN=7d

# Session Configuration
SESSION_SECRET=your-session-secret-key-here-change-this

# Encryption Keys (generate secure random strings)
ENCRYPTION_KEY=32-character-encryption-key-here
CRYPTO_ALGORITHM=aes-256-gcm

# =====================================
# EXTERNAL SERVICES
# =====================================
# OpenAI Configuration (for AI Chatbot)
OPENAI_API_KEY=your-openai-api-key-here
OPENAI_MODEL=gpt-4
OPENAI_MAX_TOKENS=1000

# Twilio Configuration (for SMS notifications)
TWILIO_ACCOUNT_SID=your-twilio-account-sid
TWILIO_AUTH_TOKEN=your-twilio-auth-token
TWILIO_PHONE_NUMBER=+1234567890

# AWS Configuration (for SNS notifications)
AWS_ACCESS_KEY_ID=your-aws-access-key
AWS_SECRET_ACCESS_KEY=your-aws-secret-key
AWS_REGION=us-east-1
AWS_SNS_TOPIC_ARN=arn:aws:sns:us-east-1:123456789:crisis-alerts

# =====================================
# CRISIS MANAGEMENT
# =====================================
# Crisis Detection Sensitivity (0.1 - 1.0)
CRISIS_DETECTION_THRESHOLD=0.7
CRISIS_RESPONSE_TIMEOUT=30000

# Emergency Services Configuration
EMERGENCY_CONTACT_ENABLED=true
AUTO_EMERGENCY_THRESHOLD=0.9

# =====================================
# EMAIL CONFIGURATION
# =====================================
# SMTP Configuration
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password

# SendGrid Alternative
SENDGRID_API_KEY=your-sendgrid-api-key
FROM_EMAIL=noreply@saneyar.com

# =====================================
# LOGGING & MONITORING
# =====================================
LOG_LEVEL=info
LOG_FORMAT=combined
ENABLE_REQUEST_LOGGING=true

# File Upload Configuration
MAX_FILE_SIZE=10485760
UPLOAD_DIR=./uploads

# Rate Limiting
RATE_LIMIT_WINDOW=15
RATE_LIMIT_MAX=100
CRISIS_RATE_LIMIT_EXEMPT=true

# =====================================
# DEVELOPMENT SETTINGS
# =====================================
ENABLE_CORS=true
CORS_ORIGIN=http://localhost:3001,http://localhost:3000
ENABLE_SWAGGER=true
API_DOCS_PATH=/api-docs

# Debug Settings
DEBUG_CRISIS_DETECTION=false
DEBUG_SOCKET_EVENTS=false
MOCK_EXTERNAL_SERVICES=false
```

### 4. Database Setup

#### Option A: Local MongoDB

1. **Install MongoDB locally:**
   ```bash
   # macOS
   brew install mongodb-community
   brew services start mongodb-community
   
   # Ubuntu/Debian
   sudo apt-get install mongodb
   sudo systemctl start mongodb
   
   # Windows
   # Download and install from https://www.mongodb.com/try/download/community
   ```

2. **Create database and collections:**
   ```bash
   npm run db:setup
   ```

#### Option B: MongoDB Atlas (Cloud)

1. **Create MongoDB Atlas Account:**
   - Go to [MongoDB Atlas](https://www.mongodb.com/atlas)
   - Create a free account and cluster

2. **Get Connection String:**
   - In Atlas dashboard, click "Connect"
   - Choose "Connect your application"
   - Copy the connection string
   - Replace `<password>` with your database user password
   - Update `MONGODB_URI` in your `.env` file

3. **Configure Network Access:**
   - In Atlas dashboard, go to "Network Access"
   - Add your IP address or use `0.0.0.0/0` for development

### 5. Redis Setup

#### Local Redis:
```bash
# macOS
brew install redis
brew services start redis

# Ubuntu/Debian
sudo apt-get install redis-server
sudo systemctl start redis

# Windows
# Download from https://redis.io/download
```

#### Redis Cloud (Alternative):
- Use [Redis Cloud](https://redis.com/redis-enterprise-cloud/) for managed Redis
- Update `REDIS_URL` in `.env` with cloud connection string

### 6. Initialize Database

Run the database initialization script:

```bash
npm run db:init
```

This will:
- Create necessary collections
- Set up indexes for performance
- Create initial admin user
- Set up crisis detection configurations

### 7. Start the Application

#### Development Mode:
```bash
# Start backend server with hot reload
npm run dev

# Start with debug mode
npm run dev:debug

# Start frontend (if separate)
cd frontend && npm start
```

#### Production Mode:
```bash
# Build the application
npm run build

# Start production server
npm start
```

The server will start on `http://localhost:3000` (or your configured PORT).

## 🔧 Quick Setup Guide for MongoDB

### MongoDB Atlas (Recommended for production)

1. **Create Account**: Visit [MongoDB Atlas](https://www.mongodb.com/atlas) and create a free account

2. **Create Cluster**: 
   - Choose "Build a Database"
   - Select "Free Shared" for development
   - Choose your preferred cloud provider and region

3. **Create Database User**:
   - Go to "Database Access"
   - Click "Add New Database User"
   - Create username/password (save these!)
   - Grant "Read and write to any database" permission

4. **Configure Network Access**:
   - Go to "Network Access"
   - Click "Add IP Address"
   - For development: Add "0.0.0.0/0" (allows access from anywhere)
   - For production: Add your server's specific IP

5. **Get Connection String**:
   - Go back to "Database" 
   - Click "Connect" on your cluster
   - Choose "Connect your application"
   - Copy the connection string
   - Replace `<password>` with your database user password
   - Update `MONGODB_URI` in your `.env` file

### Local MongoDB Setup

For local development:

```bash
# macOS with Homebrew
brew tap mongodb/brew
brew install mongodb-community
brew services start mongodb-community

# Ubuntu/Debian
wget -qO - https://www.mongodb.org/static/pgp/server-5.0.asc | sudo apt-key add -
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/5.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-5.0.list
sudo apt-get update
sudo apt-get install -y mongodb-org
sudo systemctl start mongod
sudo systemctl enable mongod

# Windows
# Download installer from https://www.mongodb.com/try/download/community
# Follow installation wizard
# MongoDB will run as a Windows service
```

After installation, use this connection string in your `.env`:
```env
MONGODB_URI=mongodb://localhost:27017/saneyar_platform
```

## 🚀 Getting Started

### 1. Verify Installation

```bash
# Check if all services are running
npm run health-check
```

This script checks:
- MongoDB connection
- Redis connection
- External service configurations

### 2. Create Admin User

```bash
# Run the admin creation script
npm run create:admin
```

Or create manually through API:

```bash
curl -X POST http://localhost:3000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Admin User",
    "email": "admin@saneyar.com", 
    "password": "SecurePassword123!",
    "role": "admin"
  }'
```

### 3. Test Crisis Detection

```bash
# Test crisis detection endpoint
curl -X POST http://localhost:3000/api/v1/crisis/analyze \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "content": "I want to hurt myself"
  }'
```

### 4. Access Admin Dashboard

1. Login as admin at `http://localhost:3000/admin`
2. Monitor active sessions and crisis alerts
3. Configure counselor accounts and specializations

### 5. Test Real-time Features

```javascript
// Connect to WebSocket
const socket = io('http://localhost:3000', {
  auth: { token: 'YOUR_JWT_TOKEN' }
});

// Listen for crisis alerts
socket.on('crisis_alert', (data) => {
  console.log('Crisis detected:', data);
});
```

## 📚 API Documentation

Comprehensive API documentation is available:

- **Interactive Docs**: `http://localhost:3000/api-docs` (Swagger UI)
- **Full Documentation**: See [API_DOCUMENTATION.md](./API_DOCUMENTATION.md)
- **Postman Collection**: Available in `/docs/postman/`

### Key Endpoints

```bash
# Authentication
POST /api/v1/auth/register     # Register new user
POST /api/v1/auth/login        # User login
POST /api/v1/auth/anonymous    # Anonymous session

# Crisis Management
POST /api/v1/crisis/analyze    # Analyze message for crisis
POST /api/v1/crisis/alert      # Trigger crisis alert
GET  /api/v1/crisis/resources  # Get emergency resources

# Sessions & Messaging
POST /api/v1/sessions          # Create new session
POST /api/v1/sessions/:id/messages  # Send message
GET  /api/v1/sessions/:id/messages   # Get messages

# Admin Dashboard
GET  /api/v1/admin/dashboard   # Dashboard data
GET  /api/v1/admin/crisis-alerts    # Active crisis alerts
```

## 🧪 Testing the Platform

### 1. Test Crisis Detection

```bash
# Test various crisis scenarios
npm run test:crisis-scenarios

# Test specific crisis message
curl -X POST http://localhost:3000/api/v1/crisis/analyze \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{"content": "I feel hopeless and want to end everything"}'
```

### 2. Test Real-time Communication

```bash
# Start a test session
npm run test:websocket

# Or use the provided test client
node test-scripts/websocket-test.js
```

### 3. Test Complete User Journey

```bash
# Automated integration tests
npm run test:integration

# Manual testing script
npm run test:user-journey
```

## 🔍 Monitoring & Health Checks

### Health Check Endpoints

```bash
# Basic health check
curl http://localhost:3000/health

# Detailed system status
curl http://localhost:3000/health/detailed

# Database connectivity
curl http://localhost:3000/health/db

# Redis connectivity  
curl http://localhost:3000/health/redis
```

### Application Logs

Monitor the application:

```bash
# View all logs
tail -f logs/application.log

# Crisis-specific logs
tail -f logs/crisis.log

# Error logs only
tail -f logs/error.log
```

## 🚨 Crisis Management System

### How It Works

1. **Message Analysis**: Every message is automatically analyzed for crisis indicators
2. **Risk Assessment**: AI determines risk level (minimal → critical)
3. **Automatic Alerts**: High-risk messages trigger immediate counselor alerts
4. **Emergency Protocols**: Critical cases can trigger emergency service contact
5. **Real-time Dashboard**: Admins monitor all crisis situations live

### Crisis Detection Categories

- **Suicide Indicators**: Direct/indirect suicide references
- **Self-Harm**: Cutting, burning, harmful behaviors
- **Violence**: Threats to self or others
- **Immediacy**: Time-sensitive crisis language
- **Hopelessness**: Despair and helplessness
- **Substance Abuse**: Crisis-level substance use
- **Isolation**: Dangerous social withdrawal
- **Method Planning**: Specific crisis method references

### Emergency Response Times

- **Critical**: Immediate (< 1 minute)
- **High**: Within 5 minutes
- **Medium**: Within 15 minutes
- **Low**: Standard response

## 🔧 Troubleshooting

### Common Issues

#### MongoDB Connection Issues
```bash
# Check MongoDB status
# For local MongoDB:
brew services list | grep mongodb  # macOS
sudo systemctl status mongod       # Linux

# Test connection
npm run test:db-connection

# Check connection string
echo $MONGODB_URI
```

#### Redis Connection Issues
```bash
# Check Redis status
redis-cli ping
# Should return "PONG"

# For local Redis:
brew services list | grep redis    # macOS
sudo systemctl status redis        # Linux
```

#### Environment Variable Issues
```bash
# Check if .env file exists and is readable
cat .env | head -5

# Verify critical variables
node -e "console.log('JWT_SECRET:', !!process.env.JWT_SECRET)"
node -e "console.log('MONGODB_URI:', !!process.env.MONGODB_URI)"
```

#### Crisis Detection Not Working
```bash
# Test OpenAI connection (if using AI features)
npm run test:openai-connection

# Test crisis keywords manually
npm run test:crisis-keywords
```

### Debug Mode

Enable detailed debugging:

```bash
# Enable all debug logs
DEBUG=saneyar:* npm run dev

# Crisis-specific debugging
DEBUG=saneyar:crisis npm run dev

# Database debugging
DEBUG=saneyar:db npm run dev
```

## 🚀 Deployment

### Production Checklist

- [ ] Set `NODE_ENV=production`
- [ ] Use secure, randomly generated secrets
- [ ] Configure MongoDB Atlas with proper access controls
- [ ] Set up Redis Cloud or secure Redis instance
- [ ] Configure proper CORS origins
- [ ] Set up SSL/HTTPS certificates
- [ ] Configure monitoring and logging
- [ ] Set up backup strategies
- [ ] Test crisis detection in production environment
- [ ] Configure emergency service integrations

### Environment Variables for Production

```env
NODE_ENV=production
PORT=80
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/saneyar_platform
REDIS_URL=rediss://user:pass@redis-cloud-host:port
JWT_SECRET=super-secure-secret-generated-randomly
CORS_ORIGIN=https://your-domain.com
ENABLE_SWAGGER=false
LOG_LEVEL=error
```

### Docker Deployment

```bash
# Build and run with Docker
docker build -t saneyar-platform .
docker run -p 3000:3000 --env-file .env saneyar-platform

# Or use Docker Compose
docker-compose up -d
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Make your changes
4. Run tests: `npm test`
5. Commit changes: `git commit -m 'Add amazing feature'`
6. Push to branch: `git push origin feature/amazing-feature`
7. Open a Pull Request

## 📞 Support & Safety

### Emergency Resources
- **Crisis Hotline**: 988 (US)
- **Emergency Services**: 911
- **Crisis Text Line**: Text HOME to 741741

### Technical Support
- **Documentation**: [API_DOCUMENTATION.md](./API_DOCUMENTATION.md)
- **GitHub Issues**: Report bugs and request features
- **Email**: support@saneyar.com

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

**⚠️ Important Safety Notice**: This platform supports mental health professionals and provides crisis intervention assistance. It is not a replacement for professional care or emergency services. In immediate danger, always contact local emergency services.