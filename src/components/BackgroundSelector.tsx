import React from 'react'
import { useLocalStorage } from '../hooks/useLocalStorage'
import {
  BACKGROUND_LIBRARY,
  BACKGROUND_CATEGORIES,
  getBackgroundsByCategory,
} from '../data/backgroundLibrary'

const BackgroundSelector: React.FC = () => {
  const [selectedBackground, setSelectedBackground] = useLocalStorage<string>(
    'selectedBackground',
    'tomato-default' // Default to tomato if nothing is stored
  )

  // Force a re-render when localStorage changes
  const [, forceUpdate] = React.useReducer(x => x + 1, 0)

  const handleBackgroundSelect = (backgroundId: string) => {
    console.log('Selecting background:', backgroundId)
    setSelectedBackground(backgroundId)
    forceUpdate() // Force re-render to update UI

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

  // Apply current background on component mount - ensure selected background is displayed
  React.useEffect(() => {
    const currentBackground = BACKGROUND_LIBRARY.find(bg => bg.id === selectedBackground)

    if (currentBackground) {
      console.log('BackgroundSelector applying background:', selectedBackground)
      document.body.style.backgroundImage = `url(${currentBackground.imageUrl})`
      document.body.style.backgroundSize = 'cover'
      document.body.style.backgroundPosition = 'center'
      document.body.style.backgroundRepeat = 'no-repeat'
      document.body.style.backgroundAttachment = 'fixed'
    }
  }, [selectedBackground])

  return (
    <div className="w-full h-full px-4 pt-0 pb-2 overflow-y-auto">
      {BACKGROUND_CATEGORIES.map((category, index) => (
        <div key={category.id}>
          {/* Separator line - skip for first category */}
          {index > 0 && <div className="border-b border-gray-300 mb-2"></div>}
          {/* Category Header */}
          <div className="text-sm font-medium text-gray-800 mb-2 mt-3 first:mt-0">
            {category.name}
          </div>

          {/* Background Grid for this category */}
          <div className="grid grid-cols-2 gap-3 mb-4">
            {getBackgroundsByCategory(category.id).map(background => {
              const isSelected = selectedBackground === background.id

              return (
                <div
                  key={background.id}
                  className="cursor-pointer"
                  onClick={() => handleBackgroundSelect(background.id)}
                >
                  <div
                    className={`relative rounded-xl overflow-hidden transition-all ${
                      isSelected ? 'ring-2 ring-blue-500' : 'hover:ring-1 hover:ring-gray-300'
                    }`}
                  >
                    <div className="aspect-[4/3]">
                      <img
                        src={background.imageUrl}
                        alt={background.name}
                        className="w-full h-full object-cover rounded-xl"
                        loading="lazy"
                      />
                    </div>
                  </div>

                  {/* Image name below the image */}
                  <div className="text-xs text-gray-600 mt-1 text-center truncate">
                    {background.name.replace('Ketchew ', '')}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      ))}
    </div>
  )
}

export default BackgroundSelector
