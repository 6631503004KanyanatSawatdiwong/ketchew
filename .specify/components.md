# Ketchew - Component Specifications (Simplified Architecture)

## 1. Pomodoro Timer Component

### State Management (React State)

```javascript
const [pomodoroState, setPomodoroState] = useState({
  currentRound: 1, // 1-4
  phase: 'study', // 'study' | 'shortBreak' | 'longBreak'
  timeRemaining: 1500, // in seconds (25 minutes)
  isActive: false,
  isPaused: false,
  studyDuration: 25, // minutes
  shortBreakDuration: 5, // minutes
  longBreakDuration: 15, // minutes
  completedRounds: [false, false, false, false],
})
```

### Timer Logic

- High-precision timing using `performance.now()` for accuracy (NFR01)
- Drift correction mechanism to maintain <1s accuracy
- Auto-switch to break phase after study completion
- Manual start required for each phase
- Progress dots update based on completedRounds array
- Sound alerts using Howler.js (if enabled)
- Persistent state in LocalStorage across browser refreshes (NFR05)

### Audio Integration (Howler.js)

```javascript
import { Howl } from 'howler'

const timerAlert = new Howl({
  src: ['/sounds/timer-complete.mp3'],
  volume: 0.5,
})

const backgroundSound = new Howl({
  src: ['/sounds/nature-ambient.mp3'],
  loop: true,
  volume: 0.3,
})
```

### UI Components

- Timer display (MM:SS format)
- Start/Pause/Resume buttons
- Round progress indicators (4 dots)
- Duration adjustment controls
- Break type selector (short/long)

## 2. Sidebar Navigation Component

### Structure (React Component)

```javascript
const navigationTabs = [
  { id: 'background', label: 'Background', icon: PhotoIcon, component: BackgroundSelector },
  { id: 'sounds', label: 'Sounds', icon: SpeakerWaveIcon, component: SoundSelector },
  { id: 'timer', label: 'Timer', icon: ClockIcon, component: PomodoroTimer },
  { id: 'todo', label: 'To-Do', icon: ListBulletIcon, component: TodoList },
  { id: 'notes', label: 'Notes', icon: DocumentTextIcon, component: NotesEditor },
]

const [activeTab, setActiveTab] = useState(null)
const [isPopupOpen, setIsPopupOpen] = useState(false)
```

### Behavior

- Fixed position with Tailwind CSS classes
- Click opens popup overlay with selected component
- Active tab highlighting with CSS classes
- Smooth transitions using Tailwind animations

## 3. Todo List Component

### Data Structure (LocalStorage)

```javascript
const [todos, setTodos] = useState([])

// LocalStorage operations
const saveTodos = todoList => {
  localStorage.setItem('ketchew_todos', JSON.stringify(todoList))
}

const loadTodos = () => {
  const saved = localStorage.getItem('ketchew_todos')
  return saved ? JSON.parse(saved) : []
}

// Todo item structure
const todoItem = {
  id: crypto.randomUUID(),
  text: 'Task description',
  completed: false,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
}
```

### Features

- Add new tasks
- Mark as complete/incomplete
- Edit task text
- Delete tasks
- Filter options
- Persistent storage

## 4. Collaboration Component (Memory-Based)

### Session Management (Server Memory)

```javascript
// Server-side session storage (in memory)
const activeSessions = new Map()

const sessionStructure = {
  id: 'unique-session-id',
  hostSocketId: 'socket-id',
  participants: [
    {
      socketId: 'socket-id',
      name: 'User Name',
      avatar: 'avatar-url',
      isHost: true,
      joinedAt: new Date(),
    },
  ],
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
  },
  chat: [], // Messages exist only in memory during session
  createdAt: new Date(),
  maxParticipants: 10,
}
```

### Real-time Features (Socket.io)

```javascript
// Client-side Socket.io connection
import io from 'socket.io-client'

const socket = io('ws://localhost:3001')

// Join session
socket.emit('join-session', {
  sessionId: 'session-123',
  name: 'User Name',
  avatar: 'avatar-url',
})

// Timer synchronization
socket.on('timer-updated', timerState => {
  setPomodoroState(timerState)
})

// Chat messages (temporary, no persistence)
socket.emit('chat-message', {
  message: 'Hello everyone!', // Max 200 chars (NFR09)
  timestamp: Date.now(),
})
```

## 5. Customization Components (LocalStorage)

### Background Selector

```javascript
const backgroundOptions = [
  {
    id: 'forest',
    name: 'Forest Clearing',
    url: '/images/backgrounds/forest.jpg',
    thumbnail: '/images/backgrounds/thumbs/forest.jpg',
    category: 'nature',
  },
  // ... more options
]

const [selectedBackground, setSelectedBackground] = useState('forest')

// Save to LocalStorage
const saveBackgroundPreference = backgroundId => {
  localStorage.setItem('ketchew_background', backgroundId)
  setSelectedBackground(backgroundId)
}
```

### Sound Selector (Howler.js Integration)

```javascript
import { Howl } from 'howler'

const soundOptions = [
  {
    id: 'rain',
    name: 'Gentle Rain',
    url: '/sounds/rain-ambient.mp3',
    category: 'nature',
  },
  // ... more options
]

const [currentSound, setCurrentSound] = useState(null)
const [volume, setVolume] = useState(50)
const [isMuted, setIsMuted] = useState(false)

// Sound management
const playBackgroundSound = soundId => {
  if (currentSound) {
    currentSound.stop()
  }

  const newSound = new Howl({
    src: [`/sounds/${soundId}.mp3`],
    loop: true,
    volume: volume / 100,
  })

  newSound.play()
  setCurrentSound(newSound)

  // Save preference
  localStorage.setItem('ketchew_sound', soundId)
  localStorage.setItem('ketchew_volume', volume)
}
```

## 6. Progress Tracking Component (LocalStorage)

### Data Structure

```javascript
const [progressData, setProgressData] = useState({
  dailyStats: [],
  totalPomodoros: 0,
  currentStreak: 0,
  longestStreak: 0,
})

// LocalStorage operations
const saveProgressData = data => {
  localStorage.setItem('ketchew_progress', JSON.stringify(data))
}

const loadProgressData = () => {
  const saved = localStorage.getItem('ketchew_progress')
  return saved
    ? JSON.parse(saved)
    : {
        dailyStats: [],
        totalPomodoros: 0,
        currentStreak: 0,
        longestStreak: 0,
      }
}

// Daily stats structure
const dailyStats = {
  date: '2024-01-01',
  completedPomodoros: 8,
  totalStudyTime: 200, // minutes
  totalBreakTime: 40, // minutes
  tasksCompleted: 5,
}
```

### Features

- Daily/weekly/monthly aggregation using JavaScript date calculations
- Goal setting stored in LocalStorage
- Streak calculations based on daily completion
- Export functionality (JSON/CSV download)
- Simple charts using Chart.js or similar lightweight library

## 7. Notes Component (SessionStorage)

### Simple Implementation

```javascript
const [noteContent, setNoteContent] = useState('')

// Session-based storage (clears on browser close)
const saveNote = content => {
  sessionStorage.setItem('ketchew_notes', content)
  setNoteContent(content)
}

const loadNote = () => {
  const saved = sessionStorage.getItem('ketchew_notes')
  return saved || ''
}

// Auto-save functionality
useEffect(() => {
  const autoSave = setTimeout(() => {
    if (noteContent) {
      saveNote(noteContent)
    }
  }, 1000) // Save after 1 second of inactivity

  return () => clearTimeout(autoSave)
}, [noteContent])
```

## 8. Authentication Component

### User Management

```typescript
interface User {
  id: string
  email: string
  displayName: string
  avatar: string
  preferences: UserPreferences
  createdAt: Date
}

interface UserPreferences {
  theme: 'light' | 'dark'
  soundEnabled: boolean
  defaultStudyDuration: number
  defaultShortBreakDuration: number
  defaultLongBreakDuration: number
  selectedBackground: string
  selectedSound: string
}
```

## 9. Main Layout Component

### Structure

- Desktop-style background
- Fixed sidebar navigation
- Popup overlay system
- Header with collaboration controls
- Responsive design

### Popup System

```typescript
interface PopupState {
  activeTab: string | null
  isOpen: boolean
  content: React.ComponentType | null
}
```

## 10. Global State Management

### Zustand Store Structure

```typescript
interface AppState {
  user: User | null
  pomodoro: PomodoroState
  todos: TodoState
  collaboration: CollaborationSession | null
  customization: {
    selectedBackground: string
    selectedSound: string
    soundEnabled: boolean
    volume: number
  }
  progress: ProgressState
  notes: NotesState
  ui: {
    activePopup: string | null
    theme: 'light' | 'dark'
  }
}
```

### Actions

- Timer controls (start, pause, reset, switchPhase)
- Todo management (add, update, delete, toggle)
- Collaboration (createSession, joinSession, sendMessage)
- Customization (setBackground, setSound, toggleSound)
- Progress tracking (updateStats, setGoals)
- UI controls (openPopup, closePopup, setTheme)
