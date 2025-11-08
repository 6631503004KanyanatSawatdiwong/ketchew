import { SoundOption } from '../types'

export const SOUND_LIBRARY: SoundOption[] = [
  // Nature sounds - Using Pixabay for reliable, fast loading

  {
    id: 'ocean',
    name: '🌊 Ocean',
    category: 'nature',
    url: 'https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3',
    description: 'Peaceful ocean waves on the shore',
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
