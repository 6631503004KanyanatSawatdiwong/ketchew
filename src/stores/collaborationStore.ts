import { create } from 'zustand'
import { subscribeWithSelector } from 'zustand/middleware'
import { io, Socket } from 'socket.io-client'

interface Participant {
  id: string
  nickname: string
  avatar: string
  isHost: boolean
  joinedAt: string
}

interface ChatMessage {
  id: string
  text: string
  sender: string
  avatar: string
  timestamp: string
}

interface SessionData {
  id: string
  participants: Participant[]
  timerState: {
    isRunning: boolean
    currentPhase: 'study' | 'shortBreak' | 'longBreak'
    timeRemaining: number
    roundsCompleted: number
    totalRounds: number
  }
  chat: ChatMessage[]
}

interface TimerState {
  isRunning: boolean
  currentPhase: 'study' | 'shortBreak' | 'longBreak'
  timeRemaining: number
  roundsCompleted: number
  totalRounds: number
}

interface ServerResponse {
  success: boolean
  sessionId?: string
  session?: SessionData
  error?: string
}

interface CollaborationStore {
  // Connection state
  socket: Socket | null
  isConnected: boolean
  connectionError: string | null

  // Session state
  currentSession: SessionData | null
  isInSession: boolean
  isHost: boolean

  // User state
  userNickname: string
  userAvatar: string

  // UI state
  inviteModalOpen: boolean
  joinModalOpen: boolean
  chatOpen: boolean
  participantsOpen: boolean
  unreadMessageCount: number
  inviteLinkModalOpen: boolean
  avatarSelectorOpen: boolean

  // Actions
  connect: () => void
  disconnect: () => void
  createSession: (
    nickname: string,
    avatar: string
  ) => Promise<{ success: boolean; sessionId?: string; error?: string }>
  joinSession: (
    sessionId: string,
    nickname: string,
    avatar: string
  ) => Promise<{ success: boolean; error?: string }>
  leaveSession: () => void
  sendMessage: (text: string) => void
  updateTimerState: (timerState: TimerState, action: string) => void

  // UI actions
  setInviteModalOpen: (open: boolean) => void
  setJoinModalOpen: (open: boolean) => void
  setChatOpen: (open: boolean) => void
  setParticipantsOpen: (open: boolean) => void
  setUserAvatar: (avatar: string) => void
  markMessagesAsRead: () => void
  setInviteLinkModalOpen: (open: boolean) => void
  setAvatarSelectorOpen: (open: boolean) => void

  // Internal actions
  setSocket: (socket: Socket | null) => void
  setConnectionState: (connected: boolean, error?: string) => void
  setSession: (session: SessionData | null) => void
  addChatMessage: (message: ChatMessage) => void
  updateParticipants: (participants: Participant[]) => void
}

export const useCollaborationStore = create<CollaborationStore>()(
  subscribeWithSelector((set, get) => ({
    // Initial state
    socket: null,
    isConnected: false,
    connectionError: null,
    currentSession: null,
    isInSession: false,
    isHost: false,
    userNickname: '',
    userAvatar: 'red', // Default to red tomato avatar
    inviteModalOpen: false,
    joinModalOpen: false,
    chatOpen: false,
    participantsOpen: false,
    unreadMessageCount: 0,
    inviteLinkModalOpen: false,
    avatarSelectorOpen: false,

    // Connection management with improved stability
    connect: () => {
      const socket = io('http://localhost:3004', {
        autoConnect: true,
        reconnection: true,
        reconnectionDelay: 2000, // Start with 2 seconds
        reconnectionDelayMax: 10000, // Max 10 seconds between attempts
        reconnectionAttempts: 10, // More attempts (was 5)
        timeout: 30000, // Longer initial connection timeout (was 10 seconds)
        // Keep connection alive settings
        forceNew: false,
        // Transport settings for stability
        transports: ['websocket', 'polling'],
      })

      socket.on('connect', () => {
        console.log('Connected to collaboration server')
        set({ isConnected: true, connectionError: null })

        // If we were in a session and got reconnected, try to rejoin
        const state = get()
        if (state.currentSession && state.userNickname) {
          console.log('🔄 Attempting to rejoin session after reconnection...')
          // Small delay to ensure server is ready
          setTimeout(() => {
            socket.emit('rejoin-session', {
              sessionId: state.currentSession?.id,
              nickname: state.userNickname,
              avatar: state.userAvatar,
            })
          }, 1000)
        }
      })

      socket.on('disconnect', reason => {
        console.log('Disconnected from server:', reason)
        set({ isConnected: false })

        // Don't clear session data on temporary disconnects
        if (reason === 'io server disconnect') {
          // Server initiated disconnect, this might be permanent
          set({ connectionError: 'Disconnected by server' })
        } else {
          // Client-side disconnect or network issue, try to reconnect
          set({ connectionError: 'Connection lost, attempting to reconnect...' })
        }
      })

      socket.on('reconnect', attemptNumber => {
        console.log('🟢 Reconnected to server after', attemptNumber, 'attempts')
        set({ isConnected: true, connectionError: null })
      })

      socket.on('reconnect_attempt', attemptNumber => {
        console.log('🔄 Reconnection attempt', attemptNumber)
        set({ connectionError: `Reconnecting... (attempt ${attemptNumber})` })
      })

      socket.on('reconnect_failed', () => {
        console.log('❌ Failed to reconnect to server')
        set({
          connectionError: 'Failed to reconnect. Please refresh the page.',
          isConnected: false,
        })
      })

      // Heartbeat to keep connection alive
      socket.on('heartbeat', () => {
        socket.emit('heartbeat-pong')
      })

      socket.on('connect_error', error => {
        console.error('Connection error:', error)
        set({
          isConnected: false,
          connectionError: 'Failed to connect to collaboration server',
        })
      })

      // Session events
      socket.on('participant-joined', data => {
        console.log('👥 Participant joined event received:', data)
        const { participants } = data
        console.log('👥 Updating participants list:', participants)

        set(state => ({
          currentSession: state.currentSession
            ? {
                ...state.currentSession,
                participants,
              }
            : null,
        }))
      })

      socket.on('participant-left', data => {
        console.log('👥 Participant left event received:', data)
        const { participants, newHost } = data

        set(state => {
          // Check if only the host remains (when session has 1 participant who is host)
          // OR if there are no participants (session ended)
          const shouldEndSession =
            participants.length === 0 ||
            (participants.length === 1 &&
              participants[0]?.isHost &&
              participants[0]?.nickname === state.userNickname)

          console.log('👥 Participants remaining:', participants.length)
          console.log('👥 Should end session:', shouldEndSession)
          console.log('👥 Current user is host:', state.isHost)
          console.log('👥 Remaining participants:', participants)

          if (shouldEndSession) {
            console.log('👥 Ending session - returning to no session state')
            // End session and return to "no session" state
            return {
              ...state,
              currentSession: null,
              isInSession: false,
              isHost: false,
              chatOpen: false,
              unreadMessageCount: 0,
              inviteModalOpen: false,
              inviteLinkModalOpen: false,
              joinModalOpen: false,
              avatarSelectorOpen: false,
            }
          }

          return {
            ...state,
            currentSession: state.currentSession
              ? {
                  ...state.currentSession,
                  participants,
                }
              : null,
            // Only update isHost if there's a new host, otherwise keep current host status
            isHost: newHost ? newHost.nickname === state.userNickname : state.isHost,
          }
        })
      })

      socket.on('session-ended', () => {
        console.log('Session ended - all collaborators left')
        set({
          currentSession: null,
          isInSession: false,
          isHost: false,
          chatOpen: false,
          participantsOpen: false,
          unreadMessageCount: 0,
          inviteLinkModalOpen: false,
        })

        // Reset timer to individual mode when session ends
        setTimeout(() => {
          import('./timerStore').then(({ useTimerStore }) => {
            const timerStore = useTimerStore.getState()
            timerStore.resetToIndividualMode()
          })
        }, 100)
      })

      socket.on('timer-update', data => {
        const { timerState, action } = data
        set(state => ({
          currentSession: state.currentSession
            ? {
                ...state.currentSession,
                timerState,
              }
            : null,
        }))

        // Update local timer if we're not the host
        if (!get().isHost) {
          // Dynamically import to avoid circular dependency
          import('./timerStore').then(({ useTimerStore }) => {
            const timerStore = useTimerStore.getState()
            timerStore.updateFromCollaboration(timerState, action)
          })
        }
      })

      socket.on('new-message', (message: ChatMessage) => {
        console.log('📨 Received new message:', message)
        get().addChatMessage(message)
      })

      set({ socket })
    },

    disconnect: () => {
      const { socket } = get()
      if (socket) {
        socket.disconnect()
        set({
          socket: null,
          isConnected: false,
          currentSession: null,
          isInSession: false,
          isHost: false,
        })
      }
    },

    createSession: async (nickname: string, avatar: string) => {
      const { socket } = get()
      if (!socket || !socket.connected) {
        return { success: false, error: 'Not connected to server' }
      }

      return new Promise(resolve => {
        socket.emit('create-session', { nickname, avatar }, (response: ServerResponse) => {
          if (response.success) {
            set({
              currentSession: response.session,
              isInSession: true,
              isHost: true,
              userNickname: nickname,
              userAvatar: avatar,
              inviteModalOpen: false,
            })
            resolve({ success: true, sessionId: response.sessionId })
          } else {
            resolve({ success: false, error: response.error })
          }
        })
      })
    },

    joinSession: async (sessionId: string, nickname: string, avatar: string) => {
      const { socket } = get()
      if (!socket || !socket.connected) {
        return { success: false, error: 'Not connected to server' }
      }

      return new Promise(resolve => {
        socket.emit(
          'join-session',
          {
            sessionId,
            participantData: { nickname, avatar },
          },
          (response: ServerResponse) => {
            if (response.success) {
              set({
                currentSession: response.session,
                isInSession: true,
                isHost: false,
                userNickname: nickname,
                userAvatar: avatar,
                joinModalOpen: false,
              })
              resolve({ success: true })
            } else {
              resolve({ success: false, error: response.error })
            }
          }
        )
      })
    },

    leaveSession: () => {
      console.log('👋 Leaving collaboration session')
      const { socket } = get()
      if (socket) {
        socket.emit('leave-session')
      }

      // CRITICAL: Clear collaboration state FIRST
      set({
        currentSession: null,
        isInSession: false,
        isHost: false,
        chatOpen: false,
        participantsOpen: false,
        unreadMessageCount: 0,
        inviteLinkModalOpen: false,
      })

      console.log('✅ Collaboration state cleared')

      // Reset timer to individual mode when leaving session
      setTimeout(() => {
        import('./timerStore').then(({ useTimerStore }) => {
          const timerStore = useTimerStore.getState()
          timerStore.resetToIndividualMode()
        })
      }, 100) // Small delay to ensure state is properly cleared
    },

    sendMessage: (text: string) => {
      const { socket } = get()
      if (socket && text.trim()) {
        socket.emit('send-message', { text: text.substring(0, 200) })
      }
    },

    updateTimerState: (timerState: TimerState, action: string) => {
      const { socket, isHost } = get()
      if (socket && isHost) {
        socket.emit('timer-action', { action, timerState })
      }
    },

    // UI actions
    setInviteModalOpen: (open: boolean) => set({ inviteModalOpen: open }),
    setJoinModalOpen: (open: boolean) => set({ joinModalOpen: open }),
    setChatOpen: (open: boolean) => {
      set({ chatOpen: open })
      if (open) {
        // Mark messages as read when chat is opened
        set({ unreadMessageCount: 0 })
      }
    },
    setParticipantsOpen: (open: boolean) => set({ participantsOpen: open }),
    setUserAvatar: (avatar: string) => set({ userAvatar: avatar }),
    markMessagesAsRead: () => set({ unreadMessageCount: 0 }),
    setInviteLinkModalOpen: (open: boolean) => set({ inviteLinkModalOpen: open }),
    setAvatarSelectorOpen: (open: boolean) => set({ avatarSelectorOpen: open }),

    // Internal actions
    setSocket: (socket: Socket | null) => set({ socket }),
    setConnectionState: (connected: boolean, error?: string) =>
      set({ isConnected: connected, connectionError: error }),
    setSession: (session: SessionData | null) =>
      set({ currentSession: session, isInSession: !!session }),

    addChatMessage: (message: ChatMessage) => {
      const state = get()
      console.log('💬 Adding message to store:', message)
      console.log(
        '💬 Current chat state - chatOpen:',
        state.chatOpen,
        'unreadCount:',
        state.unreadMessageCount
      )
      console.log('💬 Current session chat length:', state.currentSession?.chat?.length || 0)

      set(currentState => ({
        currentSession: currentState.currentSession
          ? {
              ...currentState.currentSession,
              chat: [...currentState.currentSession.chat, message],
            }
          : null,
        // Increment unread count only if chat is closed and message is not from current user
        unreadMessageCount:
          !state.chatOpen && message.sender !== state.userNickname
            ? state.unreadMessageCount + 1
            : state.unreadMessageCount,
      }))

      const newState = get()
      console.log(
        '💬 After adding - session chat length:',
        newState.currentSession?.chat?.length || 0
      )
    },

    updateParticipants: (participants: Participant[]) =>
      set(state => ({
        currentSession: state.currentSession
          ? {
              ...state.currentSession,
              participants,
            }
          : null,
      })),
  }))
)

// Auto-connect when store is first used
let autoConnected = false
export const initializeCollaboration = () => {
  if (!autoConnected) {
    autoConnected = true
    const store = useCollaborationStore.getState()
    if (!store.socket) {
      store.connect()
    }
  }
}
