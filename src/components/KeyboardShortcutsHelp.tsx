import React, { useState } from 'react'
import { X, Keyboard } from 'lucide-react'

const KeyboardShortcutsHelp: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false)

  const shortcuts = [
    { key: 'Ctrl/⌘ + 1', action: 'Open/Close Timer' },
    { key: 'Ctrl/⌘ + 2', action: 'Open/Close Tasks' },
    { key: 'Ctrl/⌘ + 3', action: 'Open/Close Notes' },
    { key: 'Ctrl/⌘ + 4', action: 'Open/Close Background' },
    { key: 'Ctrl/⌘ + 5', action: 'Open/Close Audio' },
    { key: 'Ctrl/⌘ + W', action: 'Close Focused Popup' },
    { key: 'Ctrl/⌘ + C', action: 'Cascade All Popups' },
  ]

  if (!isVisible) {
    return (
      <button
        onClick={() => setIsVisible(true)}
        className="fixed bottom-4 right-4 p-3 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-full shadow-lg border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-white dark:hover:bg-gray-800 transition-all duration-200 z-30"
        title="Keyboard Shortcuts"
      >
        <Keyboard size={20} />
      </button>
    )
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Keyboard size={24} className="text-gray-700" />
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
              Keyboard Shortcuts
            </h2>
          </div>
          <button
            onClick={() => setIsVisible(false)}
            className="p-1 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div className="space-y-3">
          {shortcuts.map((shortcut, index) => (
            <div key={index} className="flex items-center justify-between py-2">
              <span className="text-sm text-gray-600">{shortcut.action}</span>
              <kbd className="px-2 py-1 bg-gray-100 border border-gray-300 rounded text-xs font-mono text-gray-800">
                {shortcut.key}
              </kbd>
            </div>
          ))}
        </div>

        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <h3 className="text-sm font-medium text-blue-900 mb-2">Multi-Popup Features:</h3>
          <ul className="text-xs text-blue-800 space-y-1">
            <li>• Multiple popups can be open simultaneously</li>
            <li>• Drag popup headers to move windows around</li>
            <li>• Click any popup to bring it to front</li>
            <li>• Use minimize/restore buttons in popup headers</li>
            <li>• Positions are saved during your session</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

export default KeyboardShortcutsHelp
