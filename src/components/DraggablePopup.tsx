import React, { useRef, useCallback, useEffect } from 'react'
import { PopupInstance } from '../types'
import { X, Minus } from 'lucide-react'

interface DraggablePopupProps {
  popup: PopupInstance
  children: React.ReactNode
  onDrag: (popupId: string, position: { x: number; y: number }) => void
  onDragEnd: (popupId: string) => void
  onFocus: (popupId: string) => void
  onClose: (popupId: string) => void
  onMinimize: (popupId: string) => void
  onResize?: (popupId: string, size: { width: number; height: number }) => void
}

const DraggablePopup: React.FC<DraggablePopupProps> = ({
  popup,
  children,
  onDrag,
  onDragEnd,
  onFocus,
  onClose,
  onMinimize,
}) => {
  const popupRef = useRef<HTMLDivElement>(null)

  const handleMouseDown = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (e.button !== 0) return // Only handle left mouse button

      const rect = popupRef.current?.getBoundingClientRect()
      if (!rect) return

      const startX = e.clientX - rect.left
      const startY = e.clientY - rect.top

      onFocus(popup.id)

      const handleMouseMove = (e: MouseEvent) => {
        const newX = e.clientX - startX
        const newY = e.clientY - startY

        onDrag(popup.id, { x: newX, y: newY })
      }

      const handleMouseUp = () => {
        document.removeEventListener('mousemove', handleMouseMove)
        document.removeEventListener('mouseup', handleMouseUp)
        onDragEnd(popup.id)
      }

      document.addEventListener('mousemove', handleMouseMove)
      document.addEventListener('mouseup', handleMouseUp)

      e.preventDefault()
    },
    [popup.id, onDrag, onDragEnd, onFocus]
  )

  useEffect(() => {
    const handleGlobalMouseDown = (e: MouseEvent) => {
      if (popupRef.current && !popupRef.current.contains(e.target as Node)) {
        return
      }
      onFocus(popup.id)
    }

    document.addEventListener('mousedown', handleGlobalMouseDown)
    return () => {
      document.removeEventListener('mousedown', handleGlobalMouseDown)
    }
  }, [popup.id, onFocus])

  const handleClick = useCallback(() => {
    onFocus(popup.id)
  }, [popup.id, onFocus])

  const getPopupTitle = () => {
    switch (popup.type) {
      case 'timer':
        return 'Pomodoro Timer'
      case 'tasks':
        return 'Tasks'
      case 'notes':
        return 'Notes'
      case 'background':
        return 'Background'
      case 'collaboration':
        return 'Collaboration'
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
        border: '1px solid #e5e7eb',
        borderRadius: '8px',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
        overflow: 'hidden',
        userSelect: 'none',
      }}
      onClick={handleClick}
    >
      {/* Header */}
      <div
        className="popup-header bg-gray-50 dark:bg-gray-800 px-4 py-2 border-b border-gray-200 dark:border-gray-700 cursor-move flex items-center justify-between"
        onMouseDown={handleMouseDown}
      >
        <h3 className="text-sm font-medium text-gray-900 dark:text-white">{getPopupTitle()}</h3>
        <div className="flex items-center space-x-1">
          <button
            onClick={e => {
              e.stopPropagation()
              onMinimize(popup.id)
            }}
            className="p-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded"
          >
            <Minus size={14} className="text-gray-500 dark:text-gray-400" />
          </button>
          <button
            onClick={e => {
              e.stopPropagation()
              onClose(popup.id)
            }}
            className="p-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded"
          >
            <X size={14} className="text-gray-500 dark:text-gray-400" />
          </button>
        </div>
      </div>

      {/* Content */}
      {!popup.isMinimized && <div className="popup-content p-4 overflow-auto">{children}</div>}
    </div>
  )
}

export default DraggablePopup
