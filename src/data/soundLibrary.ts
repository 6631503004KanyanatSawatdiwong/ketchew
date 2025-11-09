import { SoundOption } from '../types'

/**
 * Sound Library for Ketchew Pomodoro Timer
 *
 * Supports both URL-based and procedural sounds:
 * - URLs starting with 'procedural-' trigger the ProceduralSoundGenerator
 * - Regular URLs are played through Howler.js
 *
 * Procedural sounds (generated using Web Audio API):
 * - 'procedural-rain': Natural rain ambience with gentle droplets and organic surface sounds
 * - 'procedural-forest': Forest ambience with birds and wind
 * - 'procedural-ocean': Gentle waves meeting shore with water retreat and sand textures
 */
export const SOUND_LIBRARY: SoundOption[] = [
  {
    id: 'ocean',
    name: 'Ocean',
    category: 'nature',
    url: 'procedural-ocean',
    description:
      'Continuous shore waves optimized for Pomodoro focus with extended wave patterns and gentle rhythm',
  },
  {
    id: 'rain',
    name: 'Rain',
    category: 'nature',
    url: 'procedural-rain',
    description:
      'Natural rain ambience with gentle droplets, organic surface sounds, and subtle atmospheric depth',
  },
]

// Helper functions to filter sounds by category
export const getSoundsByCategory = (category: string): SoundOption[] => {
  return SOUND_LIBRARY.filter(sound => sound.category === category)
}

export const getSoundById = (id: string): SoundOption | undefined => {
  return SOUND_LIBRARY.find(sound => sound.id === id)
}

export const getAllCategories = (): string[] => {
  return [...new Set(SOUND_LIBRARY.map(sound => sound.category))]
}
