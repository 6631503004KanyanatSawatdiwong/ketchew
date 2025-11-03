import React, { useState } from 'react'
import { useTimerStore, TimerSettings } from '../stores/timerStore'

interface TimerSettingsProps {
  className?: string
  onClose?: () => void
}

const TimerSettingsPanel: React.FC<TimerSettingsProps> = ({ className = '', onClose }) => {
  const { settings, updateSettings } = useTimerStore()
  const [localSettings, setLocalSettings] = useState<TimerSettings>(settings)
  const [errors, setErrors] = useState<Record<string, string>>({})

  // Update local settings when global settings change
  React.useEffect(() => {
    setLocalSettings(settings)
  }, [settings])

  const validateSettings = (newSettings: TimerSettings): Record<string, string> => {
    const validationErrors: Record<string, string> = {}

    // Study duration validation (5-90 minutes)
    if (newSettings.studyDuration < 5 || newSettings.studyDuration > 90) {
      validationErrors.studyDuration = 'Study duration must be between 5-90 minutes'
    }

    // Short break validation (1-30 minutes)
    if (newSettings.shortBreakDuration < 1 || newSettings.shortBreakDuration > 30) {
      validationErrors.shortBreakDuration = 'Short break must be between 1-30 minutes'
    }

    // Long break validation (5-60 minutes)
    if (newSettings.longBreakDuration < 5 || newSettings.longBreakDuration > 60) {
      validationErrors.longBreakDuration = 'Long break must be between 5-60 minutes'
    }

    // Logical validation
    if (newSettings.shortBreakDuration >= newSettings.studyDuration) {
      validationErrors.shortBreakDuration = 'Short break should be shorter than study duration'
    }

    if (newSettings.longBreakDuration <= newSettings.shortBreakDuration) {
      validationErrors.longBreakDuration = 'Long break should be longer than short break'
    }

    return validationErrors
  }

  const handleSettingChange = (key: keyof TimerSettings, value: number | boolean) => {
    const newSettings = { ...localSettings, [key]: value }
    setLocalSettings(newSettings)

    // Real-time validation
    const validationErrors = validateSettings(newSettings)
    setErrors(validationErrors)
  }

  const handleSave = () => {
    const validationErrors = validateSettings(localSettings)
    setErrors(validationErrors)

    if (Object.keys(validationErrors).length === 0) {
      updateSettings(localSettings)
      onClose?.() // Close the panel after saving
    }
  }

  return (
    <div className={className}>
      {/* Settings Panel */}
      <div className="space-y-2 border-t border-gray-500 pt-4">
        {/* Duration Settings */}
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Pomodoro</label>
            <input
              type="number"
              min="5"
              max="90"
              value={localSettings.studyDuration}
              onChange={e => handleSettingChange('studyDuration', parseInt(e.target.value) || 25)}
              className={`
                w-full px-3 py-2 border rounded-lg text-center font-mono
                ${errors.studyDuration ? 'border-red-300 bg-red-50' : 'border-gray-300'}
              `}
            />
            {errors.studyDuration && (
              <p className="text-xs text-red-600 mt-1">{errors.studyDuration}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Short Break</label>
            <input
              type="number"
              min="1"
              max="30"
              value={localSettings.shortBreakDuration}
              onChange={e =>
                handleSettingChange('shortBreakDuration', parseInt(e.target.value) || 5)
              }
              className={`
                w-full px-3 py-2 border rounded-lg text-center font-mono
                ${errors.shortBreakDuration ? 'border-red-300 bg-red-50' : 'border-gray-300'}
              `}
            />
            {errors.shortBreakDuration && (
              <p className="text-xs text-red-600 mt-1">{errors.shortBreakDuration}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Long Break</label>
            <input
              type="number"
              min="5"
              max="60"
              value={localSettings.longBreakDuration}
              onChange={e =>
                handleSettingChange('longBreakDuration', parseInt(e.target.value) || 15)
              }
              className={`
                w-full px-3 py-2 border rounded-lg text-center font-mono
                ${errors.longBreakDuration ? 'border-red-300 bg-red-50' : 'border-gray-300'}
              `}
            />
            {errors.longBreakDuration && (
              <p className="text-xs text-red-600 mt-1">{errors.longBreakDuration}</p>
            )}
          </div>
        </div>

        {/* Save Button */}
        <div className="pt-2">
          <button
            onClick={handleSave}
            disabled={Object.keys(errors).length > 0}
            className={`
              flex items-center justify-center gap-2 w-full px-6 py-2 text-sm rounded-full transition-colors
              ${
                Object.keys(errors).length > 0
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-white text-gray-800 shadow-sm hover:shadow-md'
              }
            `}
          >
            Save
          </button>
        </div>

        {/* Validation Summary */}
        {Object.keys(errors).length > 0 && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3">
            <p className="text-sm text-red-800 font-medium">Please fix the following issues:</p>
            <ul className="text-sm text-red-700 mt-1 space-y-1">
              {Object.values(errors).map((error, index) => (
                <li key={index}>• {error}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  )
}

export default TimerSettingsPanel
