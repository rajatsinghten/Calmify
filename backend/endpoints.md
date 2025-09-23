# Saneyar Mental Health Platform - Complete API Documentation# Saneyar Mental Health Platform - Complete API Documentation



## Table of Contents## Table of Contents

1. [Overview](#overview)1. [Overview](#overview)

2. [Base Configuration](#base-configuration)2. [Base Configuration](#base-configuration)

3. [Authentication](#authentication)3. [Authentication](#authentication)

4. [Error Handling](#error-handling)4. [Error Handling](#error-handling)

5. [Rate Limiting](#rate-limiting)5. [Rate Limiting](#rate-limiting)

6. [Health Check](#health-check)6. [Health Check](#health-check)

7. [Authentication Endpoints](#authentication-endpoints)7. [Authentication Endpoints](#authentication-endpoints)

8. [User Management](#user-management)8. [User Management](#user-management)

9. [Session Management](#session-management)9. [Session Management](#session-management)

10. [Message System](#message-system)10. [Message System](#message-system)

11. [Crisis Management](#crisis-management)11. [Crisis Management](#crisis-management)

12. [AI & Chatbot](#ai--chatbot)12. [AI & Chatbot](#ai--chatbot)

13. [Urgent Operations](#urgent-operations)13. [Urgent Operations](#urgent-operations)

14. [Psychological Screening](#psychological-screening)14. [Psychological Screening](#psychological-screening)

15. [Real-time Communication](#real-time-communication)15. [Real-time Communication](#real-time-communication)

16. [Data Schemas](#data-schemas)16. [Data Schemas](#data-schemas)

---

---

## Overview

## Overview

The Saneyar Mental Health Platform is a comprehensive system for mental health support featuring:

The Saneyar Mental Health Platform is a comprehensive system for mental health support featuring:- **Peer & Professional Counseling**: Real-time chat sessions between patients, peers, and counselors

- **Peer & Professional Counseling**: Real-time chat sessions between patients, peers, and counselors- **Crisis Detection & Management**: AI-powered crisis detection with immediate intervention

- **Crisis Detection & Management**: AI-powered crisis detection with immediate intervention- **Psychological Screening**: Standardized assessments (PHQ-9, GAD-7, GHQ)

- **Psychological Screening**: Standardized assessments (PHQ-9, GAD-7, GHQ)- **AI Chatbot**: 24/7 support with advanced conversation capabilities

- **AI Chatbot**: 24/7 support with advanced conversation capabilities- **Emergency Response**: Automated escalation and crisis management workflows

- **Emergency Response**: Automated escalation and crisis management workflows

**Base URL**: `http://localhost:5000/api`

**Base URL**: `http://localhost:5000/api`

### � Specialized Documentation

### 📚 Specialized Documentation- **[Psychological Screening API](./psychological-screening-api-docs.md)**: Complete documentation for PHQ-9, GAD-7, GHQ assessments

- **[Psychological Screening API](./psychological-screening-api-docs.md)**: Complete documentation for PHQ-9, GAD-7, GHQ assessments

---

---

## Base Configuration

## Base Configuration

### Environment

### Environment- **Development**: `http://localhost:5000`

- **Development**: `http://localhost:5000`- **Production**: `https://api.saneyar.com`

- **Production**: `https://api.saneyar.com`

### Content Type

### Content TypeAll requests should use `Content-Type: application/json`

All requests should use `Content-Type: application/json`

### CORS

### CORS- Allowed Origins: `http://localhost:3000` (configurable)

- Allowed Origins: `http://localhost:3000` (configurable)- Credentials: Supported

- Credentials: Supported- Methods: GET, POST, PUT, DELETE, OPTIONS

- Methods: GET, POST, PUT, DELETE, OPTIONS

---

---

## Authentication

## Authentication

### JWT Token Authentication

### JWT Token AuthenticationMost endpoints require JWT authentication via Bearer token:

Most endpoints require JWT authentication via Bearer token:

```http

```httpAuthorization: Bearer <jwt_token>

Authorization: Bearer <jwt_token>```

```

### Token Types

### Token Types- **Access Token**: Valid for 1 hour, used for API requests

- **Access Token**: Valid for 1 hour, used for API requests- **Refresh Token**: Valid for 30 days, used to obtain new access tokens

- **Refresh Token**: Valid for 30 days, used to obtain new access tokens

### User Roles

### User Roles- `patient`: Standard users seeking support

- `patient`: Standard users seeking support- `peer`: Trained peer supporters

- `peer`: Trained peer supporters- `counselor`: Professional mental health counselors

- `counselor`: Professional mental health counselors- `admin`: System administrators

- `admin`: System administrators

---

---

## Error Handling

## Error Handling

### Standard Error Format

### Standard Error Format```json

```json{

{  "success": false,

  "success": false,  "message": "Error description",

  "message": "Error description",  "error": "ERROR_CODE",

  "error": "ERROR_CODE",  "details": ["Specific validation errors"]

  "details": ["Specific validation errors"]}

}```

```

### HTTP Status Codes

### HTTP Status Codes- `200` - Success

- `200` - Success- `201` - Created

- `201` - Created- `400` - Bad Request / Validation Error

- `400` - Bad Request / Validation Error- `401` - Unauthorized / Invalid Token

- `401` - Unauthorized / Invalid Token- `403` - Forbidden / Insufficient Permissions

- `403` - Forbidden / Insufficient Permissions- `404` - Resource Not Found

- `404` - Resource Not Found- `429` - Rate Limit Exceeded

- `429` - Rate Limit Exceeded- `500` - Internal Server Error

- `500` - Internal Server Error

---

---

## Rate Limiting

## Rate Limiting

### General Limits

### General Limits- **API Endpoints**: 100 requests per 15 minutes per IP

- **API Endpoints**: 100 requests per 15 minutes per IP- **Authentication**: 5 requests per minute per IP

- **Authentication**: 5 requests per minute per IP- **Admin Endpoints**: 200 requests per 15 minutes per IP

- **Admin Endpoints**: 200 requests per 15 minutes per IP

### Rate Limit Headers

### Rate Limit Headers```http

```httpX-RateLimit-Limit: 100

X-RateLimit-Limit: 100X-RateLimit-Remaining: 95

X-RateLimit-Remaining: 95X-RateLimit-Reset: 1640995200

X-RateLimit-Reset: 1640995200```

```

---

---

## Health Check

## Health Check

### Server Health

### Server Health**Endpoint**: `GET /health`

**Endpoint**: `GET /health`

**Response**:

**Response**:```json

```json{

{  "status": "ok",

  "status": "ok",  "timestamp": "2025-09-23T08:14:15.000Z",

  "timestamp": "2025-09-23T08:14:15.000Z",  "version": "1.0.0",

  "version": "1.0.0",  "environment": "development"

  "environment": "development"}

}```

```

---

---

## Authentication Endpoints

## Authentication Endpoints

### POST /api/auth/register

### 1. User Registration

**Endpoint**: `POST /api/auth/register`Register a new user account.



**Request Body**:**Authentication**: Not required  

```json**Rate Limited**: 5 requests per 15 minutes

{

  "username": "john_doe",**Request Body**:

  "email": "john@university.edu",```json

  "password": "SecurePass123",{

  "role": "patient",  "username": "johndoe123",

  "profile": {  "email": "john.doe@example.com",

    "firstName": "John",  "password": "SecurePassword123!",

    "lastName": "Doe",  "role": "patient",

    "dateOfBirth": "1995-05-15",  "profile": {

    "phoneNumber": "+1234567890",    "firstName": "John",

    "emergencyContact": {    "lastName": "Doe",

      "name": "Jane Doe",    "age": 25,

      "relationship": "Sister",    "preferredName": "Johnny",

      "phoneNumber": "+1234567891"    "phoneNumber": "+1234567890",

    }    "emergencyContact": {

  }      "name": "Jane Doe",

}      "relationship": "Sister",

```      "phone": "+1234567891"

    },

**Success Response (201)**:    "preferences": {

```json      "language": "en",

{      "timezone": "America/New_York",

  "success": true,      "notifications": {

  "message": "User registered successfully",        "email": true,

  "data": {        "sms": false,

    "user": {        "push": true

      "id": "615f1234567890abcdef1234",      }

      "username": "john_doe",    }

      "email": "john@university.edu",  },

      "role": "patient",  "agreedToTerms": true,

      "isActive": true,  "agreedToPrivacy": true

      "createdAt": "2025-09-23T08:14:15.000Z"}

    },```

    "tokens": {

      "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",**Validation Rules**:

      "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",- `email`: Valid email format, unique

      "expiresIn": 3600- `password`: Minimum 8 characters, must contain uppercase, lowercase, number, and special character

    }- `role`: One of: `patient`, `peer`, `counselor`, `admin`

  }- `age`: Must be 13 or older

}

```**Success Response (201)**:

```json

### 2. User Login{

**Endpoint**: `POST /api/auth/login`  "message": "User registered successfully",

  "user": {

**Request Body**:    "_id": "60f7b1234567890abcdef123",

```json    "username": "johndoe123",

{    "email": "john.doe@example.com",

  "email": "john@university.edu",    "role": "patient",

  "password": "SecurePass123"    "profile": {

}      "firstName": "John",

```      "lastName": "Doe",

      "age": 25,

**Success Response (200)**:      "preferredName": "Johnny"

```json    },

{    "isVerified": false,

  "success": true,    "isOnline": false,

  "message": "Login successful",    "createdAt": "2025-09-22T10:30:00.000Z",

  "data": {    "lastLoginAt": null

    "user": {  },

      "id": "615f1234567890abcdef1234",  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",

      "username": "john_doe",  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",

      "email": "john@university.edu",  "verificationEmail": "sent"

      "role": "patient",}

      "profile": {```

        "firstName": "John",

        "lastName": "Doe"**Error Responses**:

      },```json

      "isActive": true,// 400 - Validation Error

      "lastLogin": "2025-09-23T08:14:15.000Z"{

    },  "error": "Validation failed",

    "tokens": {  "details": {

      "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",    "email": "Email already exists",

      "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",    "password": "Password must contain at least one uppercase letter"

      "expiresIn": 3600  }

    }}

  }

}// 409 - Conflict

```{

  "error": "User already exists",

### 3. Refresh Token  "details": "An account with this email already exists"

**Endpoint**: `POST /api/auth/refresh`}

```

**Request Body**:

```json---

{

  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."### POST /api/auth/login

}

```Authenticate user and obtain access token.



**Success Response (200)**:**Authentication**: Not required  

```json**Rate Limited**: 5 requests per 15 minutes

{

  "success": true,**Request Body**:

  "message": "Token refreshed successfully",```json

  "data": {{

    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",  "email": "john.doe@example.com",

    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",  "password": "SecurePassword123!",

    "expiresIn": 3600  "rememberMe": true

  }}

}```

```

**Success Response (200)**:

### 4. Logout```json

**Endpoint**: `POST /api/auth/logout`{

  "message": "Login successful",

**Headers**: `Authorization: Bearer <token>`  "user": {

    "_id": "60f7b1234567890abcdef123",

**Success Response (200)**:    "username": "johndoe123",

```json    "email": "john.doe@example.com",

{    "role": "patient",

  "success": true,    "profile": {

  "message": "Logout successful"      "firstName": "John",

}      "lastName": "Doe",

```      "preferredName": "Johnny"

    },

### 5. Get Current User    "isOnline": true,

**Endpoint**: `GET /api/auth/me`    "lastLoginAt": "2025-09-22T10:30:00.000Z",

    "preferences": {

**Headers**: `Authorization: Bearer <token>`      "language": "en",

      "timezone": "America/New_York"

**Success Response (200)**:    }

```json  },

{  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",

  "success": true,  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",

  "data": {  "expiresIn": 3600

    "user": {}

      "id": "615f1234567890abcdef1234",```

      "username": "john_doe",

      "email": "john@university.edu",**Error Responses**:

      "role": "patient",```json

      "profile": {// 401 - Invalid Credentials

        "firstName": "John",{

        "lastName": "Doe",  "error": "Invalid credentials",

        "dateOfBirth": "1995-05-15",  "details": "Email or password is incorrect"

        "phoneNumber": "+1234567890"}

      },

      "isActive": true,// 423 - Account Locked

      "isOnline": true,{

      "lastLogin": "2025-09-23T08:14:15.000Z",  "error": "Account temporarily locked",

      "createdAt": "2025-09-23T08:00:00.000Z"  "details": "Too many failed login attempts. Try again in 30 minutes.",

    }  "retryAfter": 1800

  }}

}```

```

---

---

### POST /api/auth/logout

## User Management

Logout user and invalidate tokens.

### 1. Update Profile

**Endpoint**: `PUT /api/auth/profile`**Authentication**: Required



**Headers**: `Authorization: Bearer <token>`**Request Body**:

```json

**Request Body**:{

```json  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."

{}

  "profile": {```

    "firstName": "John",

    "lastName": "Smith",**Success Response (200)**:

    "phoneNumber": "+1234567890",```json

    "bio": "Mental health advocate",{

    "preferences": {  "message": "Logout successful"

      "notifications": true,}

      "emailUpdates": false```

    }

  }---

}

```### POST /api/auth/refresh



### 2. Change PasswordRefresh access token using refresh token.

**Endpoint**: `PUT /api/auth/password`

**Authentication**: Not required

**Headers**: `Authorization: Bearer <token>`

**Request Body**:

**Request Body**:```json

```json{

{  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."

  "currentPassword": "oldPassword123",}

  "newPassword": "newSecurePass456"```

}

```**Success Response (200)**:

```json

---{

  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",

## Session Management  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",

  "expiresIn": 3600

### 1. Create Support Session}

**Endpoint**: `POST /api/sessions````



**Headers**: `Authorization: Bearer <token>`---



**Request Body**:### POST /api/auth/forgot-password

```json

{Request password reset email.

  "type": "peer_support",

  "title": "Anxiety Support Request",**Authentication**: Not required

  "description": "Looking for help with anxiety management",

  "urgencyLevel": "medium",**Request Body**:

  "preferredHelperType": "peer",```json

  "tags": ["anxiety", "stress", "academic"]{

}  "email": "john.doe@example.com"

```}

```

**Success Response (201)**:

```json**Success Response (200)**:

{```json

  "success": true,{

  "message": "Session created successfully",  "message": "Password reset email sent",

  "data": {  "details": "If an account exists with this email, you will receive reset instructions"

    "session": {}

      "id": "615f1234567890abcdef1235",```

      "type": "peer_support",

      "title": "Anxiety Support Request",---

      "description": "Looking for help with anxiety management",

      "status": "pending",### POST /api/auth/reset-password

      "urgencyLevel": "medium",

      "patientId": "615f1234567890abcdef1234",Reset password using reset token.

      "tags": ["anxiety", "stress", "academic"],

      "createdAt": "2025-09-23T08:14:15.000Z",**Authentication**: Not required

      "estimatedWaitTime": 300

    }**Request Body**:

  }```json

}{

```  "token": "reset_token_from_email",

  "newPassword": "NewSecurePassword123!",

### 2. Get Available Sessions  "confirmPassword": "NewSecurePassword123!"

**Endpoint**: `GET /api/sessions/available`}

```

**Headers**: `Authorization: Bearer <token>`

**Success Response (200)**:

**Query Parameters**:```json

- `type`: Session type filter{

- `urgencyLevel`: Urgency filter  "message": "Password reset successful"

- `limit`: Number of results (default: 10)}

```

**Success Response (200)**:

```json### POST /api/auth/anonymous

{

  "success": true,Create an anonymous session for guest users.

  "data": {

    "sessions": [**Authentication**: Not required

      {

        "id": "615f1234567890abcdef1235",**Request Body**:

        "type": "peer_support",```json

        "title": "Anxiety Support Request",{

        "urgencyLevel": "medium",  "sessionId": "optional_session_id"

        "tags": ["anxiety", "stress"],}

        "waitTime": 180,```

        "createdAt": "2025-09-23T08:14:15.000Z"

      }**Success Response (200)**:

    ],```json

    "count": 1{

  }  "success": true,

}  "message": "Anonymous session created",

```  "sessionId": "generated_session_id",

  "token": "jwt_token_for_anonymous_user"

### 3. Accept Session}

**Endpoint**: `POST /api/sessions/:sessionId/accept````



**Headers**: `Authorization: Bearer <token>`### POST /api/auth/verify



**Success Response (200)**:Verify JWT token validity.

```json

{**Authentication**: Required

  "success": true,

  "message": "Session accepted successfully",**Headers**:

  "data": {```

    "session": {Authorization: Bearer <jwt_token>

      "id": "615f1234567890abcdef1235",```

      "status": "active",

      "helperId": "615f1234567890abcdef1237",**Success Response (200)**:

      "acceptedAt": "2025-09-23T08:20:15.000Z"```json

    }{

  }  "valid": true,

}  "user": {

```    "id": "user_id",

    "username": "john_doe",

### 4. Decline Session    "email": "john@example.com",

**Endpoint**: `POST /api/sessions/:sessionId/decline`    "role": "user"

  }

**Headers**: `Authorization: Bearer <token>`}

```

**Request Body**:

```json---

{

  "reason": "Not available at the moment"## Session Management

}

```### POST /api/sessions/create



### 5. Get User SessionsCreate a new support session.

**Endpoint**: `GET /api/sessions/user`

**Authentication**: Required

**Headers**: `Authorization: Bearer <token>`

**Request Body**:

**Query Parameters**:```json

- `status`: Filter by status{

- `type`: Filter by session type  "helperType": "peer",

- `limit`: Number of results  "severity": "medium", 

- `page`: Page number  "title": "Job Interview Anxiety Support",

  "description": "I'm feeling anxious about an upcoming job interview and need someone to talk to"

**Success Response (200)**:}

```json```

{

  "success": true,**Field Descriptions**:

  "data": {- `helperType`: `peer` | `counselor` | `chatbot`

    "sessions": [- `severity`: `mild` | `moderate` | `severe` | `critical`

      {- `title`: Session title (optional)

        "id": "615f1234567890abcdef1235",- `description`: Description of what support is needed

        "type": "peer_support",

        "title": "Anxiety Support Request",**Success Response (201)**:

        "status": "completed",```json

        "duration": 1800,{

        "rating": 5,  "message": "Session created successfully",

        "createdAt": "2025-09-23T08:14:15.000Z",  "session": {

        "completedAt": "2025-09-23T08:44:15.000Z"    "_id": "60f7b1234567890abcdef124",

      }    "patientId": "60f7b1234567890abcdef123",

    ],    "helperId": null,

    "pagination": {    "helperType": "peer",

      "current": 1,    "status": "waiting",

      "total": 5,    "severity": "moderate",

      "count": 1    "title": "Job Interview Anxiety Support",

    }    "description": "I'm feeling anxious about an upcoming job interview",

  }    "createdAt": "2025-09-22T10:30:00.000Z",

}    "startedAt": null

```  }

}

### 6. End Session```

**Endpoint**: `POST /api/sessions/:sessionId/end`

---

**Headers**: `Authorization: Bearer <token>`

### GET /api/sessions/my-sessions

**Request Body**:

```jsonGet user's sessions with filtering and pagination.

{

  "rating": 5,**Authentication**: Required

  "feedback": "Very helpful session, thank you!",

  "tags": ["resolved", "helpful"]**Query Parameters**:

}- `status`: Filter by status (`waiting`, `active`, `closed`, `escalated`)

```- `helperType`: Filter by helper type (`peer`, `counselor`, `chatbot`)

- `severity`: Filter by severity (`low`, `medium`, `high`, `critical`)

---- `limit`: Number of sessions per page (default: 20, max: 100)

- `page`: Page number (default: 1)

## Message System- `sort`: Sort field (`createdAt`, `updatedAt`, `status`)

- `order`: Sort order (`asc`, `desc`)

### 1. Send Message- `dateFrom`: Start date filter (ISO string)

**Endpoint**: `POST /api/messages`- `dateTo`: End date filter (ISO string)



**Headers**: `Authorization: Bearer <token>`**Example Request**:

```http

**Request Body**:GET /api/sessions/my-sessions?status=active&limit=10&page=1&sort=createdAt&order=desc

```json```

{

  "sessionId": "615f1234567890abcdef1235",**Success Response (200)**:

  "content": {```json

    "text": "Hello, I'm struggling with anxiety about my upcoming exams.",{

    "type": "text"  "sessions": [

  },    {

  "isEncrypted": false      "_id": "60f7b1234567890abcdef124",

}      "patientId": {

```        "_id": "60f7b1234567890abcdef123",

        "username": "johndoe123",

**Success Response (201)**:        "profile": {

```json          "firstName": "John",

{          "preferredName": "Johnny"

  "success": true,        }

  "message": "Message sent successfully",      },

  "data": {      "helperId": {

    "message": {        "_id": "60f7b1234567890abcdef125",

      "id": "615f1234567890abcdef1236",        "username": "helper_sarah",

      "sessionId": "615f1234567890abcdef1235",        "profile": {

      "senderId": "615f1234567890abcdef1234",          "firstName": "Sarah",

      "content": {          "specializations": ["anxiety", "career"]

        "text": "Hello, I'm struggling with anxiety about my upcoming exams.",        }

        "type": "text"      },

      },      "status": "active",

      "timestamp": "2025-09-23T08:14:15.000Z",      "severity": "medium",

      "isEncrypted": false,      "helperType": "peer",

      "messageNumber": 1      "description": "I'm feeling anxious about an upcoming job interview",

    }      "createdAt": "2025-09-22T10:30:00.000Z",

  }      "startedAt": "2025-09-22T10:35:00.000Z",

}      "lastActivity": "2025-09-22T11:00:00.000Z",

```      "messageCount": 12,

      "duration": 1500,

### 2. Get Session Messages      "tags": ["anxiety", "career", "interview"]

**Endpoint**: `GET /api/messages/session/:sessionId`    }

  ],

**Headers**: `Authorization: Bearer <token>`  "pagination": {

    "currentPage": 1,

**Query Parameters**:    "totalPages": 3,

- `limit`: Number of messages (default: 50)    "totalSessions": 25,

- `before`: Get messages before this message ID    "hasNextPage": true,

- `after`: Get messages after this message ID    "hasPrevPage": false

  },

**Success Response (200)**:  "summary": {

```json    "total": 25,

{    "active": 2,

  "success": true,    "waiting": 1,

  "data": {    "closed": 22

    "messages": [  }

      {}

        "id": "615f1234567890abcdef1236",```

        "senderId": "615f1234567890abcdef1234",

        "senderInfo": {---

          "username": "john_doe",

          "role": "patient"### GET /api/sessions/:sessionId

        },

        "content": {Get detailed information about a specific session.

          "text": "Hello, I'm struggling with anxiety.",

          "type": "text"**Authentication**: Required  

        },**Authorization**: User must be participant in session or have counselor/admin role

        "timestamp": "2025-09-23T08:14:15.000Z",

        "messageNumber": 1,**Success Response (200)**:

        "isEdited": false```json

      }{

    ],  "session": {

    "count": 1,    "_id": "60f7b1234567890abcdef124",

    "hasMore": false    "patientId": {

  }      "_id": "60f7b1234567890abcdef123",

}      "username": "johndoe123",

```      "profile": {

        "firstName": "John",

### 3. Update Message        "preferredName": "Johnny"

**Endpoint**: `PUT /api/messages/:messageId`      }

    },

**Headers**: `Authorization: Bearer <token>`    "helperId": {

      "_id": "60f7b1234567890abcdef125",

**Request Body**:      "username": "helper_sarah",

```json      "profile": {

{        "firstName": "Sarah",

  "content": {        "specializations": ["anxiety", "career"],

    "text": "Hello, I'm struggling with severe anxiety about my upcoming exams.",        "rating": 4.8,

    "type": "text"        "sessionsCompleted": 156

  }      }

}    },

```    "status": "active",

    "severity": "medium",

### 4. Delete Message    "helperType": "peer",

**Endpoint**: `DELETE /api/messages/:messageId`    "description": "I'm feeling anxious about an upcoming job interview",

    "isAnonymous": false,

**Headers**: `Authorization: Bearer <token>`    "createdAt": "2025-09-22T10:30:00.000Z",

    "startedAt": "2025-09-22T10:35:00.000Z",

**Success Response (200)**:    "endedAt": null,

```json    "duration": 1500,

{    "messageCount": 12,

  "success": true,    "lastActivity": "2025-09-22T11:00:00.000Z",

  "message": "Message deleted successfully"    "rating": null,

}    "feedback": null,

```    "sessionNotes": "User is articulate and responding well to peer support techniques",

    "tags": ["anxiety", "career", "interview"],

---    "crisisFlags": [],

    "escalationHistory": [],

## Crisis Management    "resources": [

      {

### 1. Create Crisis Alert        "title": "Interview Anxiety Tips",

**Endpoint**: `POST /api/crisis`        "url": "https://example.com/interview-tips",

        "type": "educational"

**Headers**: `Authorization: Bearer <token>`      }

    ]

**Request Body**:  },

```json  "recentMessages": [

{    {

  "severity": "high",      "_id": "60f7b1234567890abcdef126",

  "description": "User expressing suicidal thoughts",      "message": "Thank you for sharing that with me. It's completely normal to feel anxious before interviews.",

  "triggerContent": {      "senderId": "60f7b1234567890abcdef125",

    "text": "I don't want to live anymore",      "senderRole": "peer",

    "messageId": "615f1234567890abcdef1236",      "createdAt": "2025-09-22T11:00:00.000Z"

    "sessionId": "615f1234567890abcdef1235"    }

  },  ]

  "detectionMethod": "keyword_analysis",}

  "immediateAction": "escalate_to_counselor"```

}

```---



**Success Response (201)**:### PUT /api/sessions/:sessionId

```json

{Update session details (status, rating, feedback, etc.).

  "success": true,

  "message": "Crisis alert created successfully",**Authentication**: Required  

  "data": {**Authorization**: User must be participant or have counselor/admin role

    "alert": {

      "id": "615f1234567890abcdef1237",**Request Body**:

      "userId": "615f1234567890abcdef1234",```json

      "severity": "high",{

      "status": "active",  "status": "closed",

      "description": "User expressing suicidal thoughts",  "rating": 5,

      "detectionMethod": "keyword_analysis",  "feedback": "Sarah was incredibly helpful and understanding. I feel much more confident about my interview now.",

      "createdAt": "2025-09-23T08:14:15.000Z",  "sessionNotes": "Successful peer support session. User gained confidence and coping strategies.",

      "escalationLevel": 2,  "tags": ["anxiety", "career", "interview", "resolved"]

      "assignedCounselor": "615f1234567890abcdef1238"}

    }```

  }

}**Success Response (200)**:

``````json

{

### 2. Get Crisis Alerts  "message": "Session updated successfully",

**Endpoint**: `GET /api/crisis`  "session": {

    "_id": "60f7b1234567890abcdef124",

**Headers**: `Authorization: Bearer <token>` (Admin/Counselor only)    "status": "closed",

    "rating": 5,

**Query Parameters**:    "feedback": "Sarah was incredibly helpful and understanding...",

- `severity`: Filter by severity level    "endedAt": "2025-09-22T11:30:00.000Z",

- `status`: Filter by alert status    "duration": 3600

- `userId`: Filter by specific user  }

- `limit`: Number of results}

```

**Success Response (200)**:

```json---

{

  "success": true,### GET /api/sessions/available

  "data": {

    "alerts": [Get available sessions waiting for helpers to accept.

      {

        "id": "615f1234567890abcdef1237",**Authentication**: Required  

        "user": {**Authorization**: User must have peer, counselor, or admin role

          "id": "615f1234567890abcdef1234",

          "username": "john_doe",**Query Parameters**:

          "email": "john@university.edu"- `helperType`: Filter by helper type (`peer`, `counselor`) 

        },- `severity`: Filter by severity (`mild`, `moderate`, `severe`, `critical`)

        "severity": "high",- `limit`: Number of sessions to return (default: 10, max: 50)

        "status": "active",

        "description": "User expressing suicidal thoughts",**Example Request**:

        "createdAt": "2025-09-23T08:14:15.000Z",```http

        "assignedCounselor": {GET /api/sessions/available?helperType=peer&severity=moderate&limit=5

          "id": "615f1234567890abcdef1238",```

          "name": "Dr. Smith"

        }**Success Response (200)**:

      }```json

    ],{

    "count": 1  "sessions": [

  }    {

}      "_id": "60f7b1234567890abcdef124",

```      "patientId": {

        "_id": "60f7b1234567890abcdef123",

### 3. Update Crisis Alert        "username": "johndoe123",

**Endpoint**: `PUT /api/crisis/:alertId`        "profile": {

          "firstName": "John",

**Headers**: `Authorization: Bearer <token>` (Admin/Counselor only)          "preferredName": "Johnny"

        }

**Request Body**:      },

```json      "helperType": "peer",

{      "severity": "moderate",

  "status": "resolved",      "status": "waiting",

  "resolution": "User connected with crisis counselor, safety plan established",      "title": "Job Interview Anxiety Support",

  "followUpRequired": true,      "description": "I'm feeling anxious about an upcoming job interview and need someone to talk to",

  "followUpDate": "2025-09-24T08:14:15.000Z"      "createdAt": "2025-09-22T10:30:00.000Z",

}      "waitingMinutes": 15

```    },

    {

### 4. Get Crisis Statistics      "_id": "60f7b1234567890abcdef125",

**Endpoint**: `GET /api/crisis/stats`      "patientId": {

        "_id": "60f7b1234567890abcdef126",

**Headers**: `Authorization: Bearer <token>` (Admin only)        "username": "user456",

        "profile": {

**Success Response (200)**:          "firstName": "Maria",

```json          "preferredName": "Maria"

{        }

  "success": true,      },

  "data": {      "helperType": "peer", 

    "totalAlerts": 45,      "severity": "mild",

    "activeAlerts": 3,      "status": "waiting",

    "resolvedAlerts": 42,      "title": "Daily stress management",

    "severityBreakdown": {      "description": "Looking for someone to talk through daily stressors",

      "low": 15,      "createdAt": "2025-09-22T10:45:00.000Z",

      "medium": 20,      "waitingMinutes": 0

      "high": 8,    }

      "critical": 2  ],

    },  "totalWaiting": 2,

    "averageResponseTime": 180,  "instructions": {

    "trendsLast30Days": [    "joinEndpoint": "POST /api/sessions/{sessionId}/accept",

      {    "note": "Use the accept endpoint to take responsibility as the session helper"

        "date": "2025-09-23",  }

        "count": 2}

      }```

    ]

  }---

}

```### POST /api/sessions/:sessionId/accept



---Accept a waiting session as a helper (counselor/peer).



## AI & Chatbot**Authentication**: Required  

**Authorization**: User must have peer, counselor, or admin role

### 1. Start AI Chat Session

**Endpoint**: `POST /api/ai/chat`**Request Body**:

```json

**Headers**: `Authorization: Bearer <token>`{

  "message": "Hi! I'm here to help and support you through whatever you're experiencing. How are you feeling right now?"

**Request Body**:}

```json```

{

  "message": "I'm feeling overwhelmed with my studies",**Field Descriptions**:

  "context": {- `message`: Optional welcome message to send to the patient

    "userMood": "anxious",

    "previousTopics": ["academic_stress", "time_management"]**Success Response (200)**:

  }```json

}{

```  "message": "Session accepted successfully",

  "session": {

**Success Response (200)**:    "_id": "60f7b1234567890abcdef124",

```json    "patientId": {

{      "_id": "60f7b1234567890abcdef123",

  "success": true,      "username": "johndoe123",

  "data": {      "profile": {

    "response": {        "firstName": "John",

      "text": "I understand you're feeling overwhelmed with your studies. That's a common experience, and it's important to acknowledge these feelings. Can you tell me more about what specific aspects of your studies are causing you the most stress?",        "preferredName": "Johnny"

      "suggestions": [      }

        "Break down tasks into smaller steps",    },

        "Practice time management techniques",    "helperId": {

        "Talk to a counselor about academic stress"      "_id": "60f7b1234567890abcdef125",

      ],      "username": "helper_sarah",

      "mood": "supportive",      "profile": {

      "confidence": 0.89        "firstName": "Sarah"

    },      },

    "sessionId": "ai_session_123456",      "role": "peer"

    "conversationId": "615f1234567890abcdef1239"    },

  }    "helperType": "peer",

}    "status": "active",

```    "severity": "moderate",

    "title": "Job Interview Anxiety Support",

### 2. Continue AI Conversation    "description": "I'm feeling anxious about an upcoming job interview",

**Endpoint**: `POST /api/ai/continue`    "startedAt": "2025-09-22T10:35:00.000Z",

    "createdAt": "2025-09-22T10:30:00.000Z"

**Headers**: `Authorization: Bearer <token>`  },

  "welcomeMessage": {

**Request Body**:    "_id": "60f7b1234567890abcdef130",

```json    "message": "Hi! I'm here to help and support you...",

{    "createdAt": "2025-09-22T10:35:05.000Z"

  "conversationId": "615f1234567890abcdef1239",  },

  "message": "I have three exams next week and two assignments due",  "instructions": {

  "sessionId": "ai_session_123456"    "nextSteps": [

}      "Send a welcome message to introduce yourself",

```      "Ask about their current situation and feelings",

      "Provide support and active listening",

### 3. Get AI Conversation History      "Use /api/messages to send messages",

**Endpoint**: `GET /api/ai/conversations/:conversationId`      "Monitor for any crisis indicators"

    ],

**Headers**: `Authorization: Bearer <token>`    "endpoints": {

      "sendMessage": "POST /api/messages",

**Success Response (200)**:      "getMessages": "GET /api/messages/session/60f7b1234567890abcdef124",

```json      "escalate": "POST /api/urgent/escalate"

{    }

  "success": true,  }

  "data": {}

    "conversation": {```

      "id": "615f1234567890abcdef1239",

      "userId": "615f1234567890abcdef1234",**Error Responses**:

      "messages": [```json

        {// 403 - Not qualified helper

          "role": "user",{

          "content": "I'm feeling overwhelmed with my studies",  "error": "Only peers, counselors, and admins can accept sessions"

          "timestamp": "2025-09-23T08:14:15.000Z"}

        },

        {// 400 - Session not waiting

          "role": "assistant",{

          "content": "I understand you're feeling overwhelmed...",  "error": "Can only accept sessions that are waiting for a helper"

          "timestamp": "2025-09-23T08:14:18.000Z",}

          "suggestions": ["Break down tasks into smaller steps"]

        }// 409 - Already has helper

      ],{

      "status": "active",  "error": "Session already has a helper assigned"

      "startedAt": "2025-09-23T08:14:15.000Z"}

    }```

  }

}---

```

### POST /api/sessions/:sessionId/decline

### 4. End AI Conversation

**Endpoint**: `POST /api/ai/conversations/:conversationId/end`Decline a waiting session if unable to accept it.



**Headers**: `Authorization: Bearer <token>`**Authentication**: Required  

**Authorization**: User must have peer, counselor, or admin role

**Request Body**:

```json**Request Body**:

{```json

  "rating": 4,{

  "feedback": "Helpful suggestions for managing stress",  "reason": "Currently at capacity with other sessions"

  "helpful_topics": ["time_management", "stress_reduction"]}

}```

```

**Field Descriptions**:

---- `reason`: Optional reason for declining the session



## Urgent Operations**Success Response (200)**:

```json

### 1. Escalate Session to Urgent{

**Endpoint**: `POST /api/urgent/escalate`  "message": "Session declined successfully",

  "note": "Session remains available for other helpers to accept",

**Headers**: `Authorization: Bearer <token>`  "sessionStatus": "waiting",

  "declinesCount": 2

**Request Body**:}

```json```

{

  "sessionId": "615f1234567890abcdef1235",---

  "reason": "User expressing self-harm thoughts",

  "severity": "high",### POST /api/sessions/:sessionId/join

  "helperType": "counselor",

  "immediateAction": trueJoin a session as a helper.

}

```**Authentication**: Required  

**Authorization**: User must have peer/counselor role

**Success Response (200)**:

```json**Request Body**:

{```json

  "success": true,{

  "message": "Session escalated successfully",  "message": "Hi! I'm here to help and support you through whatever you're experiencing."

  "data": {}

    "urgentSession": {```

      "id": "615f1234567890abcdef1240",

      "originalSessionId": "615f1234567890abcdef1235",**Success Response (200)**:

      "severity": "high",```json

      "status": "escalated",{

      "escalatedAt": "2025-09-23T08:14:15.000Z",  "message": "Joined session successfully",

      "estimatedResponseTime": 120,  "session": {

      "priority": 1,    "_id": "60f7b1234567890abcdef124",

      "assignedCounselor": "615f1234567890abcdef1238"    "status": "active",

    }    "helperId": "60f7b1234567890abcdef125",

  }    "startedAt": "2025-09-22T10:35:00.000Z"

}  }

```}

```

### 2. Get Urgent Sessions Queue

**Endpoint**: `GET /api/urgent/queue`---



**Headers**: `Authorization: Bearer <token>` (Counselor/Admin only)## Message Endpoints



**Success Response (200)**:### GET /api/messages/session/:sessionId

```json

{Get messages for a specific session with pagination.

  "success": true,

  "data": {**Authentication**: Required  

    "urgentSessions": [**Authorization**: User must be participant in session

      {

        "id": "615f1234567890abcdef1240",**Query Parameters**:

        "user": {- `limit`: Number of messages (default: 50, max: 200)

          "id": "615f1234567890abcdef1234",- `before`: Get messages before this timestamp (ISO string)

          "username": "john_doe"- `after`: Get messages after this timestamp (ISO string)

        },- `messageId`: Get messages before/after this message ID

        "severity": "high",- `search`: Search within message content

        "waitTime": 45,

        "escalatedAt": "2025-09-23T08:14:15.000Z",**Success Response (200)**:

        "reason": "User expressing self-harm thoughts",```json

        "priority": 1{

      }  "messages": [

    ],    {

    "queueLength": 1,      "_id": "60f7b1234567890abcdef126",

    "averageWaitTime": 180      "sessionId": "60f7b1234567890abcdef124",

  }      "senderId": {

}        "_id": "60f7b1234567890abcdef123",

```        "username": "johndoe123",

        "profile": {

### 3. Accept Urgent Session          "preferredName": "Johnny"

**Endpoint**: `POST /api/urgent/:sessionId/accept`        }

      },

**Headers**: `Authorization: Bearer <token>` (Counselor only)      "message": "I've been feeling really anxious about my job interview tomorrow",

      "senderRole": "patient",

### 4. Get Emergency Contacts      "messageType": "text",

**Endpoint**: `GET /api/urgent/emergency-contacts`      "createdAt": "2025-09-22T10:40:00.000Z",

      "updatedAt": "2025-09-22T10:40:00.000Z",

**Headers**: `Authorization: Bearer <token>`      "replyTo": null,

      "reactions": [

**Success Response (200)**:        {

```json          "userId": "60f7b1234567890abcdef125",

{          "reaction": "supportive",

  "success": true,          "createdAt": "2025-09-22T10:41:00.000Z"

  "data": {        }

    "contacts": {      ],

      "crisis_hotline": {      "crisisDetected": false,

        "name": "National Crisis Hotline",      "aiGenerated": false,

        "phone": "988",      "isEdited": false,

        "available": "24/7"      "attachments": []

      },    },

      "local_emergency": {    {

        "name": "Campus Safety",      "_id": "60f7b1234567890abcdef127",

        "phone": "+1-555-0123",      "sessionId": "60f7b1234567890abcdef124",

        "available": "24/7"      "senderId": {

      },        "_id": "60f7b1234567890abcdef125",

      "counseling_center": {        "username": "helper_sarah",

        "name": "University Counseling Center",        "profile": {

        "phone": "+1-555-0456",          "firstName": "Sarah"

        "available": "Mon-Fri 8AM-5PM"        }

      }      },

    }      "message": "Thank you for sharing that with me. Interview anxiety is completely normal and you're not alone in feeling this way.",

  }      "senderRole": "peer",

}      "messageType": "text",

```      "createdAt": "2025-09-22T10:42:00.000Z",

      "replyTo": "60f7b1234567890abcdef126",

---      "crisisDetected": false,

      "aiGenerated": false,

## Psychological Screening      "suggestedResources": [

        {

### Quick Reference          "title": "Deep Breathing Exercises",

For complete psychological screening documentation, see [Psychological Screening API](./psychological-screening-api-docs.md).          "type": "coping-strategy",

          "url": "https://example.com/breathing"

### Core Endpoints        }

- `GET /api/questionnaires/type/:type` - Get questionnaire (PHQ-9, GAD-7, GHQ)      ]

- `POST /api/responses/start` - Start assessment session    }

- `POST /api/responses/submit-answer` - Submit answers  ],

- `POST /api/responses/complete` - Complete and score assessment  "pagination": {

- `GET /api/results/user/:userId/latest` - Get latest results    "hasMore": true,

- `GET /api/results/admin/aggregate` - Admin analytics    "total": 12,

    "oldestMessageId": "60f7b1234567890abcdef126",

### Supported Assessments    "newestMessageId": "60f7b1234567890abcdef127"

- **PHQ-9**: Depression screening  },

- **GAD-7**: Anxiety assessment    "sessionInfo": {

- **GHQ-12/GHQ-28**: General health questionnaire    "status": "active",

    "participants": 2,

### Example Flow    "crisisFlags": 0

```bash  }

# 1. Get questionnaire}

GET /api/questionnaires/type/PHQ-9```



# 2. Start session---

POST /api/responses/start

{### POST /api/messages

  "questionnaireId": "quest_id",

  "questionnaireType": "PHQ-9"Send a message to a session (alternative to Socket.io).

}

**Authentication**: Required

# 3. Submit answers (repeat for each question)

POST /api/responses/submit-answer**Request Body**:

{```json

  "sessionId": "session_uuid",{

  "questionNumber": 1,  "sessionId": "60f7b1234567890abcdef124",

  "selectedValue": 2  "message": "That really helps, thank you. Can you tell me more about breathing exercises?",

}  "messageType": "text",

  "replyTo": "60f7b1234567890abcdef127",

# 4. Complete assessment  "attachments": []

POST /api/responses/complete}

{```

  "sessionId": "session_uuid"

}**For file/image messages**:

```json

# 5. Get results{

GET /api/results/user/{userId}/latest?questionnaireType=PHQ-9  "sessionId": "60f7b1234567890abcdef124",

```  "message": "Here's a photo that helps me feel calm",

  "messageType": "image",

---  "attachments": [

    {

## Real-time Communication      "url": "https://cloudinary.com/...",

      "type": "image",

### Socket.io Events      "filename": "calming-photo.jpg",

      "size": 245760

#### Connection    }

```javascript  ]

// Client connection}

const socket = io('http://localhost:5000', {```

  auth: {

    token: 'your_jwt_token'**Success Response (201)**:

  }```json

});{

```  "message": "Message sent successfully",

  "messageData": {

#### Session Events    "_id": "60f7b1234567890abcdef128",

```javascript    "sessionId": "60f7b1234567890abcdef124",

// Join session room    "senderId": "60f7b1234567890abcdef123",

socket.emit('join-session', {    "message": "That really helps, thank you. Can you tell me more about breathing exercises?",

  sessionId: '615f1234567890abcdef1235'    "senderRole": "patient",

});    "messageType": "text",

    "createdAt": "2025-09-22T10:45:00.000Z",

// New message received    "replyTo": {

socket.on('new-message', (data) => {      "_id": "60f7b1234567890abcdef127",

  console.log('New message:', data.message);      "message": "Thank you for sharing that with me..."

});    },

    "crisisDetected": false,

// Session status update    "aiAnalysis": {

socket.on('session-update', (data) => {      "intent": "seeking-information",

  console.log('Session status:', data.status);      "sentiment": "positive",

});      "urgency": "low"

    }

// Crisis alert  },

socket.on('crisis-alert', (data) => {  "aiSuggestions": [

  console.log('Crisis detected:', data.alert);    {

});      "type": "resource",

```      "title": "4-7-8 Breathing Technique",

      "description": "A simple breathing exercise to reduce anxiety"

#### Typing Indicators    }

```javascript  ]

// Send typing indicator}

socket.emit('typing', {```

  sessionId: '615f1234567890abcdef1235',

  isTyping: true---

});

### PUT /api/messages/:messageId

// Receive typing indicator

socket.on('user-typing', (data) => {Edit a previously sent message.

  console.log(`${data.username} is typing...`);

});**Authentication**: Required  

```**Authorization**: User must be the sender



#### Presence Updates**Request Body**:

```javascript```json

// User online/offline status{

socket.on('user-status-change', (data) => {  "message": "That really helps, thank you so much. Can you tell me more about breathing exercises?"

  console.log(`${data.username} is now ${data.status}`);}

});```

```

**Success Response (200)**:

---```json

{

## Data Schemas  "message": "Message updated successfully",

  "messageData": {

### User Schema    "_id": "60f7b1234567890abcdef128",

```json    "message": "That really helps, thank you so much. Can you tell me more about breathing exercises?",

{    "isEdited": true,

  "id": "string",    "editedAt": "2025-09-22T10:47:00.000Z"

  "username": "string",  }

  "email": "string",}

  "role": "patient|peer|counselor|admin",```

  "profile": {

    "firstName": "string",---

    "lastName": "string",

    "dateOfBirth": "date",### DELETE /api/messages/:messageId

    "phoneNumber": "string",

    "bio": "string",Delete a message (soft delete for audit purposes).

    "emergencyContact": {

      "name": "string",**Authentication**: Required  

      "relationship": "string",**Authorization**: User must be sender or have admin role

      "phoneNumber": "string"

    }**Success Response (200)**:

  },```json

  "isActive": "boolean",{

  "isOnline": "boolean",  "message": "Message deleted successfully"

  "lastLogin": "date",}

  "createdAt": "date",```

  "updatedAt": "date"

}---

```

## Crisis Management

### Session Schema

```json### POST /api/crisis/create

{

  "id": "string",Create a crisis alert when crisis indicators are detected.

  "type": "peer_support|counselor_session|crisis_intervention",

  "title": "string",**Authentication**: Required

  "description": "string",

  "status": "pending|active|completed|cancelled",**Request Body**:

  "urgencyLevel": "low|medium|high|critical",```json

  "patientId": "string",{

  "helperId": "string",  "severity": "high",

  "tags": ["string"],  "type": "self-harm-indication",

  "duration": "number",  "description": "User expressed thoughts of self-harm in session",

  "rating": "number",  "location": {

  "feedback": "string",    "latitude": 40.7128,

  "createdAt": "date",    "longitude": -74.0060,

  "startedAt": "date",    "address": "New York, NY",

  "completedAt": "date"    "accuracy": 100

}  },

```  "sessionId": "60f7b1234567890abcdef124",

  "triggerMessage": "I just don't see the point in continuing anymore",

### Message Schema  "detectionMethod": "keyword-analysis",

```json  "riskFactors": [

{    "expressed-hopelessness",

  "id": "string",    "social-isolation",

  "sessionId": "string",    "previous-attempts"

  "senderId": "string",  ]

  "content": {}

    "text": "string",```

    "type": "text|image|file|emoji"

  },**Field Descriptions**:

  "timestamp": "date",- `severity`: `medium` | `high` | `critical`

  "isEncrypted": "boolean",- `type`: `self-harm-indication` | `suicide-risk` | `immediate-danger` | `user-report`

  "isEdited": "boolean",

  "messageNumber": "number",**Success Response (201)**:

  "replyTo": "string"```json

}{

```  "message": "Crisis alert created successfully",

  "alert": {

### Crisis Alert Schema    "_id": "60f7b1234567890abcdef129",

```json    "userId": "60f7b1234567890abcdef123",

{    "sessionId": "60f7b1234567890abcdef124",

  "id": "string",    "severity": "high",

  "userId": "string",    "type": "self-harm-indication",

  "severity": "low|medium|high|critical",    "status": "active",

  "status": "active|investigating|resolved",    "description": "User expressed thoughts of self-harm in session",

  "description": "string",    "createdAt": "2025-09-22T10:50:00.000Z",

  "triggerContent": {    "assignedCounselorId": "60f7b1234567890abcdef130",

    "text": "string",    "estimatedResponseTime": 300,

    "messageId": "string",    "alertNumber": "CA-2025-001234"

    "sessionId": "string"  },

  },  "immediateActions": [

  "detectionMethod": "keyword_analysis|ai_detection|manual_report",    {

  "assignedCounselor": "string",      "action": "counselor-notified",

  "resolution": "string",      "status": "completed",

  "createdAt": "date",      "timestamp": "2025-09-22T10:50:00.000Z"

  "resolvedAt": "date"    },

}    {

```      "action": "session-escalated",

      "status": "in-progress",

---      "timestamp": "2025-09-22T10:50:05.000Z"

    }

## Examples  ],

  "emergencyContacts": {

### Complete Session Flow    "crisis": "988",

```bash    "text": "Text HOME to 741741",

# 1. Login    "emergency": "911",

curl -X POST http://localhost:5000/api/auth/login \    "local": {

  -H "Content-Type: application/json" \      "name": "NYC Crisis Hotline",

  -d '{"email":"user@example.com","password":"password123"}'      "phone": "1-888-NYC-WELL"

    }

# 2. Create session  },

curl -X POST http://localhost:5000/api/sessions \  "resources": [

  -H "Authorization: Bearer <token>" \    {

  -H "Content-Type: application/json" \      "title": "Crisis Text Line",

  -d '{"type":"peer_support","title":"Need help with anxiety"}'      "description": "Free, 24/7 crisis support via text",

      "contact": "Text HOME to 741741",

# 3. Send message      "type": "immediate"

curl -X POST http://localhost:5000/api/messages \    },

  -H "Authorization: Bearer <token>" \    {

  -H "Content-Type: application/json" \      "title": "National Suicide Prevention Lifeline",

  -d '{"sessionId":"session_id","content":{"text":"Hello, I need help"}}'      "description": "Free, confidential support 24/7",

      "contact": "988",

# 4. End session      "type": "immediate"

curl -X POST http://localhost:5000/api/sessions/session_id/end \    }

  -H "Authorization: Bearer <token>" \  ]

  -H "Content-Type: application/json" \}

  -d '{"rating":5,"feedback":"Very helpful"}'```

```

---

### Crisis Management Flow

```bash### GET /api/crisis/

# 1. Detect crisis (automated or manual)

curl -X POST http://localhost:5000/api/crisis \Get crisis alerts (restricted to counselors and admins).

  -H "Authorization: Bearer <token>" \

  -H "Content-Type: application/json" \**Authentication**: Required  

  -d '{"severity":"high","description":"Suicidal ideation detected"}'**Authorization**: Counselor or Admin role



# 2. Escalate session**Query Parameters**:

curl -X POST http://localhost:5000/api/urgent/escalate \- `status`: Filter by status (`active`, `resolved`, `escalated`)

  -H "Authorization: Bearer <token>" \- `severity`: Filter by severity (`medium`, `high`, `critical`)

  -H "Content-Type: application/json" \- `assignedTo`: Filter by assigned counselor ID

  -d '{"sessionId":"session_id","severity":"high","helperType":"counselor"}'- `limit`: Number of alerts (default: 20)

- `page`: Page number (default: 1)

# 3. Get emergency contacts- `dateFrom`: Start date filter

curl -X GET http://localhost:5000/api/urgent/emergency-contacts \- `dateTo`: End date filter

  -H "Authorization: Bearer <token>"

```**Success Response (200)**:

```json

---{

  "alerts": [

## Support    {

      "_id": "60f7b1234567890abcdef129",

For technical support or questions about the API:      "user": {

- **Documentation**: Complete API documentation available        "_id": "60f7b1234567890abcdef123",

- **Error Codes**: Standardized error responses with specific codes        "username": "johndoe123",

- **Rate Limits**: Clearly defined with headers        "profile": {

- **Real-time Support**: Socket.io for live communication          "firstName": "John",

          "age": 25

**Version**: 1.0.0          }

**Last Updated**: September 23, 2025      },
      "session": {
        "_id": "60f7b1234567890abcdef124",
        "status": "escalated"
      },
      "severity": "high",
      "type": "self-harm-indication",
      "status": "active",
      "description": "User expressed thoughts of self-harm in session",
      "createdAt": "2025-09-22T10:50:00.000Z",
      "assignedCounselor": {
        "_id": "60f7b1234567890abcdef130",
        "profile": {
          "firstName": "Dr. Smith"
        }
      },
      "responseTime": null,
      "resolution": null,
      "alertNumber": "CA-2025-001234",
      "riskLevel": "high",
      "followUpRequired": true
    }
  ],
  "pagination": {
    "currentPage": 1,
    "totalPages": 5,
    "totalAlerts": 89
  },
  "summary": {
    "active": 12,
    "resolved": 76,
    "critical": 1,
    "averageResponseTime": 180
  }
}
```

---

### PUT /api/crisis/:alertId

Update crisis alert status and resolution.

**Authentication**: Required  
**Authorization**: Assigned counselor, admin, or crisis team

**Request Body**:
```json
{
  "status": "resolved",
  "resolution": "User connected with local crisis counselor. Safety plan established. Follow-up scheduled for tomorrow.",
  "actionsTaken": [
    "Immediate phone contact established",
    "Safety plan created with user",
    "Local crisis center notified",
    "Follow-up appointment scheduled"
  ],
  "riskAssessment": "Risk significantly reduced after intervention",
  "followUpRequired": true,
  "followUpDate": "2025-09-23T10:00:00.000Z",
  "notes": "User was responsive to intervention and engaged in safety planning"
}
```

**Success Response (200)**:
```json
{
  "message": "Crisis alert updated successfully",
  "alert": {
    "_id": "60f7b1234567890abcdef129",
    "status": "resolved",
    "resolution": "User connected with local crisis counselor...",
    "resolvedAt": "2025-09-22T11:20:00.000Z",
    "responseTime": 1800,
    "resolvedBy": "60f7b1234567890abcdef130"
  }
}
```

---

### GET /api/crisis/resources

Get crisis resources and emergency contacts.

**Authentication**: Not required

**Query Parameters**:
- `location`: Get location-specific resources (lat,lng)
- `type`: Filter by resource type (`hotline`, `text`, `local`, `educational`)

**Success Response (200)**:
```json
{
  "emergency": {
    "title": "Emergency Services",
    "phone": "911",
    "description": "For immediate life-threatening emergencies"
  },
  "crisis": [
    {
      "title": "988 Suicide & Crisis Lifeline",
      "phone": "988",
      "text": null,
      "website": "https://988lifeline.org",
      "description": "Free, confidential support 24/7 for people in distress",
      "available": "24/7",
      "languages": ["en", "es"]
    },
    {
      "title": "Crisis Text Line",
      "phone": null,
      "text": "Text HOME to 741741",
      "website": "https://crisistextline.org",
      "description": "Free, 24/7 crisis support via text message",
      "available": "24/7"
    }
  ],
  "local": [
    {
      "title": "NYC Well",
      "phone": "1-888-692-9355",
      "text": "Text WELL to 65173",
      "description": "New York City's free, confidential mental health support",
      "location": "New York, NY"
    }
  ],
  "specialized": [
    {
      "title": "LGBTQ National Hotline",
      "phone": "1-888-843-4564",
      "description": "Support for LGBTQ youth and adults",
      "population": "LGBTQ+"
    },
    {
      "title": "Veterans Crisis Line",
      "phone": "1-800-273-8255",
      "text": "Text 838255",
      "description": "Crisis support for veterans and their families",
      "population": "Veterans"
    }
  ]
}
```

---

## AI/Chatbot Endpoints

### POST /api/ai/chat

Interact with the AI mental health assistant.

**Authentication**: Required

**Request Body**:
```json
{
  "message": "I've been feeling really anxious lately and I don't know how to cope",
  "sessionId": "60f7b1234567890abcdef124",
  "context": {
    "previousMessages": [
      {
        "role": "user",
        "content": "Hello, I need some help",
        "timestamp": "2025-09-22T10:40:00.000Z"
      },
      {
        "role": "assistant", 
        "content": "Hi there! I'm here to support you. What's been on your mind?",
        "timestamp": "2025-09-22T10:40:30.000Z"
      }
    ],
    "userProfile": {
      "age": 25,
      "previousSessions": 3,
      "preferences": {
        "communicationStyle": "supportive",
        "topicsOfConcern": ["anxiety", "work-stress"]
      }
    }
  },
  "options": {
    "includeResources": true,
    "generateSuggestions": true,
    "crisisDetection": true
  }
}
```

**Success Response (200)**:
```json
{
  "response": {
    "text": "I hear that you're feeling anxious, and I want you to know that reaching out shows real strength. Anxiety can feel overwhelming, but there are effective ways to manage it. Would you like to try a quick breathing exercise together, or would you prefer to talk about what's been triggering these feelings?",
    "type": "supportive-response",
    "intent": "anxiety-support",
    "suggestions": [
      "Try a breathing exercise",
      "Explore anxiety triggers", 
      "Learn grounding techniques",
      "Connect with a peer counselor"
    ],
    "escalationNeeded": false,
    "resources": [
      {
        "title": "4-7-8 Breathing Technique",
        "url": "https://example.com/breathing-technique",
        "type": "coping-strategy",
        "description": "A simple breathing exercise to reduce anxiety in the moment"
      },
      {
        "title": "Understanding Anxiety",
        "url": "https://example.com/anxiety-info",
        "type": "educational",
        "description": "Learn about anxiety symptoms and management strategies"
      }
    ],
    "followUpQuestions": [
      "What situations tend to trigger your anxiety?",
      "Have you tried any coping strategies before?",
      "Would you like to explore some grounding techniques?"
    ]
  },
  "metadata": {
    "confidence": 0.92,
    "intent": "anxiety-support",
    "sentiment": "concerned-but-hopeful",
    "crisisDetected": false,
    "riskLevel": "low",
    "responseTime": 1.2,
    "model": "azure-openai-gpt4",
    "conversationId": "conv_60f7b1234567890abcdef131"
  },
  "analytics": {
    "userEngagement": "high",
    "topicProgression": "appropriate",
    "supportLevel": "peer-appropriate"
  }
}
```

**Crisis Detection Response (200)**:
```json
{
  "response": {
    "text": "I'm really concerned about what you're going through right now, and I want you to know that you don't have to face this alone. Your safety is the most important thing. I'm connecting you with a crisis counselor immediately who can provide the support you need.",
    "type": "crisis-response",
    "escalationNeeded": true,
    "immediateActions": [
      "Crisis counselor notification sent",
      "Session escalated to critical priority",
      "Emergency contacts prepared"
    ]
  },
  "emergencyContacts": {
    "crisis": "988",
    "text": "Text HOME to 741741",
    "emergency": "911"
  },
  "metadata": {
    "crisisDetected": true,
    "riskLevel": "high",
    "alertCreated": "60f7b1234567890abcdef129"
  }
}
```

---

### POST /api/chatbot/session

Start a dedicated chatbot session.

**Authentication**: Required

**Request Body**:
```json
{
  "isAnonymous": false,
  "initialMessage": "Hi, I'm having a difficult day and could use some support",
  "preferences": {
    "language": "en",
    "communicationStyle": "gentle",
    "sessionGoals": ["emotional-support", "coping-strategies"]
  },
  "context": {
    "currentMood": "anxious",
    "urgency": "medium"
  }
}
```

**Success Response (201)**:
```json
{
  "message": "Chatbot session created successfully",
  "session": {
    "_id": "60f7b1234567890abcdef132",
    "userId": "60f7b1234567890abcdef123",
    "type": "chatbot",
    "status": "active",
    "isAnonymous": false,
    "createdAt": "2025-09-22T11:00:00.000Z",
    "conversationId": "conv_60f7b1234567890abcdef133"
  },
  "initialResponse": {
    "text": "Hello! I'm glad you reached out, especially on a difficult day. That takes courage. I'm here to listen and support you through whatever you're experiencing. You mentioned you could use some support - would you like to share what's been making today particularly challenging?",
    "suggestions": [
      "Tell me about your day",
      "I need coping strategies",
      "I'm feeling overwhelmed",
      "Connect me with a human counselor"
    ]
  }
}
```

---

### GET /api/chatbot/sessions/:sessionId/history

Get conversation history for a chatbot session.

**Authentication**: Required

**Success Response (200)**:
```json
{
  "conversation": [
    {
      "role": "user",
      "content": "Hi, I'm having a difficult day and could use some support",
      "timestamp": "2025-09-22T11:00:00.000Z",
      "intent": "seeking-support"
    },
    {
      "role": "assistant",
      "content": "Hello! I'm glad you reached out, especially on a difficult day...",
      "timestamp": "2025-09-22T11:00:15.000Z",
      "resources": [
        {
          "title": "Daily Coping Strategies",
          "type": "educational"
        }
      ]
    }
  ],
  "sessionInfo": {
    "startedAt": "2025-09-22T11:00:00.000Z",
    "duration": 1200,
    "messageCount": 24,
    "topics": ["anxiety", "coping-strategies", "self-care"],
    "escalations": 0
  }
}
```

---

## Urgent Operations

### POST /api/urgent/escalate

Escalate a session to higher priority or different helper type.

**Authentication**: Required

**Request Body**:
```json
{
  "sessionId": "60f7b1234567890abcdef124",
  "newSeverity": "critical",
  "reason": "User expressed suicidal ideation - immediate professional intervention required",
  "targetHelperType": "counselor",
  "notes": "User mentioned specific plan and means. Requires immediate crisis assessment.",
  "requestedCounselorId": "60f7b1234567890abcdef134"
}
```

**Success Response (200)**:
```json
{
  "message": "Session escalated successfully",
  "escalation": {
    "_id": "60f7b1234567890abcdef135",
    "sessionId": "60f7b1234567890abcdef124",
    "escalatedBy": "60f7b1234567890abcdef125",
    "escalatedTo": "counselor",
    "previousSeverity": "medium",
    "newSeverity": "critical",
    "reason": "User expressed suicidal ideation...",
    "createdAt": "2025-09-22T11:15:00.000Z",
    "estimatedResponseTime": 120,
    "priority": 1
  },
  "session": {
    "_id": "60f7b1234567890abcdef124",
    "status": "escalated",
    "severity": "critical",
    "helperType": "counselor",
    "queuePosition": 1
  },
  "notifications": {
    "crisisTeamAlerted": true,
    "counselorAssigned": "60f7b1234567890abcdef134",
    "supervisorNotified": true
  }
}
```

---

### POST /api/urgent/crisis-intervention

Request immediate crisis intervention.

**Authentication**: Required

**Request Body**:
```json
{
  "sessionId": "60f7b1234567890abcdef124",
  "interventionType": "suicide-risk",
  "immediacy": "critical",
  "location": {
    "latitude": 40.7128,
    "longitude": -74.0060,
    "address": "123 Main St, New York, NY"
  },
  "contactInfo": {
    "phone": "+1234567890",
    "emergencyContact": {
      "name": "Jane Doe",
      "relationship": "Sister",
      "phone": "+1234567891"
    }
  },
  "situation": "User has expressed intent to self-harm and has means available",
  "requestedActions": ["immediate-counselor", "local-emergency-services"]
}
```

**Success Response (200)**:
```json
{
  "message": "Crisis intervention initiated",
  "intervention": {
    "_id": "60f7b1234567890abcdef136",
    "sessionId": "60f7b1234567890abcdef124",
    "type": "suicide-risk",
    "status": "active",
    "createdAt": "2025-09-22T11:20:00.000Z",
    "assignedCrisisWorker": "60f7b1234567890abcdef137",
    "estimatedContact": "2025-09-22T11:22:00.000Z",
    "caseNumber": "CI-2025-001235"
  },
  "immediateActions": [
    {
      "action": "crisis-counselor-assigned",
      "status": "completed",
      "timestamp": "2025-09-22T11:20:05.000Z"
    },
    {
      "action": "local-services-contacted",
      "status": "in-progress", 
      "estimatedCompletion": "2025-09-22T11:25:00.000Z"
    }
  ],
  "contacts": {
    "assignedWorker": {
      "name": "Crisis Counselor Maria",
      "phone": "+1-800-CRISIS-1",
      "expectedContact": "within 2 minutes"
    }
  }
}
```

---

## Psychological Screening

The psychological screening system provides comprehensive tools for administering and analyzing standardized mental health assessments including PHQ-9 (depression), GAD-7 (anxiety), and GHQ (general health) questionnaires.

### Quick Overview

**Core Endpoints:**
- `POST /api/questionnaires` - Create questionnaire templates (Admin)
- `GET /api/questionnaires/type/:type` - Get questionnaire by type
- `POST /api/responses/start` - Start response session
- `POST /api/responses/submit-answer` - Submit individual answers
- `POST /api/responses/complete` - Complete and score questionnaire
- `GET /api/results/user/:userId/latest` - Get latest results
- `GET /api/results/admin/aggregate` - Admin analytics

### Supported Questionnaires
- **PHQ-9**: Patient Health Questionnaire (Depression screening)
- **GAD-7**: Generalized Anxiety Disorder scale
- **GHQ-12/GHQ-28**: General Health Questionnaire

### Key Features
- ✅ Automatic scoring with severity level determination
- ✅ Risk flag detection (suicidal ideation, severe symptoms)
- ✅ Real-time session management with UUID tracking
- ✅ Comprehensive analytics and trend analysis
- ✅ Admin review system for flagged responses
- ✅ Category-based scoring for detailed insights

### Example Usage Flow

1. **Get Available Questionnaire**:
   ```http
   GET /api/questionnaires/type/PHQ-9
   ```

2. **Start Response Session**:
   ```http
   POST /api/responses/start
   {
     "questionnaireId": "615f1234567890abcdef1234",
     "questionnaireType": "PHQ-9"
   }
   ```

3. **Submit Answers** (repeat for each question):
   ```http
   POST /api/responses/submit-answer
   {
     "sessionId": "uuid-session-id",
     "questionNumber": 1,
     "questionId": "question-object-id",
     "selectedValue": 2,
     "selectedText": "More than half the days"
   }
   ```

4. **Complete Assessment**:
   ```http
   POST /api/responses/complete
   {
     "sessionId": "uuid-session-id"
   }
   ```

5. **View Results**:
   ```http
   GET /api/results/user/{userId}/latest?questionnaireType=PHQ-9
   ```

### Scoring & Interpretation

The system automatically calculates:
- **Total Score**: Sum of all responses
- **Percentage Score**: Score as percentage of maximum possible
- **Severity Level**: Categorized interpretation (minimal, mild, moderate, moderately severe, severe)
- **Category Scores**: Breakdown by symptom categories (mood, anxiety, cognitive, etc.)
- **Risk Flags**: Automatic detection of concerning responses

### Admin Analytics

Administrators can access aggregate data including:
- Response distribution by severity level
- Trend analysis over time
- Risk-flagged responses requiring review
- Completion rates and average scores
- Institution-wide mental health insights

**📖 For complete API documentation with request/response examples, see [Psychological Screening API Documentation](./psychological-screening-api-docs.md)**

---

## Socket.io Events

### Connection

```javascript
// Client connects with authentication
socket.emit('authenticate', {
  token: 'jwt_token_here'
});

// Server confirms authentication
socket.on('authenticated', (userData) => {
  console.log('Connected as:', userData.username);
});
```

### Session Events

#### join-session
**Client to Server**:
```javascript
socket.emit('join-session', {
  sessionId: '60f7b1234567890abcdef124'
});
```

**Server Response**:
```javascript
socket.on('session-joined', {
  sessionId: '60f7b1234567890abcdef124',
  participants: [
    {
      userId: '60f7b1234567890abcdef123',
      username: 'johndoe123',
      role: 'patient',
      joinedAt: '2025-09-22T11:00:00.000Z'
    }
  ],
  status: 'active'
});
```

#### leave-session
**Client to Server**:
```javascript
socket.emit('leave-session', {
  sessionId: '60f7b1234567890abcdef124'
});
```

### Message Events

#### send-message
**Client to Server**:
```javascript
socket.emit('send-message', {
  sessionId: '60f7b1234567890abcdef124',
  message: 'Thank you for your help, I feel much better now',
  messageType: 'text',
  replyTo: '60f7b1234567890abcdef127'
});
```

**Server to All Session Participants**:
```javascript
socket.on('new-message', {
  _id: '60f7b1234567890abcdef140',
  sessionId: '60f7b1234567890abcdef124',
  senderId: {
    _id: '60f7b1234567890abcdef123',
    username: 'johndoe123',
    profile: {
      preferredName: 'Johnny'
    }
  },
  message: 'Thank you for your help, I feel much better now',
  senderRole: 'patient',
  messageType: 'text',
  createdAt: '2025-09-22T11:30:00.000Z',
  replyTo: {
    _id: '60f7b1234567890abcdef127',
    message: 'Remember, you have the strength to get through this'
  },
  crisisDetected: false
});
```

#### typing-indicator
**Client to Server**:
```javascript
socket.emit('typing-indicator', {
  sessionId: '60f7b1234567890abcdef124',
  isTyping: true
});
```

**Server to Other Session Participants**:
```javascript
socket.on('user-typing', {
  sessionId: '60f7b1234567890abcdef124',
  userId: '60f7b1234567890abcdef123',
  username: 'johndoe123',
  isTyping: true
});
```

### Crisis Events

#### crisis-alert
**Client to Server**:
```javascript
socket.emit('crisis-alert', {
  severity: 'high',
  description: 'User expressed thoughts of self-harm',
  sessionId: '60f7b1234567890abcdef124',
  location: {
    latitude: 40.7128,
    longitude: -74.0060
  }
});
```

**Server to Crisis Team**:
```javascript
socket.on('crisis-alert', {
  alertId: '60f7b1234567890abcdef129',
  userId: '60f7b1234567890abcdef123',
  sessionId: '60f7b1234567890abcdef124',
  severity: 'high',
  type: 'self-harm-indication',
  description: 'User expressed thoughts of self-harm',
  createdAt: '2025-09-22T11:35:00.000Z',
  location: {
    latitude: 40.7128,
    longitude: -74.0060
  },
  estimatedResponseTime: 300
});
```

#### session-escalated
**Server to Session Participants**:
```javascript
socket.on('session-escalated', {
  sessionId: '60f7b1234567890abcdef124',
  escalatedBy: '60f7b1234567890abcdef125',
  newSeverity: 'critical',
  newHelperType: 'counselor',
  reason: 'Crisis indicators detected',
  estimatedResponseTime: 120
});
```

### System Events

#### user-joined-session
**Server to Session Participants**:
```javascript
socket.on('user-joined-session', {
  sessionId: '60f7b1234567890abcdef124',
  user: {
    _id: '60f7b1234567890abcdef125',
    username: 'helper_sarah',
    role: 'peer',
    profile: {
      firstName: 'Sarah'
    }
  },
  joinedAt: '2025-09-22T11:40:00.000Z'
});
```

#### user-left-session
**Server to Session Participants**:
```javascript
socket.on('user-left-session', {
  sessionId: '60f7b1234567890abcdef124',
  userId: '60f7b1234567890abcdef125',
  leftAt: '2025-09-22T12:00:00.000Z',
  reason: 'session-completed'
});
```

#### session-status-updated
**Server to Session Participants**:
```javascript
socket.on('session-status-updated', {
  sessionId: '60f7b1234567890abcdef124',
  oldStatus: 'active',
  newStatus: 'closed',
  updatedBy: '60f7b1234567890abcdef123',
  timestamp: '2025-09-22T12:00:00.000Z'
});
```

---

## Examples

### Complete User Registration Flow

```javascript
// 1. Register user
const registerResponse = await fetch('/api/auth/register', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    username: 'johndoe123',
    email: 'john.doe@example.com',
    password: 'SecurePassword123!',
    role: 'patient',
    profile: {
      firstName: 'John',
      lastName: 'Doe',
      age: 25,
      preferredName: 'Johnny'
    },
    agreedToTerms: true,
    agreedToPrivacy: true
  })
});

const { user, token } = await registerResponse.json();

// 2. Create a session
const sessionResponse = await fetch('/api/sessions', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  },
  body: JSON.stringify({
    helperType: 'peer',
    severity: 'medium',
    description: 'Feeling anxious about job interview',
    isAnonymous: false,
    preferences: {
      ageRange: '20-30',
      gender: 'any',
      language: 'en'
    }
  })
});

const { session } = await sessionResponse.json();

// 3. Connect to Socket.io
const socket = io('http://localhost:5000', {
  auth: {
    token: token
  }
});

// 4. Join session
socket.emit('join-session', {
  sessionId: session._id
});

// 5. Send message
socket.emit('send-message', {
  sessionId: session._id,
  message: 'Hi, I\'m really nervous about my interview tomorrow',
  messageType: 'text'
});
```

### Crisis Intervention Flow

```javascript
// 1. AI detects crisis keywords in message
const aiResponse = await fetch('/api/ai/chat', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  },
  body: JSON.stringify({
    message: 'I just can\'t take this anymore, I want to end it all',
    sessionId: session._id
  })
});

const aiData = await aiResponse.json();

// 2. If crisis detected, system automatically creates alert
if (aiData.metadata.crisisDetected) {
  // Alert is automatically created by the system
  console.log('Crisis alert created:', aiData.metadata.alertCreated);
}

// 3. Manual crisis alert can also be created
const crisisResponse = await fetch('/api/crisis/create', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  },
  body: JSON.stringify({
    severity: 'critical',
    type: 'suicide-risk',
    description: 'User expressed intent to end their life',
    sessionId: session._id,
    triggerMessage: 'I just can\'t take this anymore, I want to end it all'
  })
});

// 4. Crisis team receives real-time notification via Socket.io
socket.on('crisis-alert', (alertData) => {
  console.log('Crisis alert received:', alertData);
  // Crisis team takes immediate action
});
```

### Helper Accepting Session Flow

```javascript
// Helper views available sessions waiting for help
const availableSessionsResponse = await fetch('/api/sessions/available?helperType=peer', {
  headers: {
    'Authorization': `Bearer ${helperToken}`
  }
});

const { sessions } = await availableSessionsResponse.json();

// Helper accepts a session (becomes the assigned helper)
const acceptResponse = await fetch(`/api/sessions/${sessionId}/accept`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${helperToken}`
  },
  body: JSON.stringify({
    message: 'Hi! I\'m here to help and support you through whatever you\'re experiencing. How are you feeling right now?'
  })
});

const { session, welcomeMessage, instructions } = await acceptResponse.json();

// Connect to Socket.io and join session
const helperSocket = io('http://localhost:5000', {
  auth: { token: helperToken }
});

helperSocket.emit('join-session', { sessionId });

// Listen for messages
helperSocket.on('new-message', (messageData) => {
  console.log('New message:', messageData);
  
  // Send responses using the message endpoint
  if (messageData.senderRole === 'patient') {
    // Helper can respond to patient messages
    // Use /api/messages endpoint to send replies
  }
});

// Alternative: Decline session if unable to help
const declineResponse = await fetch(`/api/sessions/${sessionId}/decline`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${helperToken}`
  },
  body: JSON.stringify({
    reason: 'Currently at capacity with other sessions'
  })
});
```

---

## Response Codes Summary

| Code | Description | Usage |
|------|-------------|--------|
| 200 | OK | Successful GET, PUT, DELETE |
| 201 | Created | Successful POST operations |
| 400 | Bad Request | Invalid request data |
| 401 | Unauthorized | Missing or invalid token |
| 403 | Forbidden | Insufficient permissions |
| 404 | Not Found | Resource doesn't exist |
| 409 | Conflict | Resource already exists |
| 422 | Unprocessable Entity | Validation errors |
| 429 | Too Many Requests | Rate limit exceeded |
| 500 | Internal Server Error | Server-side errors |

---

*This documentation covers all available endpoints in the Saneyar Mental Health Platform API. For additional support or questions, please contact the development team.*