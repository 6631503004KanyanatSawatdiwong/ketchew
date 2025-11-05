import { useEffect, useState } from 'react'
import DesktopInterface from './components/DesktopInterface'
import Sidebar from './components/Sidebar'
import PopupManager from './components/PopupManager'
import { CollaborationChat } from './components/CollaborationChat'
import { CollaborationHeader } from './components/CollaborationHeader'
import { CreateSessionModal } from './components/CreateSessionModal'
import { JoinSessionModal } from './components/JoinSessionModal'
import { InviteLinkModal } from './components/InviteLinkModal'
import { AvatarSelectorModal } from './components/AvatarSelectorModal'
import EnhancedSettings from './components/EnhancedSettings'
import AccessibilityPanel from './components/AccessibilityPanel'

import { migrateTodoData, isMigrationNeeded } from './utils/migration'
import { useThemeStore } from './stores/themeStore'
import { useCollaborationStore, initializeCollaboration } from './stores/collaborationStore'
import { BACKGROUND_LIBRARY } from './data/backgroundLibrary'

function App() {
  // Phase 8 modal states
  const [showEnhancedSettings, setShowEnhancedSettings] = useState(false)
  const [showAccessibilityPanel, setShowAccessibilityPanel] = useState(false)
  const [joinSessionId, setJoinSessionId] = useState('')

  // Initialize theme system
  const { currentTheme } = useThemeStore()

  // Initialize collaboration system
  const {
    inviteModalOpen,
    joinModalOpen,
    inviteLinkModalOpen,
    avatarSelectorOpen,
    currentSession,
    setInviteModalOpen,
    setJoinModalOpen,
    setInviteLinkModalOpen,
    setAvatarSelectorOpen,
  } = useCollaborationStore()

  // Initialize collaboration connection
  useEffect(() => {
    initializeCollaboration()

    // Check for join session in URL
    const urlParams = new URLSearchParams(window.location.search)
    const sessionIdFromUrl = urlParams.get('join')
    if (sessionIdFromUrl) {
      setJoinSessionId(sessionIdFromUrl)
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

  // Initialize default background - show tomato background on first load ONLY if no background is saved
  useEffect(() => {
    const tomatoBackground = BACKGROUND_LIBRARY.find(bg => bg.id === 'tomato-default')

    if (tomatoBackground) {
      const savedBackground = localStorage.getItem('selectedBackground')

      // Always ensure a background is applied - use tomato as default for first-time visitors
      if (!savedBackground) {
        // First time visitor - set tomato as default
        console.log('Setting default tomato background for first-time visitor')
        document.body.style.backgroundImage = `url(${tomatoBackground.imageUrl})`
        document.body.style.backgroundSize = 'cover'
        document.body.style.backgroundPosition = 'center'
        document.body.style.backgroundRepeat = 'no-repeat'
        document.body.style.backgroundAttachment = 'fixed'
        localStorage.setItem('selectedBackground', 'tomato-default')
      } else {
        // Check if saved background exists in library
        const savedBg = BACKGROUND_LIBRARY.find(bg => bg.id === savedBackground)
        if (savedBg) {
          // Apply the saved background
          console.log('Applying saved background:', savedBackground)
          document.body.style.backgroundImage = `url(${savedBg.imageUrl})`
          document.body.style.backgroundSize = 'cover'
          document.body.style.backgroundPosition = 'center'
          document.body.style.backgroundRepeat = 'no-repeat'
          document.body.style.backgroundAttachment = 'fixed'
        } else {
          // Saved background doesn't exist in library, fall back to tomato
          console.log('Saved background not found, falling back to tomato')
          document.body.style.backgroundImage = `url(${tomatoBackground.imageUrl})`
          document.body.style.backgroundSize = 'cover'
          document.body.style.backgroundPosition = 'center'
          document.body.style.backgroundRepeat = 'no-repeat'
          document.body.style.backgroundAttachment = 'fixed'
          localStorage.setItem('selectedBackground', 'tomato-default')
        }
      }
    } else {
      console.error('Tomato background not found in library')
    }
  }, [])

  // Auto-open timer popup on first load so screen doesn't look empty
  useEffect(() => {
    // Small delay to ensure PopupManager is mounted and API is available
    const timer = setTimeout(() => {
      const popupManager = (
        window as unknown as {
          ketchewPopupManager?: {
            openPopup: (type: string) => string | null
            isPopupOpen: (type: string) => boolean
          }
        }
      ).ketchewPopupManager
      if (popupManager && !popupManager.isPopupOpen('timer')) {
        popupManager.openPopup('timer')
      }
    }, 100)

    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="h-screen w-full overflow-hidden">
      {/* Desktop background interface */}
      <DesktopInterface />

      {/* Navigation sidebar */}
      <Sidebar />

      {/* Multi-popup manager system */}
      <PopupManager />

      {/* Collaboration header in top-right */}
      <CollaborationHeader />

      {/* Collaboration chat system */}
      <CollaborationChat />

      {/* Collaboration modals */}
      <CreateSessionModal isOpen={inviteModalOpen} onClose={() => setInviteModalOpen(false)} />
      <JoinSessionModal
        isOpen={joinModalOpen}
        onClose={() => {
          setJoinModalOpen(false)
          setJoinSessionId('')
        }}
        initialSessionId={joinSessionId}
      />
      <InviteLinkModal
        isOpen={inviteLinkModalOpen}
        onClose={() => setInviteLinkModalOpen(false)}
        sessionId={currentSession?.id || ''}
      />
      <AvatarSelectorModal
        isOpen={avatarSelectorOpen}
        onClose={() => setAvatarSelectorOpen(false)}
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
    </div>
  )
}

export default App
