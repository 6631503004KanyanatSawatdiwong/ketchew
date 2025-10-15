import React, { useState, useRef } from 'react'
import { Play, Pause, Volume2, VolumeX } from 'lucide-react'
// import { Howl } from 'howler' // Will be available after npm install

interface SoundOption {
  id: string
  name: string
  category: 'nature' | 'ambient' | 'focus' | 'notification'
  url: string
  description: string
}

const soundOptions: SoundOption[] = [
  // Nature sounds
  {
    id: 'rain',
    name: 'Rain',
    category: 'nature',
    url: 'https://www.soundjay.com/misc/sounds/rain-01.wav',
    description: 'Gentle rain for focus',
  },
  {
    id: 'forest',
    name: 'Forest',
    category: 'nature',
    url: 'https://www.soundjay.com/nature/sounds/forest-01.wav',
    description: 'Birds and wind in trees',
  },
  {
    id: 'waves',
    name: 'Ocean Waves',
    category: 'nature',
    url: 'https://www.soundjay.com/nature/sounds/waves-01.wav',
    description: 'Peaceful ocean sounds',
  },

  // Ambient sounds
  {
    id: 'whitenoise',
    name: 'White Noise',
    category: 'ambient',
    url: 'https://www.soundjay.com/misc/sounds/white-noise-01.wav',
    description: 'Steady background noise',
  },
  {
    id: 'cafe',
    name: 'Coffee Shop',
    category: 'ambient',
    url: 'https://www.soundjay.com/misc/sounds/cafe-01.wav',
    description: 'Ambient cafe chatter',
  },

  // Focus sounds
  {
    id: 'binaural',
    name: 'Binaural Beats',
    category: 'focus',
    url: 'https://www.soundjay.com/misc/sounds/binaural-01.wav',
    description: 'Alpha waves for concentration',
  },

  // Notification sounds
  {
    id: 'bell',
    name: 'Meditation Bell',
    category: 'notification',
    url: 'https://www.soundjay.com/misc/sounds/bell-01.wav',
    description: 'Gentle bell chime',
  },
  {
    id: 'chime',
    name: 'Wind Chime',
    category: 'notification',
    url: 'https://www.soundjay.com/misc/sounds/chime-01.wav',
    description: 'Soft wind chime',
  },
]

const SoundSelector: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [selectedSound, setSelectedSound] = useState<string | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [volume, setVolume] = useState(0.5)
  const [isMuted, setIsMuted] = useState(false)

  // For now, we'll use HTML audio API until Howler.js is available
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const currentSoundRef = useRef<string | null>(null)

  const categories = [
    { id: 'all', name: 'All Sounds' },
    { id: 'nature', name: 'Nature' },
    { id: 'ambient', name: 'Ambient' },
    { id: 'focus', name: 'Focus' },
    { id: 'notification', name: 'Notifications' },
  ]

  const filteredSounds =
    selectedCategory === 'all'
      ? soundOptions
      : soundOptions.filter(sound => sound.category === selectedCategory)

  const playSound = (soundId: string) => {
    const sound = soundOptions.find(s => s.id === soundId)
    if (!sound) return

    // Stop current audio if playing
    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current = null
    }

    // For MVP, we'll simulate audio playback
    // In production, this would use Howler.js or Web Audio API
    console.log(`Playing sound: ${sound.name}`)

    setSelectedSound(soundId)
    setIsPlaying(true)
    currentSoundRef.current = soundId

    // Simulate audio loading and playback
    setTimeout(() => {
      console.log(`${sound.name} loaded and playing`)
    }, 500)
  }

  const stopSound = () => {
    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current = null
    }

    setIsPlaying(false)
    setSelectedSound(null)
    currentSoundRef.current = null
    console.log('Audio stopped')
  }

  const toggleMute = () => {
    setIsMuted(!isMuted)
    if (audioRef.current) {
      audioRef.current.muted = !isMuted
    }
  }

  const handleVolumeChange = (newVolume: number) => {
    setVolume(newVolume)
    if (audioRef.current) {
      audioRef.current.volume = newVolume
    }
  }

  return (
    <div className="w-96">
      <h2 className="text-2xl font-bold mb-6">Sound Settings</h2>

      {/* Currently Playing */}
      {selectedSound && (
        <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <div>
              <div className="font-medium text-blue-900">
                {soundOptions.find(s => s.id === selectedSound)?.name}
              </div>
              <div className="text-sm text-blue-700">
                {soundOptions.find(s => s.id === selectedSound)?.description}
              </div>
            </div>
            <button onClick={stopSound} className="text-blue-600 hover:text-blue-700">
              <Pause size={20} />
            </button>
          </div>

          {/* Volume Control */}
          <div className="flex items-center gap-2">
            <button onClick={toggleMute} className="text-blue-600">
              {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
            </button>
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={isMuted ? 0 : volume}
              onChange={e => handleVolumeChange(parseFloat(e.target.value))}
              className="flex-1"
            />
            <span className="text-sm text-blue-700 w-8">
              {Math.round((isMuted ? 0 : volume) * 100)}%
            </span>
          </div>
        </div>
      )}

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

      {/* Sound List */}
      <div className="space-y-2 max-h-64 overflow-y-auto mb-6">
        {filteredSounds.map(sound => (
          <div
            key={sound.id}
            className={`p-3 border rounded-lg transition-all cursor-pointer ${
              selectedSound === sound.id
                ? 'bg-blue-50 border-blue-200'
                : 'bg-white border-gray-200 hover:border-gray-300'
            }`}
            onClick={() => playSound(sound.id)}
          >
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="font-medium">{sound.name}</div>
                <div className="text-sm text-gray-600">{sound.description}</div>
                <div className="text-xs text-gray-500 capitalize mt-1">{sound.category}</div>
              </div>
              <div className="ml-3">
                {selectedSound === sound.id && isPlaying ? (
                  <Pause size={16} className="text-blue-600" />
                ) : (
                  <Play size={16} className="text-gray-400" />
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Notification Settings */}
      <div className="border-t border-gray-200 pt-6">
        <h3 className="font-semibold mb-3">Timer Notifications</h3>
        <div className="space-y-3">
          <div>
            <label className="block text-sm font-medium mb-1">Study Session End</label>
            <select className="w-full px-3 py-2 border border-gray-300 rounded-lg">
              <option value="bell">Meditation Bell</option>
              <option value="chime">Wind Chime</option>
              <option value="none">No Sound</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Break End</label>
            <select className="w-full px-3 py-2 border border-gray-300 rounded-lg">
              <option value="bell">Meditation Bell</option>
              <option value="chime">Wind Chime</option>
              <option value="none">No Sound</option>
            </select>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Play notification sounds</span>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" defaultChecked />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>
        </div>
      </div>

      {/* Audio Info */}
      <div className="mt-6 p-3 bg-gray-50 rounded-lg text-sm text-gray-600">
        <p className="font-medium mb-1">Audio Features (MVP)</p>
        <ul className="space-y-1 text-xs">
          <li>• Background sounds for focus</li>
          <li>• Timer notification sounds</li>
          <li>• Volume and mute controls</li>
          <li>• Audio will integrate with Howler.js in full version</li>
        </ul>
      </div>
    </div>
  )
}

export default SoundSelector
