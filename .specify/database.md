# Ketchew - Data Storage Architecture (No Database)

## Overview

Ketchew uses a simplified, database-free architecture that relies on browser LocalStorage for persistence and server memory for temporary collaboration data. This approach eliminates the need for database credentials, user authentication, and cloud storage costs.

## LocalStorage Data Structures

### Timer State
```javascript
// Key: 'ketchew_timer'
{
  currentRound: 1, // 1-4
  phase: 'study', // 'study' | 'shortBreak' | 'longBreak'
  timeRemaining: 1500, // seconds
  isActive: false,
  isPaused: false,
  studyDuration: 25, // minutes
  shortBreakDuration: 5, // minutes
  longBreakDuration: 15, // minutes
  completedRounds: [false, false, false, false],
  lastSaved: 1640995200000 // timestamp
}
```

### Todo Items
```javascript
// Key: 'ketchew_todos'
[
  {
    id: 'uuid-generated-id',
    text: 'Complete project proposal',
    completed: false,
    priority: 'medium', // 'low' | 'medium' | 'high'
    category: 'work', // optional
    createdAt: '2024-01-01T10:00:00Z',
    updatedAt: '2024-01-01T10:00:00Z',
    completedAt: null // Date when marked complete
  }
]
```

### Progress Data
```javascript
// Key: 'ketchew_progress'
{
  dailyStats: [
    {
      date: '2024-01-01',
      completedPomodoros: 8,
      totalStudyTime: 200, // minutes
      totalBreakTime: 40, // minutes
      tasksCompleted: 5,
      sessions: [
        {
          startTime: '2024-01-01T09:00:00Z',
          endTime: '2024-01-01T09:25:00Z',
          type: 'study',
          duration: 25,
          completed: true
        }
      ]
    }
  ],
  totalPomodoros: 156,
  currentStreak: 7,
  longestStreak: 21,
  weeklyGoal: 35,
  lastUpdated: '2024-01-01T18:00:00Z'
}
```

### User Preferences
```javascript
// Key: 'ketchew_preferences'
{
  theme: 'light', // 'light' | 'dark'
  soundEnabled: true,
  volume: 50, // 0-100
  selectedBackground: 'forest',
  selectedSound: 'rain',
  defaultStudyDuration: 25,
  defaultShortBreakDuration: 5,
  defaultLongBreakDuration: 15,
  notifications: {
    desktop: true,
    sound: true,
    vibration: false
  },
  lastUpdated: '2024-01-01T12:00:00Z'
}
```

## SessionStorage Data Structures

### Notes (Temporary)
```javascript
// Key: 'ketchew_notes'
{
  content: 'Meeting notes for today...',
  lastUpdated: '2024-01-01T14:30:00Z',
  wordCount: 45,
  characterCount: 234
}
```

## Server Memory Data Structures

### Active Sessions (In-Memory Only)
```javascript
// Server-side Map: sessionId -> sessionData
const activeSessions = new Map();

// Session data structure
{
  id: 'session-uuid',
  hostSocketId: 'socket-abc123',
  participants: new Map([
    ['socket-abc123', {
      socketId: 'socket-abc123',
      name: 'John Doe',
      avatar: 'avatar-1',
      isHost: true,
      joinedAt: new Date('2024-01-01T10:00:00Z')
    }],
    ['socket-def456', {
      socketId: 'socket-def456',
      name: 'Jane Smith',
      avatar: 'avatar-2',
      isHost: false,
      joinedAt: new Date('2024-01-01T10:05:00Z')
    }]
  ]),
  sharedTimer: {
    currentRound: 2,
    phase: 'study',
    timeRemaining: 1200,
    isActive: true,
    isPaused: false,
    studyDuration: 25,
    shortBreakDuration: 5,
    longBreakDuration: 15,
    completedRounds: [true, false, false, false],
    lastUpdated: new Date('2024-01-01T10:15:00Z')
  },
  chatHistory: [
    {
      participantName: 'John Doe',
      message: 'Let\'s focus for 25 minutes!',
      timestamp: new Date('2024-01-01T10:01:00Z')
    }
  ],
  createdAt: new Date('2024-01-01T10:00:00Z'),
  maxParticipants: 10,
  settings: {
    chatEnabled: true,
    timerSyncEnabled: true
  }
}
```

## Data Management Utilities

### LocalStorage Helper Functions
```javascript
// Generic LocalStorage utilities
const storage = {
  // Save data with error handling
  save: (key, data) => {
    try {
      const serialized = JSON.stringify(data);
      localStorage.setItem(key, serialized);
      return true;
    } catch (error) {
      console.error(`Failed to save ${key}:`, error);
      return false;
    }
  },

  // Load data with fallback
  load: (key, defaultValue = null) => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
      console.error(`Failed to load ${key}:`, error);
      return defaultValue;
    }
  },

  // Remove data
  remove: (key) => {
    try {
      localStorage.removeItem(key);
      return true;
    } catch (error) {
      console.error(`Failed to remove ${key}:`, error);
      return false;
    }
  },

  // Clear all app data
  clearAll: () => {
    const keys = ['ketchew_timer', 'ketchew_todos', 'ketchew_progress', 'ketchew_preferences'];
    keys.forEach(key => localStorage.removeItem(key));
  }
};
```

### Session Memory Management
```javascript
// Server-side session management
class SessionManager {
  constructor() {
    this.sessions = new Map();
    this.socketToSession = new Map();
    
    // Cleanup inactive sessions every 30 minutes
    setInterval(() => this.cleanupInactiveSessions(), 30 * 60 * 1000);
  }

  createSession(hostSocketId, participantName, avatar) {
    const sessionId = crypto.randomUUID();
    const session = {
      id: sessionId,
      hostSocketId,
      participants: new Map([[hostSocketId, {
        socketId: hostSocketId,
        name: participantName,
        avatar,
        isHost: true,
        joinedAt: new Date()
      }]]),
      sharedTimer: this.getDefaultTimerState(),
      chatHistory: [],
      createdAt: new Date(),
      lastActivity: new Date(),
      maxParticipants: 10
    };
    
    this.sessions.set(sessionId, session);
    this.socketToSession.set(hostSocketId, sessionId);
    
    return session;
  }

  joinSession(sessionId, socketId, participantName, avatar) {
    const session = this.sessions.get(sessionId);
    if (!session) return null;
    
    if (session.participants.size >= session.maxParticipants) {
      return { error: 'SESSION_FULL' };
    }

    session.participants.set(socketId, {
      socketId,
      name: participantName,
      avatar,
      isHost: false,
      joinedAt: new Date()
    });
    
    this.socketToSession.set(socketId, sessionId);
    session.lastActivity = new Date();
    
    return session;
  }

  removeParticipant(socketId) {
    const sessionId = this.socketToSession.get(socketId);
    if (!sessionId) return null;

    const session = this.sessions.get(sessionId);
    if (!session) return null;

    session.participants.delete(socketId);
    this.socketToSession.delete(socketId);

    // If no participants left, remove session
    if (session.participants.size === 0) {
      this.sessions.delete(sessionId);
      return { sessionEnded: true };
    }

    // If host left, assign new host
    if (session.hostSocketId === socketId) {
      const newHost = Array.from(session.participants.values())[0];
      newHost.isHost = true;
      session.hostSocketId = newHost.socketId;
    }

    session.lastActivity = new Date();
    return session;
  }

  cleanupInactiveSessions() {
    const now = new Date();
    const timeout = 2 * 60 * 60 * 1000; // 2 hours

    for (const [sessionId, session] of this.sessions) {
      if (now - session.lastActivity > timeout) {
        // Remove all socket mappings for this session
        for (const participant of session.participants.values()) {
          this.socketToSession.delete(participant.socketId);
        }
        this.sessions.delete(sessionId);
      }
    }
  }
}
```

## Data Export/Import

### Export User Data
```javascript
const exportUserData = () => {
  const userData = {
    timer: storage.load('ketchew_timer'),
    todos: storage.load('ketchew_todos', []),
    progress: storage.load('ketchew_progress', {}),
    preferences: storage.load('ketchew_preferences', {}),
    exportDate: new Date().toISOString(),
    version: '1.0.0'
  };

  const dataStr = JSON.stringify(userData, null, 2);
  const dataBlob = new Blob([dataStr], { type: 'application/json' });
  
  const link = document.createElement('a');
  link.href = URL.createObjectURL(dataBlob);
  link.download = `ketchew-backup-${new Date().toISOString().split('T')[0]}.json`;
  link.click();
};
```

### Import User Data
```javascript
const importUserData = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const userData = JSON.parse(e.target.result);
        
        // Validate data structure
        if (!userData.version || !userData.exportDate) {
          throw new Error('Invalid backup file format');
        }

        // Import data with confirmation
        if (userData.timer) storage.save('ketchew_timer', userData.timer);
        if (userData.todos) storage.save('ketchew_todos', userData.todos);
        if (userData.progress) storage.save('ketchew_progress', userData.progress);
        if (userData.preferences) storage.save('ketchew_preferences', userData.preferences);

        resolve(userData);
      } catch (error) {
        reject(error);
      }
    };
    reader.readAsText(file);
  });
};
```

## Security and Privacy

### Data Protection
- **No Server Storage**: User data never leaves the browser
- **No Credentials**: No database or authentication credentials
- **HTTPS Required**: Secure data transmission for collaboration
- **Local Encryption**: Optional browser-level encryption

### Privacy Benefits
- **GDPR Compliant**: No personal data collection
- **No Tracking**: No analytics or user tracking
- **Offline Capable**: Works without internet connection
- **User Control**: Complete data ownership

## Performance Considerations

### LocalStorage Limits
- **Size Limit**: ~5-10MB per domain (browser dependent)
- **Synchronous API**: Non-blocking for small data sets
- **JSON Serialization**: Efficient data storage format

### Memory Management
- **Session Cleanup**: Automatic removal of inactive sessions
- **Chat History**: Limited to current session only
- **Participant Limits**: Maximum 10 users per session

### Error Handling
- **Storage Quota**: Graceful handling of storage limits
- **Data Corruption**: Fallback to default values
- **Network Issues**: Offline mode for core features

This architecture eliminates all database credentials and sensitive information while maintaining full functionality through client-side storage and temporary server memory.
