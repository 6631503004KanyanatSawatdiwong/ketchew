import React, { useState, useEffect } from 'react'
import { SOUND_LIBRARY } from '../data/soundLibrary'
import { SoundOption } from '../types'

const SoundSelector: React.FC = () => {
  const [selectedSound, setSelectedSound] = useState<string | null>(null)
  const [currentAudio, setCurrentAudio] = useState<HTMLAudioElement | null>(null)
  const [loadingSound, setLoadingSound] = useState<string | null>(null)
  const [failedSounds, setFailedSounds] = useState<Set<string>>(new Set())

  // Cleanup audio when component unmounts
  useEffect(() => {
    return () => {
      if (currentAudio) {
        currentAudio.pause()
        currentAudio.src = ''
      }
    }
  }, [currentAudio])

  const getSoundIcon = (sound: SoundOption) => {
    if (sound.id === 'rain') return '🌧️'
    if (sound.id === 'stream') return '🏞️'
    if (sound.id === 'ocean') return '🌊'
    if (sound.id === 'forest') return '🌲'
    return '🎵'
  }

  const handleSoundToggle = async (soundId: string) => {
    // Always stop current audio first
    if (currentAudio) {
      currentAudio.pause()
      currentAudio.currentTime = 0
      setCurrentAudio(null)
    }

    // If clicking the same sound that's already selected, just turn it off
    if (selectedSound === soundId) {
      setSelectedSound(null)
      return
    }

    // Otherwise, start the new sound
    const sound = SOUND_LIBRARY.find(s => s.id === soundId)
    if (!sound) return

    setLoadingSound(soundId)

    try {
      const audio = new Audio(sound.url)
      audio.loop = true
      audio.volume = 0.3
      audio.crossOrigin = 'anonymous'

      // Set up event listeners
      const onCanPlay = () => {
        setLoadingSound(null)
        setSelectedSound(soundId)
        setCurrentAudio(audio)
        audio.removeEventListener('canplaythrough', onCanPlay)
        audio.removeEventListener('error', onError)
      }

      const onError = (e: Event) => {
        console.error('Audio failed to load:', sound.name, e)
        console.error('Failed URL:', sound.url)

        setLoadingSound(null)
        setFailedSounds(prev => new Set([...prev, soundId]))
        audio.removeEventListener('canplaythrough', onCanPlay)
        audio.removeEventListener('error', onError)
      }

      audio.addEventListener('canplaythrough', onCanPlay)
      audio.addEventListener('error', onError)

      // Try to play
      await audio.play()
    } catch (error) {
      console.error('Audio playback failed:', sound.name, error)
      setLoadingSound(null)
      setFailedSounds(prev => new Set([...prev, soundId]))
    }
  }

  // Simple test beep function
  const playTestBeep = () => {
    // Stop any current sound first
    if (currentAudio) {
      currentAudio.pause()
      currentAudio.currentTime = 0
      setCurrentAudio(null)
      setSelectedSound(null)
    }

    // Create a simple beep using Web Audio API
    const AudioContextClass =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
    const audioContext = new AudioContextClass()
    const oscillator = audioContext.createOscillator()
    const gainNode = audioContext.createGain()

    oscillator.connect(gainNode)
    gainNode.connect(audioContext.destination)

    oscillator.frequency.setValueAtTime(800, audioContext.currentTime)
    oscillator.type = 'sine'

    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime)
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5)

    oscillator.start(audioContext.currentTime)
    oscillator.stop(audioContext.currentTime + 0.5)
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
