import React, { useState, useEffect } from 'react'
import { Volume2, VolumeX, Play, Pause, Shuffle, Settings2, Layers } from 'lucide-react'
import { SOUND_LIBRARY, getBackgroundSounds } from '../data/soundLibrary'

interface SoundMixerTrack {
  id: string
  soundId: string
  volume: number
  isPlaying: boolean
  isMuted: boolean
}

const AudioMixer: React.FC = () => {
  const [mixerTracks, setMixerTracks] = useState<SoundMixerTrack[]>([])
  const [masterVolume, setMasterVolume] = useState(0.7)
  const [isMasterMuted, setIsMasterMuted] = useState(false)
  const [showAdvanced, setShowAdvanced] = useState(false)

  const backgroundSounds = getBackgroundSounds() // Initialize mixer tracks
  useEffect(() => {
    const initialTracks: SoundMixerTrack[] = [
      { id: 'track1', soundId: 'forest-morning', volume: 0.6, isPlaying: false, isMuted: false },
      { id: 'track2', soundId: 'ocean-waves', volume: 0.4, isPlaying: false, isMuted: false },
      { id: 'track3', soundId: 'rain-gentle', volume: 0.3, isPlaying: false, isMuted: false },
    ]
    setMixerTracks(initialTracks)
  }, [])

  const addTrack = () => {
    if (mixerTracks.length < 5) {
      const availableSounds = backgroundSounds.filter(
        sound => !mixerTracks.some(track => track.soundId === sound.id)
      )

      if (availableSounds.length > 0) {
        const randomSound = availableSounds[Math.floor(Math.random() * availableSounds.length)]
        const newTrack: SoundMixerTrack = {
          id: `track${Date.now()}`,
          soundId: randomSound.id,
          volume: 0.5,
          isPlaying: false,
          isMuted: false,
        }
        setMixerTracks(prev => [...prev, newTrack])
      }
    }
  }

  const removeTrack = (trackId: string) => {
    setMixerTracks(prev => prev.filter(track => track.id !== trackId))
  }

  const updateTrack = (trackId: string, updates: Partial<SoundMixerTrack>) => {
    setMixerTracks(prev =>
      prev.map(track => (track.id === trackId ? { ...track, ...updates } : track))
    )
  }

  const toggleTrackPlay = (trackId: string) => {
    const track = mixerTracks.find(t => t.id === trackId)
    if (track) {
      updateTrack(trackId, { isPlaying: !track.isPlaying })
      // Here you would integrate with actual Howler.js instances
    }
  }

  const randomizeMix = () => {
    const newTracks = mixerTracks.map(track => ({
      ...track,
      volume: Math.random() * 0.8 + 0.1, // 0.1 to 0.9
      soundId: backgroundSounds[Math.floor(Math.random() * backgroundSounds.length)].id,
    }))
    setMixerTracks(newTracks)
  }

  const playAllTracks = () => {
    setMixerTracks(prev => prev.map(track => ({ ...track, isPlaying: true })))
  }

  const stopAllTracks = () => {
    setMixerTracks(prev => prev.map(track => ({ ...track, isPlaying: false })))
  }

  const getSoundById = (soundId: string) => {
    return SOUND_LIBRARY.find(sound => sound.id === soundId)
  }

  return (
    <div className="w-full max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Layers size={24} className="text-blue-600" />
          <h2 className="text-2xl font-bold">Audio Mixer</h2>
        </div>
        <div className="flex gap-2">
          <button
            onClick={randomizeMix}
            className="p-2 text-gray-500 hover:text-gray-700 rounded"
            title="Randomize Mix"
          >
            <Shuffle size={20} />
          </button>
          <button
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="p-2 text-gray-500 hover:text-gray-700 rounded"
            title="Advanced Settings"
          >
            <Settings2 size={20} />
          </button>
        </div>
      </div>

      {/* Master Controls */}
      <div className="mb-6 p-4 bg-gray-50 rounded-lg">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold">Master Controls</h3>
          <div className="flex gap-2">
            <button
              onClick={playAllTracks}
              className="px-3 py-1 bg-green-500 text-white rounded text-sm hover:bg-green-600 transition-colors"
            >
              Play All
            </button>
            <button
              onClick={stopAllTracks}
              className="px-3 py-1 bg-red-500 text-white rounded text-sm hover:bg-red-600 transition-colors"
            >
              Stop All
            </button>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsMasterMuted(!isMasterMuted)}
            className="text-gray-600"
            title="Master Mute"
          >
            {isMasterMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
          </button>
          <input
            type="range"
            min="0"
            max="1"
            step="0.05"
            value={isMasterMuted ? 0 : masterVolume}
            onChange={e => setMasterVolume(parseFloat(e.target.value))}
            className="flex-1"
          />
          <span className="text-sm text-gray-600 w-12">
            {Math.round((isMasterMuted ? 0 : masterVolume) * 100)}%
          </span>
        </div>
      </div>

      {/* Mixer Tracks */}
      <div className="space-y-4 mb-6">
        {mixerTracks.map(track => {
          const sound = getSoundById(track.soundId)
          return (
            <div key={track.id} className="p-4 border border-gray-200 rounded-lg">
              <div className="flex items-center gap-3 mb-3">
                <button
                  onClick={() => toggleTrackPlay(track.id)}
                  className={`p-2 rounded-full ${
                    track.isPlaying
                      ? 'bg-green-500 text-white'
                      : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                  }`}
                >
                  {track.isPlaying ? <Pause size={16} /> : <Play size={16} />}
                </button>

                <div className="flex-1">
                  <select
                    value={track.soundId}
                    onChange={e => updateTrack(track.id, { soundId: e.target.value })}
                    className="w-full px-3 py-1 border border-gray-300 rounded text-sm"
                  >
                    {backgroundSounds.map(sound => (
                      <option key={sound.id} value={sound.id}>
                        {sound.name} - {sound.category}
                      </option>
                    ))}
                  </select>
                  {sound && <div className="text-xs text-gray-500 mt-1">{sound.description}</div>}
                </div>

                <button
                  onClick={() => removeTrack(track.id)}
                  className="px-2 py-1 text-red-500 hover:text-red-700 text-sm"
                >
                  Remove
                </button>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => updateTrack(track.id, { isMuted: !track.isMuted })}
                  className="text-gray-600"
                  title="Track Mute"
                >
                  {track.isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
                </button>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={track.isMuted ? 0 : track.volume}
                  onChange={e => updateTrack(track.id, { volume: parseFloat(e.target.value) })}
                  className="flex-1"
                />
                <span className="text-sm text-gray-600 w-12">
                  {Math.round((track.isMuted ? 0 : track.volume) * 100)}%
                </span>
              </div>
            </div>
          )
        })}
      </div>

      {/* Add Track Button */}
      {mixerTracks.length < 5 && (
        <button
          onClick={addTrack}
          className="w-full py-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 hover:border-gray-400 hover:text-gray-600 transition-colors"
        >
          + Add Sound Layer ({mixerTracks.length}/5)
        </button>
      )}

      {/* Advanced Settings */}
      {showAdvanced && (
        <div className="mt-6 pt-6 border-t border-gray-200">
          <h3 className="font-semibold mb-4">Advanced Mixing Controls</h3>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Crossfade Duration</label>
              <input
                type="range"
                min="0"
                max="5000"
                step="100"
                defaultValue="1000"
                className="w-full"
              />
              <div className="text-xs text-gray-500 mt-1">1000ms</div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Auto-fade Intensity</label>
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                defaultValue="0.3"
                className="w-full"
              />
              <div className="text-xs text-gray-500 mt-1">30%</div>
            </div>
          </div>

          <div className="mt-4 space-y-2">
            <label className="flex items-center gap-2">
              <input type="checkbox" defaultChecked />
              <span className="text-sm">Auto-balance volume levels</span>
            </label>
            <label className="flex items-center gap-2">
              <input type="checkbox" />
              <span className="text-sm">Enable spatial audio effects</span>
            </label>
            <label className="flex items-center gap-2">
              <input type="checkbox" defaultChecked />
              <span className="text-sm">Sync with timer phases</span>
            </label>
          </div>
        </div>
      )}

      {/* Presets */}
      <div className="mt-6 pt-6 border-t border-gray-200">
        <h3 className="font-semibold mb-3">Mix Presets</h3>
        <div className="grid grid-cols-2 gap-2">
          <button className="px-3 py-2 bg-blue-100 text-blue-700 rounded text-sm hover:bg-blue-200 transition-colors">
            Forest Retreat
          </button>
          <button className="px-3 py-2 bg-blue-100 text-blue-700 rounded text-sm hover:bg-blue-200 transition-colors">
            Ocean Waves
          </button>
          <button className="px-3 py-2 bg-blue-100 text-blue-700 rounded text-sm hover:bg-blue-200 transition-colors">
            Rain & Thunder
          </button>
          <button className="px-3 py-2 bg-blue-100 text-blue-700 rounded text-sm hover:bg-blue-200 transition-colors">
            Urban Coffee Shop
          </button>
        </div>
      </div>

      {/* Info */}
      <div className="mt-6 p-3 bg-gray-50 rounded-lg text-sm text-gray-600">
        <p className="font-medium mb-1">Advanced Audio Mixing</p>
        <ul className="space-y-1 text-xs">
          <li>• Layer up to 5 background sounds simultaneously</li>
          <li>• Individual volume and mute controls per track</li>
          <li>• Real-time sound switching and mixing</li>
          <li>• Preset combinations for different moods</li>
          <li>• Advanced crossfade and spatial audio effects</li>
        </ul>
      </div>
    </div>
  )
}

export default AudioMixer
