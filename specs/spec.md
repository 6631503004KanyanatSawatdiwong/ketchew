# Ketchew - Pomodoro Timer Web Platform

## Project Overview

Ketchew is a web-based pomodoro timer platform that combines productivity tools with social collaboration features. The platform provides a desktop-like interface with sticky tabs and popup overlays for various functionality.

## Functional Requirements (FRs)

\*\*\* fix later na

### FR01: Pomodoro Timer System

**Description**: The system shall provide a configurable pomodoro timer with a default 4-round cycle

- **FR01.1**: System shall implement Study 25min → Short Break 5min (repeat 3x) → Study 25min → Long Break 15min cycle
- **FR01.2**: System shall display 4 progress indicators (grey dots) that turn black as rounds complete
- **FR01.3**: System shall provide Start/Stop/Resume controls for all timer phases
- **FR01.4**: System shall allow users to customize study and break durations
- **FR01.5**: System shall require manual user action to start each timer phase
- **FR01.6**: System shall allow users to select long break (15min) during any break phase
- **FR01.7**: System shall persist timer state across browser sessions

### FR02: Task Management System

**Description**: The system shall provide comprehensive task management capabilities

- **FR02.1**: System shall allow users to create new tasks with text descriptions
- **FR02.2**: System shall allow users to update existing task content
- **FR02.3**: System shall allow users to delete tasks
- **FR02.4**: System shall allow users to mark tasks as complete/incomplete
- **FR02.5**: System shall persist task data locally and sync to cloud when authenticated
- **FR02.6**: System shall integrate task completion tracking with pomodoro sessions

### FR03: Real-time Collaboration System

**Description**: The system shall enable collaborative focus sessions between multiple users

- **FR03.1**: System shall generate unique session invite links for sharing
- **FR03.2**: System shall allow users to join sessions by entering name and selecting avatar
- **FR03.3**: System shall synchronize timer state in real-time across all session participants
- **FR03.4**: System shall provide live chat functionality during active sessions
- **FR03.5**: System shall support up to 10 concurrent users per session (NFR03)
- **FR03.6**: System shall clear chat history when session ends
- **FR03.7**: System shall designate session host with timer control privileges

### FR04: Customization and Personalization System

**Description**: The system shall provide extensive customization options for user experience

- **FR04.1**: System shall offer preset natural background sound library
- **FR04.2**: System shall provide customizable background image selection
- **FR04.3**: System shall include mute/unmute controls for all audio elements
- **FR04.4**: System shall allow volume adjustment for background sounds
- **FR04.5**: System shall persist user preferences across sessions
- **FR04.6**: System shall support light/dark theme switching

### FR05: Progress Tracking and Analytics System

**Description**: The system shall track and analyze user productivity data

- **FR05.1**: System shall record completed pomodoro sessions with timestamps
- **FR05.2**: System shall track total study time and break time per day/week/month
- **FR05.3**: System shall calculate and display productivity streaks
- **FR05.4**: System shall provide visual analytics dashboard with charts and graphs
- **FR05.5**: System shall allow export of productivity summaries
- **FR05.6**: System shall enable sharing of achievements on social media platforms
- **FR05.7**: System shall store progress data in LocalStorage and sync to cloud

### FR06: Notes and Documentation System

**Description**: The system shall provide quick note-taking capabilities

- **FR06.1**: System shall offer simple text editor for note creation
- **FR06.2**: System shall support basic text formatting (bold, italic, lists)
- **FR06.3**: System shall auto-save notes during editing
- **FR06.4**: System shall clear notes when browser session ends (session-based storage)
- **FR06.5**: System shall integrate notes interface with main popup system
- **FR06.6**: System shall provide search functionality within notes

## User Interface Design (Supporting FRs)

### Main Layout (FR01-FR06)

- **Desktop Interface**: Clean, minimal design with default background (FR04.2, NFR07)
- **Sticky Sidebar**: Vertical tab navigation on left side (FR01-FR06 access)
- **Popup System**: All features open as overlays, no page navigation (NFR06)

### Navigation Tabs (Feature Access)

1. **Background**: Image selection interface (FR04.2)
2. **Sounds**: Natural sound library with controls (FR04.1, FR04.3, FR04.4)
3. **Timer**: Main pomodoro interface with progress dots (FR01.1, FR01.2)
4. **To-Do**: Task management interface (FR02.1-FR02.6)
5. **Notes**: Quick note-taking area (FR06.1-FR06.6)

### Header Elements (Collaboration Support)

- **Top Right Controls**:
  - Video icon for collaboration (FR03.1)
  - Invite button for session sharing (FR03.1)
  - Profile button with sign-up/sign-in options

## Technical Requirements

### Frontend Stack

- **React**: Component-based UI framework for interactive interfaces
- **TailwindCSS**: Utility-first CSS framework for responsive design
- **Howler.js**: Web audio library for background sounds and timer alerts
- **LocalStorage**: Browser-based persistence for user data

### Backend Stack

- **Node.js**: JavaScript runtime for server-side development
- **Express**: Web framework for API endpoints and server setup
- **Socket.io**: Real-time bidirectional communication for collaboration

### Data Architecture

- **Local-Only Storage**:
  - Tasks and todo items stored in LocalStorage
  - Pomodoro counts and progress data in LocalStorage
  - User preferences and customization settings in LocalStorage
- **Temporary Session Data**:
  - Collaboration nicknames and avatars stored in server memory
  - Session state and timer synchronization in server memory
  - Chat messages exist only during active sessions
- **No Database Required**: Simplified architecture with browser and memory storage only

## User Experience Flow (FR Implementation)

### Initial Load (Supporting Multiple FRs)

1. User sees desktop interface with default background (FR04.2, NFR06)
2. Sticky sidebar visible on left with all navigation tabs (FR01-FR06 access)
3. Top-right shows collaboration and profile controls (FR03.1)

### Pomodoro Workflow (FR01 Implementation)

1. User clicks Timer tab → Popup opens with 4 progress dots (FR01.2)
2. User starts 25-minute study timer (FR01.1, FR01.5)
3. Timer completes → Automatic switch to break tab (5min default) (FR01.1)
4. User manually starts break timer (FR01.5)
5. Process repeats for 4 rounds total (FR01.1)
6. Progress dots update as rounds complete (FR01.2)

### Collaboration Flow (FR03 Implementation)

1. User clicks invite button → Generates shareable link (FR03.1)
2. Participants join with name/avatar selection (FR03.2)
3. Timers synchronize across all participants (FR03.3)
4. Chat functionality available during session (FR03.4)
5. Session ends when host terminates or all leave (FR03.6, FR03.7)

### Customization Flow (FR04 Implementation)

1. Background tab → Image gallery with preview (FR04.2)
2. Sounds tab → Audio library with play/preview controls (FR04.1, FR04.3, FR04.4)
3. Settings persist in localStorage (FR04.5)
4. Real-time updates across active sessions (FR04.5)

## Non-Functional Requirements (NFRs)

- **NFR01**: Timer must remain accurate with <1s drift
- **NFR02**: Chat messages should deliver with latency ≤ 300ms
- **NFR03**: Up to 10 concurrent users per shared session
- **NFR04**: Server uptime 99% for collaborative features
- **NFR05**: Local data must persist across browser refreshes
- **NFR06**: UI must be responsive across devices (desktop, tablet, mobile)
- **NFR07**: Minimalist design with intuitive controls
- **NFR08**: All communication secured via HTTPS/WSS
- **NFR09**: Message length limit at ≤ 200 characters

_See `.specify/nfr.md` for detailed NFR specifications and implementation strategies._

## Success Metrics

- User engagement with pomodoro cycles
- Collaboration session participation rates
- Feature adoption across different tools
- User retention and productivity tracking
- System performance metrics (timer accuracy, latency, uptime)

## Development Phases

1. **Phase 1**: Core pomodoro timer and basic UI
2. **Phase 2**: To-do list and notes functionality
3. **Phase 3**: Customization features (backgrounds, sounds)
4. **Phase 4**: Collaboration and real-time features
5. **Phase 5**: Progress tracking and social sharing
