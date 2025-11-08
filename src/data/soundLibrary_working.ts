import { SoundOption } from '../types'

export const SOUND_LIBRARY: SoundOption[] = [
  // Nature sounds - Using reliable CORS-friendly sources

  {
    id: 'ocean',
    name: '🌊 Ocean',
    category: 'nature',
    url: 'https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3',
    description: 'Peaceful ocean waves on the shore',
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

// Test sound option for debugging
export const TEST_BEEP: SoundOption = {
  id: 'test-beep',
  name: '🔊 Test Beep',
  category: 'notification',
  url: 'data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTr7KNUEQxKn+PyvmAcCEOa3/LNeSsFJHfI7+GQQAoUXrTq7aJUEAxLoeL0wGIdBkCY3PLOeCkFJnbH8N+PQAkUXbTq7qBUEAxMn+H0wGIdBkCY3PLOeSsFJHbI8N2PQAkUXbTr7qBTEAxMn+H0wGIdBkKU3PLOeSsFJHbI8N2PQAkUXbTr7qBTEAxMn+H0wGIdBkKU3PLOeSsFJHbI8N2PQAkUXbTr7qBTEAxMn+H0wGIdBkKU3PLOeSsFJHbI8N2PQAkUXbTr7qBTEAxMn+H0wGIdBkKU3PLOeSsFJHbI8N2PQAkUXbTr7qBTEAxMn+H0wGEdBkKU3PLOeSsFJHbI8N2PQAkUXbTr7qBTEAxMn+H0wGEdBkKU3PLOeSsFJHbI8N2PQAkUXbTr7qBTEAxMn+H0wGEdBkKU3PLOeSsFJHbI8N2PQAkUXbTr7qBTEAxMn+H0wGEdBkKU3PLOeSsFJHbI8N2PQAkUXbTr7qBTEAxMn+H0wGEdBkKU3PLOeSsFJHbI8N2PQAkUXbTr7qBTEAxMn+H0wGEdBkKU3PLOeSsFJHbI8N2PQAkUXbTr7qBTEAxMn+H0wGEdBkKU3PLOeSsFJHbI8N2PQAkUXbTr7qBTEAxMn+H0wGEdBkKU3PLOeSsFJHbI8N2PQAkUXbTr7qBTEAxMn+H0wGEdBkKU3PLOeSsFJHbI8N2PQAkUXbTr7qBTEAxMn+H0wGEdBkKU3PLOeSsFJHbI8N2PQAkUXbTr7qBTEAxMn+H0wGEdBkKU3PLOeSsFJHbI8N2PQAkUXbTr7qBTEAxMn+H0wGEdBkKU3PLOeSsFJHbI8N2PQAkUXbTr7qBTEAxMn+H0wGEdBkOTl7',
  description: 'Quick test beep for audio system debugging',
}
