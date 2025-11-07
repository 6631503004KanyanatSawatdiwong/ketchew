import { SoundOption } from '../types'

export const SOUND_LIBRARY: SoundOption[] = [
  // Generated ambient sounds - guaranteed to work
  {
    id: 'rain-generated',
    name: '🌧️ Rain',
    category: 'nature',
    url: 'GENERATED:rain',
    description: 'Soothing rain sounds for focus and relaxation',
  },
  {
    id: 'stream-generated',
    name: '🏞️ Stream',
    category: 'nature',
    url: 'GENERATED:stream',
    description: 'Gentle babbling brook sounds',
  },
  {
    id: 'ocean-generated',
    name: '🌊 Ocean',
    category: 'nature',
    url: 'GENERATED:ocean',
    description: 'Peaceful ocean waves on the shore',
  },
  {
    id: 'forest-generated',
    name: '🌲 Forest',
    category: 'nature',
    url: 'GENERATED:forest',
    description: 'Calming forest ambiance with birds and wind',
  },
  {
    id: 'white-noise-generated',
    name: '🌫️ White Noise',
    category: 'ambient',
    url: 'GENERATED:whitenoise',
    description: 'Generated white noise for concentration',
  },
  {
    id: 'brown-noise-generated',
    name: '🟤 Brown Noise',
    category: 'ambient',
    url: 'GENERATED:brownnoise',
    description: 'Deep brown noise for deep focus',
  },
  {
    id: 'pink-noise-generated',
    name: '🌸 Pink Noise',
    category: 'ambient',
    url: 'GENERATED:pinknoise',
    description: 'Balanced pink noise for relaxation',
  },

  // Test and notification sounds
  {
    id: 'test-beep',
    name: '🔊 Test Beep',
    category: 'notification',
    url: 'GENERATED:beep',
    description: 'Simple test sound to verify audio is working',
  },
  {
    id: 'bell-generated',
    name: '🔔 Bell',
    category: 'notification',
    url: 'GENERATED:bell',
    description: 'Simple bell chime',
  },
  {
    id: 'chime-generated',
    name: '✨ Chime',
    category: 'notification',
    url: 'GENERATED:chime',
    description: 'Gentle notification chime',
  },

  // Focus sounds
  {
    id: 'binaural-alpha',
    name: '🧠 Alpha Waves',
    category: 'focus',
    url: 'GENERATED:binaural-alpha',
    description: 'Alpha binaural beats for enhanced focus',
  },
  {
    id: 'binaural-theta',
    name: '🧘 Theta Waves',
    category: 'focus',
    url: 'GENERATED:binaural-theta',
    description: 'Theta binaural beats for deep meditation',
  },

  // Working embedded sounds using data URLs
  {
    id: 'bell-embedded',
    name: '🔔 Bell (Embedded)',
    category: 'notification',
    url: 'data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt555NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvGccBzyO1fLNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvGccBzyO1fLNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvGccBzyO1fLNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvGccBzyO1fLNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvGccBzyO1fLNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvGccBzyO1fLNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvGccBzyO1fLNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvGccBzyO1fLNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvGccBzyO1fLNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvGccBzyO1fLNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvGccBz',
    description: 'Gentle bell chime (embedded audio)',
  },
]

export const getSoundById = (id: string): SoundOption | undefined => {
  return SOUND_LIBRARY.find(sound => sound.id === id)
}

export const getSoundsByCategory = (category: string): SoundOption[] => {
  if (category === 'all') return SOUND_LIBRARY
  return SOUND_LIBRARY.filter(sound => sound.category === category)
}

export const getBackgroundSounds = (): SoundOption[] => {
  return SOUND_LIBRARY.filter(
    sound =>
      sound.category === 'nature' || sound.category === 'ambient' || sound.category === 'focus'
  )
}

export const getNotificationSounds = (): SoundOption[] => {
  return SOUND_LIBRARY.filter(sound => sound.category === 'notification')
}

export const SOUND_CATEGORIES = [
  { id: 'all', name: 'All Sounds', count: SOUND_LIBRARY.length },
  { id: 'nature', name: 'Nature', count: getSoundsByCategory('nature').length },
  { id: 'ambient', name: 'Ambient', count: getSoundsByCategory('ambient').length },
  { id: 'focus', name: 'Focus', count: getSoundsByCategory('focus').length },
  { id: 'notification', name: 'Notifications', count: getSoundsByCategory('notification').length },
]
