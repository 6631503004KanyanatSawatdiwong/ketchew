import React, { useState, useEffect } from 'react'
import { X, Keyboard } from 'lucide-react'
import { useKeyboardShortcutsHelp } from '../hooks/useGlobalKeyboardShortcuts'

const KeyboardShortcutsHelp: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false)
  const shortcuts = useKeyboardShortcutsHelp()

  useEffect(() => {
    const toggleHelp = () => setIsVisible(!isVisible)
    const closeHelp = () => setIsVisible(false)

    // Listen for help toggle event
    window.addEventListener('toggle-help', toggleHelp)
    window.addEventListener('close-modals', closeHelp)

    // Original keyboard shortcut
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === '?' && e.shiftKey) {
        e.preventDefault()
        toggleHelp()
      }
      if (e.key === 'Escape') {
        closeHelp()
      }
    }

    document.addEventListener('keydown', handleKeyPress)

    return () => {
      window.removeEventListener('toggle-help', toggleHelp)
      window.removeEventListener('close-modals', closeHelp)
      document.removeEventListener('keydown', handleKeyPress)
    }
  }, [isVisible])

  const contextNames = {
    global: 'Global',
    timer: 'Timer',
    notes: 'Notes',
    tasks: 'Tasks',
    analytics: 'Analytics'
  }

  if (!isVisible) {
    return (
      <button
        onClick={() => setIsVisible(true)}
        className="fixed bottom-4 right-4 p-3 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-full shadow-lg border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-white dark:hover:bg-gray-800 transition-all duration-200 z-30"
        title="Keyboard Shortcuts (Shift + ?)"
      >
        <Keyboard size={20} />
      </button>
    )
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[80vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <Keyboard className="w-6 h-6 text-blue-600" />
            <h2 className="text-xl font-semibold text-gray-900">Keyboard Shortcuts</h2>
          </div>
          <button
            onClick={() => setIsVisible(false)}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[60vh]">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {Object.entries(shortcuts).map(([context, contextShortcuts]) => (
              <div key={context} className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center space-x-2">
                  <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                  <span>{contextNames[context as keyof typeof contextNames] || context}</span>
                </h3>
                
                <div className="space-y-3">
                  {contextShortcuts.map((shortcut, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <span className="text-gray-700">{shortcut.description}</span>
                      <div className="flex items-center space-x-1">
                        {shortcut.keys.split(' + ').map((key, keyIndex) => (
                          <React.Fragment key={keyIndex}>
                            {keyIndex > 0 && <span className="text-gray-400">+</span>}
                            <kbd className="px-2 py-1 bg-gray-100 border border-gray-300 rounded text-sm font-mono">
                              {key}
                            </kbd>
                          </React.Fragment>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
          <div className="flex items-center justify-between text-sm text-gray-600">
            <p>
              Press <kbd className="px-2 py-1 bg-gray-200 rounded text-xs">Shift + ?</kbd> to toggle this help
            </p>
            <p>
              Press <kbd className="px-2 py-1 bg-gray-200 rounded text-xs">Esc</kbd> to close
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default KeyboardShortcutsHelp
