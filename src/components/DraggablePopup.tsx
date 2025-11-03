import React, { useRef, useCallback, useEffect } from 'react'
import { PopupInstance } from '../types'

interface DraggablePopupProps {
  popup: PopupInstance
  children: React.ReactNode
  onDrag: (popupId: string, position: { x: number; y: number }) => void
  onDragEnd: (popupId: string) => void
  onFocus: (popupId: string) => void
  onResize?: (popupId: string, size: { width: number; height: number }) => void
}

const DraggablePopup: React.FC<DraggablePopupProps> = ({
  popup,
  children,
  onDrag,
  onDragEnd,
  onFocus,
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

  return (
    <div
      ref={popupRef}
      className={`popup-window ${popup.isDragging ? 'dragging' : ''}`}
      style={{
        position: 'absolute',
        left: popup.position.x,
        top: popup.position.y,
        width: popup.isMinimized ? 'auto' : popup.size.width,
        height: popup.isMinimized ? 'auto' : popup.type === 'timer' ? 'auto' : popup.size.height,
        minHeight: popup.type === 'timer' ? popup.size.height : undefined,
        zIndex: popup.zIndex,
        border: popup.type === 'timer' ? 'none' : '1px solid #ffffff',
        borderRadius: '20px',
        boxShadow: popup.type === 'timer' ? 'none' : '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
        overflow:
          popup.type === 'timer' ? 'visible' : popup.type === 'background' ? 'hidden' : 'hidden',
        userSelect: 'none',
        backgroundColor: popup.type === 'timer' ? 'transparent' : 'rgba(255, 255, 255, 1)',
        backgroundImage:
          popup.type === 'timer'
            ? 'linear-gradient(to bottom, rgba(255, 255, 255, 0.9), rgba(255, 255, 255, 0.4))'
            : 'none',
        backdropFilter: popup.type === 'timer' ? 'blur(8px)' : 'none',
        WebkitBackdropFilter: popup.type === 'timer' ? 'blur(8px)' : 'none',
      }}
      onClick={handleClick}
    >
      {/* Header - Invisible for all popups but draggable */}
      <div
        className="popup-header cursor-move flex items-center justify-center"
        onMouseDown={handleMouseDown}
        style={{
          backgroundColor: 'transparent',
          borderBottom: 'none',
          padding: '0',
          height: '24px',
        }}
      >
        {/* No visible title for any popup type */}
      </div>

      {/* Content */}
      {!popup.isMinimized && (
        <div
          className={`popup-content ${
            popup.type === 'timer'
              ? 'overflow-visible'
              : popup.type === 'background'
                ? 'overflow-auto h-full'
                : 'overflow-auto p-4'
          }`}
          style={
            popup.type === 'timer'
              ? {
                  background: 'transparent',
                  padding: '8px 16px 16px 16px', // Reduced top padding to compensate for larger header
                }
              : popup.type === 'background'
                ? {
                    height: 'calc(100% - 24px)', // Account for header height
                    padding: '0',
                  }
                : undefined
          }
        >
          {children}
        </div>
      )}
    </div>
  )
}

export default DraggablePopup
