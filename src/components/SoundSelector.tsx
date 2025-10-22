import React, { useState } from 'react'
import { Play, Pause, Volume2, VolumeX, Settings, RotateCcw } from 'lucide-react'
import { useAudioStore } from '../stores/audioStore'
import {
  SOUND_LIBRARY,
  SOUND_CATEGORIES,
  getBackgroundSounds,
  getNotificationSounds,
} from '../data/soundLibrary'

const SoundSelector: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [showAdvancedSettings, setShowAdvancedSettings] = useState(false)

  // Audio store state
  const {
    selectedBackgroundSound,
    isBackgroundPlaying,
    backgroundVolume,
    notificationVolume,
    isMuted,
    enableNotifications,
    enableBackgroundSounds,
    selectedNotificationSounds,
    fadeInDuration,
    fadeOutDuration,

    // Actions
    setBackgroundVolume,
    setNotificationVolume,
    toggleMute,
    playBackgroundSound,
    stopBackgroundSound,
    playNotificationSound,
    setNotificationSound,
    setBackgroundSoundEnabled,
    setNotificationsEnabled,
    setFadeSettings,
  } = useAudioStore()

  const backgroundSounds = getBackgroundSounds()
  const notificationSounds = getNotificationSounds()

  const currentBackgroundSound = selectedBackgroundSound
    ? SOUND_LIBRARY.find(s => s.id === selectedBackgroundSound)
    : null

  const handlePlayBackground = (soundId: string) => {
    if (selectedBackgroundSound === soundId && isBackgroundPlaying) {
      stopBackgroundSound()
    } else {
      playBackgroundSound(soundId)
    }
  }

  const handleTestNotification = (type: 'studyEnd' | 'breakEnd' | 'roundComplete') => {
    playNotificationSound(type)
  }

  return (
    <div className="w-96">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">Sound Settings</h2>
        <button
          onClick={() => setShowAdvancedSettings(!showAdvancedSettings)}
          className="p-2 text-gray-500 hover:text-gray-700 rounded"
          title="Advanced Settings"
        >
          <Settings size={20} />
        </button>
      </div>

      {/* Currently Playing Background Sound */}
      {currentBackgroundSound && isBackgroundPlaying && (
        <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-center justify-between mb-3">
            <div>
              <div className="font-medium text-blue-900">{currentBackgroundSound.name}</div>
              <div className="text-sm text-blue-700">{currentBackgroundSound.description}</div>
            </div>
            <button
              onClick={stopBackgroundSound}
              className="text-blue-600 hover:text-blue-700"
              title="Stop background sound"
            >
              <Pause size={20} />
            </button>
          </div>

          {/* Background Volume Control */}
          <div className="flex items-center gap-2">
            <button onClick={toggleMute} className="text-blue-600" title="Toggle mute">
              {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
            </button>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={isMuted ? 0 : backgroundVolume}
              onChange={e => setBackgroundVolume(parseFloat(e.target.value))}
              className="flex-1"
            />
            <span className="text-sm text-blue-700 w-10">
              {Math.round((isMuted ? 0 : backgroundVolume) * 100)}%
            </span>
          </div>
        </div>
      )}

      {/* Enable/Disable Background Sounds */}
      <div className="mb-6 p-4 bg-gray-50 rounded-lg">
        <div className="flex items-center justify-between mb-3">
          <div>
            <div className="font-medium">Background Sounds</div>
            <div className="text-sm text-gray-600">Ambient sounds for focus sessions</div>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              className="sr-only peer"
              checked={enableBackgroundSounds}
              onChange={e => setBackgroundSoundEnabled(e.target.checked)}
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
          </label>
        </div>
      </div>

      {/* Category Filter */}
      {enableBackgroundSounds && (
        <>
          <div className="mb-6">
            <div className="flex flex-wrap gap-2">
              {SOUND_CATEGORIES.map(category => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
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

          {/* Background Sound List */}
          <div className="space-y-2 max-h-64 overflow-y-auto mb-6">
            {backgroundSounds
              .filter(sound => selectedCategory === 'all' || sound.category === selectedCategory)
              .map(sound => (
                <div
                  key={sound.id}
                  className={`p-3 border rounded-lg transition-all cursor-pointer ${
                    selectedBackgroundSound === sound.id
                      ? 'bg-blue-50 border-blue-200'
                      : 'bg-white border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => handlePlayBackground(sound.id)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="font-medium">{sound.name}</div>
                      <div className="text-sm text-gray-600">{sound.description}</div>
                      <div className="text-xs text-gray-500 capitalize mt-1">{sound.category}</div>
                    </div>
                    <div className="ml-3">
                      {selectedBackgroundSound === sound.id && isBackgroundPlaying ? (
                        <Pause size={16} className="text-blue-600" />
                      ) : (
                        <Play size={16} className="text-gray-400" />
                      )}
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </>
      )}

      {/* Notification Settings */}
      <div className="border-t border-gray-200 pt-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-semibold">Timer Notifications</h3>
            <p className="text-sm text-gray-600">Sounds for session transitions</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              className="sr-only peer"
              checked={enableNotifications}
              onChange={e => setNotificationsEnabled(e.target.checked)}
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
          </label>
        </div>

        {enableNotifications && (
          <div className="space-y-4">
            {/* Notification Volume */}
            <div className="flex items-center gap-2 mb-4">
              <Volume2 size={16} className="text-gray-500" />
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={notificationVolume}
                onChange={e => setNotificationVolume(parseFloat(e.target.value))}
                className="flex-1"
              />
              <span className="text-sm text-gray-600 w-10">
                {Math.round(notificationVolume * 100)}%
              </span>
            </div>

            {/* Study Session End */}
            <div>
              <label className="block text-sm font-medium mb-2">Study Session End</label>
              <div className="flex gap-2">
                <select
                  value={selectedNotificationSounds.studyEnd}
                  onChange={e => setNotificationSound('studyEnd', e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg"
                >
                  {notificationSounds.map(sound => (
                    <option key={sound.id} value={sound.id}>
                      {sound.name}
                    </option>
                  ))}
                </select>
                <button
                  onClick={() => handleTestNotification('studyEnd')}
                  className="px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg"
                  title="Test sound"
                >
                  <Play size={16} />
                </button>
              </div>
            </div>

            {/* Break End */}
            <div>
              <label className="block text-sm font-medium mb-2">Break End</label>
              <div className="flex gap-2">
                <select
                  value={selectedNotificationSounds.breakEnd}
                  onChange={e => setNotificationSound('breakEnd', e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg"
                >
                  {notificationSounds.map(sound => (
                    <option key={sound.id} value={sound.id}>
                      {sound.name}
                    </option>
                  ))}
                </select>
                <button
                  onClick={() => handleTestNotification('breakEnd')}
                  className="px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg"
                  title="Test sound"
                >
                  <Play size={16} />
                </button>
              </div>
            </div>

            {/* Round Complete */}
            <div>
              <label className="block text-sm font-medium mb-2">Pomodoro Complete</label>
              <div className="flex gap-2">
                <select
                  value={selectedNotificationSounds.roundComplete}
                  onChange={e => setNotificationSound('roundComplete', e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg"
                >
                  {notificationSounds.map(sound => (
                    <option key={sound.id} value={sound.id}>
                      {sound.name}
                    </option>
                  ))}
                </select>
                <button
                  onClick={() => handleTestNotification('roundComplete')}
                  className="px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg"
                  title="Test sound"
                >
                  <Play size={16} />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Advanced Settings */}
      {showAdvancedSettings && (
        <div className="mt-6 pt-6 border-t border-gray-200">
          <h3 className="font-semibold mb-4">Advanced Audio Settings</h3>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                Fade In Duration: {fadeInDuration}ms
              </label>
              <input
                type="range"
                min="0"
                max="3000"
                step="100"
                value={fadeInDuration}
                onChange={e => setFadeSettings(parseInt(e.target.value), fadeOutDuration)}
                className="w-full"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Fade Out Duration: {fadeOutDuration}ms
              </label>
              <input
                type="range"
                min="0"
                max="3000"
                step="100"
                value={fadeOutDuration}
                onChange={e => setFadeSettings(fadeInDuration, parseInt(e.target.value))}
                className="w-full"
              />
            </div>

            <button
              onClick={() => setFadeSettings(1000, 1000)}
              className="flex items-center gap-2 px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm"
            >
              <RotateCcw size={14} />
              Reset to Default
            </button>
          </div>
        </div>
      )}

      {/* Audio Info */}
      <div className="mt-6 p-3 bg-gray-50 rounded-lg text-sm text-gray-600">
        <p className="font-medium mb-1">Enhanced Audio System</p>
        <ul className="space-y-1 text-xs">
          <li>• {SOUND_LIBRARY.length} high-quality sounds</li>
          <li>• Howler.js powered audio engine</li>
          <li>• Advanced volume and fade controls</li>
          <li>• Background sounds with timer integration</li>
          <li>• Customizable notification sounds</li>
        </ul>
      </div>
    </div>
  )
}

export default SoundSelector
