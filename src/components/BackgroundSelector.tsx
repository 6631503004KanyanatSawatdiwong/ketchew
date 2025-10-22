import React, { useState } from 'react'
import { Search, Eye, Heart, Download, RotateCcw, Monitor } from 'lucide-react'
import { useLocalStorage } from '../hooks/useLocalStorage'
import {
  BACKGROUND_LIBRARY,
  BACKGROUND_CATEGORIES,
  getBackgroundsByCategory,
  getRandomBackground,
  searchBackgrounds,
  BackgroundImage,
} from '../data/backgroundLibrary'

const BackgroundSelector: React.FC = () => {
  const [selectedBackground, setSelectedBackground] = useLocalStorage<string | null>(
    'selectedBackground',
    null
  )
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [searchQuery, setSearchQuery] = useState<string>('')
  const [favorites, setFavorites] = useLocalStorage<string[]>('favoriteBackgrounds', [])
  const [previewBackground, setPreviewBackground] = useState<string | null>(null)

  // Get filtered backgrounds based on category and search
  const getFilteredBackgrounds = (): BackgroundImage[] => {
    const backgrounds = searchQuery
      ? searchBackgrounds(searchQuery)
      : getBackgroundsByCategory(selectedCategory)

    return backgrounds
  }

  const filteredBackgrounds = getFilteredBackgrounds()
  const currentBackground = selectedBackground
    ? BACKGROUND_LIBRARY.find(bg => bg.id === selectedBackground)
    : null

  const handleBackgroundSelect = (backgroundId: string) => {
    setSelectedBackground(backgroundId)
    setPreviewBackground(null)

    // Apply background immediately
    const background = BACKGROUND_LIBRARY.find(bg => bg.id === backgroundId)
    if (background) {
      document.body.style.backgroundImage = `url(${background.imageUrl})`
      document.body.style.backgroundSize = 'cover'
      document.body.style.backgroundPosition = 'center'
      document.body.style.backgroundRepeat = 'no-repeat'
      document.body.style.backgroundAttachment = 'fixed'
    }
  }

  const handleRandomBackground = () => {
    const randomBg = getRandomBackground(selectedCategory === 'all' ? undefined : selectedCategory)
    handleBackgroundSelect(randomBg.id)
  }

  const handleClearBackground = () => {
    setSelectedBackground(null)
    setPreviewBackground(null)
    document.body.style.backgroundImage = ''
  }

  const toggleFavorite = (backgroundId: string) => {
    setFavorites(prev =>
      prev.includes(backgroundId) ? prev.filter(id => id !== backgroundId) : [...prev, backgroundId]
    )
  }

  const handlePreview = (backgroundId: string) => {
    if (previewBackground === backgroundId) {
      setPreviewBackground(null)
      return
    }

    setPreviewBackground(backgroundId)
    const background = BACKGROUND_LIBRARY.find(bg => bg.id === backgroundId)
    if (background) {
      document.body.style.backgroundImage = `url(${background.imageUrl})`
      document.body.style.backgroundSize = 'cover'
      document.body.style.backgroundPosition = 'center'
      document.body.style.backgroundRepeat = 'no-repeat'
      document.body.style.backgroundAttachment = 'fixed'
    }
  }

  // Apply current background on component mount
  React.useEffect(() => {
    if (currentBackground) {
      document.body.style.backgroundImage = `url(${currentBackground.imageUrl})`
      document.body.style.backgroundSize = 'cover'
      document.body.style.backgroundPosition = 'center'
      document.body.style.backgroundRepeat = 'no-repeat'
      document.body.style.backgroundAttachment = 'fixed'
    }
  }, [currentBackground])

  return (
    <div className="w-96">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">Background Images</h2>
        <div className="flex gap-2">
          <button
            onClick={handleRandomBackground}
            className="p-2 text-gray-500 hover:text-gray-700 rounded"
            title="Random Background"
          >
            <RotateCcw size={20} />
          </button>
          <button
            onClick={handleClearBackground}
            className="p-2 text-gray-500 hover:text-gray-700 rounded"
            title="Clear Background"
          >
            <Monitor size={20} />
          </button>
        </div>
      </div>

      {/* Current Background Display */}
      {currentBackground && (
        <div className="mb-6 p-4 bg-white bg-opacity-90 backdrop-blur-sm border border-gray-200 rounded-lg">
          <div className="flex items-center gap-3 mb-3">
            <img
              src={currentBackground.imageUrl}
              alt={currentBackground.name}
              className="w-16 h-12 object-cover rounded border"
            />
            <div className="flex-1">
              <div className="font-medium">{currentBackground.name}</div>
              <div className="text-sm text-gray-600">{currentBackground.description}</div>
              <div className="text-xs text-gray-500 capitalize mt-1">
                {currentBackground.category} • by {currentBackground.artist}
              </div>
            </div>
            <button
              onClick={() => toggleFavorite(currentBackground.id)}
              className={`p-2 rounded ${
                favorites.includes(currentBackground.id)
                  ? 'text-red-500 hover:text-red-600'
                  : 'text-gray-400 hover:text-red-500'
              }`}
              title="Toggle Favorite"
            >
              <Heart
                size={16}
                fill={favorites.includes(currentBackground.id) ? 'currentColor' : 'none'}
              />
            </button>
          </div>
        </div>
      )}

      {/* Search */}
      <div className="mb-4">
        <div className="relative">
          <Search size={16} className="absolute left-3 top-3 text-gray-400" />
          <input
            type="text"
            placeholder="Search backgrounds..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Category Filter */}
      <div className="mb-6">
        <div className="flex flex-wrap gap-2">
          {BACKGROUND_CATEGORIES.map(category => (
            <button
              key={category.id}
              onClick={() => {
                setSelectedCategory(category.id)
                setSearchQuery('')
              }}
              className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                selectedCategory === category.id
                  ? 'bg-gray-900 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {category.name} ({category.count})
            </button>
          ))}
        </div>
      </div>

      {/* Background Grid */}
      <div className="space-y-4 max-h-96 overflow-y-auto">
        {filteredBackgrounds.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <p>No backgrounds found</p>
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="text-blue-500 hover:text-blue-600 text-sm mt-2"
              >
                Clear search
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {filteredBackgrounds.map(background => (
              <div
                key={background.id}
                className={`relative group cursor-pointer border-2 rounded-lg overflow-hidden transition-all ${
                  selectedBackground === background.id
                    ? 'border-blue-500 ring-2 ring-blue-200'
                    : previewBackground === background.id
                      ? 'border-yellow-500 ring-2 ring-yellow-200'
                      : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="aspect-video">
                  <img
                    src={background.imageUrl}
                    alt={background.name}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>

                {/* Overlay with controls */}
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all duration-200">
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="flex gap-2">
                      <button
                        onClick={() => handlePreview(background.id)}
                        className={`p-2 rounded-full backdrop-blur-sm transition-colors ${
                          previewBackground === background.id
                            ? 'bg-yellow-500 text-white'
                            : 'bg-white bg-opacity-90 text-gray-700 hover:bg-opacity-100'
                        }`}
                        title="Preview"
                      >
                        <Eye size={16} />
                      </button>
                      <button
                        onClick={() => handleBackgroundSelect(background.id)}
                        className="p-2 bg-blue-500 text-white rounded-full backdrop-blur-sm hover:bg-blue-600 transition-colors"
                        title="Apply Background"
                      >
                        <Download size={16} />
                      </button>
                      <button
                        onClick={() => toggleFavorite(background.id)}
                        className={`p-2 rounded-full backdrop-blur-sm transition-colors ${
                          favorites.includes(background.id)
                            ? 'bg-red-500 text-white'
                            : 'bg-white bg-opacity-90 text-gray-700 hover:bg-opacity-100'
                        }`}
                        title="Toggle Favorite"
                      >
                        <Heart
                          size={16}
                          fill={favorites.includes(background.id) ? 'currentColor' : 'none'}
                        />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Background info */}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-3">
                  <div className="text-white text-sm font-medium">{background.name}</div>
                  <div className="text-gray-200 text-xs">
                    {background.tags.slice(0, 3).join(', ')}
                  </div>
                </div>

                {/* Selected indicator */}
                {selectedBackground === background.id && (
                  <div className="absolute top-2 right-2 bg-blue-500 text-white rounded-full p-1">
                    <Download size={12} />
                  </div>
                )}

                {/* Preview indicator */}
                {previewBackground === background.id && (
                  <div className="absolute top-2 left-2 bg-yellow-500 text-white rounded-full p-1">
                    <Eye size={12} />
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Background Library Info */}
      <div className="mt-6 p-3 bg-gray-50 rounded-lg text-sm text-gray-600">
        <p className="font-medium mb-1">Enhanced Background Library</p>
        <ul className="space-y-1 text-xs">
          <li>• {BACKGROUND_LIBRARY.length} high-quality backgrounds</li>
          <li>• Organized by categories and themes</li>
          <li>• Search and favorite functionality</li>
          <li>• Real-time preview system</li>
          <li>• Credits to Unsplash photographers</li>
        </ul>
      </div>

      {/* Preview Notice */}
      {previewBackground && (
        <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
          <div className="text-sm text-yellow-800">
            <strong>Preview Mode:</strong> Click &quot;Apply Background&quot; to save this
            selection, or select another image to change preview.
          </div>
        </div>
      )}
    </div>
  )
}

export default BackgroundSelector
