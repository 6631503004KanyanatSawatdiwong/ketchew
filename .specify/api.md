# Ketchew - API Specifications

## Authentication Endpoints

### POST /api/auth/signup
Register a new user
```json
{
  "email": "user@example.com",
  "password": "securePassword",
  "displayName": "John Doe"
}
```

Response:
```json
{
  "user": {
    "id": "user_123",
    "email": "user@example.com",
    "displayName": "John Doe",
    "avatar": "default_avatar_url"
  },
  "token": "jwt_token_here"
}
```

### POST /api/auth/signin
Authenticate existing user
```json
{
  "email": "user@example.com",
  "password": "securePassword"
}
```

### POST /api/auth/refresh
Refresh authentication token

### POST /api/auth/signout
Sign out user

## User Management Endpoints

### GET /api/user/profile
Get current user profile

### PUT /api/user/profile
Update user profile
```json
{
  "displayName": "Updated Name",
  "avatar": "new_avatar_url"
}
```

### GET /api/user/preferences
Get user preferences

### PUT /api/user/preferences
Update user preferences
```json
{
  "theme": "dark",
  "soundEnabled": true,
  "defaultStudyDuration": 25,
  "defaultShortBreakDuration": 5,
  "defaultLongBreakDuration": 15,
  "selectedBackground": "bg_forest",
  "selectedSound": "rain_sounds"
}
```

## Progress Tracking Endpoints

### GET /api/progress/stats
Get user progress statistics
Query params: `?period=daily|weekly|monthly&date=2024-01-01`

Response:
```json
{
  "stats": [
    {
      "date": "2024-01-01",
      "completedPomodoros": 8,
      "totalStudyTime": 200,
      "totalBreakTime": 40,
      "tasksCompleted": 5
    }
  ],
  "summary": {
    "totalPomodoros": 156,
    "currentStreak": 7,
    "longestStreak": 21
  }
}
```

### POST /api/progress/pomodoro
Record completed pomodoro
```json
{
  "studyDuration": 25,
  "breakDuration": 5,
  "completedAt": "2024-01-01T10:30:00Z"
}
```

### POST /api/progress/task
Record completed task
```json
{
  "taskId": "task_123",
  "completedAt": "2024-01-01T10:30:00Z"
}
```

## Collaboration Endpoints

### POST /api/collaboration/session
Create new collaboration session
```json
{
  "name": "Study Group Session",
  "isPublic": false
}
```

Response:
```json
{
  "sessionId": "session_123",
  "inviteLink": "https://ketchew.com/join/session_123",
  "hostId": "user_123"
}
```

### POST /api/collaboration/join
Join collaboration session (NFR03: Max 10 users per session)
```json
{
  "sessionId": "session_123",
  "participantName": "Jane Doe",
  "avatar": "avatar_url"
}
```

Response (if session full):
```json
{
  "error": {
    "code": "SESSION_FULL",
    "message": "Session has reached maximum capacity of 10 users"
  }
}
```

### GET /api/collaboration/session/:id
Get session details

### DELETE /api/collaboration/session/:id
End collaboration session (host only)

## WebSocket Events

### Connection
```javascript
socket.emit('join-session', {
  sessionId: 'session_123',
  userId: 'user_123',
  name: 'John Doe',
  avatar: 'avatar_url'
});
```

### Timer Synchronization
```javascript
// Host controls timer
socket.emit('timer-start', {
  sessionId: 'session_123',
  phase: 'study',
  duration: 1500 // 25 minutes in seconds
});

socket.emit('timer-pause', { sessionId: 'session_123' });
socket.emit('timer-resume', { sessionId: 'session_123' });
socket.emit('timer-reset', { sessionId: 'session_123' });

// Broadcast to all participants
socket.on('timer-updated', (timerState) => {
  // Update local timer state
});
```

### Chat Messages
```javascript
socket.emit('chat-message', {
  sessionId: 'session_123',
  message: 'Let\'s focus for 25 minutes!', // Max 200 characters (NFR09)
  timestamp: Date.now()
});

socket.on('chat-message', (messageData) => {
  // Display message in chat
  // Latency target: ≤300ms (NFR02)
});
```

### Participant Management
```javascript
socket.on('participant-joined', (participant) => {
  // Update participant list
});

socket.on('participant-left', (participantId) => {
  // Remove from participant list
});

socket.on('session-ended', () => {
  // Handle session termination
});
```

## Content Endpoints

### GET /api/content/backgrounds
Get available background images
```json
{
  "backgrounds": [
    {
      "id": "bg_forest",
      "name": "Forest Clearing",
      "url": "https://cdn.ketchew.com/bg/forest.jpg",
      "thumbnail": "https://cdn.ketchew.com/bg/thumbs/forest.jpg",
      "category": "nature"
    }
  ]
}
```

### GET /api/content/sounds
Get available background sounds
```json
{
  "sounds": [
    {
      "id": "rain_sounds",
      "name": "Gentle Rain",
      "url": "https://cdn.ketchew.com/audio/rain.mp3",
      "category": "nature",
      "duration": 600
    }
  ]
}
```

## Error Responses

### Standard Error Format
```json
{
  "error": {
    "code": "INVALID_CREDENTIALS",
    "message": "Invalid email or password",
    "details": {}
  }
}
```

### Common Error Codes
- `INVALID_CREDENTIALS` - Authentication failed
- `SESSION_NOT_FOUND` - Collaboration session doesn't exist
- `SESSION_FULL` - Maximum participants reached
- `UNAUTHORIZED` - Action requires authentication
- `FORBIDDEN` - User doesn't have permission
- `VALIDATION_ERROR` - Request data validation failed
- `RATE_LIMITED` - Too many requests

## Rate Limiting

- Authentication endpoints: 5 requests per minute
- Progress tracking: 100 requests per hour
- Chat messages: 60 messages per minute
- General API: 1000 requests per hour

## Response Headers

All API responses include:
```
X-RateLimit-Limit: 1000
X-RateLimit-Remaining: 999
X-RateLimit-Reset: 1640995200
Content-Type: application/json
```
