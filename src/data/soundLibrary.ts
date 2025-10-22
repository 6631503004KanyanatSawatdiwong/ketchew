import { SoundOption } from '../types'

export const SOUND_LIBRARY: SoundOption[] = [
  // Nature sounds
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
    url: 'https://www.soundjay.com/nature/sounds/waves-01.wav',
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
    url: 'https://www.soundjay.com/misc/sounds/bell-01.wav',
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
