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

    // Basic validation - just ensure positive numbers
    if (newSettings.studyDuration < 1) {
      validationErrors.studyDuration = 'Study duration must be at least 1 minute'
    }

    if (newSettings.shortBreakDuration < 1) {
      validationErrors.shortBreakDuration = 'Short break must be at least 1 minute'
    }

    if (newSettings.longBreakDuration < 1) {
      validationErrors.longBreakDuration = 'Long break must be at least 1 minute'
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
              min="1"
              value={localSettings.studyDuration}
              onChange={e => handleSettingChange('studyDuration', parseInt(e.target.value) || 25)}
              className={`
                w-full px-3 py-2 border rounded-lg text-center font-mono
                ${errors.studyDuration ? 'border-red-300 bg-red-50' : 'border-gray-300'}
              `}
              placeholder="Minutes"
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
              value={localSettings.shortBreakDuration}
              onChange={e =>
                handleSettingChange('shortBreakDuration', parseInt(e.target.value) || 5)
              }
              className={`
                w-full px-3 py-2 border rounded-lg text-center font-mono
                ${errors.shortBreakDuration ? 'border-red-300 bg-red-50' : 'border-gray-300'}
              `}
              placeholder="Minutes"
            />
            {errors.shortBreakDuration && (
              <p className="text-xs text-red-600 mt-1">{errors.shortBreakDuration}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Long Break</label>
            <input
              type="number"
              min="1"
              value={localSettings.longBreakDuration}
              onChange={e =>
                handleSettingChange('longBreakDuration', parseInt(e.target.value) || 15)
              }
              className={`
                w-full px-3 py-2 border rounded-lg text-center font-mono
                ${errors.longBreakDuration ? 'border-red-300 bg-red-50' : 'border-gray-300'}
              `}
              placeholder="Minutes"
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
