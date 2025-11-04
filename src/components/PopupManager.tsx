import React, { useState, useCallback, useEffect } from 'react'
import { PopupInstance, PopupType } from '../types'
import DraggablePopup from './DraggablePopup'
import PomodoroTimer from './PomodoroTimer'
import TodoList from './TodoList'
import SoundSelector from './SoundSelector'
import BackgroundSelector from './BackgroundSelector'

interface PopupManagerProps {
  onPopupStateChange?: (popups: PopupInstance[]) => void
}

const PopupManager: React.FC<PopupManagerProps> = ({ onPopupStateChange }) => {
  const [popups, setPopups] = useState<PopupInstance[]>([])
  const [maxZIndex, setMaxZIndex] = useState(1000)

  // Load popup state from sessionStorage on mount
  useEffect(() => {
    const savedPopups = sessionStorage.getItem('ketchew-popup-state')
    if (savedPopups) {
      try {
        const parsedPopups = JSON.parse(savedPopups) as PopupInstance[]
        setPopups(parsedPopups)
        const highestZ = Math.max(...parsedPopups.map(p => p.zIndex), 1000)
        setMaxZIndex(highestZ)
      } catch (error) {
        console.warn('Failed to restore popup state:', error)
      }
    }
  }, [])

  // Save popup state to sessionStorage whenever it changes
  useEffect(() => {
    if (popups.length > 0) {
      sessionStorage.setItem('ketchew-popup-state', JSON.stringify(popups))
    } else {
      sessionStorage.removeItem('ketchew-popup-state')
    }
    onPopupStateChange?.(popups)
  }, [popups, onPopupStateChange])

  const generatePopupId = useCallback(() => {
    return `popup-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`
  }, [])

  const calculateCascadePosition = useCallback((index: number) => {
    const baseX = 100
    const baseY = 100
    const offset = 30

    return {
      x: baseX + index * offset,
      y: baseY + index * offset,
    }
  }, [])

  const openPopup = useCallback(
    (type: Exclude<PopupType, null>) => {
      // Check if popup of this type already exists
      const existingPopup = popups.find(p => p.type === type)
      if (existingPopup) {
        // Bring existing popup to front
        const newZIndex = maxZIndex + 1
        setPopups(prev =>
          prev.map(p => (p.id === existingPopup.id ? { ...p, zIndex: newZIndex } : p))
        )
        setMaxZIndex(newZIndex)
        return existingPopup.id
      }

      // Check maximum popup limit
      if (popups.length >= 5) {
        console.warn('Maximum number of popups (5) reached')
        return null
      }

      const newZIndex = maxZIndex + 1
      const position = calculateCascadePosition(popups.length)

      // Default sizes for different popup types
      const getDefaultSize = (popupType: Exclude<PopupType, null>) => {
        switch (popupType) {
          case 'timer':
            return { width: 484, height: 250 } // 440 + 10% = 484px, minimum height of 250px
          case 'tasks':
            return { width: 250, height: 300 } // Reduced width for more compact layout
          case 'sound':
            return { width: 280, height: 320 } // Compact size with scrolling
          case 'background':
            return { width: 600, height: 450 }
          default:
            return { width: 400, height: 300 }
        }
      }

      const newPopup: PopupInstance = {
        id: generatePopupId(),
        type,
        position,
        size: getDefaultSize(type),
        isMinimized: false,
        zIndex: newZIndex,
        isDragging: false,
        isResizing: false,
      }

      setPopups(prev => [...prev, newPopup])
      setMaxZIndex(newZIndex)

      return newPopup.id
    },
    [popups, maxZIndex, generatePopupId, calculateCascadePosition]
  )

  const closePopup = useCallback((popupId: string) => {
    setPopups(prev => prev.filter(p => p.id !== popupId))
  }, [])

  const focusPopup = useCallback(
    (popupId: string) => {
      const newZIndex = maxZIndex + 1
      setPopups(prev => prev.map(p => (p.id === popupId ? { ...p, zIndex: newZIndex } : p)))
      setMaxZIndex(newZIndex)
    },
    [maxZIndex]
  )

  const minimizePopup = useCallback((popupId: string) => {
    setPopups(prev => prev.map(p => (p.id === popupId ? { ...p, isMinimized: !p.isMinimized } : p)))
  }, [])

  const updatePopupPosition = useCallback((popupId: string, position: { x: number; y: number }) => {
    setPopups(prev =>
      prev.map(p =>
        p.id === popupId ? { ...p, position, isDragging: true } : { ...p, isDragging: false }
      )
    )
  }, [])

  const handleDragEnd = useCallback((popupId: string) => {
    setPopups(prev => prev.map(p => (p.id === popupId ? { ...p, isDragging: false } : p)))
  }, [])

  const updatePopupSize = useCallback(
    (popupId: string, size: { width: number; height: number }) => {
      setPopups(prev => prev.map(p => (p.id === popupId ? { ...p, size } : p)))
    },
    []
  )

  const cascadePopups = useCallback(() => {
    setPopups(prev =>
      prev.map((popup, index) => ({
        ...popup,
        position: calculateCascadePosition(index),
      }))
    )
  }, [calculateCascadePosition])

  const clearSavedState = useCallback(() => {
    sessionStorage.removeItem('ketchew-popup-state')
    setPopups([])
    console.log('Popup state cleared - new popups will use default sizes')
  }, [])

  const renderPopupContent = useCallback((popup: PopupInstance) => {
    switch (popup.type) {
      case 'timer':
        return <PomodoroTimer />
      case 'tasks':
        return <TodoList />
      case 'sound':
        return <SoundSelector />
      case 'background':
        return <BackgroundSelector />
      default:
        return <div>Unknown popup type</div>
    }
  }, [])

  // Expose popup manager functions globally for sidebar access
  useEffect(() => {
    interface PopupManagerAPI {
      openPopup: (type: string) => string | null
      closePopup: (id: string) => void
      focusPopup: (id: string) => void
      minimizePopup: (id: string) => void
      cascadePopups: () => void
      getOpenPopups: () => PopupInstance[]
      isPopupOpen: (type: string) => boolean
      clearSavedState: () => void
      updatePopupSize: (id: string, size: { width: number; height: number }) => void
    }

    const api: PopupManagerAPI = {
      openPopup: (type: string) => openPopup(type as Exclude<PopupType, null>),
      closePopup,
      focusPopup,
      minimizePopup,
      cascadePopups,
      getOpenPopups: () => popups,
      isPopupOpen: (type: string) => popups.some(p => p.type === type),
      clearSavedState,
      updatePopupSize,
    }

    ;(window as unknown as { ketchewPopupManager: PopupManagerAPI }).ketchewPopupManager = api

    return () => {
      delete (window as unknown as { ketchewPopupManager?: PopupManagerAPI }).ketchewPopupManager
    }
  }, [
    openPopup,
    closePopup,
    focusPopup,
    minimizePopup,
    cascadePopups,
    clearSavedState,
    updatePopupSize,
    popups,
  ])

  return (
    <div className="popup-manager">
      {popups.map(popup => (
        <DraggablePopup
          key={popup.id}
          popup={popup}
          onDrag={updatePopupPosition}
          onDragEnd={handleDragEnd}
          onFocus={focusPopup}
          onResize={updatePopupSize}
        >
          {renderPopupContent(popup)}
        </DraggablePopup>
      ))}
    </div>
  )
}

export default PopupManager
