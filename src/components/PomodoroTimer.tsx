import React, { useState, useEffect, useRef } from 'react'
import { Play, Pause, Square, RotateCcw } from 'lucide-react'
import { useLocalStorage } from '../hooks/useLocalStorage'

interface PomodoroState {
  currentRound: number
  phase: 'study' | 'shortBreak' | 'longBreak'
  timeRemaining: number
  isActive: boolean
  isPaused: boolean
  studyDuration: number
  shortBreakDuration: number
  longBreakDuration: number
  completedRounds: boolean[]
}

const PomodoroTimer: React.FC = () => {
  const [timerState, setTimerState] = useLocalStorage<PomodoroState>('ketchew_timer', {
    currentRound: 1,
    phase: 'study',
    timeRemaining: 25 * 60, // 25 minutes in seconds
    isActive: false,
    isPaused: false,
    studyDuration: 25,
    shortBreakDuration: 5,
    longBreakDuration: 15,
    completedRounds: [false, false, false, false]
  })

  const intervalRef = useRef<number | null>(null)
  const startTimeRef = useRef<number>(0)
  const driftRef = useRef<number>(0)

  useEffect(() => {
    if (timerState.isActive && !timerState.isPaused) {
      startTimeRef.current = performance.now()
      
      intervalRef.current = window.setInterval(() => {
        const now = performance.now()
        const elapsed = Math.floor((now - startTimeRef.current) / 1000)
        const expectedTime = timerState.timeRemaining - elapsed - driftRef.current
        
        if (expectedTime <= 0) {
          handlePhaseComplete()
        } else {
          setTimerState(prev => ({
            ...prev,
            timeRemaining: expectedTime
          }))
        }
        
        // Drift correction every 10 seconds
        if (elapsed % 10 === 0) {
          const actualElapsed = elapsed + driftRef.current
          const expectedElapsed = Math.floor((now - startTimeRef.current) / 1000)
          driftRef.current = actualElapsed - expectedElapsed
        }
      }, 1000)
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [timerState.isActive, timerState.isPaused])

  const handlePhaseComplete = () => {
    setTimerState(prev => {
      const newCompletedRounds = [...prev.completedRounds]
      
      if (prev.phase === 'study') {
        // Mark current round as completed
        newCompletedRounds[prev.currentRound - 1] = true
        
        // Determine next phase
        const nextPhase = prev.currentRound === 4 ? 'longBreak' : 'shortBreak'
        const nextDuration = nextPhase === 'longBreak' ? prev.longBreakDuration : prev.shortBreakDuration
        
        return {
          ...prev,
          phase: nextPhase,
          timeRemaining: nextDuration * 60,
          isActive: false,
          completedRounds: newCompletedRounds
        }
      } else {
        // Break completed, move to next round or reset
        if (prev.currentRound === 4) {
          // All rounds completed, reset
          return {
            ...prev,
            currentRound: 1,
            phase: 'study',
            timeRemaining: prev.studyDuration * 60,
            isActive: false,
            completedRounds: [false, false, false, false]
          }
        } else {
          // Move to next round
          return {
            ...prev,
            currentRound: prev.currentRound + 1,
            phase: 'study',
            timeRemaining: prev.studyDuration * 60,
            isActive: false
          }
        }
      }
    })
    
    // Play notification sound (would integrate with Howler.js)
    console.log('Phase completed!')
  }

  const startTimer = () => {
    setTimerState(prev => ({
      ...prev,
      isActive: true,
      isPaused: false
    }))
  }

  const pauseTimer = () => {
    setTimerState(prev => ({
      ...prev,
      isPaused: true
    }))
  }

  const resumeTimer = () => {
    setTimerState(prev => ({
      ...prev,
      isPaused: false
    }))
  }

  const stopTimer = () => {
    setTimerState(prev => ({
      ...prev,
      isActive: false,
      isPaused: false,
      timeRemaining: prev.phase === 'study' ? prev.studyDuration * 60 :
                     prev.phase === 'shortBreak' ? prev.shortBreakDuration * 60 :
                     prev.longBreakDuration * 60
    }))
  }

  const resetTimer = () => {
    setTimerState(prev => ({
      ...prev,
      currentRound: 1,
      phase: 'study',
      timeRemaining: prev.studyDuration * 60,
      isActive: false,
      isPaused: false,
      completedRounds: [false, false, false, false]
    }))
  }

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  const getPhaseLabel = () => {
    switch (timerState.phase) {
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
    <div className="w-96 text-center">
      <h2 className="text-2xl font-bold mb-6">Pomodoro Timer</h2>
      
      {/* Progress Dots */}
      <div className="flex justify-center gap-2 mb-6">
        {timerState.completedRounds.map((completed, index) => (
          <div
            key={index}
            className={`w-3 h-3 rounded-full transition-colors ${
              completed ? 'bg-gray-900' : 'bg-gray-300'
            }`}
          />
        ))}
      </div>

      {/* Phase Label */}
      <div className="mb-4">
        <span className="text-sm font-medium text-gray-600">
          Round {timerState.currentRound} - {getPhaseLabel()}
        </span>
      </div>

      {/* Timer Display */}
      <div className="mb-8">
        <div className="text-6xl font-mono font-bold text-gray-900">
          {formatTime(timerState.timeRemaining)}
        </div>
      </div>

      {/* Controls */}
      <div className="flex justify-center gap-4">
        {!timerState.isActive ? (
          <button onClick={startTimer} className="btn-primary flex items-center gap-2">
            <Play size={16} />
            Start
          </button>
        ) : timerState.isPaused ? (
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
        
        <button onClick={resetTimer} className="btn-secondary flex items-center gap-2">
          <RotateCcw size={16} />
          Reset
        </button>
      </div>

      {/* Duration Settings */}
      <div className="mt-8 pt-6 border-t border-gray-200">
        <h3 className="text-lg font-semibold mb-4">Duration Settings</h3>
        <div className="grid grid-cols-3 gap-4 text-sm">
          <div>
            <label className="block font-medium mb-1">Study</label>
            <input
              type="number"
              min="1"
              max="60"
              value={timerState.studyDuration}
              onChange={(e) => setTimerState(prev => ({
                ...prev,
                studyDuration: parseInt(e.target.value) || 25
              }))}
              className="w-full px-2 py-1 border border-gray-300 rounded"
            />
          </div>
          <div>
            <label className="block font-medium mb-1">Short Break</label>
            <input
              type="number"
              min="1"
              max="30"
              value={timerState.shortBreakDuration}
              onChange={(e) => setTimerState(prev => ({
                ...prev,
                shortBreakDuration: parseInt(e.target.value) || 5
              }))}
              className="w-full px-2 py-1 border border-gray-300 rounded"
            />
          </div>
          <div>
            <label className="block font-medium mb-1">Long Break</label>
            <input
              type="number"
              min="1"
              max="60"
              value={timerState.longBreakDuration}
              onChange={(e) => setTimerState(prev => ({
                ...prev,
                longBreakDuration: parseInt(e.target.value) || 15
              }))}
              className="w-full px-2 py-1 border border-gray-300 rounded"
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default PomodoroTimer
