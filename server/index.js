import express from 'express'
import { createServer } from 'http'
import { Server } from 'socket.io'
import cors from 'cors'
import helmet from 'helmet'
import rateLimit from 'express-rate-limit'
import compression from 'compression'

const app = express()
const server = createServer(app)

// Security and performance middleware
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com'],
        fontSrc: ["'self'", 'https://fonts.gstatic.com'],
        imgSrc: [
          "'self'",
          'data:',
          'https://images.unsplash.com',
          'https://res.cloudinary.com',
          'https://unsplash.com',
        ],
        scriptSrc: ["'self'"],
        connectSrc: ["'self'", 'ws:', 'wss:'],
      },
    },
  })
)
app.use(compression())
app.use(
  cors({
    origin: process.env.CLIENT_URL || 'http://localhost:3000',
    methods: ['GET', 'POST'],
    credentials: true,
  })
)

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
})
app.use(limiter)

app.use(express.json({ limit: '10mb' }))

// Socket.io configuration with longer timeouts for stable collaboration
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL || 'http://localhost:3000',
    methods: ['GET', 'POST'],
    credentials: true,
  },
  // Much longer timeouts to prevent premature disconnections
  pingTimeout: 300000, // 5 minutes (was 60 seconds)
  pingInterval: 120000, // 2 minutes (was 25 seconds)
  // Allow more time for connection upgrades
  upgradeTimeout: 30000,
  // Keep connections alive longer
  maxHttpBufferSize: 1e6,
  // Reconnection settings
  allowEIO3: true,
})

// In-memory storage for sessions
class SessionManager {
  constructor() {
    this.sessions = new Map() // sessionId -> session data
    this.participants = new Map() // socketId -> participant data
  }

  createSession(hostSocketId, hostData) {
    const sessionId = this.generateSessionId()
    const session = {
      id: sessionId,
      hostId: hostSocketId,
      participants: new Map(),
      timerState: {
        isRunning: false,
        currentPhase: 'study',
        timeRemaining: 25 * 60, // 25 minutes in seconds
        roundsCompleted: 0,
        totalRounds: 4,
      },
      chat: [],
      createdAt: new Date(),
      lastActivity: new Date(),
    }

    // Add host as first participant
    session.participants.set(hostSocketId, {
      ...hostData,
      isHost: true,
      joinedAt: new Date(),
    })

    this.sessions.set(sessionId, session)
    this.participants.set(hostSocketId, { sessionId, isHost: true })

    return session
  }

  joinSession(sessionId, socketId, participantData) {
    const session = this.sessions.get(sessionId)
    if (!session) {
      throw new Error('Session not found')
    }

    if (session.participants.size >= 10) {
      throw new Error('Session is full (maximum 10 participants)')
    }

    session.participants.set(socketId, {
      ...participantData,
      isHost: false,
      joinedAt: new Date(),
    })

    this.participants.set(socketId, { sessionId, isHost: false })
    session.lastActivity = new Date()

    return session
  }

  leaveSession(socketId) {
    const participantData = this.participants.get(socketId)
    if (!participantData) return null

    const { sessionId, isHost } = participantData
    const session = this.sessions.get(sessionId)
    if (!session) return null

    session.participants.delete(socketId)
    this.participants.delete(socketId)

    // If host left, promote another participant or delete session
    if (isHost && session.participants.size > 0) {
      const newHost = session.participants.entries().next().value
      if (newHost) {
        const [newHostSocketId, newHostData] = newHost
        newHostData.isHost = true
        session.hostId = newHostSocketId
        this.participants.set(newHostSocketId, { sessionId, isHost: true })
      }
    } else if (session.participants.size === 0) {
      this.sessions.delete(sessionId)
    }

    return { session, wasHost: isHost }
  }

  getSession(sessionId) {
    return this.sessions.get(sessionId)
  }

  getParticipantSession(socketId) {
    const participantData = this.participants.get(socketId)
    if (!participantData) return null

    return this.sessions.get(participantData.sessionId)
  }

  updateTimerState(sessionId, timerState) {
    const session = this.sessions.get(sessionId)
    if (session) {
      session.timerState = { ...session.timerState, ...timerState }
      session.lastActivity = new Date()
    }
    return session
  }

  addChatMessage(sessionId, message) {
    const session = this.sessions.get(sessionId)
    if (session) {
      // Limit message length to 200 characters (NFR09)
      const truncatedMessage = {
        ...message,
        text: message.text.substring(0, 200),
      }

      session.chat.push(truncatedMessage)
      // Keep only last 100 messages to prevent memory issues
      if (session.chat.length > 100) {
        session.chat = session.chat.slice(-100)
      }
      session.lastActivity = new Date()
    }
    return session
  }

  generateSessionId() {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
  }

  // Cleanup old sessions (run periodically) - but be more conservative
  cleanupInactiveSessions() {
    const now = new Date()
    const maxInactiveTime = 7 * 24 * 60 * 60 * 1000 // 7 days (was 24 hours)

    for (const [sessionId, session] of this.sessions.entries()) {
      if (now - session.lastActivity > maxInactiveTime) {
        // Clean up participants
        for (const socketId of session.participants.keys()) {
          this.participants.delete(socketId)
        }
        this.sessions.delete(sessionId)
        console.log(`Cleaned up inactive session: ${sessionId}`)
      }
    }
  }
}

const sessionManager = new SessionManager()

// Socket.io connection handling
io.on('connection', socket => {
  console.log(`User connected: ${socket.id}`)

  // Set up heartbeat to keep connection alive
  const heartbeatInterval = setInterval(() => {
    socket.emit('heartbeat', { timestamp: Date.now() })
  }, 30000) // Send heartbeat every 30 seconds

  // Clean up heartbeat on disconnect
  socket.on('disconnect', () => {
    clearInterval(heartbeatInterval)
  })

  // Respond to heartbeat pong
  socket.on('heartbeat-pong', () => {
    // Just acknowledge - keeps connection active
  })

  // Create a new session
  socket.on('create-session', (hostData, callback) => {
    try {
      const session = sessionManager.createSession(socket.id, hostData)
      socket.join(session.id)

      callback({
        success: true,
        sessionId: session.id,
        session: {
          id: session.id,
          participants: Array.from(session.participants.values()),
          timerState: session.timerState,
          chat: session.chat,
        },
      })

      console.log(`Session created: ${session.id} by ${socket.id}`)
    } catch (error) {
      callback({ success: false, error: error.message })
    }
  })

  // Rejoin session after reconnection
  socket.on('rejoin-session', data => {
    try {
      const { sessionId, nickname, avatar } = data
      const session = sessionManager.getSession(sessionId)

      if (!session) {
        socket.emit('rejoin-failed', { error: 'Session no longer exists' })
        return
      }

      // Check if this user was already in the session
      let existingParticipant = null
      for (const [socketId, participant] of session.participants.entries()) {
        if (participant.nickname === nickname) {
          existingParticipant = { socketId, participant }
          break
        }
      }

      if (existingParticipant) {
        // Remove old socket reference and add new one
        session.participants.delete(existingParticipant.socketId)
        this.participants.delete(existingParticipant.socketId)

        // Add with new socket ID
        session.participants.set(socket.id, {
          ...existingParticipant.participant,
          avatar, // Allow avatar update on rejoin
        })
        this.participants.set(socket.id, {
          sessionId,
          isHost: existingParticipant.participant.isHost,
        })

        socket.join(sessionId)

        // Update host reference if this was the host
        if (existingParticipant.participant.isHost) {
          session.hostId = socket.id
        }

        // Notify all participants about the rejoin
        io.to(sessionId).emit('participant-rejoined', {
          participant: session.participants.get(socket.id),
          participants: Array.from(session.participants.values()),
        })

        console.log(`User ${nickname} rejoined session ${sessionId}`)
      } else {
        socket.emit('rejoin-failed', { error: 'You were not in this session' })
      }
    } catch (error) {
      socket.emit('rejoin-failed', { error: error.message })
    }
  })

  // Join an existing session
  socket.on('join-session', (data, callback) => {
    try {
      const { sessionId, participantData } = data
      const session = sessionManager.joinSession(sessionId, socket.id, participantData)

      socket.join(sessionId)

      // Notify other participants
      socket.to(sessionId).emit('participant-joined', {
        participant: session.participants.get(socket.id),
        participants: Array.from(session.participants.values()),
      })

      callback({
        success: true,
        session: {
          id: session.id,
          participants: Array.from(session.participants.values()),
          timerState: session.timerState,
          chat: session.chat,
        },
      })

      console.log(`User ${socket.id} joined session ${sessionId}`)
    } catch (error) {
      callback({ success: false, error: error.message })
    }
  })

  // Timer control (host only)
  socket.on('timer-action', data => {
    const session = sessionManager.getParticipantSession(socket.id)
    if (!session) return

    const participant = session.participants.get(socket.id)
    if (!participant || !participant.isHost) return // Only host can control timer

    const { action, timerState } = data

    sessionManager.updateTimerState(session.id, timerState)

    // Broadcast timer update to all participants
    io.to(session.id).emit('timer-update', {
      action,
      timerState: session.timerState,
      timestamp: Date.now(),
    })

    console.log(`Timer action '${action}' in session ${session.id}`)
  })

  // Chat message
  socket.on('send-message', messageData => {
    const session = sessionManager.getParticipantSession(socket.id)
    if (!session) return

    const participant = session.participants.get(socket.id)
    if (!participant) return

    const message = {
      id: Date.now().toString(),
      text: messageData.text,
      sender: participant.nickname,
      avatar: participant.avatar,
      timestamp: new Date().toISOString(),
    }

    sessionManager.addChatMessage(session.id, message)

    // Send message to ALL participants in the session including sender
    // First send to all others in the room
    socket.to(session.id).emit('new-message', message)
    // Then send to sender as well
    socket.emit('new-message', message)

    console.log(`Message in session ${session.id}: ${message.text.substring(0, 50)}...`)
  })

  // Handle explicit leave session
  socket.on('leave-session', () => {
    console.log(`User ${socket.id} leaving session`)

    const result = sessionManager.leaveSession(socket.id)
    if (result && result.session) {
      const { session, wasHost } = result

      // Notify remaining participants
      socket.to(session.id).emit('participant-left', {
        socketId: socket.id,
        participants: Array.from(session.participants.values()),
        newHost:
          wasHost && session.participants.size > 0
            ? Array.from(session.participants.values()).find(p => p.isHost)
            : null,
      })
    }
  })

  // Handle disconnection
  socket.on('disconnect', () => {
    console.log(`User disconnected: ${socket.id}`)

    const result = sessionManager.leaveSession(socket.id)
    if (result && result.session) {
      const { session, wasHost } = result

      // Notify remaining participants
      socket.to(session.id).emit('participant-left', {
        socketId: socket.id,
        participants: Array.from(session.participants.values()),
        newHost:
          wasHost && session.participants.size > 0
            ? Array.from(session.participants.values()).find(p => p.isHost)
            : null,
      })
    }
  })

  // Get session info
  socket.on('get-session-info', (sessionId, callback) => {
    const session = sessionManager.getSession(sessionId)
    if (session) {
      callback({
        success: true,
        session: {
          id: session.id,
          participants: Array.from(session.participants.values()),
          timerState: session.timerState,
        },
      })
    } else {
      callback({ success: false, error: 'Session not found' })
    }
  })
})

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    sessions: sessionManager.sessions.size,
    participants: sessionManager.participants.size,
  })
})

// Serve static files from React build (for production)
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

if (process.env.NODE_ENV === 'production') {
  // Serve static files from the React build
  app.use(express.static(path.join(__dirname, '../dist')))

  // Serve React app for any non-API routes
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../dist/index.html'))
  })
}

// Session cleanup interval (every 6 hours instead of every hour)
setInterval(
  () => {
    sessionManager.cleanupInactiveSessions()
  },
  6 * 60 * 60 * 1000 // 6 hours
)

const PORT = process.env.PORT || 3004

server.listen(PORT, () => {
  console.log(`Ketchew server running on port ${PORT}`)
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`)
})

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully')
  server.close(() => {
    console.log('Process terminated')
  })
})
