import React, { useState } from 'react'
import DesktopInterface from './components/DesktopInterface'
import Sidebar from './components/Sidebar'
import PopupOverlay from './components/PopupOverlay'
import PomodoroTimer from './components/PomodoroTimer'
import TodoList from './components/TodoList'
import NotesEditor from './components/NotesEditor'
import BackgroundSelector from './components/BackgroundSelector'
import SoundSelector from './components/SoundSelector'
import { useLocalStorage } from './hooks/useLocalStorage'

export interface AppState {
  activePopup: string | null
  selectedBackground: string
  selectedSound: string | null
  soundEnabled: boolean
  volume: number
}

function App() {
  const [activePopup, setActivePopup] = useState<string | null>(null)
  const [preferences, setPreferences] = useLocalStorage('ketchew_preferences', {
    selectedBackground: 'default',
    selectedSound: null,
    soundEnabled: true,
    volume: 50
  })

  const openPopup = (popupId: string) => {
    setActivePopup(popupId)
  }

  const closePopup = () => {
    setActivePopup(null)
  }

  const updatePreferences = (updates: Partial<typeof preferences>) => {
    setPreferences(prev => ({ ...prev, ...updates }))
  }

  const renderPopupContent = () => {
    switch (activePopup) {
      case 'timer':
        return <PomodoroTimer />
      case 'todo':
        return <TodoList />
      case 'notes':
        return <NotesEditor />
      case 'background':
        return (
          <BackgroundSelector
            selectedBackground={preferences.selectedBackground}
            onSelectBackground={(bg) => updatePreferences({ selectedBackground: bg })}
          />
        )
      case 'sounds':
        return (
          <SoundSelector
            selectedSound={preferences.selectedSound}
            soundEnabled={preferences.soundEnabled}
            volume={preferences.volume}
            onSelectSound={(sound) => updatePreferences({ selectedSound: sound })}
            onToggleSound={(enabled) => updatePreferences({ soundEnabled: enabled })}
            onVolumeChange={(volume) => updatePreferences({ volume })}
          />
        )
      default:
        return null
    }
  }

  return (
    <div className="h-screen w-screen overflow-hidden">
      <DesktopInterface background={preferences.selectedBackground} />
      <Sidebar activeTab={activePopup} onTabClick={openPopup} />
      
      {activePopup && (
        <PopupOverlay onClose={closePopup}>
          {renderPopupContent()}
        </PopupOverlay>
      )}
    </div>
  )
}

export default App
