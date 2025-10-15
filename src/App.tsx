import React, { useState } from 'react'
import { PopupType } from './types'
import DesktopInterface from './components/DesktopInterface'
import Sidebar from './components/Sidebar'
import PopupOverlay from './components/PopupOverlay'
import PomodoroTimer from './components/PomodoroTimer'
import TodoList from './components/TodoList'
import NotesEditor from './components/NotesEditor'
import BackgroundSelector from './components/BackgroundSelector'
import SoundSelector from './components/SoundSelector'

function App() {
  const [activePopup, setActivePopup] = useState<PopupType>(null)

  const handleOpenPopup = (popupType: PopupType) => {
    setActivePopup(popupType)
  }

  const handleClosePopup = () => {
    setActivePopup(null)
  }

  const renderPopupContent = () => {
    switch (activePopup) {
      case 'timer':
        return <PomodoroTimer />
      case 'tasks':
        return <TodoList />
      case 'notes':
        return <NotesEditor />
      case 'background':
        return <BackgroundSelector />
      case 'audio':
        return <SoundSelector />
      default:
        return null
    }
  }

  return (
    <div className="h-screen w-full overflow-hidden">
      {/* Desktop background interface */}
      <DesktopInterface />

      {/* Navigation sidebar */}
      <Sidebar onOpenPopup={handleOpenPopup} activePopup={activePopup} />

      {/* Popup overlay system */}
      {activePopup && (
        <PopupOverlay onClose={handleClosePopup}>{renderPopupContent()}</PopupOverlay>
      )}
    </div>
  )
}

export default App
