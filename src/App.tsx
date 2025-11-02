import { useEffect, useState } from 'react'
import DesktopInterface from './components/DesktopInterface'
import Sidebar from './components/Sidebar'
import PopupManager from './components/PopupManager'
import KeyboardShortcutsHelp from './components/KeyboardShortcutsHelp'
import { CollaborationChat } from './components/CollaborationChat'
import { CreateSessionModal } from './components/CreateSessionModal'
import { JoinSessionModal } from './components/JoinSessionModal'
import EnhancedSettings from './components/EnhancedSettings'
import AccessibilityPanel from './components/AccessibilityPanel'
import PerformanceMonitor from './components/PerformanceMonitor'
import Phase8Completion from './components/Phase8Completion'
import useKeyboardShortcuts from './hooks/useKeyboardShortcuts'
import { useGlobalKeyboardShortcuts } from './hooks/useGlobalKeyboardShortcuts'
import { migrateTodoData, isMigrationNeeded } from './utils/migration'
import { useThemeStore } from './stores/themeStore'
import { useCollaborationStore, initializeCollaboration } from './stores/collaborationStore'

function App() {
  // Enable keyboard shortcuts for multi-popup system
  useKeyboardShortcuts()
  useGlobalKeyboardShortcuts()

  // Phase 8 modal states
  const [showEnhancedSettings, setShowEnhancedSettings] = useState(false)
  const [showAccessibilityPanel, setShowAccessibilityPanel] = useState(false)
  const [showPhase8Completion, setShowPhase8Completion] = useState(false)

  // Initialize theme system
  const { currentTheme } = useThemeStore()

  // Initialize collaboration system
  const { inviteModalOpen, joinModalOpen, setInviteModalOpen, setJoinModalOpen } = useCollaborationStore()

  // Show Phase 8 completion on first load
  useEffect(() => {
    const hasSeenPhase8 = localStorage.getItem('ketchew-phase8-seen')
    if (!hasSeenPhase8) {
      setTimeout(() => setShowPhase8Completion(true), 1000)
      localStorage.setItem('ketchew-phase8-seen', 'true')
    }
  }, [])

  // Initialize collaboration connection
  useEffect(() => {
    initializeCollaboration()

    // Check for join session in URL
    const urlParams = new URLSearchParams(window.location.search)
    const joinSessionId = urlParams.get('join')
    if (joinSessionId) {
      setJoinModalOpen(true)
      // Clear URL parameter
      window.history.replaceState({}, document.title, window.location.pathname)
    }
  }, [setJoinModalOpen])

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

  // Apply theme on app startup and theme changes
  useEffect(() => {
    // Apply theme styles to DOM
    const root = document.documentElement

    Object.entries(currentTheme.colors).forEach(([key, value]) => {
      root.style.setProperty(`--color-${key}`, value)
    })

    root.style.setProperty('--font-primary', currentTheme.fonts.primary)
    root.style.setProperty('--font-secondary', currentTheme.fonts.secondary)
    root.style.setProperty('--font-mono', currentTheme.fonts.mono)

    Object.entries(currentTheme.borderRadius).forEach(([key, value]) => {
      root.style.setProperty(`--radius-${key}`, value)
    })

    root.style.setProperty('--spacing-scale', currentTheme.spacing.scale.toString())

    // Apply theme class to body
    document.body.className = document.body.className.replace(/theme-\w+/g, '')
    document.body.classList.add(`theme-${currentTheme.id}`)
  }, [currentTheme])

  return (
    <div className="h-screen w-full overflow-hidden">
      {/* Desktop background interface */}
      <DesktopInterface />

      {/* Navigation sidebar */}
      <Sidebar />

      {/* Multi-popup manager system */}
      <PopupManager />

      {/* Collaboration chat system */}
      <CollaborationChat />

      {/* Collaboration modals */}
      <CreateSessionModal 
        isOpen={inviteModalOpen} 
        onClose={() => setInviteModalOpen(false)} 
      />
      <JoinSessionModal 
        isOpen={joinModalOpen} 
        onClose={() => setJoinModalOpen(false)} 
      />

      {/* Phase 8 Components */}
      <EnhancedSettings
        isOpen={showEnhancedSettings}
        onClose={() => setShowEnhancedSettings(false)}
      />
      
      <AccessibilityPanel
        isOpen={showAccessibilityPanel}
        onClose={() => setShowAccessibilityPanel(false)}
      />

      <Phase8Completion
        isOpen={showPhase8Completion}
        onClose={() => setShowPhase8Completion(false)}
      />

      {/* Performance Monitor */}
      <PerformanceMonitor />

      {/* Keyboard shortcuts help */}
      <KeyboardShortcutsHelp />
    </div>
  )
}

export default App
