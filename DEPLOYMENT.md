# Saneyar Mental Health Platform - Deployment Guide

This guide covers deployment options for the Saneyar Mental Health Platform, from development to production environments.

## 🚀 Quick Start

For the fastest setup, use our automated script:

```bash
# Clone and setup
git clone https://github.com/your-org/saneyar-platform.git
cd saneyar-platform
npm run setup

# Check health
npm run health-check

# Start development server
npm run dev
```

## 🏗️ Deployment Options

### 1. Local Development

Perfect for development and testing:

```bash
# Prerequisites: Node.js 18+, MongoDB, Redis
npm install
cp .env.example .env
# Configure .env with your settings
npm run dev
```

**Access Points:**
- API: `http://localhost:3000`
- API Docs: `http://localhost:3000/api-docs`
- Health Check: `http://localhost:3000/health`

### 2. Docker Deployment

Containerized deployment for consistent environments:

```bash
# Build the Docker image
docker build -t saneyar-platform .

# Run with Docker Compose (includes MongoDB and Redis)
docker-compose up -d

# Or run standalone container
docker run -p 3000:3000 --env-file .env saneyar-platform
```

**Docker Compose Services:**
- `app`: Main application server
- `mongodb`: MongoDB database
- `redis`: Redis for sessions and caching
- `nginx`: Reverse proxy (production)

### 3. Cloud Deployment

#### 3.1 Heroku Deployment

Easy cloud deployment with automatic scaling:

```bash
# Install Heroku CLI
# Create Heroku app
heroku create saneyar-platform

# Add MongoDB Atlas and Redis add-ons
heroku addons:create mongolab:sandbox
heroku addons:create redistogo:nano

# Set environment variables
heroku config:set NODE_ENV=production
heroku config:set JWT_SECRET=your-secret-here
# ... other environment variables

# Deploy
git push heroku main
```

#### 3.2 AWS Deployment

Scalable deployment using AWS services:

**Services Used:**
- **EC2**: Application hosting
- **DocumentDB**: MongoDB-compatible database
- **ElastiCache**: Redis caching
- **Load Balancer**: Traffic distribution
- **S3**: File storage
- **CloudWatch**: Monitoring

```bash
# Example EC2 deployment
# 1. Launch EC2 instance (t3.medium recommended)
# 2. Install Node.js, PM2
# 3. Clone repository
# 4. Configure environment with AWS services
# 5. Start with PM2

pm2 start ecosystem.config.js --env production
pm2 save
pm2 startup
```

#### 3.3 Google Cloud Platform

```bash
# Deploy to Google App Engine
gcloud app deploy app.yaml

# Or use Google Cloud Run
gcloud builds submit --tag gcr.io/PROJECT_ID/saneyar
gcloud run deploy --image gcr.io/PROJECT_ID/saneyar
```

#### 3.4 DigitalOcean App Platform

```bash
# Create app.yaml for DigitalOcean
# Connect GitHub repository
# Configure environment variables
# Deploy automatically on git push
```

## 🔧 Production Configuration

### Environment Variables for Production

```env
# Production Settings
NODE_ENV=production
PORT=80
LOG_LEVEL=error
ENABLE_SWAGGER=false

# Database (MongoDB Atlas recommended)
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/saneyar_prod

# Redis (Redis Cloud recommended)
REDIS_URL=rediss://user:pass@redis-cloud-host:port

# Security (generate secure random strings)
JWT_SECRET=super-secure-64-character-random-string
JWT_REFRESH_SECRET=another-super-secure-random-string
SESSION_SECRET=secure-session-secret
ENCRYPTION_KEY=32-character-encryption-key

# CORS (your production domain)
CORS_ORIGIN=https://yourdomain.com,https://www.yourdomain.com

# External Services
OPENAI_API_KEY=sk-your-production-openai-key
TWILIO_ACCOUNT_SID=your-production-twilio-sid
AWS_ACCESS_KEY_ID=your-production-aws-key

# Monitoring
SENTRY_DSN=your-sentry-dsn-for-error-tracking

# Performance
TRUST_PROXY=true
COMPRESSION_ENABLED=true
RATE_LIMIT_MAX=1000
```

### SSL/HTTPS Configuration

For production, always use HTTPS:

```bash
# With Let's Encrypt (free SSL)
sudo certbot --nginx -d yourdomain.com

# Or use Cloudflare for SSL termination
# Configure Cloudflare proxy with your domain
```

### Database Production Setup

#### MongoDB Atlas (Recommended)

1. **Create Production Cluster**:
   - Choose M10+ for production workloads
   - Enable backup (Point-in-Time Recovery)
   - Configure multiple regions for redundancy

2. **Security Configuration**:
   ```javascript
   // Network Access
   // Add your server IPs only (not 0.0.0.0/0)
   
   // Database Access
   // Create specific users with minimal permissions
   {
     "user": "saneyar_app",
     "roles": [
       { "role": "readWrite", "db": "saneyar_production" }
     ]
   }
   ```

3. **Performance Optimization**:
   ```javascript
   // Connection string options for production
   mongodb+srv://user:pass@cluster.mongodb.net/saneyar_prod?retryWrites=true&w=majority&maxPoolSize=20&serverSelectionTimeoutMS=5000&connectTimeoutMS=10000&authSource=admin&authMechanism=SCRAM-SHA-1
   ```

#### Redis Production Setup

Use Redis Cloud or AWS ElastiCache:

```bash
# Redis Cloud configuration
REDIS_URL=rediss://user:password@redis-cloud-endpoint:port

# Enable persistence and backups
# Configure memory limits
# Set up monitoring alerts
```

### PM2 Production Configuration

Create `ecosystem.config.js`:

```javascript
module.exports = {
  apps: [{
    name: 'saneyar-platform',
    script: 'server.js',
    instances: 'max', // Use all CPU cores
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'development'
    },
    env_production: {
      NODE_ENV: 'production',
      PORT: 3000
    },
    error_file: 'logs/err.log',
    out_file: 'logs/out.log',
    log_file: 'logs/combined.log',
    time: true,
    max_memory_restart: '1G',
    restart_delay: 5000,
    max_restarts: 5,
    min_uptime: '10s'
  }]
};
```

Start with PM2:
```bash
pm2 start ecosystem.config.js --env production
pm2 save
pm2 startup # Enable auto-start on boot
```

## 🔒 Security Hardening

### 1. Server Security

```bash
# Update system packages
sudo apt update && sudo apt upgrade

# Configure firewall
sudo ufw allow 22    # SSH
sudo ufw allow 80    # HTTP
sudo ufw allow 443   # HTTPS
sudo ufw enable

# Disable root login
sudo sed -i 's/PermitRootLogin yes/PermitRootLogin no/' /etc/ssh/sshd_config
sudo systemctl restart ssh
```

### 2. Application Security

```javascript
// security.js - Additional security middleware
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true
  }
}));

// Enhanced rate limiting for production
const productionLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 1000, // Limit each IP to 1000 requests per windowMs
  message: 'Too many requests from this IP',
  standardHeaders: true,
  legacyHeaders: false,
});
```

### 3. Database Security

```javascript
// MongoDB production security
{
  "security": {
    "authorization": "enabled",
    "javascriptEnabled": false
  },
  "net": {
    "bindIp": "127.0.0.1", // Only localhost
    "tls": {
      "mode": "requireTLS"
    }
  }
}
```

## 📊 Monitoring & Logging

### 1. Application Monitoring

```javascript
// monitoring.js
const winston = require('winston');
const Sentry = require('@sentry/node');

// Initialize Sentry for error tracking
Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV,
  tracesSampleRate: 1.0,
});

// Production logging
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
    new winston.transports.File({ filename: 'logs/combined.log' }),
  ],
});
```

### 2. Health Monitoring

```javascript
// health.js - Comprehensive health checks
app.get('/health', async (req, res) => {
  const health = {
    status: 'healthy',
    timestamp: new Date().toISOString(),
    version: process.env.npm_package_version,
    uptime: process.uptime(),
    environment: process.env.NODE_ENV,
    checks: {
      database: await checkDatabase(),
      redis: await checkRedis(),
      memory: checkMemory(),
      disk: await checkDisk(),
      externalServices: await checkExternalServices()
    }
  };
  
  const isHealthy = Object.values(health.checks).every(check => check.status === 'ok');
  res.status(isHealthy ? 200 : 503).json(health);
});
```

### 3. Crisis Monitoring

```javascript
// crisis-monitor.js - Real-time crisis monitoring
const CrisisMonitor = {
  setupAlerts() {
    // Monitor crisis response times
    setInterval(async () => {
      const unresponded = await CrisisAlert.find({
        status: 'active',
        createdAt: { $lt: new Date(Date.now() - 5 * 60 * 1000) } // 5 minutes
      });
      
      if (unresponded.length > 0) {
        this.escalateCrisis(unresponded);
      }
    }, 60000); // Check every minute
  },
  
  escalateCrisis(alerts) {
    // Send alerts to supervisors
    // Trigger emergency protocols
    // Log escalation events
  }
};
```

## 🔄 Backup & Recovery

### 1. Database Backup

```bash
# MongoDB Atlas automatic backups (recommended)
# Or manual backup script
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
mongodump --uri="$MONGODB_URI" --out="backup_$DATE"
tar -czf "backup_$DATE.tar.gz" "backup_$DATE"
aws s3 cp "backup_$DATE.tar.gz" s3://your-backup-bucket/
```

### 2. Application Backup

```bash
# Application files backup
#!/bin/bash
tar -czf "app_backup_$(date +%Y%m%d).tar.gz" \
  --exclude=node_modules \
  --exclude=logs \
  --exclude=.git \
  .
```

### 3. Recovery Procedures

```bash
# Database recovery
mongorestore --uri="$MONGODB_URI" backup_directory

# Application recovery
tar -xzf app_backup.tar.gz
npm install
npm run health-check
pm2 restart all
```

## 📈 Performance Optimization

### 1. Database Optimization

```javascript
// Database indexes for production
db.users.createIndex({ "email": 1 }, { unique: true })
db.sessions.createIndex({ "user": 1, "status": 1 })
db.sessions.createIndex({ "createdAt": 1 }, { expireAfterSeconds: 86400 })
db.messages.createIndex({ "session": 1, "timestamp": 1 })
db.crisisalerts.createIndex({ "severity": 1, "status": 1 })

// Query optimization
const users = await User.find({ status: 'active' })
  .select('name email role')
  .lean() // Return plain JavaScript objects
  .limit(100);
```

### 2. Caching Strategy

```javascript
// Redis caching
const redis = require('redis');
const client = redis.createClient(process.env.REDIS_URL);

// Cache user sessions
app.use(session({
  store: new RedisStore({ client }),
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  }
}));

// Cache frequently accessed data
const cacheMiddleware = (duration) => {
  return async (req, res, next) => {
    const key = req.originalUrl;
    const cached = await client.get(key);
    
    if (cached) {
      return res.json(JSON.parse(cached));
    }
    
    res.sendResponse = res.json;
    res.json = (body) => {
      client.setex(key, duration, JSON.stringify(body));
      res.sendResponse(body);
    };
    
    next();
  };
};
```

### 3. Load Balancing

```nginx
# nginx.conf - Load balancer configuration
upstream saneyar_backend {
    server 127.0.0.1:3000;
    server 127.0.0.1:3001;
    server 127.0.0.1:3002;
}

server {
    listen 80;
    server_name yourdomain.com;
    
    location / {
        proxy_pass http://saneyar_backend;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

## 🚨 Crisis Management in Production

### 1. Crisis Response SLA

- **Critical**: Response within 60 seconds
- **High**: Response within 5 minutes
- **Medium**: Response within 15 minutes

### 2. Crisis Monitoring Dashboard

```javascript
// Real-time crisis dashboard
const crisisDashboard = {
  getMetrics: async () => ({
    activeCrises: await CrisisAlert.countDocuments({ status: 'active' }),
    averageResponseTime: await calculateResponseTime(),
    availableCounselors: await User.countDocuments({ 
      role: 'counselor', 
      isOnline: true 
    }),
    systemHealth: await getSystemHealth()
  })
};
```

### 3. Failover Procedures

```javascript
// Automatic failover for crisis situations
const crisisFailover = {
  checkCounselorAvailability: async () => {
    const available = await User.countDocuments({
      role: 'counselor',
      isOnline: true
    });
    
    if (available === 0) {
      // Activate emergency protocols
      await this.activateEmergencyBackup();
    }
  },
  
  activateEmergencyBackup: async () => {
    // Send crisis alerts to supervisors
    // Activate external crisis services
    // Display emergency resources to users
  }
};
```

## 📞 Production Support

### Emergency Contacts
- **System Administrator**: +1-XXX-XXX-XXXX
- **Database Admin**: +1-XXX-XXX-XXXX
- **Crisis Supervisor**: +1-XXX-XXX-XXXX

### Monitoring URLs
- **Application Health**: `https://yourdomain.com/health`
- **API Status**: `https://yourdomain.com/api/v1/health`
- **Crisis Dashboard**: `https://yourdomain.com/admin/crisis-monitor`

### Troubleshooting Checklist

1. **Application Down**:
   - Check PM2 status: `pm2 status`
   - Check logs: `pm2 logs`
   - Restart if needed: `pm2 restart all`

2. **Database Issues**:
   - Check MongoDB Atlas status
   - Verify connection string
   - Check database user permissions

3. **Crisis System Issues**:
   - Verify crisis detection is running
   - Check counselor availability
   - Activate emergency protocols if needed

---

**⚠️ Production Safety Notice**: Always test deployment procedures in staging environments first. For crisis management systems, maintain 24/7 monitoring and have emergency contact procedures in place.