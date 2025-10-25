import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';
import { io, Socket } from 'socket.io-client';

interface Participant {
  id: string;
  nickname: string;
  avatar: string;
  isHost: boolean;
  joinedAt: string;
}

interface ChatMessage {
  id: string;
  text: string;
  sender: string;
  avatar: string;
  timestamp: string;
}

interface SessionData {
  id: string;
  participants: Participant[];
  timerState: {
    isRunning: boolean;
    currentPhase: 'study' | 'shortBreak' | 'longBreak';
    timeRemaining: number;
    roundsCompleted: number;
    totalRounds: number;
  };
  chat: ChatMessage[];
}

interface TimerState {
  isRunning: boolean;
  currentPhase: 'study' | 'shortBreak' | 'longBreak';
  timeRemaining: number;
  roundsCompleted: number;
  totalRounds: number;
}

interface ServerResponse {
  success: boolean;
  sessionId?: string;
  session?: SessionData;
  error?: string;
}

interface CollaborationStore {
  // Connection state
  socket: Socket | null;
  isConnected: boolean;
  connectionError: string | null;
  
  // Session state
  currentSession: SessionData | null;
  isInSession: boolean;
  isHost: boolean;
  
  // User state
  userNickname: string;
  userAvatar: string;
  
  // UI state
  inviteModalOpen: boolean;
  joinModalOpen: boolean;
  chatOpen: boolean;
  participantsOpen: boolean;
  
  // Actions
  connect: () => void;
  disconnect: () => void;
  createSession: (nickname: string, avatar: string) => Promise<{ success: boolean; sessionId?: string; error?: string }>;
  joinSession: (sessionId: string, nickname: string, avatar: string) => Promise<{ success: boolean; error?: string }>;
  leaveSession: () => void;
  sendMessage: (text: string) => void;
  updateTimerState: (timerState: TimerState, action: string) => void;
  
  // UI actions
  setInviteModalOpen: (open: boolean) => void;
  setJoinModalOpen: (open: boolean) => void;
  setChatOpen: (open: boolean) => void;
  setParticipantsOpen: (open: boolean) => void;
  
  // Internal actions
  setSocket: (socket: Socket | null) => void;
  setConnectionState: (connected: boolean, error?: string) => void;
  setSession: (session: SessionData | null) => void;
  addChatMessage: (message: ChatMessage) => void;
  updateParticipants: (participants: Participant[]) => void;
}

const AVATARS = [
  '🐱', '🐶', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼',
  '🐨', '🐯', '🦁', '🐸', '🐵', '🐧', '🐦', '🦉'
];

const generateRandomAvatar = () => {
  return AVATARS[Math.floor(Math.random() * AVATARS.length)];
};

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
    userAvatar: generateRandomAvatar(),
    inviteModalOpen: false,
    joinModalOpen: false,
    chatOpen: false,
    participantsOpen: false,

    // Connection management
    connect: () => {
      const socket = io('http://localhost:3004', {
        autoConnect: true,
        reconnection: true,
        reconnectionDelay: 1000,
        reconnectionAttempts: 5,
        timeout: 10000
      });

      socket.on('connect', () => {
        console.log('Connected to collaboration server');
        set({ isConnected: true, connectionError: null });
      });

      socket.on('disconnect', (reason) => {
        console.log('Disconnected from server:', reason);
        set({ isConnected: false });
        
        if (reason === 'io server disconnect') {
          // Server initiated disconnect, don't reconnect automatically
          set({ connectionError: 'Disconnected by server' });
        }
      });

      socket.on('connect_error', (error) => {
        console.error('Connection error:', error);
        set({ 
          isConnected: false, 
          connectionError: 'Failed to connect to collaboration server' 
        });
      });

      // Session events
      socket.on('participant-joined', (data) => {
        const { participants } = data;
        set((state) => ({
          currentSession: state.currentSession ? {
            ...state.currentSession,
            participants
          } : null
        }));
      });

      socket.on('participant-left', (data) => {
        const { participants, newHost } = data;
        set((state) => ({
          currentSession: state.currentSession ? {
            ...state.currentSession,
            participants
          } : null,
          isHost: newHost?.nickname === state.userNickname
        }));
      });

      socket.on('timer-update', (data) => {
        const { timerState } = data;
        set((state) => ({
          currentSession: state.currentSession ? {
            ...state.currentSession,
            timerState
          } : null
        }));

        // Update local timer if we're not the host
        if (!get().isHost) {
          // Dynamically import to avoid circular dependency
          import('./timerStore').then(({ useTimerStore }) => {
            const timerStore = useTimerStore.getState();
            timerStore.updateFromCollaboration(timerState);
          });
        }
      });

      socket.on('new-message', (message: ChatMessage) => {
        get().addChatMessage(message);
      });

      set({ socket });
    },

    disconnect: () => {
      const { socket } = get();
      if (socket) {
        socket.disconnect();
        set({ 
          socket: null, 
          isConnected: false, 
          currentSession: null,
          isInSession: false,
          isHost: false 
        });
      }
    },

    createSession: async (nickname: string, avatar: string) => {
      const { socket } = get();
      if (!socket || !socket.connected) {
        return { success: false, error: 'Not connected to server' };
      }

      return new Promise((resolve) => {
        socket.emit('create-session', { nickname, avatar }, (response: ServerResponse) => {
          if (response.success) {
            set({
              currentSession: response.session,
              isInSession: true,
              isHost: true,
              userNickname: nickname,
              userAvatar: avatar,
              inviteModalOpen: false
            });
            resolve({ success: true, sessionId: response.sessionId });
          } else {
            resolve({ success: false, error: response.error });
          }
        });
      });
    },

    joinSession: async (sessionId: string, nickname: string, avatar: string) => {
      const { socket } = get();
      if (!socket || !socket.connected) {
        return { success: false, error: 'Not connected to server' };
      }

      return new Promise((resolve) => {
        socket.emit('join-session', { 
          sessionId, 
          participantData: { nickname, avatar } 
        }, (response: ServerResponse) => {
          if (response.success) {
            set({
              currentSession: response.session,
              isInSession: true,
              isHost: false,
              userNickname: nickname,
              userAvatar: avatar,
              joinModalOpen: false
            });
            resolve({ success: true });
          } else {
            resolve({ success: false, error: response.error });
          }
        });
      });
    },

    leaveSession: () => {
      const { socket } = get();
      if (socket) {
        socket.emit('leave-session');
      }
      
      set({
        currentSession: null,
        isInSession: false,
        isHost: false,
        chatOpen: false,
        participantsOpen: false
      });
    },

    sendMessage: (text: string) => {
      const { socket } = get();
      if (socket && text.trim()) {
        socket.emit('send-message', { text: text.substring(0, 200) });
      }
    },

    updateTimerState: (timerState: TimerState, action: string) => {
      const { socket, isHost } = get();
      if (socket && isHost) {
        socket.emit('timer-action', { action, timerState });
      }
    },

    // UI actions
    setInviteModalOpen: (open: boolean) => set({ inviteModalOpen: open }),
    setJoinModalOpen: (open: boolean) => set({ joinModalOpen: open }),
    setChatOpen: (open: boolean) => set({ chatOpen: open }),
    setParticipantsOpen: (open: boolean) => set({ participantsOpen: open }),

    // Internal actions
    setSocket: (socket: Socket | null) => set({ socket }),
    setConnectionState: (connected: boolean, error?: string) => 
      set({ isConnected: connected, connectionError: error }),
    setSession: (session: SessionData | null) => 
      set({ currentSession: session, isInSession: !!session }),
    
    addChatMessage: (message: ChatMessage) => set((state) => ({
      currentSession: state.currentSession ? {
        ...state.currentSession,
        chat: [...state.currentSession.chat, message]
      } : null
    })),

    updateParticipants: (participants: Participant[]) => set((state) => ({
      currentSession: state.currentSession ? {
        ...state.currentSession,
        participants
      } : null
    }))
  }))
);

// Auto-connect when store is first used
let autoConnected = false;
export const initializeCollaboration = () => {
  if (!autoConnected) {
    autoConnected = true;
    const store = useCollaborationStore.getState();
    if (!store.socket) {
      store.connect();
    }
  }
};