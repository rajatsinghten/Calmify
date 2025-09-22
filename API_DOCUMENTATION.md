# Saneyar Mental Health Platform - API Documentation

## Table of Contents
- [Overview](#overview)
- [Authentication](#authentication)
- [Base URL](#base-url)
- [Response Format](#response-format)
- [Error Handling](#error-handling)
- [Rate Limiting](#rate-limiting)
- [API Endpoints](#api-endpoints)
  - [Authentication](#authentication-endpoints)
  - [Users](#user-management)
  - [Sessions](#session-management)
  - [Messages](#messaging)
  - [Crisis Management](#crisis-management)
  - [Assessments](#mental-health-assessments)
  - [AI Chatbot](#ai-chatbot)
  - [Admin Dashboard](#admin-dashboard)
- [WebSocket Events](#websocket-events)
- [Crisis Response Workflow](#crisis-response-workflow)
- [Code Examples](#code-examples)

## Overview

The Saneyar Mental Health Platform API provides comprehensive mental health support services including crisis detection, counselor matching, AI-powered chatbot assistance, and real-time communication. The platform prioritizes user safety with advanced crisis detection algorithms and immediate response protocols.

### Key Features
- 🚨 **Advanced Crisis Detection**: AI-powered analysis with immediate intervention
- 👥 **Smart Counselor Matching**: Intelligent pairing based on specializations and availability
- 🤖 **AI Chatbot Support**: Mental health assessments and coping strategies
- 📊 **Real-time Dashboard**: Live monitoring for administrators and supervisors
- 🔒 **Security & Privacy**: HIPAA-compliant with end-to-end encryption
- 📱 **Multi-platform Support**: Web, mobile, and API access

## Base URL
```
Production: https://api.saneyar.com/v1
Development: http://localhost:3000/api/v1
```

## Authentication

The API uses JWT (JSON Web Tokens) for authentication. Include the token in the Authorization header:

```http
Authorization: Bearer <your-jwt-token>
```

### Anonymous Access
For privacy, users can access crisis support without registration:
```http
X-Anonymous-ID: <anonymous-user-id>
```

## Response Format

All API responses follow this standard format:

### Success Response
```json
{
  "success": true,
  "data": {},
  "message": "Operation completed successfully",
  "timestamp": "2025-09-22T10:30:00.000Z"
}
```

### Error Response
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid input data",
    "details": [
      {
        "field": "email",
        "message": "Invalid email format"
      }
    ]
  },
  "timestamp": "2025-09-22T10:30:00.000Z"
}
```

### Crisis Response
```json
{
  "success": true,
  "crisis": {
    "detected": true,
    "level": "high",
    "requiresImmediate": true,
    "resources": [
      {
        "name": "National Suicide Prevention Lifeline",
        "phone": "988",
        "available24x7": true
      }
    ]
  },
  "data": {},
  "timestamp": "2025-09-22T10:30:00.000Z"
}
```

## Error Handling

### HTTP Status Codes
- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `409` - Conflict
- `429` - Rate Limited
- `500` - Internal Server Error
- `503` - Service Unavailable

### Error Codes
- `VALIDATION_ERROR` - Input validation failed
- `AUTHENTICATION_ERROR` - Invalid or expired token
- `AUTHORIZATION_ERROR` - Insufficient permissions
- `NOT_FOUND_ERROR` - Resource not found
- `CRISIS_DETECTED` - Crisis situation detected (special handling)
- `RATE_LIMIT_ERROR` - Too many requests

## Rate Limiting

- **General API**: 100 requests per minute per IP
- **Crisis Endpoints**: No rate limiting (safety priority)
- **Authentication**: 5 login attempts per 15 minutes
- **Messages**: 50 messages per minute per user

## API Endpoints

### Authentication Endpoints

#### Register User
```http
POST /auth/register
```

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securePassword123",
  "role": "user",
  "age": 25,
  "preferredLanguage": "en"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "user_123",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "user"
    },
    "tokens": {
      "accessToken": "eyJhbGciOiJIUzI1NiIs...",
      "refreshToken": "eyJhbGciOiJIUzI1NiIs..."
    }
  }
}
```

#### Login
```http
POST /auth/login
```

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "securePassword123"
}
```

#### Generate Anonymous ID
```http
POST /auth/anonymous
```

**Response:**
```json
{
  "success": true,
  "data": {
    "anonymousId": "anon_abc123def456",
    "tempToken": "eyJhbGciOiJIUzI1NiIs...",
    "expiresIn": "24h"
  }
}
```

#### Refresh Token
```http
POST /auth/refresh
```

**Request Body:**
```json
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIs..."
}
```

### User Management

#### Get User Profile
```http
GET /users/profile
Authorization: Bearer <token>
```

#### Update User Profile
```http
PUT /users/profile
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "name": "John Smith",
  "preferredLanguage": "es",
  "emergencyContacts": [
    {
      "name": "Jane Doe",
      "relationship": "spouse",
      "phone": "+1234567890"
    }
  ],
  "medicalHistory": {
    "conditions": ["anxiety", "depression"],
    "medications": ["sertraline"],
    "allergies": []
  }
}
```

#### Get Available Counselors
```http
GET /users/counselors
Authorization: Bearer <token>
```

**Query Parameters:**
- `specialization` - Filter by specialization
- `language` - Filter by language
- `availability` - Only show available counselors

**Response:**
```json
{
  "success": true,
  "data": {
    "counselors": [
      {
        "id": "counselor_123",
        "name": "Dr. Sarah Wilson",
        "role": "therapist",
        "specializations": ["anxiety", "depression", "crisis_intervention"],
        "languages": ["en", "es"],
        "rating": 4.8,
        "isAvailable": true,
        "responseTime": "5-10 minutes"
      }
    ],
    "total": 15,
    "available": 8
  }
}
```

### Session Management

#### Create Session
```http
POST /sessions
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "type": "crisis",
  "helperId": "counselor_123",
  "isAnonymous": false,
  "initialMessage": "I need help dealing with anxiety"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "session": {
      "id": "session_456",
      "type": "crisis",
      "status": "active",
      "user": "user_123",
      "helper": {
        "id": "counselor_123",
        "name": "Dr. Sarah Wilson"
      },
      "createdAt": "2025-09-22T10:30:00.000Z",
      "estimatedWaitTime": "2-5 minutes"
    }
  }
}
```

#### Get Session Details
```http
GET /sessions/:sessionId
Authorization: Bearer <token>
```

#### End Session
```http
POST /sessions/:sessionId/end
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "reason": "completed",
  "feedback": {
    "rating": 5,
    "comment": "Very helpful session"
  },
  "followUpNeeded": false
}
```

#### Get User Sessions
```http
GET /sessions
Authorization: Bearer <token>
```

**Query Parameters:**
- `status` - Filter by status (active, completed, cancelled)
- `type` - Filter by type (crisis, regular, group)
- `limit` - Number of sessions to return
- `offset` - Pagination offset

### Messaging

#### Send Message
```http
POST /sessions/:sessionId/messages
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "content": "I've been feeling overwhelmed lately",
  "type": "text",
  "encrypted": true
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "message": {
      "id": "msg_789",
      "content": "I've been feeling overwhelmed lately",
      "sender": "user_123",
      "timestamp": "2025-09-22T10:30:00.000Z",
      "crisisAnalysis": {
        "riskLevel": "low",
        "confidence": 0.3,
        "requiresAttention": false
      }
    }
  }
}
```

#### Get Messages
```http
GET /sessions/:sessionId/messages
Authorization: Bearer <token>
```

**Query Parameters:**
- `limit` - Number of messages (default: 50)
- `before` - Get messages before this timestamp
- `after` - Get messages after this timestamp

### Crisis Management

#### Analyze Crisis Content
```http
POST /crisis/analyze
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "content": "I can't take this anymore and want to end it all",
  "context": {
    "sessionId": "session_456",
    "previousMessages": 5
  }
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "analysis": {
      "riskLevel": "critical",
      "confidence": 0.95,
      "categories": ["suicide", "hopelessness"],
      "matchedKeywords": [
        {
          "keyword": "end it all",
          "category": "suicide",
          "severity": "critical"
        }
      ],
      "riskFactors": {
        "suicideWithImmediacy": true,
        "hopelessness": true
      },
      "requiresImmediate": true
    },
    "recommendations": {
      "immediate": [
        "Contact crisis counselor immediately",
        "Initiate safety protocol"
      ],
      "resources": [
        {
          "name": "National Suicide Prevention Lifeline",
          "contact": "988"
        }
      ]
    }
  }
}
```

#### Trigger Crisis Alert
```http
POST /crisis/alert
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "sessionId": "session_456",
  "messageId": "msg_789",
  "severity": "critical",
  "override": false
}
```

#### Get Crisis Resources
```http
GET /crisis/resources
```

**Query Parameters:**
- `location` - User location (country code)
- `language` - Preferred language
- `type` - Resource type (hotline, text, chat)

### Mental Health Assessments

#### Start PHQ-9 Assessment
```http
POST /assessments/phq9
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "assessment": {
      "id": "assessment_123",
      "type": "phq9",
      "questions": [
        {
          "id": 1,
          "text": "Over the last 2 weeks, how often have you been bothered by little interest or pleasure in doing things?",
          "options": [
            {"value": 0, "text": "Not at all"},
            {"value": 1, "text": "Several days"},
            {"value": 2, "text": "More than half the days"},
            {"value": 3, "text": "Nearly every day"}
          ]
        }
      ],
      "currentQuestion": 1,
      "totalQuestions": 9
    }
  }
}
```

#### Submit Assessment Answer
```http
POST /assessments/:assessmentId/answer
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "questionId": 1,
  "answer": 2
}
```

#### Get Assessment Results
```http
GET /assessments/:assessmentId/results
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "results": {
      "score": 15,
      "severity": "moderate",
      "interpretation": "Moderate depression symptoms detected",
      "recommendations": [
        "Consider speaking with a mental health professional",
        "Practice self-care strategies",
        "Monitor symptoms regularly"
      ],
      "followUpSuggested": true
    }
  }
}
```

### AI Chatbot

#### Start Chatbot Conversation
```http
POST /chatbot/conversation
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "initialMessage": "I'm feeling anxious",
  "anonymous": true
}
```

#### Send Message to Chatbot
```http
POST /chatbot/message
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "conversationId": "conv_123",
  "message": "I can't sleep and feel worried all the time"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "response": {
      "message": "I understand you're experiencing anxiety and sleep difficulties. These are common symptoms that many people face. Would you like me to guide you through a brief anxiety assessment to better understand your situation?",
      "intent": "anxiety_support",
      "confidence": 0.92,
      "suggestedActions": [
        "Take anxiety assessment",
        "Learn breathing techniques",
        "Connect with counselor"
      ],
      "crisisCheck": {
        "flagged": false,
        "riskLevel": "low"
      }
    }
  }
}
```

### Admin Dashboard

#### Get Dashboard Overview
```http
GET /admin/dashboard
Authorization: Bearer <admin-token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "overview": {
      "activeAlerts": {
        "critical": 2,
        "high": 5,
        "medium": 8,
        "total": 15
      },
      "activeSessions": {
        "total": 23,
        "crisis": 7,
        "regular": 16
      },
      "counselorStatus": {
        "available": 12,
        "busy": 8,
        "offline": 3
      },
      "systemMetrics": {
        "averageResponseTime": 45,
        "systemLoad": 67,
        "uptime": "99.8%"
      }
    }
  }
}
```

#### Get Crisis Alerts
```http
GET /admin/crisis-alerts
Authorization: Bearer <admin-token>
```

**Query Parameters:**
- `status` - Filter by status (active, resolved)
- `severity` - Filter by severity
- `limit` - Number of alerts to return

#### Assign Crisis Counselor
```http
POST /admin/crisis-alerts/:alertId/assign
Authorization: Bearer <admin-token>
```

**Request Body:**
```json
{
  "counselorId": "counselor_123",
  "priority": "urgent",
  "notes": "Counselor has experience with similar cases"
}
```

## WebSocket Events

Connect to WebSocket server for real-time updates:

```javascript
const socket = io('ws://localhost:3000', {
  auth: {
    token: 'your-jwt-token'
  }
});
```

### Client Events (Emit)

#### Join User Room
```javascript
socket.emit('join_user_room', {
  userId: 'user_123'
});
```

#### Join Session
```javascript
socket.emit('join_session', {
  sessionId: 'session_456'
});
```

#### Send Real-time Message
```javascript
socket.emit('send_message', {
  sessionId: 'session_456',
  content: 'Hello',
  type: 'text'
});
```

#### Counselor Availability Update
```javascript
socket.emit('counselor_availability_update', {
  counselorId: 'counselor_123',
  availability: {
    isOnline: true,
    status: 'available'
  }
});
```

### Server Events (Listen)

#### New Message Received
```javascript
socket.on('new_message', (data) => {
  console.log('New message:', data.message);
  // Handle crisis analysis if present
  if (data.crisisAnalysis?.requiresImmediate) {
    // Show crisis resources
  }
});
```

#### Crisis Alert
```javascript
socket.on('crisis_alert', (data) => {
  console.log('Crisis detected:', data);
  // Show emergency resources immediately
  showEmergencyResources(data.resources);
});
```

#### Session Status Update
```javascript
socket.on('session_status_update', (data) => {
  console.log('Session status:', data.status);
  // Update UI based on session status
});
```

#### Counselor Response
```javascript
socket.on('counselor_response', (data) => {
  console.log('Counselor responded:', data);
  // Show counselor availability/response
});
```

#### Emergency Resources
```javascript
socket.on('emergency_resources', (data) => {
  console.log('Emergency resources:', data.resources);
  // Display emergency contact information
});
```

## Crisis Response Workflow

### Automatic Crisis Detection Flow

1. **Message Analysis**: Every message is analyzed for crisis indicators
2. **Risk Assessment**: AI determines risk level (minimal, low, medium, high, critical)
3. **Alert Triggering**: High/critical risk automatically triggers alerts
4. **Counselor Notification**: Available crisis counselors are notified immediately
5. **Emergency Protocols**: Critical cases trigger emergency service protocols
6. **Real-time Monitoring**: Continuous monitoring until resolution

### Crisis Severity Levels

- **Critical**: Immediate danger, emergency services may be contacted
- **High**: Urgent counselor intervention required within 5 minutes
- **Medium**: Counselor assignment within 15 minutes
- **Low**: Regular monitoring and support
- **Minimal**: Standard care protocols

### Emergency Escalation

When crisis detected:
1. User receives immediate crisis resources
2. Available crisis counselors notified
3. Admin dashboard updated in real-time
4. Emergency contacts may be notified (with consent)
5. External emergency services contacted if necessary

## Code Examples

### React Frontend Integration

```javascript
// Crisis-aware messaging component
import { useState, useEffect } from 'react';
import io from 'socket.io-client';

const CrisisAwareChat = ({ sessionId, token }) => {
  const [socket, setSocket] = useState(null);
  const [messages, setMessages] = useState([]);
  const [crisisResources, setCrisisResources] = useState(null);

  useEffect(() => {
    const newSocket = io('ws://localhost:3000', {
      auth: { token }
    });

    // Listen for crisis alerts
    newSocket.on('crisis_alert', (data) => {
      setCrisisResources(data.resources);
      // Show emergency modal
      showEmergencyModal(data);
    });

    // Listen for new messages
    newSocket.on('new_message', (data) => {
      setMessages(prev => [...prev, data.message]);
      
      // Check for crisis analysis
      if (data.crisisAnalysis?.requiresImmediate) {
        showCrisisSupport(data.crisisAnalysis);
      }
    });

    newSocket.emit('join_session', { sessionId });
    setSocket(newSocket);

    return () => newSocket.close();
  }, [sessionId, token]);

  const sendMessage = async (content) => {
    try {
      const response = await fetch(`/api/v1/sessions/${sessionId}/messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ content, type: 'text' })
      });

      const result = await response.json();
      
      // Handle crisis detection in response
      if (result.crisis?.detected) {
        showCrisisAlert(result.crisis);
      }
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  return (
    <div className="crisis-aware-chat">
      {crisisResources && (
        <EmergencyResourcesModal resources={crisisResources} />
      )}
      {/* Chat UI */}
    </div>
  );
};
```

### Node.js Client Integration

```javascript
const axios = require('axios');
const io = require('socket.io-client');

class SaneyarClient {
  constructor(baseURL, token) {
    this.baseURL = baseURL;
    this.token = token;
    this.socket = null;
  }

  async connectSocket() {
    this.socket = io(this.baseURL.replace('/api/v1', ''), {
      auth: { token: this.token }
    });

    this.socket.on('crisis_alert', (data) => {
      console.log('🚨 CRISIS ALERT:', data);
      this.handleCrisisAlert(data);
    });
  }

  async sendMessage(sessionId, content) {
    try {
      const response = await axios.post(
        `${this.baseURL}/sessions/${sessionId}/messages`,
        { content, type: 'text' },
        { headers: { Authorization: `Bearer ${this.token}` } }
      );

      return response.data;
    } catch (error) {
      throw new Error(`Message send failed: ${error.response?.data?.error?.message}`);
    }
  }

  async analyzeCrisis(content) {
    try {
      const response = await axios.post(
        `${this.baseURL}/crisis/analyze`,
        { content },
        { headers: { Authorization: `Bearer ${this.token}` } }
      );

      return response.data.data.analysis;
    } catch (error) {
      throw new Error(`Crisis analysis failed: ${error.response?.data?.error?.message}`);
    }
  }

  handleCrisisAlert(alertData) {
    // Implement your crisis handling logic
    console.log('Handling crisis alert:', alertData);
    
    // Example: Send notification to admin
    this.notifyAdmins(alertData);
  }
}

// Usage
const client = new SaneyarClient('http://localhost:3000/api/v1', 'your-token');
await client.connectSocket();

// Send message with automatic crisis detection
const result = await client.sendMessage('session_123', 'I need help');
if (result.crisis?.detected) {
  console.log('Crisis detected:', result.crisis);
}
```

### Emergency Resource Display

```javascript
const EmergencyResources = ({ resources, severity }) => {
  const criticalResources = [
    { name: 'Emergency Services', contact: '911', type: 'emergency' },
    { name: 'Suicide Prevention Lifeline', contact: '988', type: 'crisis' },
    { name: 'Crisis Text Line', contact: '741741', type: 'text', keyword: 'HOME' }
  ];

  return (
    <div className={`emergency-resources ${severity}`}>
      <h2>🚨 Emergency Resources</h2>
      <p>If you are in immediate danger, please contact emergency services.</p>
      
      <div className="resources-grid">
        {criticalResources.map((resource, index) => (
          <div key={index} className="resource-card">
            <h3>{resource.name}</h3>
            <div className="contact-info">
              {resource.type === 'text' ? (
                <p>Text "{resource.keyword}" to {resource.contact}</p>
              ) : (
                <a href={`tel:${resource.contact}`}>{resource.contact}</a>
              )}
            </div>
            <span className="availability">Available 24/7</span>
          </div>
        ))}
      </div>
      
      {resources && (
        <div className="additional-resources">
          <h4>Additional Support:</h4>
          {resources.map((resource, index) => (
            <div key={index} className="resource-item">
              <span className="name">{resource.name}</span>
              <span className="contact">{resource.phone || resource.text}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
```

## Security Considerations

### Data Protection
- All sensitive data is encrypted at rest and in transit
- PHI (Protected Health Information) is handled according to HIPAA guidelines
- Message encryption uses AES-256 encryption
- Anonymous sessions protect user identity

### Crisis Safety
- Crisis detection cannot be disabled or bypassed
- Emergency protocols always take precedence
- Failsafe mechanisms ensure help is always available
- Audit trails track all crisis interventions

### API Security
- JWT tokens with configurable expiration
- Rate limiting to prevent abuse
- Input validation and sanitization
- CORS protection and security headers

---

For questions or support, contact our development team or refer to the main documentation.