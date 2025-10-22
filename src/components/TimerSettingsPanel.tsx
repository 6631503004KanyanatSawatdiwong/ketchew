import React, { useState } from 'react'
import { Settings, Check, X, RotateCcw } from 'lucide-react'
import { useTimerStore, TimerSettings } from '../stores/timerStore'

interface TimerSettingsProps {
  className?: string
}

const TimerSettingsPanel: React.FC<TimerSettingsProps> = ({ className = '' }) => {
  const { settings, updateSettings, status } = useTimerStore()
  const [isOpen, setIsOpen] = useState(false)
  const [localSettings, setLocalSettings] = useState<TimerSettings>(settings)
  const [errors, setErrors] = useState<Record<string, string>>({})

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
      setIsOpen(false)
    }
  }

  const handleCancel = () => {
    setLocalSettings(settings)
    setErrors({})
    setIsOpen(false)
  }

  const handleReset = () => {
    const defaultSettings: TimerSettings = {
      studyDuration: 25,
      shortBreakDuration: 5,
      longBreakDuration: 15,
      autoStartBreaks: false,
      autoStartStudy: false,
    }
    setLocalSettings(defaultSettings)
    setErrors({})
  }

  const presetOptions = [
    { name: 'Classic', study: 25, shortBreak: 5, longBreak: 15 },
    { name: 'Short & Sweet', study: 15, shortBreak: 3, longBreak: 10 },
    { name: 'Deep Focus', study: 45, shortBreak: 10, longBreak: 30 },
    { name: 'Micro Sessions', study: 10, shortBreak: 2, longBreak: 8 },
  ]

  const handlePreset = (preset: (typeof presetOptions)[0]) => {
    const newSettings = {
      ...localSettings,
      studyDuration: preset.study,
      shortBreakDuration: preset.shortBreak,
      longBreakDuration: preset.longBreak,
    }
    setLocalSettings(newSettings)
    setErrors(validateSettings(newSettings))
  }

  return (
    <div className={className}>
      {/* Settings Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`
          flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-200
          ${
            isOpen
              ? 'bg-blue-100 text-blue-700 shadow-md'
              : 'bg-gray-100 hover:bg-gray-200 text-gray-600 hover:text-gray-800'
          }
        `}
        disabled={status === 'running'}
      >
        <Settings size={16} />
        <span className="text-sm font-medium">Settings</span>
      </button>

      {/* Settings Panel */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-lg border border-gray-200 p-6 z-50">
          <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Timer Settings</h3>
              <div className="flex gap-2">
                <button
                  onClick={handleReset}
                  className="text-sm text-gray-500 hover:text-gray-700 flex items-center gap-1"
                >
                  <RotateCcw size={14} />
                  Reset to Default
                </button>
              </div>
            </div>

            {/* Preset Buttons */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Quick Presets</label>
              <div className="grid grid-cols-2 gap-2">
                {presetOptions.map(preset => (
                  <button
                    key={preset.name}
                    onClick={() => handlePreset(preset)}
                    className="text-left p-3 rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-colors"
                  >
                    <div className="font-medium text-sm text-gray-900">{preset.name}</div>
                    <div className="text-xs text-gray-600">
                      {preset.study}m / {preset.shortBreak}m / {preset.longBreak}m
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Duration Settings */}
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Study Duration
                </label>
                <div className="relative">
                  <input
                    type="number"
                    min="5"
                    max="90"
                    value={localSettings.studyDuration}
                    onChange={e =>
                      handleSettingChange('studyDuration', parseInt(e.target.value) || 25)
                    }
                    className={`
                      w-full px-3 py-2 border rounded-lg text-center font-mono
                      ${errors.studyDuration ? 'border-red-300 bg-red-50' : 'border-gray-300'}
                    `}
                  />
                  <div className="absolute right-3 top-2 text-xs text-gray-500">min</div>
                </div>
                {errors.studyDuration && (
                  <p className="text-xs text-red-600 mt-1">{errors.studyDuration}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Short Break</label>
                <div className="relative">
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
                  <div className="absolute right-3 top-2 text-xs text-gray-500">min</div>
                </div>
                {errors.shortBreakDuration && (
                  <p className="text-xs text-red-600 mt-1">{errors.shortBreakDuration}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Long Break</label>
                <div className="relative">
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
                  <div className="absolute right-3 top-2 text-xs text-gray-500">min</div>
                </div>
                {errors.longBreakDuration && (
                  <p className="text-xs text-red-600 mt-1">{errors.longBreakDuration}</p>
                )}
              </div>
            </div>

            {/* Auto-start Options */}
            <div className="space-y-3">
              <label className="block text-sm font-medium text-gray-700">Automation Settings</label>
              <div className="space-y-2">
                <label className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={localSettings.autoStartBreaks}
                    onChange={e => handleSettingChange('autoStartBreaks', e.target.checked)}
                    className="rounded border-gray-300"
                  />
                  <span className="text-sm text-gray-700">Auto-start breaks</span>
                </label>
                <label className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={localSettings.autoStartStudy}
                    onChange={e => handleSettingChange('autoStartStudy', e.target.checked)}
                    className="rounded border-gray-300"
                  />
                  <span className="text-sm text-gray-700">Auto-start study sessions</span>
                </label>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
              <button
                onClick={handleCancel}
                className="flex items-center gap-2 px-4 py-2 text-sm text-gray-600 hover:text-gray-800 transition-colors"
              >
                <X size={16} />
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={Object.keys(errors).length > 0}
                className={`
                  flex items-center gap-2 px-4 py-2 text-sm rounded-lg transition-colors
                  ${
                    Object.keys(errors).length > 0
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      : 'bg-blue-600 text-white hover:bg-blue-700'
                  }
                `}
              >
                <Check size={16} />
                Save Settings
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
      )}
    </div>
  )
}

export default TimerSettingsPanel
