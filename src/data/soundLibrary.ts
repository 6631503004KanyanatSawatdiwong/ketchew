import { SoundOption } from '../types'

export const SOUND_LIBRARY: SoundOption[] = [
  // Nature sounds - High quality recordings
  {
    id: 'rain',
    name: '🌧️ Rain',
    category: 'nature',
    url: 'https://www.soundjay.com/misc/sounds/rain-01.wav',
    description: 'Soothing rain sounds for focus and relaxation',
  },
  {
    id: 'heavy-rain',
    name: '⛈️ Heavy Rain',
    category: 'nature',
    url: 'https://www.soundjay.com/weather/sounds/rain-02.wav',
    description: 'Heavy rainfall with thunder',
  },
  {
    id: 'stream',
    name: '🏞️ Stream',
    category: 'nature',
    url: 'https://www.soundjay.com/nature/sounds/stream-01.wav',
    description: 'Gentle babbling brook sounds',
  },
  {
    id: 'ocean',
    name: '🌊 Ocean',
    category: 'nature',
    url: 'https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3',
    description: 'Peaceful ocean waves on the shore',
  },
  {
    id: 'forest',
    name: '🌲 Forest',
    category: 'nature',
    url: 'https://www.soundjay.com/nature/sounds/forest-01.wav',
    description: 'Calming forest ambiance with birds and wind',
  },
  {
    id: 'wind',
    name: '💨 Wind',
    category: 'nature',
    url: 'https://www.soundjay.com/nature/sounds/wind-01.wav',
    description: 'Gentle wind through trees',
  },
  {
    id: 'thunder',
    name: '⚡ Thunder',
    category: 'nature',
    url: 'https://www.soundjay.com/weather/sounds/thunder-01.wav',
    description: 'Distant thunder with rain',
  },

  // Ambient sounds - Perfect for concentration
  {
    id: 'white-noise',
    name: '🌫️ White Noise',
    category: 'ambient',
    url: 'https://www.soundjay.com/misc/sounds/white-noise-01.wav',
    description: 'Steady white noise for concentration',
  },
  {
    id: 'cafe',
    name: '☕ Coffee Shop',
    category: 'ambient',
    url: 'https://www.soundjay.com/misc/sounds/cafe-01.wav',
    description: 'Warm cafe atmosphere with gentle chatter',
  },
  {
    id: 'library',
    name: '📚 Library',
    category: 'ambient',
    url: 'https://www.soundjay.com/misc/sounds/library-01.wav',
    description: 'Quiet library ambiance',
  },
  {
    id: 'fireplace',
    name: '🔥 Fireplace',
    category: 'ambient',
    url: 'https://www.soundjay.com/misc/sounds/fire-01.wav',
    description: 'Cozy crackling fireplace',
  },

  // Focus sounds - Binaural beats and meditation
  {
    id: 'binaural-alpha',
    name: '🧠 Alpha Waves',
    category: 'focus',
    url: 'https://www.soundjay.com/misc/sounds/binaural-01.wav',
    description: 'Alpha binaural beats for enhanced focus',
  },
  {
    id: 'meditation',
    name: '🧘 Meditation',
    category: 'focus',
    url: 'https://www.soundjay.com/misc/sounds/meditation-01.wav',
    description: 'Deep meditation tones',
  },
  {
    id: 'tibetan-bowls',
    name: '🎵 Tibetan Bowls',
    category: 'focus',
    url: 'https://www.soundjay.com/misc/sounds/tibetan-01.wav',
    description: 'Calming Tibetan singing bowls',
  },

  // Notification sounds - Clean and pleasant
  {
    id: 'bell',
    name: '🔔 Bell',
    category: 'notification',
    url: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav',
    description: 'Simple bell chime',
  },
  {
    id: 'chime',
    name: '✨ Wind Chime',
    category: 'notification',
    url: 'https://www.soundjay.com/misc/sounds/chime-01.wav',
    description: 'Gentle wind chime melody',
  },
  {
    id: 'ding',
    name: '🔊 Ding',
    category: 'notification',
    url: 'https://www.soundjay.com/misc/sounds/ding-01.wav',
    description: 'Clean notification sound',
  },
  {
    id: 'soft-bell',
    name: '🛎️ Soft Bell',
    category: 'notification',
    url: 'https://www.soundjay.com/misc/sounds/soft-bell-01.wav',
    description: 'Gentle notification bell',
  },
  {
    id: 'zen-gong',
    name: '🎋 Zen Gong',
    category: 'notification',
    url: 'https://www.soundjay.com/misc/sounds/gong-01.wav',
    description: 'Peaceful zen gong',
  },

  // Backup embedded sound for testing
  {
    id: 'test-beep',
    name: '� Test Beep',
    category: 'notification',
    url: 'data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt555NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvGccBzyO1fLNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvGccBzyO1fLNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvGccBzyO1fLNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvGccBzyO1fLNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvGccBzyO1fLNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvGccBzyO1fLNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvGccBzyO1fLNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvGccBzyO1fLNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvGccBzyO1fLNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvGccBzyO1fLNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvGccBz',
    description: 'Simple test beep to verify audio is working',
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
