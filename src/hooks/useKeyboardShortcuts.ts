import { useEffect } from 'react'
import { PopupType } from '../types'

interface UseKeyboardShortcutsProps {
  onTogglePopup?: (type: Exclude<PopupType, null>) => void
}

const useKeyboardShortcuts = ({ onTogglePopup }: UseKeyboardShortcutsProps = {}) => {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Check for Ctrl/Cmd modifier
      const isModifierPressed = event.ctrlKey || event.metaKey

      if (!isModifierPressed) return

      interface PopupManagerAPI {
        openPopup: (type: string) => string | null
        getOpenPopups: () => Array<{ type: string; id: string; zIndex: number }>
        closePopup: (id: string) => void
        cascadePopups: () => void
      }

      const popupManager = (window as unknown as { ketchewPopupManager?: PopupManagerAPI })
        .ketchewPopupManager

      switch (event.key) {
        case '1':
          event.preventDefault()
          if (popupManager) {
            popupManager.openPopup('timer')
          } else if (onTogglePopup) {
            onTogglePopup('timer')
          }
          break

        case '2':
          event.preventDefault()
          if (popupManager) {
            popupManager.openPopup('tasks')
          } else if (onTogglePopup) {
            onTogglePopup('tasks')
          }
          break

        case '3':
          event.preventDefault()
          if (popupManager) {
            popupManager.openPopup('notes')
          } else if (onTogglePopup) {
            onTogglePopup('notes')
          }
          break

        case '4':
          event.preventDefault()
          if (popupManager) {
            popupManager.openPopup('background')
          } else if (onTogglePopup) {
            onTogglePopup('background')
          }
          break

        case '5':
          event.preventDefault()
          if (popupManager) {
            popupManager.openPopup('audio')
          } else if (onTogglePopup) {
            onTogglePopup('audio')
          }
          break

        case 'w':
        case 'W':
          // Close focused popup
          event.preventDefault()
          if (popupManager) {
            const openPopups = popupManager.getOpenPopups()
            if (openPopups.length > 0) {
              // Find the popup with highest z-index (most recently focused)
              const focusedPopup = openPopups.reduce((prev, current) =>
                current.zIndex > prev.zIndex ? current : prev
              )
              popupManager.closePopup(focusedPopup.id)
            }
          }
          break

        case 'c':
        case 'C':
          // Cascade all open popups
          event.preventDefault()
          if (popupManager) {
            popupManager.cascadePopups()
          }
          break

        default:
          break
      }
    }

    document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [onTogglePopup])
}

export default useKeyboardShortcuts
