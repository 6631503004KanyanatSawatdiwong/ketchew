import React, { useCallback } from 'react'
import { useLocalStorage } from '../hooks/useLocalStorage'

interface BackgroundOption {
  id: string
  name: string
  thumbnail: string
  url: string
  category: 'nature' | 'abstract' | 'minimal' | 'workspace'
}

const backgroundOptions: BackgroundOption[] = [
  // Nature
  {
    id: 'forest',
    name: 'Forest Path',
    thumbnail:
      'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=150&h=100&fit=crop&auto=format',
    url: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1920&h=1080&fit=crop&auto=format',
    category: 'nature',
  },
  {
    id: 'mountains',
    name: 'Mountain Lake',
    thumbnail:
      'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=150&h=100&fit=crop&auto=format',
    url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&h=1080&fit=crop&auto=format',
    category: 'nature',
  },
  {
    id: 'ocean',
    name: 'Ocean Waves',
    thumbnail:
      'https://images.unsplash.com/photo-1505142468610-359e7d316be0?w=150&h=100&fit=crop&auto=format',
    url: 'https://images.unsplash.com/photo-1505142468610-359e7d316be0?w=1920&h=1080&fit=crop&auto=format',
    category: 'nature',
  },

  // Abstract
  {
    id: 'gradient1',
    name: 'Purple Gradient',
    thumbnail:
      'https://images.unsplash.com/photo-1557672172-298e090bd0f1?w=150&h=100&fit=crop&auto=format',
    url: 'https://images.unsplash.com/photo-1557672172-298e090bd0f1?w=1920&h=1080&fit=crop&auto=format',
    category: 'abstract',
  },
  {
    id: 'gradient2',
    name: 'Blue Waves',
    thumbnail:
      'https://images.unsplash.com/photo-1558591710-4b4a1ae0f04d?w=150&h=100&fit=crop&auto=format',
    url: 'https://images.unsplash.com/photo-1558591710-4b4a1ae0f04d?w=1920&h=1080&fit=crop&auto=format',
    category: 'abstract',
  },

  // Minimal
  {
    id: 'minimal1',
    name: 'Clean White',
    thumbnail:
      'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTUwIiBoZWlnaHQ9IjEwMCIgdmlld0JveD0iMCAwIDE1MCAxMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjE1MCIgaGVpZ2h0PSIxMDAiIGZpbGw9IiNmOWZhZmIiLz48L3N2Zz4=',
    url: '',
    category: 'minimal',
  },
  {
    id: 'minimal2',
    name: 'Soft Gray',
    thumbnail:
      'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTUwIiBoZWlnaHQ9IjEwMCIgdmlld0JveD0iMCAwIDE1MCAxMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjE1MCIgaGVpZ2h0PSIxMDAiIGZpbGw9IiNmM2Y0ZjYiLz48L3N2Zz4=',
    url: '',
    category: 'minimal',
  },

  // Workspace
  {
    id: 'workspace1',
    name: 'Coffee Shop',
    thumbnail:
      'https://images.unsplash.com/photo-1521017432531-fbd92d768814?w=150&h=100&fit=crop&auto=format',
    url: 'https://images.unsplash.com/photo-1521017432531-fbd92d768814?w=1920&h=1080&fit=crop&auto=format',
    category: 'workspace',
  },
  {
    id: 'workspace2',
    name: 'Modern Office',
    thumbnail:
      'https://images.unsplash.com/photo-1497366216548-37526070297c?w=150&h=100&fit=crop&auto=format',
    url: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=1920&h=1080&fit=crop&auto=format',
    category: 'workspace',
  },
]

const BackgroundSelector: React.FC = () => {
  const [selectedBackground, setSelectedBackground] = useLocalStorage<string>(
    'ketchew_background',
    'minimal1'
  )
  const [selectedCategory, setSelectedCategory] = React.useState<string>('all')

  const categories = [
    { id: 'all', name: 'All' },
    { id: 'nature', name: 'Nature' },
    { id: 'abstract', name: 'Abstract' },
    { id: 'minimal', name: 'Minimal' },
    { id: 'workspace', name: 'Workspace' },
  ]

  const filteredBackgrounds =
    selectedCategory === 'all'
      ? backgroundOptions
      : backgroundOptions.filter(bg => bg.category === selectedCategory)

  const applyBackground = useCallback(
    (background: BackgroundOption) => {
      setSelectedBackground(background.id)

      // Apply background to body
      const body = document.body
      if (background.url) {
        body.style.backgroundImage = `url(${background.url})`
        body.style.backgroundSize = 'cover'
        body.style.backgroundPosition = 'center'
        body.style.backgroundRepeat = 'no-repeat'
      } else {
        // Handle minimal backgrounds with solid colors
        body.style.backgroundImage = 'none'
        if (background.id === 'minimal1') {
          body.style.backgroundColor = '#f9fafb'
        } else if (background.id === 'minimal2') {
          body.style.backgroundColor = '#f3f4f6'
        }
      }
    },
    [setSelectedBackground]
  )

  // Apply saved background on component mount
  React.useEffect(() => {
    const savedBackground = backgroundOptions.find(bg => bg.id === selectedBackground)
    if (savedBackground) {
      applyBackground(savedBackground)
    }
  }, [selectedBackground, applyBackground])

  return (
    <div className="w-96">
      <h2 className="text-2xl font-bold mb-6">Background Settings</h2>

      {/* Category Filter */}
      <div className="mb-6">
        <div className="flex flex-wrap gap-2">
          {categories.map(category => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                selectedCategory === category.id
                  ? 'bg-gray-900 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {category.name}
            </button>
          ))}
        </div>
      </div>

      {/* Background Grid */}
      <div className="grid grid-cols-2 gap-4 max-h-96 overflow-y-auto">
        {filteredBackgrounds.map(background => (
          <div
            key={background.id}
            className={`relative cursor-pointer rounded-lg overflow-hidden border-2 transition-all hover:scale-105 ${
              selectedBackground === background.id
                ? 'border-gray-900 ring-2 ring-gray-200'
                : 'border-gray-200 hover:border-gray-300'
            }`}
            onClick={() => applyBackground(background)}
          >
            <img
              src={background.thumbnail}
              alt={background.name}
              className="w-full h-20 object-cover"
            />
            <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white text-xs p-2">
              {background.name}
            </div>
            {selectedBackground === background.id && (
              <div className="absolute top-2 right-2 w-4 h-4 bg-gray-900 rounded-full flex items-center justify-center">
                <div className="w-2 h-2 bg-white rounded-full" />
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Custom Background Upload */}
      <div className="mt-6 pt-6 border-t border-gray-200">
        <h3 className="font-semibold mb-3">Custom Background</h3>
        <div className="space-y-3">
          <input
            type="file"
            accept="image/*"
            onChange={e => {
              const file = e.target.files?.[0]
              if (file) {
                const reader = new FileReader()
                reader.onload = event => {
                  const imageUrl = event.target?.result as string
                  if (imageUrl) {
                    document.body.style.backgroundImage = `url(${imageUrl})`
                    document.body.style.backgroundSize = 'cover'
                    document.body.style.backgroundPosition = 'center'
                    document.body.style.backgroundRepeat = 'no-repeat'
                    setSelectedBackground('custom')
                  }
                }
                reader.readAsDataURL(file)
              }
            }}
            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-gray-50 file:text-gray-700 hover:file:bg-gray-100"
          />
          <p className="text-xs text-gray-500">
            Upload your own image (JPG, PNG). Best resolution: 1920x1080
          </p>
        </div>
      </div>

      {/* Reset Button */}
      <div className="mt-4">
        <button
          onClick={() => {
            document.body.style.backgroundImage = 'none'
            document.body.style.backgroundColor = '#f9fafb'
            setSelectedBackground('minimal1')
          }}
          className="w-full btn-secondary"
        >
          Reset to Default
        </button>
      </div>
    </div>
  )
}

export default BackgroundSelector
