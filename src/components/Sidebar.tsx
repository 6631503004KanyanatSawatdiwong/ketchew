import React, { useState, useEffect, useMemo } from 'react'
import { PopupType } from '../types'
import logoImage from '../images/logo.png'
import ketchewText from '../images/ketchewText.png'
import screenInactive from '../images/icons/screenInactive.png'
import screenActive from '../images/icons/screenActive.png'
import soundInactive from '../images/icons/soundsInactive.png'
import soundActive from '../images/icons/soundsActive.png'
import taskaInactive from '../images/icons/tasksInactive.png'
import taskaActive from '../images/icons/tasksActive.png'
import timeInactive from '../images/icons/timeInactive.png'
import timeActive from '../images/icons/timeActive.png'

interface SidebarProps {
  // Props can be added here in the future if needed
  className?: string
}

const Sidebar: React.FC<SidebarProps> = () => {
  const [openPopups, setOpenPopups] = useState<string[]>([])

  const tabs = useMemo(
    () => [
      { id: 'timer' as const, iconActive: timeActive, iconInactive: timeInactive, label: 'Timer' },
      {
        id: 'tasks' as const,
        iconActive: taskaActive,
        iconInactive: taskaInactive,
        label: 'Tasks',
      },
      {
        id: 'sound' as const,
        iconActive: soundActive,
        iconInactive: soundInactive,
        label: 'Sound',
      },
      {
        id: 'background' as const,
        iconActive: screenActive,
        iconInactive: screenInactive,
        label: 'Background',
      },
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

  // Handle popup toggle on button click
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
    <>
      {/* Logo Section - Fixed at top left */}
      <div className="fixed left-4 top-[60px] z-40">
        <div className="p-3">
          <div className="flex items-center gap-2">
            <img src={logoImage} alt="Ketchew Logo" className="w-10 h-10 object-contain" />
            <img src={ketchewText} alt="Ketchew" className="h-8 object-contain" />
          </div>
        </div>
      </div>

      {/* Sidebar Controls - Centered vertically */}
      <div className="fixed left-4 top-1/2 transform -translate-y-1/2 z-40">
        <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-2">
          {/* Main App Controls */}
          <div className="flex flex-col gap-1">
            {tabs.map(({ id, iconActive, iconInactive, label }) => (
              <button
                key={id}
                onClick={() => handlePopupToggle(id)}
                title={`${isPopupOpen(id) ? 'Close' : 'Open'} ${label}`}
              >
                <img
                  src={isPopupOpen(id) ? iconActive : iconInactive}
                  alt={`${label} icon`}
                  className="w-20 h-21 object-contain transition-transform duration-200 ease-in-out transform group-hover:scale-110"
                />

                {/* Tooltip */}
                <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                  {isPopupOpen(id) ? `Close ${label}` : `Open ${label}`}
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </>
  )
}

export default Sidebar
