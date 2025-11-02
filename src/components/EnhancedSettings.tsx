import React, { useState } from 'react'
import { X, Settings, Bell, Volume2, Monitor, Keyboard, Download, Upload, Trash2, RotateCcw } from 'lucide-react'
import { useTimerStore } from '../stores/timerStore'
import { useTaskStore } from '../stores/taskStore'
import { useNotesStore } from '../stores/notesStore'
import { useAnalyticsStore } from '../stores/analyticsStore'

interface EnhancedSettingsProps {
  isOpen: boolean
  onClose: () => void
}

const EnhancedSettings: React.FC<EnhancedSettingsProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState('timer')
  const { settings, updateSettings } = useTimerStore()
  const { taskSessions } = useTaskStore()
  const { notes, clearAllNotes } = useNotesStore()
  const { sessions } = useAnalyticsStore()

  const [showConfirmation, setShowConfirmation] = useState<string | null>(null)

  if (!isOpen) return null

  const tabs = [
    { id: 'timer', label: 'Timer', icon: Settings },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'audio', label: 'Audio', icon: Volume2 },
    { id: 'display', label: 'Display', icon: Monitor },
    { id: 'keyboard', label: 'Keyboard', icon: Keyboard },
    { id: 'data', label: 'Data', icon: Download },
  ]

  const exportData = () => {
    // Get todos from localStorage since they're not in a Zustand store
    const todosData = localStorage.getItem('ketchew_todos')
    const todos = todosData ? JSON.parse(todosData) : []

    const data = {
      todos,
      notes,
      analytics: sessions,
      taskSessions,
      settings,
      exportDate: new Date().toISOString()
    }

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `ketchew-backup-${new Date().toISOString().split('T')[0]}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const importData = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target?.result as string)
        
        // Import settings
        if (data.settings) {
          updateSettings(data.settings)
        }

        // Import todos to localStorage
        if (data.todos && Array.isArray(data.todos)) {
          localStorage.setItem('ketchew_todos', JSON.stringify(data.todos))
        }

        // Note: Notes and analytics would need import methods in their stores
        alert('Settings and todos imported successfully! Please refresh the page to see all changes.')
      } catch (err) {
        console.error('Import error:', err)
        alert('Error importing data. Please check the file format.')
      }
    }
    reader.readAsText(file)
  }

  const confirmAction = (action: string, callback: () => void) => {
    setShowConfirmation(action)
    setTimeout(() => {
      if (window.confirm(`Are you sure you want to ${action}? This action cannot be undone.`)) {
        callback()
        setShowConfirmation(null)
      } else {
        setShowConfirmation(null)
      }
    }, 100)
  }

  const clearAllTasks = () => {
    localStorage.removeItem('ketchew_todos')
    alert('All tasks have been cleared. Please refresh the page.')
  }

  const clearAllAnalytics = () => {
    localStorage.removeItem('ketchew-analytics-store')
    alert('All analytics data has been cleared. Please refresh the page.')
  }

  const renderTabContent = () => {
    switch (activeTab) {
      case 'timer':
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Study Duration (minutes)
              </label>
              <input
                type="number"
                min="1"
                max="60"
                value={settings.studyDuration}
                onChange={(e) => updateSettings({ studyDuration: Number(e.target.value) })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Short Break (minutes)
              </label>
              <input
                type="number"
                min="1"
                max="30"
                value={settings.shortBreakDuration}
                onChange={(e) => updateSettings({ shortBreakDuration: Number(e.target.value) })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Long Break (minutes)
              </label>
              <input
                type="number"
                min="1"
                max="60"
                value={settings.longBreakDuration}
                onChange={(e) => updateSettings({ longBreakDuration: Number(e.target.value) })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="autoStartBreaks"
                checked={settings.autoStartBreaks}
                onChange={(e) => updateSettings({ autoStartBreaks: e.target.checked })}
                className="mr-2"
              />
              <label htmlFor="autoStartBreaks" className="text-sm text-gray-700">
                Auto-start breaks
              </label>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="autoStartStudy"
                checked={settings.autoStartStudy}
                onChange={(e) => updateSettings({ autoStartStudy: e.target.checked })}
                className="mr-2"
              />
              <label htmlFor="autoStartStudy" className="text-sm text-gray-700">
                Auto-start study sessions
              </label>
            </div>
          </div>
        )

      case 'audio':
        return (
          <div className="space-y-6">
            <div className="text-center py-8">
              <p className="text-gray-500">Audio settings are managed globally in the Audio popup.</p>
              <p className="text-sm text-gray-400 mt-2">Use Ctrl/⌘ + 5 to open audio settings.</p>
            </div>
          </div>
        )

      case 'data':
        return (
          <div className="space-y-6">
            <div className="border-b border-gray-200 pb-4">
              <h3 className="text-lg font-medium text-gray-900 mb-2">Backup & Restore</h3>
              <p className="text-sm text-gray-600 mb-4">
                Export your data to backup or import from a previous backup.
              </p>
              
              <div className="flex space-x-3">
                <button
                  onClick={exportData}
                  className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Export Data
                </button>
                
                <label className="flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors cursor-pointer">
                  <Upload className="w-4 h-4 mr-2" />
                  Import Data
                  <input
                    type="file"
                    accept=".json"
                    onChange={importData}
                    className="hidden"
                  />
                </label>
              </div>
            </div>

            <div className="border-b border-gray-200 pb-4">
              <h3 className="text-lg font-medium text-gray-900 mb-2">Reset Data</h3>
              <p className="text-sm text-gray-600 mb-4">
                Clear specific data types. Use with caution - this cannot be undone.
              </p>
              
              <div className="space-y-3">
                <button
                  onClick={() => confirmAction('clear all tasks', clearAllTasks)}
                  className="flex items-center px-4 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700 transition-colors"
                  disabled={showConfirmation === 'clear all tasks'}
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Clear All Tasks
                </button>
                
                <button
                  onClick={() => confirmAction('clear all notes', clearAllNotes)}
                  className="flex items-center px-4 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700 transition-colors"
                  disabled={showConfirmation === 'clear all notes'}
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Clear All Notes
                </button>
                
                <button
                  onClick={() => confirmAction('clear analytics data', clearAllAnalytics)}
                  className="flex items-center px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
                  disabled={showConfirmation === 'clear analytics data'}
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Clear Analytics Data
                </button>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Reset Settings</h3>
              <p className="text-sm text-gray-600 mb-4">
                Reset all settings to their default values.
              </p>
              
              <button
                onClick={() => confirmAction('reset all settings', () => {
                  updateSettings({
                    studyDuration: 25,
                    shortBreakDuration: 5,
                    longBreakDuration: 15,
                    autoStartBreaks: false,
                    autoStartStudy: false
                  })
                })}
                className="flex items-center px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
                disabled={showConfirmation === 'reset all settings'}
              >
                <RotateCcw className="w-4 h-4 mr-2" />
                Reset to Defaults
              </button>
            </div>
          </div>
        )

      default:
        return (
          <div className="text-center py-8">
            <p className="text-gray-500">Settings for {activeTab} coming soon...</p>
          </div>
        )
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[80vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <Settings className="w-6 h-6 text-blue-600" />
            <h2 className="text-xl font-semibold text-gray-900">Settings</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <div className="flex">
          {/* Sidebar */}
          <div className="w-64 bg-gray-50 border-r border-gray-200">
            <nav className="p-4 space-y-2">
              {tabs.map((tab) => {
                const Icon = tab.icon
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center space-x-3 px-3 py-2 rounded-md text-left transition-colors ${
                      activeTab === tab.id
                        ? 'bg-blue-100 text-blue-700'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span>{tab.label}</span>
                  </button>
                )
              })}
            </nav>
          </div>

          {/* Content */}
          <div className="flex-1 p-6 overflow-y-auto max-h-[60vh]">
            {renderTabContent()}
          </div>
        </div>
      </div>
    </div>
  )
}

export default EnhancedSettings
