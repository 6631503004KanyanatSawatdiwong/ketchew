import DesktopInterface from './components/DesktopInterface'
import Sidebar from './components/Sidebar'
import PopupManager from './components/PopupManager'
import KeyboardShortcutsHelp from './components/KeyboardShortcutsHelp'
import useKeyboardShortcuts from './hooks/useKeyboardShortcuts'

function App() {
  // Enable keyboard shortcuts for multi-popup system
  useKeyboardShortcuts()

  return (
    <div className="h-screen w-full overflow-hidden">
      {/* Desktop background interface */}
      <DesktopInterface />

      {/* Navigation sidebar */}
      <Sidebar />

      {/* Multi-popup manager system */}
      <PopupManager />

      {/* Keyboard shortcuts help */}
      <KeyboardShortcutsHelp />
    </div>
  )
}

export default App
