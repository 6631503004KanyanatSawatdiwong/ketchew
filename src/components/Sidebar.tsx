import React, { useState, useEffect, useMemo } from 'react'
import {
  Timer,
  CheckSquare,
  FileText,
  Image,
  Volume2,
  Palette,
  Layers,
  Settings,
  Video,
  Users,
  TrendingUp,
  Sliders,
} from 'lucide-react'
import { PopupType } from '../types'
import { useCollaborationStore } from '../stores/collaborationStore'

interface SidebarProps {
  // Props can be added here in the future if needed
  className?: string
}

const Sidebar: React.FC<SidebarProps> = () => {
  const [openPopups, setOpenPopups] = useState<string[]>([])
  
  // Collaboration store
  const { 
    isInSession, 
    isConnected, 
    currentSession, 
    setInviteModalOpen, 
    setJoinModalOpen 
  } = useCollaborationStore()

  const tabs = useMemo(
    () => [
      { id: 'timer' as const, icon: Timer, label: 'Timer' },
      { id: 'tasks' as const, icon: CheckSquare, label: 'Tasks' },
      { id: 'notes' as const, icon: FileText, label: 'Notes' },
      { id: 'background' as const, icon: Image, label: 'Background' },
      { id: 'audio' as const, icon: Volume2, label: 'Audio' },
      { id: 'mixer' as const, icon: Layers, label: 'Audio Mixer' },
      { id: 'theme' as const, icon: Palette, label: 'Theme' },
      { id: 'visual' as const, icon: Sliders, label: 'Visual' },
      { id: 'analytics' as const, icon: TrendingUp, label: 'Analytics' },
      { id: 'settings' as const, icon: Settings, label: 'Settings' },
    ],
    []
  )

  // Check for popup manager availability and update open popups state
  useEffect(() => {
    const checkOpenPopups = () => {
      const popupManager = (
        window as unknown as {
          ketchewPopupManager?: {
            isPopupOpen: (type: string) => boolean
            getOpenPopups: () => Array<{ type: string; id: string }>
            openPopup: (type: string) => void
            closePopup: (id: string) => void
            cascadePopups: () => void
          }
        }
      ).ketchewPopupManager

      if (popupManager) {
        const openTypes = tabs.map(tab => tab.id).filter(type => popupManager.isPopupOpen(type))
        setOpenPopups(openTypes)
      }
    }

    // Initial check
    checkOpenPopups()

    // Set up periodic checking for popup state changes
    const interval = setInterval(checkOpenPopups, 500)

    return () => clearInterval(interval)
  }, [tabs])

  const handlePopupToggle = (popupType: Exclude<PopupType, null>) => {
    const popupManager = (
      window as unknown as {
        ketchewPopupManager?: {
          isPopupOpen: (type: string) => boolean
          getOpenPopups: () => Array<{ type: string; id: string }>
          openPopup: (type: string) => void
          closePopup: (id: string) => void
        }
      }
    ).ketchewPopupManager

    if (!popupManager) {
      console.warn('PopupManager not available')
      return
    }

    if (popupManager.isPopupOpen(popupType)) {
      // If popup is open, close it
      const openPopups = popupManager.getOpenPopups()
      const popup = openPopups.find(p => p.type === popupType)
      if (popup) {
        popupManager.closePopup(popup.id)
      }
    } else {
      // If popup is closed, open it
      popupManager.openPopup(popupType)
    }
  }

  const isPopupOpen = (popupType: string) => openPopups.includes(popupType)

  return (
    <div className="fixed left-4 top-1/2 transform -translate-y-1/2 z-40">
      <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-2">
        {/* Collaboration Controls */}
        <div className="flex flex-col gap-1 mb-2 pb-2 border-b border-gray-200 dark:border-gray-700">
          <button
            onClick={() => setInviteModalOpen(true)}
            disabled={!isConnected}
            className={`p-3 rounded-lg transition-all duration-200 group relative ${
              isInSession
                ? 'bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300'
                : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-gray-100 disabled:opacity-50 disabled:cursor-not-allowed'
            }`}
            title={isInSession ? 'In Session' : 'Start Session'}
          >
            <Video size={20} />
            
            {/* Session indicator */}
            {isInSession && (
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white animate-pulse"></div>
            )}
            
            {/* Participant count */}
            {isInSession && currentSession && (
              <div className="absolute -bottom-1 -right-1 bg-blue-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                {currentSession.participants.length}
              </div>
            )}

            {/* Tooltip */}
            <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
              {isInSession ? 'Session Active' : 'Start Session'}
            </div>
          </button>

          <button
            onClick={() => setJoinModalOpen(true)}
            disabled={!isConnected || isInSession}
            className="p-3 rounded-lg transition-all duration-200 group relative text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
            title="Join Session"
          >
            <Users size={20} />

            {/* Tooltip */}
            <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
              Join Session
            </div>
          </button>
        </div>

        {/* Main App Controls */}
        <div className="flex flex-col gap-1">
          {tabs.map(({ id, icon: Icon, label }) => (
            <button
              key={id}
              onClick={() => handlePopupToggle(id)}
              className={`p-3 rounded-lg transition-all duration-200 group relative ${
                isPopupOpen(id)
                  ? 'bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 shadow-md'
                  : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-gray-100'
              }`}
              title={`${isPopupOpen(id) ? 'Close' : 'Open'} ${label}`}
            >
              <Icon size={20} />

              {/* Active indicator */}
              {isPopupOpen(id) && (
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
              )}

              {/* Tooltip */}
              <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                {isPopupOpen(id) ? `Close ${label}` : `Open ${label}`}
              </div>
            </button>
          ))}
        </div>

        {/* Additional controls */}
        <div className="mt-2 pt-2 border-t border-gray-200 dark:border-gray-700 space-y-2">
          <button
            onClick={() => {
              const popupManager = (
                window as unknown as {
                  ketchewPopupManager?: {
                    cascadePopups: () => void
                  }
                }
              ).ketchewPopupManager
              if (popupManager) {
                popupManager.cascadePopups()
              }
            }}
            className="w-full p-2 text-xs text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 rounded transition-colors"
            title="Cascade Windows"
          >
            Cascade
          </button>
        </div>
      </div>
    </div>
  )
}

export default Sidebar
