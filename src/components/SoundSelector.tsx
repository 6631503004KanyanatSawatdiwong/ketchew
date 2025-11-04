import React, { useState } from 'react'
import { SOUND_LIBRARY } from '../data/soundLibrary'
import { SoundOption } from '../types'

const SoundSelector: React.FC = () => {
  const [selectedSound, setSelectedSound] = useState<string | null>(null)
  const [currentAudio, setCurrentAudio] = useState<HTMLAudioElement | null>(null)

  const getSoundIcon = (sound: SoundOption) => {
    if (sound.category === 'nature') {
      if (sound.id.includes('rain') || sound.id.includes('thunder')) return '🌧️'
      if (sound.id.includes('forest')) return '🌲'
      if (sound.id.includes('waves') || sound.id.includes('ocean')) return '🌊'
      if (sound.id.includes('wind')) return '💨'
      if (sound.id.includes('stream')) return '🏞️'
      if (sound.id.includes('fire')) return '🔥'
      return '🌿'
    }
    if (sound.category === 'ambient') return '☁️'
    if (sound.category === 'focus') return '🧘'
    if (sound.category === 'notification') return '🔔'
    return '🎵'
  }

  const handleSoundToggle = (soundId: string) => {
    // Stop current audio if playing
    if (currentAudio) {
      currentAudio.pause()
      currentAudio.currentTime = 0
      setCurrentAudio(null)
    }

    if (selectedSound === soundId) {
      // Turning off the current sound
      setSelectedSound(null)
    } else {
      // Turning on a new sound
      setSelectedSound(soundId)
      const sound = SOUND_LIBRARY.find(s => s.id === soundId)
      if (sound) {
        const audio = new Audio(sound.url)
        audio.loop = true
        audio.volume = 0.5
        audio.play().catch(console.error)
        setCurrentAudio(audio)
      }
    }
  }

  return (
    <div className="w-full h-full flex flex-col p-3">
      <h2 className="text-lg font-semibold mb-3 text-gray-800 flex-shrink-0">All sounds</h2>

      {/* Sound List */}
      <div className="flex-1 min-h-0 overflow-y-auto space-y-2 pr-1">
        {SOUND_LIBRARY.map(sound => (
          <div
            key={sound.id}
            className="flex items-center justify-between py-1.5 px-1 flex-shrink-0"
          >
            <div className="flex items-center gap-2 min-w-0 flex-1">
              <span className="text-sm flex-shrink-0">{getSoundIcon(sound)}</span>
              <span className="text-sm font-medium text-gray-900 leading-tight truncate">
                {sound.name}
              </span>
            </div>
            <button
              onClick={() => handleSoundToggle(sound.id)}
              className={`relative w-10 h-5 rounded-full transition-colors flex-shrink-0 ml-2 ${
                selectedSound === sound.id ? 'bg-green-500' : 'bg-gray-300'
              }`}
            >
              <div
                className={`absolute top-0.5 w-4 h-4 bg-white rounded-full transition-transform ${
                  selectedSound === sound.id ? 'translate-x-5' : 'translate-x-0.5'
                }`}
              />
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}

export default SoundSelector
