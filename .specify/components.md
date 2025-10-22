# Ketchew - Component Specifications (Multi-Popup Architecture)

## 0. Multi-Popup Manager Component

### State Management (React State)

```javascript
const [openPopups, setOpenPopups] = useState([])
const [focusedPopupId, setFocusedPopupId] = useState(null)
const [nextZIndex, setNextZIndex] = useState(100)

// Popup structure
const popupInstance = {
  id: crypto.randomUUID(),
  type: 'timer', // 'timer' | 'tasks' | 'notes' | 'background' | 'audio'
  position: { x: 100, y: 100 },
  size: { width: 400, height: 500 },
  isMinimized: false,
  zIndex: 100,
  isDragging: false,
}
```

### Popup Management Functions

```javascript
// Open new popup with auto-positioning
const openPopup = type => {
  const newPosition = calculateCascadePosition(openPopups.length)
  const newPopup = {
    id: crypto.randomUUID(),
    type,
    position: newPosition,
    size: getDefaultSize(type),
    isMinimized: false,
    zIndex: nextZIndex,
    isDragging: false,
  }

  setOpenPopups([...openPopups, newPopup])
  setFocusedPopupId(newPopup.id)
  setNextZIndex(nextZIndex + 1)
}

// Close specific popup
const closePopup = popupId => {
  setOpenPopups(openPopups.filter(popup => popup.id !== popupId))
  if (focusedPopupId === popupId) {
    const remaining = openPopups.filter(popup => popup.id !== popupId)
    setFocusedPopupId(remaining.length > 0 ? remaining[remaining.length - 1].id : null)
  }
}

// Bring popup to front
const focusPopup = popupId => {
  setFocusedPopupId(popupId)
  setOpenPopups(
    openPopups.map(popup => (popup.id === popupId ? { ...popup, zIndex: nextZIndex } : popup))
  )
  setNextZIndex(nextZIndex + 1)
}

// Update popup position during drag
const updatePopupPosition = (popupId, newPosition) => {
  setOpenPopups(
    openPopups.map(popup => (popup.id === popupId ? { ...popup, position: newPosition } : popup))
  )
}

// Auto-cascade positioning
const calculateCascadePosition = index => {
  const offset = index * 30
  return {
    x: 100 + offset,
    y: 100 + offset,
  }
}
```

### Drag and Drop Implementation

```javascript
import { useDrag } from 'react-dnd'

const DraggablePopup = ({ popup, children, onDrag, onFocus }) => {
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })

  const handleMouseDown = e => {
    if (e.target.closest('.popup-header')) {
      setIsDragging(true)
      setDragStart({
        x: e.clientX - popup.position.x,
        y: e.clientY - popup.position.y,
      })
      onFocus(popup.id)
    }
  }

  const handleMouseMove = e => {
    if (isDragging) {
      const newPosition = {
        x: Math.max(0, Math.min(e.clientX - dragStart.x, window.innerWidth - popup.size.width)),
        y: Math.max(0, Math.min(e.clientY - dragStart.y, window.innerHeight - popup.size.height)),
      }
      onDrag(popup.id, newPosition)
    }
  }

  const handleMouseUp = () => {
    setIsDragging(false)
  }

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove)
      document.addEventListener('mouseup', handleMouseUp)
      return () => {
        document.removeEventListener('mousemove', handleMouseMove)
        document.removeEventListener('mouseup', handleMouseUp)
      }
    }
  }, [isDragging, dragStart])

  return (
    <div
      className={`popup-window ${isDragging ? 'dragging' : ''} ${popup.id === focusedPopupId ? 'focused' : ''}`}
      style={{
        left: popup.position.x,
        top: popup.position.y,
        width: popup.size.width,
        height: popup.isMinimized ? 60 : popup.size.height,
        zIndex: popup.zIndex,
      }}
      onMouseDown={handleMouseDown}
      onClick={() => onFocus(popup.id)}
    >
      {children}
    </div>
  )
}
```

## 1. Enhanced Sidebar Navigation Component

### Updated Structure for Multi-Popup Support

```javascript
const navigationTabs = [
  { id: 'timer', label: 'Timer', icon: ClockIcon, component: PomodoroTimer },
  { id: 'tasks', label: 'Tasks', icon: ListBulletIcon, component: TodoList },
  { id: 'notes', label: 'Notes', icon: DocumentTextIcon, component: NotesEditor },
  { id: 'background', label: 'Background', icon: PhotoIcon, component: BackgroundSelector },
  { id: 'audio', label: 'Audio', icon: SpeakerWaveIcon, component: SoundSelector },
]

const Sidebar = ({ openPopups, onOpenPopup }) => {
  const isPopupOpen = type => {
    return openPopups.some(popup => popup.type === type)
  }

  return (
    <div className="sidebar">
      {navigationTabs.map(tab => (
        <button
          key={tab.id}
          className={`sidebar-tab ${isPopupOpen(tab.id) ? 'active' : ''}`}
          onClick={() => onOpenPopup(tab.id)}
          disabled={isPopupOpen(tab.id)}
        >
          <tab.icon className="w-6 h-6" />
          <span className="sr-only">{tab.label}</span>
        </button>
      ))}
    </div>
  )
}
```

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

## 9. Enhanced Main Layout Component

### Multi-Popup Architecture

```javascript
const App = () => {
  const [openPopups, setOpenPopups] = useState([])
  const [focusedPopupId, setFocusedPopupId] = useState(null)
  const [nextZIndex, setNextZIndex] = useState(100)

  const popupComponents = {
    timer: PomodoroTimer,
    tasks: TodoList,
    notes: NotesEditor,
    background: BackgroundSelector,
    audio: SoundSelector,
  }

  return (
    <div className="app-container">
      <DesktopInterface />

      <Sidebar openPopups={openPopups} onOpenPopup={openPopup} />

      <div className="popup-manager">
        {openPopups.map(popup => {
          const Component = popupComponents[popup.type]
          return (
            <DraggablePopup
              key={popup.id}
              popup={popup}
              onDrag={updatePopupPosition}
              onFocus={focusPopup}
            >
              <div className="popup-header">
                <div className="popup-title">
                  <TabIcon type={popup.type} />
                  {getTabLabel(popup.type)}
                </div>
                <div className="popup-controls">
                  <button
                    className="popup-control-button minimize"
                    onClick={() => toggleMinimize(popup.id)}
                  >
                    {popup.isMinimized ? '□' : '_'}
                  </button>
                  <button
                    className="popup-control-button close"
                    onClick={() => closePopup(popup.id)}
                  >
                    ×
                  </button>
                </div>
              </div>

              {!popup.isMinimized && (
                <div className="popup-content">
                  <Component />
                </div>
              )}
            </DraggablePopup>
          )
        })}
      </div>
    </div>
  )
}
```

### Popup State Management

```javascript
// Enhanced popup state with position persistence
const usePopupManager = () => {
  const [openPopups, setOpenPopups] = useState(() => {
    // Load popup positions from sessionStorage
    const saved = sessionStorage.getItem('ketchew_popup_positions')
    return saved ? JSON.parse(saved) : []
  })

  // Save popup positions on change
  useEffect(() => {
    sessionStorage.setItem('ketchew_popup_positions', JSON.stringify(openPopups))
  }, [openPopups])

  // Keyboard shortcuts for popup management
  useEffect(() => {
    const handleKeyDown = e => {
      if (e.ctrlKey || e.metaKey) {
        switch (e.key) {
          case '1':
            e.preventDefault()
            togglePopup('timer')
            break
          case '2':
            e.preventDefault()
            togglePopup('tasks')
            break
          case '3':
            e.preventDefault()
            togglePopup('notes')
            break
          case 'w':
            if (focusedPopupId) {
              e.preventDefault()
              closePopup(focusedPopupId)
            }
            break
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [focusedPopupId])

  return {
    openPopups,
    focusedPopupId,
    openPopup,
    closePopup,
    focusPopup,
    updatePopupPosition,
    toggleMinimize,
  }
}
```

## 10. Enhanced Global State Management

### Multi-Popup State Structure

```typescript
interface PopupInstance {
  id: string
  type: 'timer' | 'tasks' | 'notes' | 'background' | 'audio'
  position: { x: number; y: number }
  size: { width: number; height: number }
  isMinimized: boolean
  zIndex: number
  isDragging: boolean
}

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
    openPopups: PopupInstance[]
    focusedPopupId: string | null
    nextZIndex: number
    theme: 'light' | 'dark'
  }
}
```

### Multi-Popup Actions

```typescript
interface PopupActions {
  // Popup management
  openPopup: (type: string) => void
  closePopup: (popupId: string) => void
  focusPopup: (popupId: string) => void
  toggleMinimize: (popupId: string) => void
  updatePopupPosition: (popupId: string, position: { x: number; y: number }) => void
  updatePopupSize: (popupId: string, size: { width: number; height: number }) => void

  // Bulk operations
  closeAllPopups: () => void
  minimizeAllPopups: () => void
  restoreAllPopups: () => void
  cascadePopups: () => void

  // Session management
  savePopupLayout: () => void
  restorePopupLayout: () => void
}
```

### Enhanced Hook Implementation

```typescript
const useMultiPopupStore = create<AppState & PopupActions>((set, get) => ({
  // State
  ui: {
    openPopups: [],
    focusedPopupId: null,
    nextZIndex: 100,
    theme: 'light',
  },

  // Actions
  openPopup: type => {
    const { ui } = get()
    const existingPopup = ui.openPopups.find(popup => popup.type === type)

    if (existingPopup) {
      // Focus existing popup instead of opening new one
      get().focusPopup(existingPopup.id)
      return
    }

    const newPopup: PopupInstance = {
      id: crypto.randomUUID(),
      type,
      position: calculateCascadePosition(ui.openPopups.length),
      size: getDefaultSize(type),
      isMinimized: false,
      zIndex: ui.nextZIndex,
      isDragging: false,
    }

    set(state => ({
      ui: {
        ...state.ui,
        openPopups: [...state.ui.openPopups, newPopup],
        focusedPopupId: newPopup.id,
        nextZIndex: state.ui.nextZIndex + 1,
      },
    }))
  },

  closePopup: popupId => {
    set(state => {
      const remainingPopups = state.ui.openPopups.filter(popup => popup.id !== popupId)
      const newFocusedId =
        state.ui.focusedPopupId === popupId
          ? remainingPopups.length > 0
            ? remainingPopups[remainingPopups.length - 1].id
            : null
          : state.ui.focusedPopupId

      return {
        ui: {
          ...state.ui,
          openPopups: remainingPopups,
          focusedPopupId: newFocusedId,
        },
      }
    })
  },

  focusPopup: popupId => {
    set(state => ({
      ui: {
        ...state.ui,
        focusedPopupId: popupId,
        openPopups: state.ui.openPopups.map(popup =>
          popup.id === popupId ? { ...popup, zIndex: state.ui.nextZIndex } : popup
        ),
        nextZIndex: state.ui.nextZIndex + 1,
      },
    }))
  },

  updatePopupPosition: (popupId, position) => {
    set(state => ({
      ui: {
        ...state.ui,
        openPopups: state.ui.openPopups.map(popup =>
          popup.id === popupId ? { ...popup, position } : popup
        ),
      },
    }))
  },

  closeAllPopups: () => {
    set(state => ({
      ui: {
        ...state.ui,
        openPopups: [],
        focusedPopupId: null,
      },
    }))
  },

  cascadePopups: () => {
    set(state => ({
      ui: {
        ...state.ui,
        openPopups: state.ui.openPopups.map((popup, index) => ({
          ...popup,
          position: calculateCascadePosition(index),
        })),
      },
    }))
  },
}))
```

This enhanced specification supports:

- **Multiple simultaneous popups** for Timer, Tasks, and Notes
- **Drag and drop functionality** with viewport constraints
- **Auto-cascade positioning** to prevent overlap
- **Focus management** with proper z-index layering
- **Minimize/restore functionality** for each popup
- **Keyboard shortcuts** for quick popup access
- **Session persistence** for popup positions
- **Responsive behavior** on different screen sizes
