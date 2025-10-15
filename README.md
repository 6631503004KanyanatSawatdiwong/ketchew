# Ketchew - Pomodoro Timer MVP

## Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn

### Installation and Setup

1. **Install dependencies:**
```bash
npm install
```

2. **Start the development server:**
```bash
npm run dev
```

3. **Open your browser:**
Navigate to `http://localhost:3000` to see the Ketchew app running locally.

## Features

### ✅ Implemented in MVP
- **Pomodoro Timer**: 4-round cycle (25min study, 5min break, repeat 4x, then 15min long break)
- **Visual Progress**: Progress dots showing completed rounds
- **Timer Controls**: Start, pause, resume, stop, reset
- **Customizable Durations**: Adjust study, short break, and long break times
- **Todo List**: Add, edit, delete, and mark tasks as complete with progress tracking
- **Session Notes**: Auto-saving text editor with word count and download options
- **Background Selector**: Choose from nature, abstract, minimal, and workspace backgrounds
- **Sound Settings**: Background sounds and notification preferences (UI ready for Howler.js)
- **Popup Interface**: Clean modal-based navigation between features
- **Local Storage**: Persistent data for timer settings, todos, and preferences
- **Session Storage**: Temporary storage for notes (cleared when tab closes)

### 🎯 Core Functionality
1. **Timer Operation**: Accurate countdown with drift correction for precise timing
2. **Data Persistence**: Settings and todos save automatically to localStorage
3. **Responsive Design**: TailwindCSS styling with clean, professional interface
4. **State Management**: React hooks for component state and data persistence

## Project Structure

```
src/
├── components/
│   ├── DesktopInterface.tsx    # Background desktop environment
│   ├── Sidebar.tsx             # Navigation sidebar with 5 tabs
│   ├── PopupOverlay.tsx        # Modal system for feature panels
│   ├── PomodoroTimer.tsx       # Core timer with 4-round cycle
│   ├── TodoList.tsx            # Task management with CRUD operations
│   ├── NotesEditor.tsx         # Session notes with auto-save
│   ├── BackgroundSelector.tsx  # Background customization
│   └── SoundSelector.tsx       # Audio settings (ready for Howler.js)
├── hooks/
│   └── useLocalStorage.ts      # Persistent storage utility
├── App.tsx                     # Main application with popup state
├── main.tsx                    # React entry point
└── index.css                   # TailwindCSS styles and custom components
```

## Usage Instructions

### Timer Usage
1. Click the **Timer** tab in the sidebar
2. Use **Start** to begin a 25-minute focus session
3. Progress dots show completed rounds (4 total per cycle)
4. Timer automatically transitions between study and break phases
5. Customize durations in the settings section at the bottom

### Todo Management
1. Click the **Tasks** tab
2. Type a task and press **Enter** or click **Add**
3. Click checkboxes to mark tasks complete
4. Use edit/delete icons for task management
5. Progress bar shows completion percentage

### Notes
1. Click the **Notes** tab
2. Start typing - notes auto-save every second
3. Download notes as .txt file for permanent storage
4. Notes are stored in session storage (cleared when tab closes)

### Customization
1. **Backgrounds**: Click **Background** tab to choose from curated images or upload custom
2. **Sounds**: Click **Audio** tab to select focus sounds and notification preferences

## Development Notes

### MVP Limitations
- Audio playback simulated (console logs) - Howler.js integration pending
- External image URLs may require CORS handling in production
- Session storage used for notes (temporary by design)

### Production Roadiness
- All React components are TypeScript-ready
- TailwindCSS provides responsive design
- LocalStorage ensures data persistence
- Modular architecture supports easy feature additions

### Next Steps for Full Version
1. Integrate Howler.js for actual audio playback
2. Add real-time collaboration features with Socket.io backend
3. Implement user authentication and cloud data sync
4. Add more background and sound options
5. Enhanced timer statistics and progress tracking

## Technical Stack
- **Frontend**: React 18 + TypeScript + TailwindCSS
- **Icons**: Lucide React
- **Storage**: LocalStorage (persistent) + SessionStorage (temporary)
- **Bundler**: Vite
- **Styling**: TailwindCSS with custom component classes

## License
This is an MVP version of the Ketchew pomodoro timer platform.
