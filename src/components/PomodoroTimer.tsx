import React, { useState } from 'react'
import { RotateCcw, Settings } from 'lucide-react'
import { useTimerStore, TimerPhase } from '../stores/timerStore'
import PhaseNotification from './PhaseNotification'
import TimerSettingsPanel from './TimerSettingsPanel'
import tomatoImage from '../images/RoundTime.png'

const PomodoroTimer: React.FC = () => {
  const [showSettings, setShowSettings] = useState(false)

  const {
    currentRound,
    currentPhase,
    timeRemainingMs,
    status,
    completedRounds,
    showPhaseNotification,
    lastCompletedPhase,
    startTimer,
    pauseTimer,
    resumeTimer,
    resetSession,
    switchPhase,
    dismissNotification,
  } = useTimerStore()

  // Render tomato indicators for rounds
  const renderTomatoIndicators = () => {
    return (
      <div className="flex justify-center gap-4 mb-8">
        {[1, 2, 3, 4].map(round => (
          <div
            key={round}
            className={`w-8 h-8 transition-all duration-300 ${
              completedRounds[round - 1]
                ? 'opacity-100 filter-none' // Completed: full color (red)
                : 'opacity-30 grayscale' // Not completed: grey and dimmed
            }`}
          >
            <img
              src={tomatoImage}
              alt={`Pomodoro round ${round}`}
              className="w-full h-full object-contain"
            />
          </div>
        ))}
      </div>
    )
  }

  const handlePhaseChange = (phase: TimerPhase) => {
    // Switch to the specified phase
    switchPhase(phase)
  }

  return (
    <>
      {/* Phase Completion Notification */}
      {showPhaseNotification && lastCompletedPhase && (
        <PhaseNotification
          phase={currentPhase}
          round={currentRound}
          onDismiss={dismissNotification}
        />
      )}

      <div className="w-full max-w-sm mx-auto px-3 pb-2 pointer-events-auto">
        {/* Tomato Round Indicators */}
        {renderTomatoIndicators()}

        {/* Large Timer Display */}
        <div className="text-center mb-6">
          <div className="flex items-center justify-center gap-6 mb-4">
            {/* Time Display */}
            <div className="text-5xl font-bold font-mono text-gray-900">
              {Math.floor(timeRemainingMs / 60000)
                .toString()
                .padStart(2, '0')}
              :
              {Math.floor((timeRemainingMs % 60000) / 1000)
                .toString()
                .padStart(2, '0')}
            </div>
            {/* Start/Pause Button */}
            {status === 'idle' || status === 'completed' ? (
              <button
                onClick={startTimer}
                className="bg-white border-1 border-gray-500 text-gray-800 px-8 py-1 rounded-full font-medium shadow-sm hover:shadow-md transition-shadow text-sm"
              >
                Start
              </button>
            ) : status === 'paused' ? (
              <button
                onClick={resumeTimer}
                className="bg-white text-gray-800 px-6 py-1 rounded-full font-medium shadow-sm hover:shadow-md transition-shadow text-sm"
              >
                Resume
              </button>
            ) : (
              <button
                onClick={pauseTimer}
                className="bg-white text-gray-800 px-7 py-1 rounded-full font-medium shadow-sm hover:shadow-md transition-shadow text-sm"
              >
                Pause
              </button>
            )}
            {/* Reset Button */}
            <button
              onClick={resetSession}
              className="p-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              <RotateCcw size={16} />
            </button>
          </div>
        </div>

        {/* Phase Tabs */}
        <div className="flex justify-between mb-2">
          <button
            onClick={() => handlePhaseChange('study')}
            className={`flex-1 py-2 text-sm font-medium border-b-2 transition-colors ${
              currentPhase === 'study'
                ? 'border-red-700 text-red-700'
                : 'border-transparent text-gray-700 hover:text-black'
            }`}
          >
            Pomodoro
          </button>
          <button
            onClick={() => handlePhaseChange('shortBreak')}
            className={`flex-1 py-2 text-sm font-medium border-b-2 transition-colors ${
              currentPhase === 'shortBreak'
                ? 'border-red-700 text-red-700'
                : 'border-transparent text-gray-700 hover:text-black'
            }`}
          >
            Short Break
          </button>
          <button
            onClick={() => handlePhaseChange('longBreak')}
            className={`flex-1 py-2 text-sm font-medium border-b-2 transition-colors ${
              currentPhase === 'longBreak'
                ? 'border-red-700 text-red-700'
                : 'border-transparent text-gray-700 hover:text-black'
            }`}
          >
            Long Break
          </button>
          {/* Settings Icon */}
          <button
            onClick={() => setShowSettings(!showSettings)}
            className={`p-2 rounded-full transition-colors ${
              showSettings ? 'text-red-600' : 'text-gray-700 hover:text-black'
            }`}
          >
            <Settings size={20} />
          </button>
        </div>

        {/* Expandable Settings Panel */}
        {showSettings && (
          <div className="mt-4 pt-2 animate-in slide-in-from-top-5 duration-200">
            <TimerSettingsPanel onClose={() => setShowSettings(false)} />
          </div>
        )}
      </div>
    </>
  )
}

export default PomodoroTimer
