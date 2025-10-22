import React from 'react'
import { Play, Pause, Square, RotateCcw } from 'lucide-react'
import { useTimerStore } from '../stores/timerStore'
import TimerDisplay from './TimerDisplay'
import TimerProgress from './TimerProgress'
import PhaseNotification from './PhaseNotification'
import TimerSettingsPanel from './TimerSettingsPanel'

const PomodoroTimer: React.FC = () => {
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
    stopTimer,
    resetSession,
    dismissNotification,
  } = useTimerStore()

  const getPhaseLabel = () => {
    switch (currentPhase) {
      case 'study':
        return 'Focus Time'
      case 'shortBreak':
        return 'Short Break'
      case 'longBreak':
        return 'Long Break'
      default:
        return 'Timer'
    }
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

      <div className="w-full max-w-sm sm:max-w-md lg:max-w-lg mx-auto text-center px-4">
        <h2 className="text-2xl font-bold mb-6">Pomodoro Timer</h2>

        {/* Enhanced Progress Indicator */}
        <TimerProgress
          currentRound={currentRound}
          completedRounds={completedRounds}
          currentPhase={currentPhase}
          className="mb-8"
        />

        {/* Phase Label */}
        <div className="mb-6">
          <span className="text-sm font-medium text-gray-600">
            Round {currentRound} - {getPhaseLabel()}
          </span>
        </div>

        {/* Enhanced Timer Display */}
        <TimerDisplay
          timeRemainingMs={timeRemainingMs}
          currentPhase={currentPhase}
          status={status}
          className="mb-8"
        />

        {/* Controls */}
        <div className="flex justify-center gap-4">
          {status === 'idle' || status === 'completed' ? (
            <button onClick={startTimer} className="btn-primary flex items-center gap-2">
              <Play size={16} />
              Start
            </button>
          ) : status === 'paused' ? (
            <button onClick={resumeTimer} className="btn-primary flex items-center gap-2">
              <Play size={16} />
              Resume
            </button>
          ) : (
            <button onClick={pauseTimer} className="btn-secondary flex items-center gap-2">
              <Pause size={16} />
              Pause
            </button>
          )}

          <button onClick={stopTimer} className="btn-secondary flex items-center gap-2">
            <Square size={16} />
            Stop
          </button>

          <button onClick={resetSession} className="btn-secondary flex items-center gap-2">
            <RotateCcw size={16} />
            Reset
          </button>
        </div>

        {/* Simple Manual Phase Transition */}
        {(status === 'running' || status === 'paused') && (
          <div className="mt-4">
            <button
              onClick={() => {
                if (status === 'running') {
                  stopTimer()
                }
                const { handlePhaseComplete } = useTimerStore.getState()
                handlePhaseComplete()
              }}
              className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
            >
              Skip to next phase
            </button>
          </div>
        )}

        {/* Enhanced Timer Settings */}
        <div className="mt-8 pt-6 border-t border-gray-200 relative">
          <TimerSettingsPanel />
        </div>
      </div>
    </>
  )
}

export default PomodoroTimer
