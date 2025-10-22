// Global type definitions for Ketchew

export interface TimerState {
  currentRound: number
  phase: 'study' | 'shortBreak' | 'longBreak'
  timeRemaining: number
  isActive: boolean
  isPaused: boolean
  studyDuration: number
  shortBreakDuration: number
  longBreakDuration: number
  completedRounds: boolean[]
}

export interface TodoItem {
  id: string
  text: string
  completed: boolean
  createdAt: string
  completedAt?: string
  pomodorosSessions?: number
  priority?: 'low' | 'medium' | 'high'
  category?: string
}

export interface BackgroundOption {
  id: string
  name: string
  thumbnail: string
  url: string
  category: 'nature' | 'abstract' | 'minimal' | 'workspace'
}

export interface SoundOption {
  id: string
  name: string
  category: 'nature' | 'ambient' | 'focus' | 'notification'
  url: string
  description: string
}

export interface UserPreferences {
  selectedBackground: string
  selectedSounds: {
    background?: string
    studyEnd: string
    breakEnd: string
  }
  volume: number
  isMuted: boolean
  theme: 'light' | 'dark'
  timerSettings: {
    studyDuration: number
    shortBreakDuration: number
    longBreakDuration: number
    autoStartBreaks: boolean
    autoStartPomodoros: boolean
  }
}

export interface SessionData {
  id: string
  participants: Participant[]
  timerState: TimerState
  hostId: string
  createdAt: string
  isActive: boolean
}

export interface Participant {
  id: string
  nickname: string
  avatar?: string
  isHost: boolean
  joinedAt: string
}

export interface ChatMessage {
  id: string
  participantId: string
  message: string
  timestamp: string
}

export interface ProgressData {
  date: string
  completedPomodoros: number
  studyTime: number // in minutes
  completedTasks: number
  streak: number
}

export type PopupType = 'timer' | 'tasks' | 'notes' | 'background' | 'audio' | null

// Multi-popup interface types
export interface PopupInstance {
  id: string
  type: Exclude<PopupType, null>
  position: { x: number; y: number }
  size: { width: number; height: number }
  isMinimized: boolean
  zIndex: number
  isDragging: boolean
  isResizing: boolean
}

export interface PopupManagerState {
  popups: PopupInstance[]
  maxZIndex: number
  dragOffset: { x: number; y: number }
  activePopupId: string | null
}
