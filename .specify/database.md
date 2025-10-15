# Ketchew - Database Schema

## User Collection

```json
{
  "_id": "ObjectId",
  "email": "string (unique, required)",
  "password": "string (hashed, required)",
  "displayName": "string (required)",
  "avatar": "string (URL)",
  "preferences": {
    "theme": "string (light|dark, default: light)",
    "soundEnabled": "boolean (default: true)",
    "defaultStudyDuration": "number (default: 25)",
    "defaultShortBreakDuration": "number (default: 5)",
    "defaultLongBreakDuration": "number (default: 15)",
    "selectedBackground": "string (default: 'default')",
    "selectedSound": "string (default: 'none')",
    "volume": "number (0-100, default: 50)"
  },
  "createdAt": "Date",
  "updatedAt": "Date",
  "lastLoginAt": "Date"
}
```

### Indexes
- `email` (unique)
- `createdAt`

## Progress Collection

```json
{
  "_id": "ObjectId",
  "userId": "ObjectId (ref: User)",
  "date": "Date (YYYY-MM-DD)",
  "completedPomodoros": "number (default: 0)",
  "totalStudyTime": "number (minutes, default: 0)",
  "totalBreakTime": "number (minutes, default: 0)",
  "tasksCompleted": "number (default: 0)",
  "sessions": [
    {
      "startTime": "Date",
      "endTime": "Date",
      "type": "string (study|shortBreak|longBreak)",
      "duration": "number (minutes)",
      "completed": "boolean"
    }
  ],
  "createdAt": "Date",
  "updatedAt": "Date"
}
```

### Indexes
- `userId`
- `date`
- `userId + date` (compound, unique)

## Collaboration Sessions Collection

```json
{
  "_id": "ObjectId",
  "sessionId": "string (unique, generated)",
  "name": "string",
  "hostId": "ObjectId (ref: User)",
  "isPublic": "boolean (default: false)",
  "status": "string (active|ended, default: active)",
  "participants": [
    {
      "userId": "ObjectId (ref: User, optional for guests)",
      "name": "string (required)",
      "avatar": "string",
      "joinedAt": "Date",
      "isHost": "boolean",
      "isGuest": "boolean"
    }
  ],
  "sharedTimer": {
    "currentRound": "number (1-4)",
    "phase": "string (study|shortBreak|longBreak)",
    "timeRemaining": "number (seconds)",
    "isActive": "boolean",
    "isPaused": "boolean",
    "studyDuration": "number (minutes)",
    "shortBreakDuration": "number (minutes)",
    "longBreakDuration": "number (minutes)",
    "completedRounds": ["boolean", "boolean", "boolean", "boolean"],
    "lastUpdated": "Date"
  },
  "settings": {
    "maxParticipants": "number (default: 10)",
    "allowGuests": "boolean (default: true)",
    "chatEnabled": "boolean (default: true)"
  },
  "createdAt": "Date",
  "updatedAt": "Date",
  "endedAt": "Date (nullable)"
}
```

### Indexes
- `sessionId` (unique)
- `hostId`
- `status`
- `createdAt`

## Chat Messages Collection

```json
{
  "_id": "ObjectId",
  "sessionId": "string (ref: CollaborationSession.sessionId)",
  "participantId": "string",
  "participantName": "string",
  "message": "string (required)",
  "timestamp": "Date",
  "type": "string (text|system, default: text)"
}
```

### Indexes
- `sessionId`
- `timestamp`
- `sessionId + timestamp` (compound)

## Todos Collection

```json
{
  "_id": "ObjectId",
  "userId": "ObjectId (ref: User)",
  "text": "string (required)",
  "completed": "boolean (default: false)",
  "priority": "string (low|medium|high, default: medium)",
  "category": "string (optional)",
  "dueDate": "Date (optional)",
  "pomodorosEstimated": "number (optional)",
  "pomodorosCompleted": "number (default: 0)",
  "order": "number (for sorting)",
  "createdAt": "Date",
  "updatedAt": "Date",
  "completedAt": "Date (nullable)"
}
```

### Indexes
- `userId`
- `completed`
- `userId + completed` (compound)
- `userId + order` (compound)

## Notes Collection

```json
{
  "_id": "ObjectId",
  "userId": "ObjectId (ref: User)",
  "title": "string (optional)",
  "content": "string",
  "tags": ["string"],
  "isPinned": "boolean (default: false)",
  "createdAt": "Date",
  "updatedAt": "Date"
}
```

### Indexes
- `userId`
- `userId + isPinned` (compound)
- `userId + updatedAt` (compound)

## Content Collections

### Backgrounds Collection

```json
{
  "_id": "ObjectId",
  "name": "string (required)",
  "category": "string (nature|abstract|minimalist|custom)",
  "url": "string (required)",
  "thumbnail": "string (required)",
  "isPremium": "boolean (default: false)",
  "isActive": "boolean (default: true)",
  "uploadedBy": "ObjectId (ref: User, optional)",
  "metadata": {
    "width": "number",
    "height": "number",
    "fileSize": "number",
    "format": "string"
  },
  "createdAt": "Date"
}
```

### Sounds Collection

```json
{
  "_id": "ObjectId",
  "name": "string (required)",
  "category": "string (nature|ambient|white-noise|music)",
  "url": "string (required)",
  "duration": "number (seconds)",
  "isPremium": "boolean (default: false)",
  "isActive": "boolean (default: true)",
  "uploadedBy": "ObjectId (ref: User, optional)",
  "metadata": {
    "bitrate": "number",
    "format": "string",
    "fileSize": "number"
  },
  "createdAt": "Date"
}
```

### Indexes for Content
- `category`
- `isPremium`
- `isActive`

## Authentication Tokens Collection

```json
{
  "_id": "ObjectId",
  "userId": "ObjectId (ref: User)",
  "token": "string (hashed)",
  "type": "string (access|refresh)",
  "expiresAt": "Date",
  "createdAt": "Date",
  "lastUsedAt": "Date"
}
```

### Indexes
- `userId`
- `token` (unique)
- `expiresAt` (TTL index)

## Analytics Collection (Optional)

```json
{
  "_id": "ObjectId",
  "userId": "ObjectId (ref: User, optional for anonymous)",
  "event": "string (timer_start|timer_complete|task_complete|session_join)",
  "data": {
    "duration": "number (optional)",
    "phase": "string (optional)",
    "sessionId": "string (optional)",
    "userAgent": "string",
    "timestamp": "Date"
  },
  "createdAt": "Date"
}
```

### Indexes
- `userId`
- `event`
- `createdAt`

## Database Configuration

### MongoDB Settings
```javascript
// Connection string
mongodb+srv://username:password@cluster.mongodb.net/ketchew?retryWrites=true&w=majority

// Connection options
{
  useNewUrlParser: true,
  useUnifiedTopology: true,
  maxPoolSize: 10,
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
}
```

### Performance Optimizations
1. **TTL Indexes**: Automatic cleanup of expired tokens and old analytics data
2. **Compound Indexes**: Optimized queries for user-specific data
3. **Connection Pooling**: Efficient connection management
4. **Read Preferences**: Secondary reads for analytics queries

### Data Validation
```javascript
// User schema validation
{
  $jsonSchema: {
    bsonType: "object",
    required: ["email", "password", "displayName"],
    properties: {
      email: {
        bsonType: "string",
        pattern: "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$"
      },
      password: {
        bsonType: "string",
        minLength: 8
      },
      displayName: {
        bsonType: "string",
        minLength: 1,
        maxLength: 50
      }
    }
  }
}
```

### Backup Strategy
1. **Daily Backups**: Automated daily snapshots
2. **Point-in-time Recovery**: 7-day recovery window
3. **Cross-region Replication**: Disaster recovery setup
4. **Test Restores**: Monthly backup verification

### Security Measures
1. **Encryption at Rest**: MongoDB encrypted storage
2. **Network Security**: VPC and firewall rules
3. **Authentication**: SCRAM-SHA-256
4. **Authorization**: Role-based access control
5. **Audit Logging**: Track database operations
