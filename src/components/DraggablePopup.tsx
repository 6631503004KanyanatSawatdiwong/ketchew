import React, { useRef, useCallback, useEffect } from 'react'
import { PopupInstance } from '../types'

interface DraggablePopupProps {
  popup: PopupInstance
  children: React.ReactNode
  onDrag: (popupId: string, position: { x: number; y: number }) => void
  onDragEnd: (popupId: string) => void
  onFocus: (popupId: string) => void
  onClose: (popupId: string) => void
  onMinimize: (popupId: string) => void
  onResize: (popupId: string, size: { width: number; height: number }) => void
}

const DraggablePopup: React.FC<DraggablePopupProps> = ({
  popup,
  children,
  onDrag,
  onDragEnd,
  onFocus,
  onClose,
  onMinimize,
  // onResize, // TODO: Implement resize functionality
}) => {
  const popupRef = useRef<HTMLDivElement>(null)
  const headerRef = useRef<HTMLDivElement>(null)
  const isDraggingRef = useRef(false)
  const dragOffsetRef = useRef({ x: 0, y: 0 })

  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      if (!headerRef.current || !popupRef.current) return

      // Only start drag if clicking on header, not on buttons
      const target = e.target as HTMLElement
      if (target.closest('.popup-control-button')) return

      isDraggingRef.current = true
      onFocus(popup.id)

      const rect = popupRef.current.getBoundingClientRect()
      dragOffsetRef.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      }

      e.preventDefault()
    },
    [popup.id, onFocus]
  )

  // Global mouse event handlers
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDraggingRef.current) return

      const viewportWidth = window.innerWidth
      const viewportHeight = window.innerHeight
      const popupWidth = popup.size.width
      const popupHeight = popup.size.height

      // Calculate new position with viewport constraints
      let newX = e.clientX - dragOffsetRef.current.x
      let newY = e.clientY - dragOffsetRef.current.y

      // Constrain to viewport boundaries
      newX = Math.max(0, Math.min(newX, viewportWidth - popupWidth))
      newY = Math.max(0, Math.min(newY, viewportHeight - popupHeight))

      onDrag(popup.id, { x: newX, y: newY })
    }

    const handleMouseUp = () => {
      if (isDraggingRef.current) {
        isDraggingRef.current = false
        onDragEnd(popup.id)
      }
    }

    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseup', handleMouseUp)

    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
    }
  }, [popup.id, popup.size.width, popup.size.height, onDrag, onDragEnd])

  const handleClick = useCallback(() => {
    onFocus(popup.id)
  }, [popup.id, onFocus])

  const getPopupTitle = () => {
    switch (popup.type) {
      case 'timer':
        return 'Pomodoro Timer'
      case 'tasks':
        return 'Task List'
      case 'notes':
        return 'Notes'
      case 'background':
        return 'Background'
      case 'audio':
        return 'Audio Settings'
      default:
        return 'Popup'
    }
  }

  return (
    <div
      ref={popupRef}
      className={`popup-window bg-white dark:bg-gray-900 ${popup.isDragging ? 'dragging' : ''} ${
        popup.isMinimized ? 'minimized' : ''
      }`}
      style={{
        position: 'absolute',
        left: popup.position.x,
        top: popup.position.y,
        width: popup.isMinimized ? 'auto' : popup.size.width,
        height: popup.isMinimized ? 'auto' : popup.size.height,
        zIndex: popup.zIndex,
        borderRadius: 'var(--radius-2xl)',
        boxShadow: popup.isDragging
          ? '0 32px 64px -12px rgba(0, 0, 0, 0.35)'
          : '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
        pointerEvents: 'auto',
        minWidth: popup.isMinimized ? '200px' : '320px',
        minHeight: popup.isMinimized ? '40px' : '200px',
        transform: popup.isDragging ? 'scale(1.02)' : 'scale(1)',
        transition: popup.isDragging ? 'none' : 'transform 0.2s ease, box-shadow 0.2s ease',
        resize: popup.isMinimized ? 'none' : 'both',
        overflow: 'hidden',
      }}
      onClick={handleClick}
    >
      {/* Popup Header */}
      <div
        ref={headerRef}
        className="popup-header bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700"
        style={{
          cursor: 'grab',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          userSelect: 'none',
          padding: '12px 16px',
          borderBottom: popup.isMinimized ? 'none' : undefined,
          borderTopLeftRadius: 'var(--radius-2xl)',
          borderTopRightRadius: 'var(--radius-2xl)',
        }}
        onMouseDown={handleMouseDown}
      >
        <div className="flex items-center gap-2">
          <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
            {getPopupTitle()}
          </div>
        </div>

        <div className="flex items-center gap-1">
          {/* Minimize Button */}
          <button
            className="popup-control-button hover:bg-yellow-100 dark:hover:bg-yellow-800 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-yellow-600 dark:text-yellow-400"
            onClick={e => {
              e.stopPropagation()
              onMinimize(popup.id)
            }}
            title={popup.isMinimized ? 'Restore' : 'Minimize'}
          >
            {popup.isMinimized ? '□' : '−'}
          </button>

          {/* Close Button */}
          <button
            className="popup-control-button hover:bg-red-100 dark:hover:bg-red-800 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-red-600 dark:text-red-400"
            onClick={e => {
              e.stopPropagation()
              onClose(popup.id)
            }}
            title="Close"
          >
            ×
          </button>
        </div>
      </div>

      {/* Popup Content */}
      {!popup.isMinimized && (
        <div
          className="popup-content"
          style={{
            padding: '16px',
            height: 'calc(100% - 49px)',
            overflow: 'auto',
          }}
        >
          {children}
        </div>
      )}
    </div>
  )
}

export default DraggablePopup
