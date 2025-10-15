import React from 'react'
import { Clock, CheckSquare, StickyNote, Image, Volume2 } from 'lucide-react'

interface SidebarProps {
  activeTab: string | null
  onTabClick: (tabId: string) => void
}

const tabs = [
  { id: 'background', label: 'Background', icon: Image },
  { id: 'sounds', label: 'Sounds', icon: Volume2 },
  { id: 'timer', label: 'Timer', icon: Clock },
  { id: 'todo', label: 'To-Do', icon: CheckSquare },
  { id: 'notes', label: 'Notes', icon: StickyNote }
]

const Sidebar: React.FC<SidebarProps> = ({ activeTab, onTabClick }) => {
  return (
    <div className="fixed left-0 top-0 h-full w-20 bg-white/10 backdrop-blur-md border-r border-white/20 z-40 flex flex-col items-center py-6 gap-4">
      {tabs.map((tab) => {
        const Icon = tab.icon
        const isActive = activeTab === tab.id
        
        return (
          <button
            key={tab.id}
            onClick={() => onTabClick(tab.id)}
            className={`sidebar-tab ${isActive ? 'active' : ''} text-white group relative`}
            title={tab.label}
          >
            <Icon size={20} />
            
            {/* Tooltip */}
            <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
              {tab.label}
            </div>
          </button>
        )
      })}
    </div>
  )
}

export default Sidebar
