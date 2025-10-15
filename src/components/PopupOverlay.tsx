import React, { ReactNode } from 'react'
import { X } from 'lucide-react'

interface PopupOverlayProps {
  children: ReactNode
  onClose: () => void
}

const PopupOverlay: React.FC<PopupOverlayProps> = ({ children, onClose }) => {
  return (
    <div className="popup-overlay" onClick={onClose}>
      <div className="popup-container" onClick={e => e.stopPropagation()}>
        {/* Close button */}
        <div className="absolute top-4 right-4 z-10">
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">{children}</div>
      </div>
    </div>
  )
}

export default PopupOverlay
