import { SoundOption } from '../types'

/**
 * Sound Library for Ketchew Pomodoro Timer
 *
 * Supports both URL-based and procedural sounds:
 * - URLs starting with 'procedural-' trigger the ProceduralSoundGenerator
 * - Regular URLs are played through Howler.js
 *
 * Procedural sounds (generated using Web Audio API):
 * - 'procedural-rain': Light drizzle ambience with sparse gentle droplets and subtle atmosphere
 * - 'procedural-wind': Gentle wind sounds with natural ambient atmosphere
 * - 'procedural-night': Pure quiet night atmosphere with gentle night air sounds
 * - 'procedural-whitenoise': Balanced white noise with equal high and low frequencies
 */
export const SOUND_LIBRARY: SoundOption[] = [
  {
    id: 'rain',
    name: 'Rain',
    category: 'nature',
    url: 'procedural-rain',
    description:
      'Light drizzle ambience with sparse gentle droplets and subtle atmospheric depth, perfect for focus',
  },
  {
    id: 'wind',
    name: 'Wind in Trees',
    category: 'ambient',
    url: 'procedural-wind',
    description: 'Gentle wind sounds with natural ambient atmosphere for peaceful focus',
  },
  {
    id: 'night',
    name: 'Night Ambience',
    category: 'nature',
    url: 'procedural-night',
    description:
      'Pure quiet night atmosphere with gentle night air sounds for deep focus and tranquility',
  },
  {
    id: 'whitenoise',
    name: 'White Noise',
    category: 'ambient',
    url: 'procedural-whitenoise',
    description:
      'Balanced white noise with equal high and low frequencies for consistent background sound',
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
