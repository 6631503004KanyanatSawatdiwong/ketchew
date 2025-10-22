import { useEffect } from 'react'
import DesktopInterface from './components/DesktopInterface'
import Sidebar from './components/Sidebar'
import PopupManager from './components/PopupManager'
import KeyboardShortcutsHelp from './components/KeyboardShortcutsHelp'
import useKeyboardShortcuts from './hooks/useKeyboardShortcuts'
import { migrateTodoData, isMigrationNeeded } from './utils/migration'

function App() {
  // Enable keyboard shortcuts for multi-popup system
  useKeyboardShortcuts()

  // Run data migrations on app startup
  useEffect(() => {
    if (isMigrationNeeded()) {
      console.log('Running data migration...')
      const result = migrateTodoData()

      if (result.success) {
        console.log(`Migration successful: ${result.migratedFrom} → ${result.migratedTo}`)
        if (result.itemsUpdated > 0) {
          console.log(`Updated ${result.itemsUpdated} todo items`)
        }
      } else {
        console.error('Migration failed:', result.errors)
      }
    }
  }, [])

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
