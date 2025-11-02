import React from 'react'
import { Eye, Type, Zap, UserCheck, Keyboard, X } from 'lucide-react'

interface AccessibilityPanelProps {
  isOpen: boolean
  onClose: () => void
}

const AccessibilityPanel: React.FC<AccessibilityPanelProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null

  const features = [
    {
      icon: Keyboard,
      title: 'Keyboard Navigation',
      description: 'Complete keyboard accessibility with shortcuts for all features',
      items: [
        'Space to start/pause timer',
        'Arrow keys to navigate tasks',
        'Ctrl/⌘ + 1-5 for quick popup access',
        'Shift + ? for help system'
      ]
    },
    {
      icon: Eye,
      title: 'Visual Accessibility',
      description: 'High contrast design with clear visual indicators',
      items: [
        'High contrast colors',
        'Clear focus indicators',
        'Large clickable areas',
        'Progress indicators'
      ]
    },
    {
      icon: Type,
      title: 'Text & Typography',
      description: 'Readable fonts and scalable text',
      items: [
        'Clean, readable fonts',
        'Proper text sizing',
        'Good line spacing',
        'Screen reader friendly'
      ]
    },
    {
      icon: UserCheck,
      title: 'Inclusive Design',
      description: 'Designed for users with different abilities',
      items: [
        'Color-blind friendly palette',
        'Motion sensitivity options',
        'Consistent interaction patterns',
        'Clear error messages'
      ]
    },
    {
      icon: Zap,
      title: 'Performance',
      description: 'Optimized for assistive technologies',
      items: [
        'Fast loading times',
        'Responsive interactions',
        'Efficient state management',
        'Minimal cognitive load'
      ]
    }
  ]

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[80vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <UserCheck className="w-6 h-6 text-green-600" />
            <h2 className="text-xl font-semibold text-gray-900">Accessibility Features</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label="Close accessibility panel"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[60vh]">
          <div className="mb-6">
            <p className="text-gray-600 leading-relaxed">
              Ketchew is built with accessibility in mind, ensuring that all users can effectively 
              manage their time and productivity regardless of their abilities or the assistive 
              technologies they use.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {features.map((feature, index) => {
              const Icon = feature.icon
              return (
                <div key={index} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center space-x-3 mb-3">
                    <Icon className="w-5 h-5 text-blue-600" />
                    <h3 className="text-lg font-semibold text-gray-900">{feature.title}</h3>
                  </div>
                  
                  <p className="text-gray-600 text-sm mb-3">{feature.description}</p>
                  
                  <ul className="space-y-1">
                    {feature.items.map((item, itemIndex) => (
                      <li key={itemIndex} className="flex items-start space-x-2 text-sm text-gray-700">
                        <span className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2 flex-shrink-0"></span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )
            })}
          </div>

          {/* Keyboard Shortcuts Quick Reference */}
          <div className="mt-8 p-4 bg-blue-50 rounded-lg">
            <h3 className="text-lg font-semibold text-blue-900 mb-3">Quick Keyboard Reference</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <h4 className="font-medium text-blue-800 mb-2">Global</h4>
                <ul className="space-y-1 text-blue-700">
                  <li><kbd className="bg-white px-1 rounded">Shift + ?</kbd> Help</li>
                  <li><kbd className="bg-white px-1 rounded">Esc</kbd> Close modals</li>
                  <li><kbd className="bg-white px-1 rounded">Ctrl + 1-5</kbd> Toggle popups</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium text-blue-800 mb-2">Timer</h4>
                <ul className="space-y-1 text-blue-700">
                  <li><kbd className="bg-white px-1 rounded">Space</kbd> Start/Pause</li>
                  <li><kbd className="bg-white px-1 rounded">Enter</kbd> Skip phase</li>
                  <li><kbd className="bg-white px-1 rounded">Ctrl + R</kbd> Reset</li>
                </ul>
              </div>
            </div>
            <p className="text-blue-600 text-xs mt-3">
              Press <kbd className="bg-white px-1 rounded">Shift + ?</kbd> anytime for the complete shortcuts list
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
          <div className="flex items-center justify-between text-sm text-gray-600">
            <p>
              Ketchew follows WCAG 2.1 accessibility guidelines
            </p>
            <p>
              Report accessibility issues on GitHub
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AccessibilityPanel
