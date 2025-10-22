import React from 'react'

interface TimerDisplayProps {
  timeRemainingMs: number
  currentPhase: 'study' | 'shortBreak' | 'longBreak'
  status: 'idle' | 'running' | 'paused' | 'completed'
  className?: string
}

const TimerDisplay: React.FC<TimerDisplayProps> = ({
  timeRemainingMs,
  currentPhase,
  status,
  className = '',
}) => {
  // Convert milliseconds to MM:SS format
  const formatTime = (milliseconds: number): string => {
    const totalSeconds = Math.ceil(milliseconds / 1000)
    const mins = Math.floor(totalSeconds / 60)
    const secs = totalSeconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  const getPhaseColor = () => {
    switch (currentPhase) {
      case 'study':
        return 'text-blue-600'
      case 'shortBreak':
        return 'text-green-600'
      case 'longBreak':
        return 'text-purple-600'
      default:
        return 'text-gray-900'
    }
  }

  const getBackgroundPulse = () => {
    if (status !== 'running') return ''

    switch (currentPhase) {
      case 'study':
        return 'animate-pulse bg-blue-50'
      case 'shortBreak':
        return 'animate-pulse bg-green-50'
      case 'longBreak':
        return 'animate-pulse bg-purple-50'
      default:
        return ''
    }
  }

  return (
    <div className={`text-center ${className}`}>
      {/* Timer Circle */}
      <div
        className={`
        relative mx-auto mb-6 w-48 h-48 sm:w-56 sm:h-56 lg:w-64 lg:h-64 rounded-full border-4 sm:border-6 lg:border-8 transition-all duration-300
        flex items-center justify-center
        ${
          status === 'running'
            ? currentPhase === 'study'
              ? 'border-blue-200 shadow-lg shadow-blue-100'
              : currentPhase === 'shortBreak'
                ? 'border-green-200 shadow-lg shadow-green-100'
                : 'border-purple-200 shadow-lg shadow-purple-100'
            : 'border-gray-200'
        }
        ${getBackgroundPulse()}
      `}
      >
        {/* Progress ring background */}
        <div className="absolute inset-0 rounded-full">
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
            <circle
              cx="50"
              cy="50"
              r="45"
              stroke="currentColor"
              strokeWidth="2"
              fill="none"
              className="text-gray-200"
            />
            {/* Progress ring - you can add progress calculation here later */}
          </svg>
        </div>

        {/* Time display */}
        <div className="relative z-10">
          <div
            className={`
            text-4xl sm:text-5xl lg:text-6xl font-mono font-bold transition-colors
            ${getPhaseColor()}
          `}
          >
            {formatTime(timeRemainingMs)}
          </div>

          {/* Status indicator */}
          <div className="mt-2">
            <div
              className={`
              inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium
              ${
                status === 'running'
                  ? 'bg-green-100 text-green-700'
                  : status === 'paused'
                    ? 'bg-yellow-100 text-yellow-700'
                    : status === 'completed'
                      ? 'bg-purple-100 text-purple-700'
                      : 'bg-gray-100 text-gray-600'
              }
            `}
            >
              {status === 'running' && (
                <div className="w-2 h-2 bg-green-500 rounded-full animate-ping" />
              )}
              {status === 'paused' && <div className="w-2 h-2 bg-yellow-500 rounded-full" />}
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TimerDisplay
