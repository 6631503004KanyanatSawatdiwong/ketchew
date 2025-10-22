import React, { useState, useEffect } from 'react'
import { Check, Coffee, Focus, Clock } from 'lucide-react'

interface PhaseNotificationProps {
  phase: 'study' | 'shortBreak' | 'longBreak'
  round: number
  onDismiss: () => void
}

const PhaseNotification: React.FC<PhaseNotificationProps> = ({ phase, round, onDismiss }) => {
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    // Auto-dismiss after 3 seconds
    const timer = setTimeout(() => {
      setIsVisible(false)
      setTimeout(onDismiss, 300) // Wait for fade out animation
    }, 3000)

    return () => clearTimeout(timer)
  }, [onDismiss])

  const getPhaseInfo = () => {
    switch (phase) {
      case 'study':
        return {
          icon: Focus,
          title: `Round ${round} - Focus Time`,
          message: 'Time to concentrate and be productive!',
          color: 'blue',
        }
      case 'shortBreak':
        return {
          icon: Coffee,
          title: 'Short Break',
          message: 'Take a quick 5-minute break.',
          color: 'green',
        }
      case 'longBreak':
        return {
          icon: Clock,
          title: 'Long Break',
          message: 'Well done! Enjoy a longer break.',
          color: 'purple',
        }
    }
  }

  const phaseInfo = getPhaseInfo()
  const Icon = phaseInfo.icon

  if (!isVisible) return null

  return (
    <div
      className={`fixed top-4 right-4 z-50 transition-all duration-300 ${
        isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-full'
      }`}
    >
      <div
        className={`
        bg-white rounded-lg shadow-lg border-l-4 p-4 min-w-[300px]
        ${
          phaseInfo.color === 'blue'
            ? 'border-blue-500'
            : phaseInfo.color === 'green'
              ? 'border-green-500'
              : 'border-purple-500'
        }
      `}
      >
        <div className="flex items-start gap-3">
          <div
            className={`
            p-2 rounded-full
            ${
              phaseInfo.color === 'blue'
                ? 'bg-blue-100 text-blue-600'
                : phaseInfo.color === 'green'
                  ? 'bg-green-100 text-green-600'
                  : 'bg-purple-100 text-purple-600'
            }
          `}
          >
            <Icon size={20} />
          </div>

          <div className="flex-1">
            <h4 className="font-semibold text-gray-900">{phaseInfo.title}</h4>
            <p className="text-sm text-gray-600 mt-1">{phaseInfo.message}</p>
          </div>

          <button
            onClick={() => {
              setIsVisible(false)
              setTimeout(onDismiss, 300)
            }}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <Check size={18} />
          </button>
        </div>
      </div>
    </div>
  )
}

export default PhaseNotification
