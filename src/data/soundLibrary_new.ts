import { SoundOption } from '../types'

export const SOUND_LIBRARY: SoundOption[] = [
  // High-quality ambient sounds from reliable sources
  {
    id: 'rain',
    name: '🌧️ Rain',
    category: 'nature',
    url: 'https://cdn.pixabay.com/download/audio/2022/03/10/audio_d1358e7c8a.mp3',
    description: 'Soothing rain sounds for focus and relaxation',
  },
  {
    id: 'stream',
    name: '🏞️ Stream',
    category: 'nature',
    url: 'https://cdn.pixabay.com/download/audio/2021/08/04/audio_0625c1539c.mp3',
    description: 'Gentle babbling brook sounds',
  },
  {
    id: 'ocean',
    name: '🌊 Ocean',
    category: 'nature',
    url: 'https://cdn.pixabay.com/download/audio/2022/01/18/audio_c0f69ab57c.mp3',
    description: 'Peaceful ocean waves on the shore',
  },
  {
    id: 'forest',
    name: '🌲 Forest',
    category: 'nature',
    url: 'https://cdn.pixabay.com/download/audio/2022/11/22/audio_f4a5c56ba8.mp3',
    description: 'Calming forest ambiance with birds and wind',
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
