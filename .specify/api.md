# Ketchew - API Specifications (Simplified Architecture)

## Socket.io Real-time Events (No REST APIs)

Since the application uses only LocalStorage for persistence and memory for collaboration, there are no traditional REST API endpoints. All communication is handled through Socket.io events.

## WebSocket Events (Socket.io)

### Connection Management

#### Client → Server: Join Session

```javascript
socket.emit('join-session', {
  sessionId: 'session_123', // Optional, generates new if not provided
  participantName: 'John Doe',
  avatar: 'avatar_url',
})
```

#### Server → Client: Session Joined

```javascript
socket.on('session-joined', {
  sessionId: 'session_123',
  participantId: 'socket_id',
  isHost: true,
  participants: [
    {
      socketId: 'socket_id',
      name: 'John Doe',
      avatar: 'avatar_url',
      isHost: true,
      joinedAt: '2024-01-01T10:00:00Z',
    },
  ],
  inviteLink: 'https://ketchew.com/join/session_123',
})
```

#### Server → Client: Participant Joined

```javascript
socket.on('participant-joined', {
  participant: {
    socketId: 'new_socket_id',
    name: 'Jane Doe',
    avatar: 'avatar_url',
    isHost: false,
    joinedAt: '2024-01-01T10:05:00Z',
  },
  totalParticipants: 2,
})
```

### Timer Synchronization (Host Controls)

#### Client → Server: Timer Control (Host Only)

```javascript
// Start timer
socket.emit('timer-start', {
  sessionId: 'session_123',
  phase: 'study',
  duration: 1500, // 25 minutes in seconds
})

// Pause timer
socket.emit('timer-pause', {
  sessionId: 'session_123',
})

// Resume timer
socket.emit('timer-resume', {
  sessionId: 'session_123',
})

// Reset timer
socket.emit('timer-reset', {
  sessionId: 'session_123',
})
```

#### Server → All Clients: Timer State Update

```javascript
socket.on('timer-updated', {
  currentRound: 1,
  phase: 'study',
  timeRemaining: 1485, // seconds
  isActive: true,
  isPaused: false,
  studyDuration: 25,
  shortBreakDuration: 5,
  longBreakDuration: 15,
  completedRounds: [false, false, false, false],
  lastUpdated: '2024-01-01T10:00:15Z',
})
```

### Chat Messages

```javascript
// Client → Server: Send message
socket.emit('chat-message', {
  sessionId: 'session_123',
  message: "Let's focus for 25 minutes!", // Max 200 characters (NFR09)
  timestamp: Date.now(),
})

// Server → All Clients: Message broadcast
socket.on('chat-message', {
  participantName: 'John Doe',
  participantAvatar: 'avatar_url',
  message: "Let's focus for 25 minutes!",
  timestamp: 1640995200000,
  deliveryLatency: 150, // ms (target: ≤300ms per NFR02)
})
```

### Session Management

#### Server → Client: Session Full Error

```javascript
socket.on('session-error', {
  error: 'SESSION_FULL',
  message: 'Session has reached maximum capacity of 10 users',
  maxParticipants: 10,
  currentParticipants: 10,
})
```

#### Client → Server: Leave Session

```javascript
socket.emit('leave-session', {
  sessionId: 'session_123',
})
```

#### Server → All Clients: Participant Left

```javascript
socket.on('participant-left', {
  participantName: 'Jane Doe',
  remainingParticipants: 1,
})
```

#### Server → All Clients: Session Ended

```javascript
socket.on('session-ended', {
  reason: 'HOST_LEFT', // or 'ALL_PARTICIPANTS_LEFT'
  timestamp: Date.now(),
})
```

## Server-Side Memory Structure

### Active Sessions Storage

```javascript
// In-memory storage on server (no database)
const activeSessions = new Map()

// Session data structure
const sessionData = {
  id: 'session_123',
  hostSocketId: 'socket_abc',
  participants: new Map([
    [
      'socket_abc',
      {
        socketId: 'socket_abc',
        name: 'John Doe',
        avatar: 'avatar_1',
        isHost: true,
        joinedAt: new Date(),
      },
    ],
  ]),
  sharedTimer: {
    currentRound: 1,
    phase: 'study',
    timeRemaining: 1500,
    isActive: false,
    isPaused: false,
    studyDuration: 25,
    shortBreakDuration: 5,
    longBreakDuration: 15,
    completedRounds: [false, false, false, false],
    lastUpdated: new Date(),
  },
  chatHistory: [], // Temporary, cleared when session ends
  createdAt: new Date(),
  maxParticipants: 10,
}
```

## Error Handling

### Connection Errors

```javascript
socket.on('connect_error', error => {
  console.error('Connection failed:', error)
  // Show user-friendly error message
})

socket.on('disconnect', reason => {
  if (reason === 'io server disconnect') {
    // Server disconnected the client, try to reconnect
    socket.connect()
  }
})
```

### Session Errors

```javascript
socket.on('session-error', error => {
  switch (error.code) {
    case 'SESSION_NOT_FOUND':
      // Redirect to home or show error
      break
    case 'SESSION_FULL':
      // Show capacity reached message
      break
    case 'INVALID_SESSION_ID':
      // Show invalid link message
      break
    case 'HOST_REQUIRED':
      // Action requires host privileges
      break
  }
})
```

## Client-Side LocalStorage Operations

### Timer State Persistence

```javascript
// Save timer state to LocalStorage
const saveTimerState = state => {
  localStorage.setItem(
    'ketchew_timer',
    JSON.stringify({
      ...state,
      lastSaved: Date.now(),
    })
  )
}

// Load timer state from LocalStorage
const loadTimerState = () => {
  const saved = localStorage.getItem('ketchew_timer')
  if (saved) {
    const state = JSON.parse(saved)
    // Check if state is still valid (not too old)
    if (Date.now() - state.lastSaved < 24 * 60 * 60 * 1000) {
      // 24 hours
      return state
    }
  }
  return getDefaultTimerState()
}
```

### User Preferences

```javascript
// Save preferences
const savePreferences = prefs => {
  localStorage.setItem('ketchew_preferences', JSON.stringify(prefs))
}

// Load preferences
const loadPreferences = () => {
  const saved = localStorage.getItem('ketchew_preferences')
  return saved ? JSON.parse(saved) : getDefaultPreferences()
}
```

## Rate Limiting (Server-Side)

### Message Rate Limiting

```javascript
const messageRateLimit = new Map() // socketId -> { count, resetTime }

const isRateLimited = socketId => {
  const now = Date.now()
  const userLimit = messageRateLimit.get(socketId)

  if (!userLimit || now > userLimit.resetTime) {
    messageRateLimit.set(socketId, { count: 1, resetTime: now + 60000 }) // 1 minute
    return false
  }

  if (userLimit.count >= 60) {
    // 60 messages per minute
    return true
  }

  userLimit.count++
  return false
}
```

## Development Environment

### Local Development Setup

```javascript
// Server (Express + Socket.io)
const express = require('express')
const { createServer } = require('http')
const { Server } = require('socket.io')

const app = express()
const httpServer = createServer(app)
const io = new Server(httpServer, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST'],
  },
})

httpServer.listen(3001)
```

### Production Deployment

- **Frontend**: Static hosting (Netlify, Vercel, GitHub Pages)
- **Backend**: Simple server deployment (Railway, Heroku, DigitalOcean)
- **No Database Required**: Eliminates database hosting costs and complexity

This simplified architecture eliminates the need for user authentication, database management, and complex API endpoints while maintaining all core functionality through LocalStorage and Socket.io.
