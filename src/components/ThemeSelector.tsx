import React, { useState } from 'react'
import { Palette, Eye, Download, RotateCcw, Sun, Moon, Leaf, Focus } from 'lucide-react'
import { useThemeStore, THEMES } from '../stores/themeStore'

const ThemeSelector: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all')

  const {
    currentTheme,
    availableThemes,
    previewTheme,
    setTheme,
    setPreviewTheme,
    clearPreview,
    resetToDefault,
  } = useThemeStore()

  const categories = [
    { id: 'all', name: 'All Themes', icon: Palette },
    { id: 'light', name: 'Light', icon: Sun },
    { id: 'dark', name: 'Dark', icon: Moon },
    { id: 'nature', name: 'Nature', icon: Leaf },
    { id: 'focus', name: 'Focus', icon: Focus },
  ]

  const filteredThemes =
    selectedCategory === 'all'
      ? availableThemes
      : availableThemes.filter(theme => theme.category === selectedCategory)

  const getThemeIcon = (category: string) => {
    switch (category) {
      case 'light':
        return Sun
      case 'dark':
        return Moon
      case 'nature':
        return Leaf
      case 'focus':
        return Focus
      default:
        return Palette
    }
  }

  const handlePreview = (themeId: string) => {
    if (previewTheme?.id === themeId) {
      clearPreview()
    } else {
      setPreviewTheme(themeId)
    }
  }

  const handleApply = (themeId: string) => {
    setTheme(themeId)
  }

  return (
    <div className="w-96">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">Theme Settings</h2>
        <div className="flex gap-2">
          <button
            onClick={resetToDefault}
            className="p-2 text-gray-500 hover:text-gray-700 rounded"
            title="Reset to Default"
          >
            <RotateCcw size={20} />
          </button>
        </div>
      </div>

      {/* Current Theme Display */}
      <div className="mb-6 p-4 bg-white bg-opacity-90 backdrop-blur-sm border border-gray-200 rounded-lg">
        <div className="flex items-center gap-3 mb-3">
          <div
            className="w-12 h-12 rounded-lg border flex items-center justify-center"
            style={{
              backgroundColor: currentTheme.colors.primary,
              borderColor: currentTheme.colors.border,
            }}
          >
            {React.createElement(getThemeIcon(currentTheme.category), {
              size: 20,
              color: currentTheme.colors.primaryText,
            })}
          </div>
          <div className="flex-1">
            <div className="font-medium">{currentTheme.name}</div>
            <div className="text-sm text-gray-600">{currentTheme.description}</div>
            <div className="text-xs text-gray-500 capitalize mt-1">{currentTheme.category}</div>
          </div>
        </div>

        {/* Color Preview */}
        <div className="flex gap-2">
          <div
            className="w-8 h-8 rounded border"
            style={{ backgroundColor: currentTheme.colors.primary }}
            title="Primary"
          />
          <div
            className="w-8 h-8 rounded border"
            style={{ backgroundColor: currentTheme.colors.background }}
            title="Background"
          />
          <div
            className="w-8 h-8 rounded border"
            style={{ backgroundColor: currentTheme.colors.surface }}
            title="Surface"
          />
          <div
            className="w-8 h-8 rounded border"
            style={{ backgroundColor: currentTheme.colors.text }}
            title="Text"
          />
          <div
            className="w-8 h-8 rounded border"
            style={{ backgroundColor: currentTheme.colors.success }}
            title="Success"
          />
        </div>
      </div>

      {/* Category Filter */}
      <div className="mb-6">
        <div className="flex flex-wrap gap-2">
          {categories.map(category => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                selectedCategory === category.id
                  ? 'bg-gray-900 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <category.icon size={14} />
              {category.name}
            </button>
          ))}
        </div>
      </div>

      {/* Theme Grid */}
      <div className="space-y-4 max-h-96 overflow-y-auto">
        {filteredThemes.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <p>No themes found in this category</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredThemes.map(theme => (
              <div
                key={theme.id}
                className={`relative group p-4 border-2 rounded-lg transition-all ${
                  currentTheme.id === theme.id
                    ? 'border-blue-500 ring-2 ring-blue-200'
                    : previewTheme?.id === theme.id
                      ? 'border-yellow-500 ring-2 ring-yellow-200'
                      : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center gap-3 mb-3">
                  <div
                    className="w-10 h-10 rounded-lg border flex items-center justify-center flex-shrink-0"
                    style={{
                      backgroundColor: theme.colors.primary,
                      borderColor: theme.colors.border,
                    }}
                  >
                    {React.createElement(getThemeIcon(theme.category), {
                      size: 16,
                      color: theme.colors.primaryText,
                    })}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium">{theme.name}</div>
                    <div className="text-sm text-gray-600 truncate">{theme.description}</div>
                    <div className="text-xs text-gray-500 capitalize">{theme.category}</div>
                  </div>

                  {/* Action buttons */}
                  <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => handlePreview(theme.id)}
                      className={`p-2 rounded-full transition-colors ${
                        previewTheme?.id === theme.id
                          ? 'bg-yellow-500 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                      title="Preview"
                    >
                      <Eye size={14} />
                    </button>
                    <button
                      onClick={() => handleApply(theme.id)}
                      className="p-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors"
                      title="Apply Theme"
                    >
                      <Download size={14} />
                    </button>
                  </div>
                </div>

                {/* Color Preview */}
                <div className="flex gap-1">
                  <div
                    className="w-6 h-6 rounded border"
                    style={{ backgroundColor: theme.colors.primary }}
                    title="Primary"
                  />
                  <div
                    className="w-6 h-6 rounded border"
                    style={{ backgroundColor: theme.colors.background }}
                    title="Background"
                  />
                  <div
                    className="w-6 h-6 rounded border"
                    style={{ backgroundColor: theme.colors.surface }}
                    title="Surface"
                  />
                  <div
                    className="w-6 h-6 rounded border"
                    style={{ backgroundColor: theme.colors.text }}
                    title="Text"
                  />
                  <div
                    className="w-6 h-6 rounded border"
                    style={{ backgroundColor: theme.colors.success }}
                    title="Success"
                  />
                  <div
                    className="w-6 h-6 rounded border"
                    style={{ backgroundColor: theme.colors.warning }}
                    title="Warning"
                  />
                  <div
                    className="w-6 h-6 rounded border"
                    style={{ backgroundColor: theme.colors.error }}
                    title="Error"
                  />
                </div>

                {/* Selected indicator */}
                {currentTheme.id === theme.id && (
                  <div className="absolute top-2 right-2 bg-blue-500 text-white rounded-full p-1">
                    <Download size={12} />
                  </div>
                )}

                {/* Preview indicator */}
                {previewTheme?.id === theme.id && (
                  <div className="absolute top-2 left-2 bg-yellow-500 text-white rounded-full p-1">
                    <Eye size={12} />
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Theme System Info */}
      <div className="mt-6 p-3 bg-gray-50 rounded-lg text-sm text-gray-600">
        <p className="font-medium mb-1">Dynamic Theme System</p>
        <ul className="space-y-1 text-xs">
          <li>• {THEMES.length} built-in themes</li>
          <li>• Real-time preview and switching</li>
          <li>• Category-based organization</li>
          <li>• Comprehensive color schemes</li>
          <li>• Optimized for productivity and focus</li>
        </ul>
      </div>

      {/* Preview Notice */}
      {previewTheme && (
        <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
          <div className="text-sm text-yellow-800">
            <strong>Preview Mode:</strong> You&apos;re previewing &quot;{previewTheme.name}&quot;.
            Click &quot;Apply Theme&quot; to save this selection.
          </div>
        </div>
      )}
    </div>
  )
}

export default ThemeSelector
