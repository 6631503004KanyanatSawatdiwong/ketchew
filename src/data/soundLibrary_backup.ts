import { SoundOption } from '../types'

export const SOUND_LIBRARY: SoundOption[] = [
  // High-quality generated ambient sounds - guaranteed to work
  {
    id: 'rain-generated',
    name: '�️ Rain',
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

  // Test sounds for debugging
  {
    id: 'test-beep',
    name: '🔊 Test Beep',
    category: 'notification',
    url: 'GENERATED:beep',
    description: 'Simple test sound to verify audio is working',
  },
  {
    id: 'white-noise-generated',
    name: '�️ White Noise',
    category: 'ambient',
    url: 'GENERATED:whitenoise',
    description: 'Generated white noise for concentration',
  },

  // Original placeholder sounds (may not work due to CORS/invalid URLs)ort const SOUND_LIBRARY: SoundOption[] = [
  // Test sounds - These will always work as they're generated
  {
    id: 'test-beep',
    name: '🔊 Test Beep',
    category: 'notification',
    url: 'GENERATED:beep',
    description: 'Simple test sound to verify audio is working',
  },
  {
    id: 'white-noise-generated',
    name: '🌫️ White Noise (Generated)',
    category: 'ambient',
    url: 'GENERATED:whitenoise',
    description: 'Generated white noise for concentration',
  },
  {
    id: 'rain-sound',
    name: '🌧️ Rain Sound (Generated)',
    category: 'nature',
    url: 'GENERATED:rain',
    description: 'Simulated rain sound for focus',
  },

  // Working external sounds - these should load properly
  {
    id: 'nature-sample',
    name: '� Sample Audio (MP3)',
    category: 'ambient',
    url: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav',
    description: 'Test audio to check external loading',
  },
  {
    id: 'notification-ding',
    name: '🔔 Notification Ding',
    category: 'notification',
    url: 'data:audio/mpeg;base64,SUQzBAAAAAABEVRYWFgAAAAtAAADY29tbWVudABCaWdTb3VuZEJhbmsuY29tIC8gTGFTb25vdGhlcXVlLm9yZwBURU5DAAAAHQAAAFN3aXRjaCBQbHVzIMKpIE5DSCBTb2Z0d2FyZQBUSVQyAAAABgAAAzIyAFRQRTEAAAARAAAAU3dpdGNoIFBsdXMgdjQuMAAA',
    description: 'Simple notification sound',
  },

  // Original placeholder sounds (may not work due to CORS/invalid URLs)
  {
    id: 'rain',
    name: 'Gentle Rain',
    category: 'nature',
    url: 'https://www.soundjay.com/misc/sounds/rain-01.wav',
    description: 'Soft rainfall for deep focus',
  },
  {
    id: 'forest',
    name: 'Forest Ambiance',
    category: 'nature',
    url: 'https://www.soundjay.com/nature/sounds/forest-01.wav',
    description: 'Birds chirping and wind through trees',
  },
  {
    id: 'waves',
    name: 'Ocean Waves',
    category: 'nature',
    url: 'https://cdn.pixabay.com/download/audio/2021/08/04/audio_0625c1539c.mp3',
    description: 'Peaceful ocean waves on the shore',
  },
  {
    id: 'thunder',
    name: 'Distant Thunder',
    category: 'nature',
    url: 'https://www.soundjay.com/weather/sounds/thunder-01.wav',
    description: 'Gentle thunder with rain',
  },
  {
    id: 'wind',
    name: 'Mountain Wind',
    category: 'nature',
    url: 'https://www.soundjay.com/nature/sounds/wind-01.wav',
    description: 'Calming mountain breeze',
  },
  {
    id: 'stream',
    name: 'Babbling Brook',
    category: 'nature',
    url: 'https://www.soundjay.com/nature/sounds/stream-01.wav',
    description: 'Gentle flowing water',
  },
  {
    id: 'fireplace',
    name: 'Cozy Fireplace',
    category: 'nature',
    url: 'https://www.soundjay.com/misc/sounds/fire-01.wav',
    description: 'Warm crackling fire',
  },

  // Test sound - Simple beep for immediate testing
  {
    id: 'test-beep',
    name: 'Test Beep',
    category: 'notification',
    url: 'data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvGccBzyO1fLNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvGccBzyO1fLNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvGccBzyO1fLNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvGccBzyO1fLNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvGccBzyO1fLNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvGccBzyO1fLNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvGccBzyO1fLNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvGccBzyO1fLNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvGccBzyO1fLNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvGccBzyO1fLNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvGccBzyO1fLNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvGccBzyO1fLNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvGccBzyO1fLNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvGccBzyO1fLNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvGccBzyO1fLNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvGccBzyO1fLNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvGccBzyO1fLNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvGccBzyO1fLNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvGccBzyO1fLNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvGccBzyO1fLNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvGccBz',
    description: 'Simple test sound to verify audio is working',
  },

  // Ambient sounds
  {
    id: 'whitenoise',
    name: 'White Noise',
    category: 'ambient',
    url: 'https://www.soundjay.com/misc/sounds/white-noise-01.wav',
    description: 'Steady background noise for concentration',
  },
  {
    id: 'cafe',
    name: 'Coffee Shop',
    category: 'ambient',
    url: 'https://www.soundjay.com/misc/sounds/cafe-01.wav',
    description: 'Warm cafe atmosphere with gentle chatter',
  },
  {
    id: 'library',
    name: 'Quiet Library',
    category: 'ambient',
    url: 'https://www.soundjay.com/misc/sounds/library-01.wav',
    description: 'Subtle library ambiance',
  },
  {
    id: 'city',
    name: 'Urban Background',
    category: 'ambient',
    url: 'https://www.soundjay.com/misc/sounds/city-01.wav',
    description: 'Distant city sounds',
  },

  // Focus sounds
  {
    id: 'binaural',
    name: 'Binaural Beats',
    category: 'focus',
    url: 'https://www.soundjay.com/misc/sounds/binaural-01.wav',
    description: 'Alpha waves for enhanced concentration',
  },
  {
    id: 'meditation',
    name: 'Meditation Drone',
    category: 'focus',
    url: 'https://www.soundjay.com/misc/sounds/meditation-01.wav',
    description: 'Deep meditation tones',
  },
  {
    id: 'tibetan',
    name: 'Tibetan Bowls',
    category: 'focus',
    url: 'https://www.soundjay.com/misc/sounds/tibetan-01.wav',
    description: 'Calming singing bowls',
  },

  // Notification sounds
  {
    id: 'bell',
    name: 'Meditation Bell',
    category: 'notification',
    url: 'data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvGccBzyO1fLNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvGccBzyO1fLNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvGccBzyO1fLNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvGccBzyO1fLNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvGccBzyO1fLNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvGccBzyO1fLNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvGccBzyO1fLNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvGccBzyO1fLNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvGccBzyO1fLNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvGccBzyO1fLNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvGccBzyO1fLNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvGccBzyO1fLNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvGccBzyO1fLNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvGccBzyO1fLNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvGccBzyO1fLNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvGccBzyO1fLNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvGccBzyO1fLNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvGccBz',
    description: 'Gentle bell chime',
  },
  {
    id: 'chime',
    name: 'Wind Chime',
    category: 'notification',
    url: 'https://www.soundjay.com/misc/sounds/chime-01.wav',
    description: 'Soft wind chime melody',
  },
  {
    id: 'ding',
    name: 'Simple Ding',
    category: 'notification',
    url: 'https://www.soundjay.com/misc/sounds/ding-01.wav',
    description: 'Clean notification sound',
  },
  {
    id: 'success',
    name: 'Success Tone',
    category: 'notification',
    url: 'https://www.soundjay.com/misc/sounds/success-01.wav',
    description: 'Positive completion sound',
  },
  {
    id: 'soft-bell',
    name: 'Soft Bell',
    category: 'notification',
    url: 'https://www.soundjay.com/misc/sounds/soft-bell-01.wav',
    description: 'Gentle notification bell',
  },
  {
    id: 'zen',
    name: 'Zen Gong',
    category: 'notification',
    url: 'https://www.soundjay.com/misc/sounds/gong-01.wav',
    description: 'Peaceful zen gong',
  },
  {
    id: 'ping',
    name: 'Digital Ping',
    category: 'notification',
    url: 'https://www.soundjay.com/misc/sounds/ping-01.wav',
    description: 'Modern notification ping',
  },
  {
    id: 'gentle',
    name: 'Gentle Chime',
    category: 'notification',
    url: 'https://www.soundjay.com/misc/sounds/gentle-01.wav',
    description: 'Soft, non-intrusive chime',
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
