import { useEffect, useState } from 'react'
import DesktopInterface from './components/DesktopInterface'
import Sidebar from './components/Sidebar'
import PopupManager from './components/PopupManager'
import { CollaborationChat } from './components/CollaborationChat'
import { CreateSessionModal } from './components/CreateSessionModal'
import { JoinSessionModal } from './components/JoinSessionModal'
import EnhancedSettings from './components/EnhancedSettings'
import AccessibilityPanel from './components/AccessibilityPanel'
import PerformanceMonitor from './components/PerformanceMonitor'
import Phase8Completion from './components/Phase8Completion'

import { migrateTodoData, isMigrationNeeded } from './utils/migration'
import { useThemeStore } from './stores/themeStore'
import { useCollaborationStore, initializeCollaboration } from './stores/collaborationStore'
import { BACKGROUND_LIBRARY } from './data/backgroundLibrary'

function App() {
  // Phase 8 modal states
  const [showEnhancedSettings, setShowEnhancedSettings] = useState(false)
  const [showAccessibilityPanel, setShowAccessibilityPanel] = useState(false)
  const [showPhase8Completion, setShowPhase8Completion] = useState(false)

  // Initialize theme system
  const { currentTheme } = useThemeStore()

  // Initialize collaboration system
  const { inviteModalOpen, joinModalOpen, setInviteModalOpen, setJoinModalOpen } =
    useCollaborationStore()

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

  // Initialize default background
  useEffect(() => {
    const savedBackground = localStorage.getItem('selectedBackground')
    if (!savedBackground) {
      // Set a default background - use the first minimalist background
      const defaultBg =
        BACKGROUND_LIBRARY.find(bg => bg.category === 'minimalist') || BACKGROUND_LIBRARY[0]
      if (defaultBg) {
        localStorage.setItem('selectedBackground', JSON.stringify(defaultBg.id))
        document.body.style.backgroundImage = `url(${defaultBg.imageUrl})`
        document.body.style.backgroundSize = 'cover'
        document.body.style.backgroundPosition = 'center'
        document.body.style.backgroundRepeat = 'no-repeat'
        document.body.style.backgroundAttachment = 'fixed'
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

      {/* Collaboration chat system */}
      <CollaborationChat />

      {/* Collaboration modals */}
      <CreateSessionModal isOpen={inviteModalOpen} onClose={() => setInviteModalOpen(false)} />
      <JoinSessionModal isOpen={joinModalOpen} onClose={() => setJoinModalOpen(false)} />

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
    </div>
  )
}

export default App
