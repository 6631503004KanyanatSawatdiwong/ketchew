import React, { useState, useEffect } from 'react'
import { SOUND_LIBRARY } from '../data/soundLibrary'
import { SoundOption } from '../types'
import { getAudioGenerator, AudioGenerator } from '../utils/AudioGenerator'

const SoundSelector: React.FC = () => {
  const [selectedSound, setSelectedSound] = useState<string | null>(null)
  const [loadingSound, setLoadingSound] = useState<string | null>(null)
  const [failedSounds, setFailedSounds] = useState<Set<string>>(new Set())
  const [audioGenerator, setAudioGenerator] = useState<AudioGenerator | null>(null)

  // Cleanup audio when component unmounts
  useEffect(() => {
    return () => {
      if (audioGenerator) {
        audioGenerator.stop()
      }
    }
  }, [audioGenerator])

  const getSoundIcon = (sound: SoundOption) => {
    if (sound.id === 'rain') return '🌧️'
    if (sound.id === 'stream') return '🏞️'
    if (sound.id === 'ocean') return '🌊'
    if (sound.id === 'forest') return '🌲'
    return '🎵'
  }

  const handleSoundToggle = async (soundId: string) => {
    console.log('🔊 Sound toggle clicked:', soundId)

    // Always stop current audio first
    if (audioGenerator) {
      console.log('🔇 Stopping current audio')
      audioGenerator.stop()
      setAudioGenerator(null)
    }

    // If clicking the same sound that's already selected, just turn it off
    if (selectedSound === soundId) {
      console.log('🔄 Turning off current sound')
      setSelectedSound(null)
      return
    }

    // Otherwise, start the new sound
    const sound = SOUND_LIBRARY.find(s => s.id === soundId)
    if (!sound) {
      console.error('❌ Sound not found:', soundId)
      return
    }

    console.log('▶️ Starting new sound:', sound.name, sound.url)
    setLoadingSound(soundId)

    try {
      console.log('Trying to play sound:', sound.name, sound.url)
      const generator = getAudioGenerator()

      const result = await generator.playSound(sound.url)
      if (result) {
        setLoadingSound(null)
        setSelectedSound(soundId)
        setAudioGenerator(generator)
        console.log('Sound played successfully:', sound.name)
      } else {
        console.error('Sound failed to play:', sound.name)
        setLoadingSound(null)
        setFailedSounds(prev => new Set([...prev, soundId]))
      }
    } catch (error) {
      console.error('Audio playback failed:', sound.name, error)
      setLoadingSound(null)
      setFailedSounds(prev => new Set([...prev, soundId]))
    }
  }

  // Simple test beep function
  const playTestBeep = async () => {
    console.log('🧪 Testing audio...')

    // Stop any current sound first
    if (audioGenerator) {
      audioGenerator.stop()
      setAudioGenerator(null)
    }
    setSelectedSound(null)

    try {
      const generator = getAudioGenerator()
      // Use embedded test beep (not from sound library)
      const testBeepUrl =
        'data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt555NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvGccBzyO1fLNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvGccBzyO1fLNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvGccBzyO1fLNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvGccBzyO1fLNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvGccBzyO1fLNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvGccBzyO1fLNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvGccBzyO1fLNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvGccBzyO1fLNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvGccBzyO1fLNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvGccBz'

      console.log('🔊 Playing test beep (embedded audio)...')
      const result = await generator.playSound(testBeepUrl)
      console.log('🔊 Test beep result:', result)
    } catch (error) {
      console.error('❌ Test beep failed:', error)
    }
  }

  return (
    <div className="w-full h-full flex flex-col p-3">
      <h2 className="text-lg font-semibold mb-3 text-gray-800 flex-shrink-0">Ambient Sounds</h2>

      {/* Test Audio Button */}
      <div className="mb-3 flex-shrink-0">
        <button
          onClick={playTestBeep}
          className="w-full px-3 py-2 bg-blue-500 hover:bg-blue-600 text-white text-sm rounded-lg transition-colors"
        >
          🔊 Test Audio
        </button>
        <p className="text-xs text-gray-500 mt-1">
          Click to test if audio is working on your device
        </p>
      </div>

      {/* Sound List */}
      <div className="flex-1 min-h-0 overflow-y-auto space-y-2 pr-1">
        {SOUND_LIBRARY.map(sound => (
          <div
            key={sound.id}
            className="flex items-center justify-between py-1.5 px-1 flex-shrink-0"
          >
            <div className="flex items-center gap-2 min-w-0 flex-1">
              <span className="text-sm flex-shrink-0">{getSoundIcon(sound)}</span>
              <span
                className={`text-sm font-medium leading-tight truncate ${
                  failedSounds.has(sound.id) ? 'text-red-500' : 'text-gray-900'
                }`}
              >
                {sound.name}
                {failedSounds.has(sound.id) && ' (unavailable)'}
                {loadingSound === sound.id && ' (loading...)'}
              </span>
            </div>
            <button
              onClick={() => handleSoundToggle(sound.id)}
              disabled={loadingSound === sound.id}
              className={`relative w-10 h-5 rounded-full transition-colors flex-shrink-0 ml-2 ${
                selectedSound === sound.id
                  ? 'bg-green-500'
                  : failedSounds.has(sound.id)
                    ? 'bg-red-300'
                    : loadingSound === sound.id
                      ? 'bg-yellow-300'
                      : 'bg-gray-300'
              } ${loadingSound === sound.id ? 'opacity-50' : ''}`}
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
