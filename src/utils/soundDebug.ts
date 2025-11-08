/**
 * Debug utility for testing sound generation
 * Use this in the browser console to test individual sounds
 */

import { getAudioGenerator } from './AudioGenerator'

// Make it available globally for debugging
;(window as unknown as { testSound: (soundUrl: string) => Promise<void> }).testSound = async (
  soundUrl: string
) => {
  console.log('Testing sound:', soundUrl)
  const generator = getAudioGenerator()
  try {
    const result = await generator.playSound(soundUrl)
    if (result) {
      console.log('Sound played successfully!')
    } else {
      console.log('Sound playback failed')
    }
  } catch (error) {
    console.error('Sound playback failed:', error)
  }
}

// Test all sound types
;(window as unknown as { testAllSounds: () => Promise<void> }).testAllSounds = async () => {
  const soundUrls = [
    'https://www.soundjay.com/misc/sounds/rain-01.wav',
    'https://www.soundjay.com/weather/sounds/rain-02.wav',
    'https://www.soundjay.com/nature/sounds/stream-01.wav',
    'https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3',
    'https://www.soundjay.com/nature/sounds/forest-01.wav',
    'https://www.soundjay.com/nature/sounds/wind-01.wav',
    'https://www.soundjay.com/misc/sounds/white-noise-01.wav',
    'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav',
    'https://www.soundjay.com/misc/sounds/chime-01.wav',
  ]

  for (const soundUrl of soundUrls) {
    console.log('Testing:', soundUrl)
    await new Promise(resolve => setTimeout(resolve, 2000)) // Wait 2 seconds between tests
    try {
      const generator = getAudioGenerator()
      const result = await generator.playSound(soundUrl)
      console.log(soundUrl, result ? '✅' : '❌')
      generator.stop() // Stop after testing
    } catch (error) {
      console.log(soundUrl, '❌', (error as Error).message)
    }
  }
}

console.log('Sound debug utilities loaded!')
console.log('Use testSound("https://example.com/sound.mp3") to test an external sound')
console.log('Use testAllSounds() to test all sounds from the library')
console.log('All sounds now use Howler.js for better compatibility!')
