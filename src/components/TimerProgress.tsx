import React from 'react'
import { Check } from 'lucide-react'

interface TimerProgressProps {
  currentRound: number
  completedRounds: boolean[]
  currentPhase: 'study' | 'shortBreak' | 'longBreak'
  className?: string
}

const TimerProgress: React.FC<TimerProgressProps> = ({
  currentRound,
  completedRounds,
  currentPhase,
  className = '',
}) => {
  return (
    <div className={`flex justify-center items-center gap-4 ${className}`}>
      {completedRounds.map((completed, index) => {
        const roundNumber = index + 1
        const isActive = currentRound === roundNumber
        const isCurrentBreak = isActive && currentPhase !== 'study'

        return (
          <div key={index} className="flex flex-col items-center gap-2">
            {/* Round indicator */}
            <div className="relative">
              <div
                className={`
                  w-8 h-8 rounded-full border-2 transition-all duration-300 flex items-center justify-center
                  ${
                    completed
                      ? 'bg-green-500 border-green-500 text-white shadow-lg scale-110'
                      : isActive
                        ? currentPhase === 'study'
                          ? 'border-blue-500 bg-blue-50 text-blue-600 animate-pulse'
                          : 'border-green-500 bg-green-50 text-green-600'
                        : 'border-gray-300 bg-white text-gray-400'
                  }
                `}
              >
                {completed ? (
                  <Check size={16} />
                ) : (
                  <span className="text-sm font-semibold">{roundNumber}</span>
                )}
              </div>

              {/* Active indicator */}
              {isActive && !completed && (
                <div
                  className={`
                  absolute -top-1 -right-1 w-3 h-3 rounded-full animate-ping
                  ${currentPhase === 'study' ? 'bg-blue-500' : 'bg-green-500'}
                `}
                />
              )}
            </div>

            {/* Phase label */}
            <div className="text-center">
              <div
                className={`
                text-xs font-medium transition-colors
                ${
                  isActive
                    ? currentPhase === 'study'
                      ? 'text-blue-600'
                      : 'text-green-600'
                    : completed
                      ? 'text-green-600'
                      : 'text-gray-400'
                }
              `}
              >
                Round {roundNumber}
              </div>

              {/* Break indicator */}
              {isCurrentBreak && (
                <div className="text-xs text-green-500 mt-1 animate-bounce">
                  {currentPhase === 'shortBreak' ? 'Break' : 'Long Break'}
                </div>
              )}
            </div>

            {/* Connection line to next round */}
            {index < completedRounds.length - 1 && (
              <div
                className={`
                absolute top-4 left-12 w-8 h-0.5 transition-colors
                ${
                  completed || (isActive && index < currentRound - 1)
                    ? 'bg-green-500'
                    : 'bg-gray-300'
                }
              `}
              />
            )}
          </div>
        )
      })}
    </div>
  )
}

export default TimerProgress
