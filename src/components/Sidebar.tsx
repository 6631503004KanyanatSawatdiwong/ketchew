import React from 'react'
import { Timer, CheckSquare, FileText, Image, Volume2 } from 'lucide-react'
import { PopupType } from '../types'

interface SidebarProps {
  onOpenPopup: (popupType: PopupType) => void
  activePopup: PopupType
}

const Sidebar: React.FC<SidebarProps> = ({ onOpenPopup, activePopup }) => {
  const tabs = [
    { id: 'timer' as const, icon: Timer, label: 'Timer' },
    { id: 'tasks' as const, icon: CheckSquare, label: 'Tasks' },
    { id: 'notes' as const, icon: FileText, label: 'Notes' },
    { id: 'background' as const, icon: Image, label: 'Background' },
    { id: 'audio' as const, icon: Volume2, label: 'Audio' },
  ]

  return (
    <div className="fixed left-4 top-1/2 transform -translate-y-1/2 z-40">
      <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-lg border border-gray-200 p-2">
        <div className="flex flex-col gap-1">
          {tabs.map(({ id, icon: Icon, label }) => (
            <button
              key={id}
              onClick={() => onOpenPopup(id)}
              className={`p-3 rounded-lg transition-all duration-200 group relative ${
                activePopup === id
                  ? 'bg-gray-900 text-white shadow-md'
                  : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
              }`}
              title={label}
            >
              <Icon size={20} />

              {/* Tooltip */}
              <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                {label}
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Sidebar
