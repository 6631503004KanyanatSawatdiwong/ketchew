# Ketchew - Component Specifications

## 1. Pomodoro Timer Component

### State Management
```typescript
interface PomodoroState {
  currentRound: number; // 1-4
  phase: 'study' | 'shortBreak' | 'longBreak';
  timeRemaining: number; // in seconds
  isActive: boolean;
  isPaused: boolean;
  studyDuration: number; // default 25 minutes
  shortBreakDuration: number; // default 5 minutes
  longBreakDuration: number; // default 15 minutes
  completedRounds: boolean[]; // [false, false, false, false]
}
```

### Timer Logic
- High-precision timing using `performance.now()` for accuracy (NFR01)
- Drift correction mechanism to maintain <1s accuracy
- Auto-switch to break phase after study completion
- Manual start required for each phase
- Progress dots update based on completedRounds array
- Sound alerts on phase transitions (if enabled)
- Persistent state across browser refreshes (NFR05)

### UI Components
- Timer display (MM:SS format)
- Start/Pause/Resume buttons
- Round progress indicators (4 dots)
- Duration adjustment controls
- Break type selector (short/long)

## 2. Sidebar Navigation Component

### Structure
```typescript
interface TabItem {
  id: string;
  label: string;
  icon: React.ComponentType;
  component: React.ComponentType;
}

const tabs: TabItem[] = [
  { id: 'background', label: 'Background', icon: PhotoIcon, component: BackgroundSelector },
  { id: 'sounds', label: 'Sounds', icon: SpeakerWaveIcon, component: SoundSelector },
  { id: 'timer', label: 'Timer', icon: ClockIcon, component: PomodoroTimer },
  { id: 'todo', label: 'To-Do', icon: ListBulletIcon, component: TodoList },
  { id: 'notes', label: 'Notes', icon: DocumentTextIcon, component: NotesEditor }
];
```

### Behavior
- Fixed position on left side
- Click opens popup overlay
- Active tab highlighting
- Smooth transitions

## 3. Todo List Component

### Data Structure
```typescript
interface TodoItem {
  id: string;
  text: string;
  completed: boolean;
  createdAt: Date;
  updatedAt: Date;
}

interface TodoState {
  items: TodoItem[];
  filter: 'all' | 'active' | 'completed';
}
```

### Features
- Add new tasks
- Mark as complete/incomplete
- Edit task text
- Delete tasks
- Filter options
- Persistent storage

## 4. Collaboration Component

### Session Management
```typescript
interface CollaborationSession {
  id: string;
  hostId: string;
  participants: Participant[]; // Max 10 participants (NFR03)
  sharedTimer: PomodoroState;
  chat: ChatMessage[];
  createdAt: Date;
  maxParticipants: number; // Default: 10
}

interface Participant {
  id: string;
  name: string;
  avatar: string;
  isHost: boolean;
  joinedAt: Date;
}

interface ChatMessage {
  id: string;
  participantId: string;
  message: string; // Max 200 characters (NFR09)
  timestamp: Date;
  deliveryLatency?: number; // Track latency for NFR02
}
```

### Real-time Features
- WebSocket connection for live updates
- Timer synchronization
- Chat messaging
- Participant presence
- Session invite links

## 5. Customization Components

### Background Selector
```typescript
interface BackgroundOption {
  id: string;
  name: string;
  url: string;
  thumbnail: string;
  category: 'nature' | 'abstract' | 'minimalist';
}
```

### Sound Selector
```typescript
interface SoundOption {
  id: string;
  name: string;
  url: string;
  category: 'nature' | 'ambient' | 'white-noise';
  volume: number;
  isPlaying: boolean;
}
```

## 6. Progress Tracking Component

### Data Structure
```typescript
interface ProgressData {
  date: string;
  completedPomodoros: number;
  totalStudyTime: number; // in minutes
  totalBreakTime: number; // in minutes
  tasksCompleted: number;
}

interface ProgressState {
  dailyStats: ProgressData[];
  weeklyGoal: number;
  streak: number;
  totalPomodoros: number;
}
```

### Features
- Daily/weekly/monthly views
- Goal setting and tracking
- Streak counters
- Export capabilities
- Social sharing

## 7. Notes Component

### Simple Implementation
```typescript
interface NotesState {
  content: string;
  lastUpdated: Date;
}
```

### Features
- Rich text editor (basic formatting)
- Auto-save functionality
- Session-based storage
- Quick access from sidebar

## 8. Authentication Component

### User Management
```typescript
interface User {
  id: string;
  email: string;
  displayName: string;
  avatar: string;
  preferences: UserPreferences;
  createdAt: Date;
}

interface UserPreferences {
  theme: 'light' | 'dark';
  soundEnabled: boolean;
  defaultStudyDuration: number;
  defaultShortBreakDuration: number;
  defaultLongBreakDuration: number;
  selectedBackground: string;
  selectedSound: string;
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
  activeTab: string | null;
  isOpen: boolean;
  content: React.ComponentType | null;
}
```

## 10. Global State Management

### Zustand Store Structure
```typescript
interface AppState {
  user: User | null;
  pomodoro: PomodoroState;
  todos: TodoState;
  collaboration: CollaborationSession | null;
  customization: {
    selectedBackground: string;
    selectedSound: string;
    soundEnabled: boolean;
    volume: number;
  };
  progress: ProgressState;
  notes: NotesState;
  ui: {
    activePopup: string | null;
    theme: 'light' | 'dark';
  };
}
```

### Actions
- Timer controls (start, pause, reset, switchPhase)
- Todo management (add, update, delete, toggle)
- Collaboration (createSession, joinSession, sendMessage)
- Customization (setBackground, setSound, toggleSound)
- Progress tracking (updateStats, setGoals)
- UI controls (openPopup, closePopup, setTheme)
