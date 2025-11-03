import React, { useState } from 'react'
import { Volume2, VolumeX, Play, Pause, RotateCcw } from 'lucide-react'
import { SOUND_LIBRARY, getSoundsByCategory } from '../data/soundLibrary'
import { SoundOption } from '../types'

const SoundSelector: React.FC = () => {
  const [selectedSound, setSelectedSound] = useState<string | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [volume, setVolume] = useState(0.5)
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [currentAudio, setCurrentAudio] = useState<HTMLAudioElement | null>(null)

  const categories = [
    { id: 'all', name: 'All Sounds' },
    { id: 'nature', name: 'Nature' },
    { id: 'ambient', name: 'Ambient' },
    { id: 'focus', name: 'Focus' },
    { id: 'notification', name: 'Notifications' },
  ]

  const getFilteredSounds = (): SoundOption[] => {
    return selectedCategory === 'all' ? SOUND_LIBRARY : getSoundsByCategory(selectedCategory)
  }

  const handleSoundSelect = (soundId: string) => {
    // Stop current audio if playing
    if (currentAudio) {
      currentAudio.pause()
      currentAudio.currentTime = 0
    }

    setSelectedSound(soundId)
    setIsPlaying(false)
    setCurrentAudio(null)
  }

  const handlePlayPause = (soundId?: string) => {
    const targetSoundId = soundId || selectedSound
    if (!targetSoundId) return

    const sound = SOUND_LIBRARY.find(s => s.id === targetSoundId)
    if (!sound) return

    if (isPlaying && currentAudio) {
      currentAudio.pause()
      setIsPlaying(false)
    } else {
      // Stop any existing audio
      if (currentAudio) {
        currentAudio.pause()
        currentAudio.currentTime = 0
      }

      const audio = new Audio(sound.url)
      audio.volume = volume
      audio.loop = true
      audio.play()
      setCurrentAudio(audio)
      setIsPlaying(true)
      setSelectedSound(targetSoundId)

      audio.addEventListener('ended', () => {
        setIsPlaying(false)
      })
    }
  }

  const handleVolumeChange = (newVolume: number) => {
    setVolume(newVolume)
    if (currentAudio) {
      currentAudio.volume = newVolume
    }
  }

  const handleRandomSound = () => {
    const filteredSounds = getFilteredSounds()
    const randomSound = filteredSounds[Math.floor(Math.random() * filteredSounds.length)]
    handleSoundSelect(randomSound.id)
  }

  const handleClearSound = () => {
    if (currentAudio) {
      currentAudio.pause()
      currentAudio.currentTime = 0
    }
    setSelectedSound(null)
    setIsPlaying(false)
    setCurrentAudio(null)
  }

  const filteredSounds = getFilteredSounds()
  const currentSound = selectedSound ? SOUND_LIBRARY.find(s => s.id === selectedSound) : null

  return (
    <div className="w-full h-full p-4">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">Sound Library</h2>
        <div className="flex gap-2">
          <button
            onClick={handleRandomSound}
            className="p-2 text-gray-500 hover:text-gray-700 rounded"
            title="Random Sound"
          >
            <RotateCcw size={20} />
          </button>
          <button
            onClick={handleClearSound}
            className="p-2 text-gray-500 hover:text-gray-700 rounded"
            title="Clear Sound"
          >
            <VolumeX size={20} />
          </button>
        </div>
      </div>

      {/* Current Sound Display */}
      {currentSound && (
        <div className="mb-6 p-4 bg-white bg-opacity-90 backdrop-blur-sm border border-gray-200 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium">{currentSound.name}</h3>
              <p className="text-sm text-gray-600">{currentSound.description}</p>
            </div>
            <button
              onClick={() => handlePlayPause()}
              className={`p-3 rounded-full transition-colors ${
                isPlaying ? 'bg-red-500 text-white' : 'bg-green-500 text-white'
              }`}
            >
              {isPlaying ? <Pause size={20} /> : <Play size={20} />}
            </button>
          </div>
        </div>
      )}

      {/* Volume Control */}
      <div className="mb-6 p-4 bg-white bg-opacity-90 backdrop-blur-sm border border-gray-200 rounded-lg">
        <div className="flex items-center gap-3">
          <Volume2 size={20} className="text-gray-500" />
          <input
            type="range"
            min="0"
            max="1"
            step="0.1"
            value={volume}
            onChange={e => handleVolumeChange(parseFloat(e.target.value))}
            className="flex-1"
          />
          <span className="text-sm text-gray-500 w-12">{Math.round(volume * 100)}%</span>
        </div>
      </div>

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

      {/* Sound Grid */}
      <div className="space-y-4">
        {filteredSounds.length > 0 ? (
          <div className="grid grid-cols-1 gap-3">
            {filteredSounds.map(sound => (
              <div
                key={sound.id}
                className={`group relative cursor-pointer border-2 rounded-lg p-4 transition-all duration-200 ${
                  selectedSound === sound.id
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300 bg-white bg-opacity-90'
                }`}
                onClick={() => handleSoundSelect(sound.id)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900">{sound.name}</h3>
                    <p className="text-sm text-gray-600">{sound.description}</p>
                    <span className="inline-block mt-1 px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded-full">
                      {sound.category}
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={e => {
                        e.stopPropagation()
                        handlePlayPause(sound.id)
                      }}
                      className={`p-2 rounded-full transition-colors ${
                        isPlaying && selectedSound === sound.id
                          ? 'bg-red-500 text-white'
                          : 'bg-green-500 text-white hover:bg-green-600'
                      }`}
                      title={isPlaying && selectedSound === sound.id ? 'Pause' : 'Play'}
                    >
                      {isPlaying && selectedSound === sound.id ? (
                        <Pause size={16} />
                      ) : (
                        <Play size={16} />
                      )}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <Volume2 size={48} className="mx-auto mb-3 opacity-50" />
            <p>No sounds found in this category</p>
          </div>
        )}
      </div>

      {/* Sound Library Info */}
      <div className="mt-6 p-3 bg-gray-50 rounded-lg text-sm text-gray-600">
        <p className="font-medium mb-1">Enhanced Sound Library</p>
        <ul className="space-y-1 text-xs">
          <li>• {SOUND_LIBRARY.length} high-quality ambient sounds</li>
          <li>• Organized by categories</li>
          <li>• Continuous loop playback</li>
          <li>• Volume control</li>
          <li>• Perfect for focus and relaxation</li>
        </ul>
      </div>
    </div>
  )
}

export default SoundSelector
