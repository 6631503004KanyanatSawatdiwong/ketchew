import { useEffect } from 'react'
import { useNotesStore } from '../stores/notesStore'

interface PopupManagerInstance {
  isPopupOpen: (type: string) => boolean
  getOpenPopups: () => Array<{ id: string; type: string }>
  closePopup: (id: string) => void
  openPopup: (type: string) => void
}

declare global {
  interface Window {
    ketchewPopupManager?: PopupManagerInstance
  }
}
import { useAnalyticsStore } from '../stores/analyticsStore'

interface KeyboardShortcut {
  key: string
  ctrl?: boolean
  shift?: boolean
  alt?: boolean
  description: string
  action: () => void
  context?: 'global' | 'notes' | 'timer' | 'tasks' | 'analytics'
}

export const useGlobalKeyboardShortcuts = () => {
  const { createNote, selectNote, deleteNote, getFilteredNotes, selectedNoteId } = useNotesStore()

  const { exportData } = useAnalyticsStore()

  const shortcuts: KeyboardShortcut[] = [
    // Global shortcuts
    {
      key: '?',
      shift: true,
      description: 'Show keyboard shortcuts help',
      action: () => {
        const event = new CustomEvent('toggle-help')
        window.dispatchEvent(event)
      },
      context: 'global',
    },
    {
      key: 'Escape',
      description: 'Close modals and popups',
      action: () => {
        // Close any open modals
        const event = new CustomEvent('close-modals')
        window.dispatchEvent(event)
      },
      context: 'global',
    },

    // Timer shortcuts
    {
      key: ' ',
      description: 'Start/pause timer',
      action: () => {
        const event = new CustomEvent('timer-toggle')
        window.dispatchEvent(event)
      },
      context: 'timer',
    },
    {
      key: 's',
      ctrl: true,
      description: 'Skip current timer phase',
      action: () => {
        const event = new CustomEvent('timer-skip')
        window.dispatchEvent(event)
      },
      context: 'timer',
    },
    {
      key: 'r',
      ctrl: true,
      description: 'Reset timer session',
      action: () => {
        const event = new CustomEvent('timer-reset')
        window.dispatchEvent(event)
      },
      context: 'timer',
    },

    // Notes shortcuts
    {
      key: 'n',
      ctrl: true,
      description: 'Create new note',
      action: () => {
        createNote({
          title: 'New Note',
          content: '',
          category: 'general',
        })
      },
      context: 'notes',
    },
    {
      key: 's',
      ctrl: true,
      description: 'Save current note',
      action: () => {
        const event = new CustomEvent('note-save')
        window.dispatchEvent(event)
      },
      context: 'notes',
    },
    {
      key: 'Delete',
      description: 'Delete selected note',
      action: () => {
        if (selectedNoteId && confirm('Are you sure you want to delete this note?')) {
          deleteNote(selectedNoteId)
        }
      },
      context: 'notes',
    },
    {
      key: 'j',
      description: 'Next note',
      action: () => {
        const notes = getFilteredNotes()
        const currentIndex = notes.findIndex((note: { id: string }) => note.id === selectedNoteId)
        const nextNote = notes[currentIndex + 1]
        if (nextNote) {
          selectNote(nextNote.id)
        }
      },
      context: 'notes',
    },
    {
      key: 'k',
      description: 'Previous note',
      action: () => {
        const notes = getFilteredNotes()
        const currentIndex = notes.findIndex((note: { id: string }) => note.id === selectedNoteId)
        const prevNote = notes[currentIndex - 1]
        if (prevNote) {
          selectNote(prevNote.id)
        }
      },
      context: 'notes',
    },

    // Tasks shortcuts
    {
      key: 't',
      ctrl: true,
      description: 'Create new task',
      action: () => {
        const event = new CustomEvent('task-create')
        window.dispatchEvent(event)
      },
      context: 'tasks',
    },
    {
      key: 'Enter',
      ctrl: true,
      description: 'Complete selected task',
      action: () => {
        const event = new CustomEvent('task-toggle')
        window.dispatchEvent(event)
      },
      context: 'tasks',
    },

    // Analytics shortcuts
    {
      key: 'e',
      ctrl: true,
      description: 'Export analytics data',
      action: () => {
        const data = exportData('json', 'all')
        const blob = new Blob([data], { type: 'application/json' })
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `ketchew-analytics-${new Date().toISOString().split('T')[0]}.json`
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        URL.revokeObjectURL(url)
      },
      context: 'analytics',
    },

    // Popup management
    {
      key: '1',
      ctrl: true,
      description: 'Toggle Timer popup',
      action: () => {
        const popupManager = window.ketchewPopupManager
        if (popupManager) {
          if (popupManager.isPopupOpen('timer')) {
            const popup = popupManager
              .getOpenPopups()
              .find((p: { id: string; type: string }) => p.type === 'timer')
            if (popup) popupManager.closePopup(popup.id)
          } else {
            popupManager.openPopup('timer')
          }
        }
      },
      context: 'global',
    },
    {
      key: '2',
      ctrl: true,
      description: 'Toggle Tasks popup',
      action: () => {
        const popupManager = window.ketchewPopupManager
        if (popupManager) {
          if (popupManager.isPopupOpen('tasks')) {
            const popup = popupManager
              .getOpenPopups()
              .find((p: { id: string; type: string }) => p.type === 'tasks')
            if (popup) popupManager.closePopup(popup.id)
          } else {
            popupManager.openPopup('tasks')
          }
        }
      },
      context: 'global',
    },
    {
      key: '3',
      ctrl: true,
      description: 'Toggle Notes popup',
      action: () => {
        const popupManager = window.ketchewPopupManager
        if (popupManager) {
          if (popupManager.isPopupOpen('notes')) {
            const popup = popupManager
              .getOpenPopups()
              .find((p: { id: string; type: string }) => p.type === 'notes')
            if (popup) popupManager.closePopup(popup.id)
          } else {
            popupManager.openPopup('notes')
          }
        }
      },
      context: 'global',
    },
    {
      key: '4',
      ctrl: true,
      description: 'Toggle Analytics popup',
      action: () => {
        const popupManager = window.ketchewPopupManager
        if (popupManager) {
          if (popupManager.isPopupOpen('analytics')) {
            const popup = popupManager
              .getOpenPopups()
              .find((p: { id: string; type: string }) => p.type === 'analytics')
            if (popup) popupManager.closePopup(popup.id)
          } else {
            popupManager.openPopup('analytics')
          }
        }
      },
      context: 'global',
    },
    {
      key: '5',
      ctrl: true,
      description: 'Toggle Settings popup',
      action: () => {
        const popupManager = window.ketchewPopupManager
        if (popupManager) {
          if (popupManager.isPopupOpen('settings')) {
            const popup = popupManager
              .getOpenPopups()
              .find((p: { id: string; type: string }) => p.type === 'settings')
            if (popup) popupManager.closePopup(popup.id)
          } else {
            popupManager.openPopup('settings')
          }
        }
      },
      context: 'global',
    },
  ]

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Don't trigger shortcuts when typing in inputs
      if (
        event.target instanceof HTMLInputElement ||
        event.target instanceof HTMLTextAreaElement ||
        event.target instanceof HTMLSelectElement ||
        (event.target as HTMLElement)?.contentEditable === 'true'
      ) {
        // Allow certain shortcuts even in input fields
        const allowedInInputs = ['Escape', 's', 'n']
        if (!allowedInInputs.includes(event.key)) {
          return
        }
      }

      const matchingShortcut = shortcuts.find(shortcut => {
        return (
          shortcut.key === event.key &&
          !!shortcut.ctrl === event.ctrlKey &&
          !!shortcut.shift === event.shiftKey &&
          !!shortcut.alt === event.altKey
        )
      })

      if (matchingShortcut) {
        event.preventDefault()
        event.stopPropagation()
        matchingShortcut.action()
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [shortcuts])

  return shortcuts
}

// Hook to get shortcuts for help display
export const useKeyboardShortcutsHelp = () => {
  const shortcuts = useGlobalKeyboardShortcuts()

  const formatShortcut = (shortcut: KeyboardShortcut): string => {
    const keys = []
    if (shortcut.ctrl) keys.push('Ctrl')
    if (shortcut.shift) keys.push('Shift')
    if (shortcut.alt) keys.push('Alt')
    keys.push(shortcut.key === ' ' ? 'Space' : shortcut.key)
    return keys.join(' + ')
  }

  const groupedShortcuts = shortcuts.reduce(
    (groups, shortcut) => {
      const context = shortcut.context || 'global'
      if (!groups[context]) {
        groups[context] = []
      }
      groups[context].push({
        keys: formatShortcut(shortcut),
        description: shortcut.description,
      })
      return groups
    },
    {} as Record<string, Array<{ keys: string; description: string }>>
  )

  return groupedShortcuts
}
