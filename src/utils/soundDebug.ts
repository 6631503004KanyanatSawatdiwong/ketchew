/**
 * Debug utility for testing sound generation
 * Use this in the browser console to test individual sounds
 */

import { getAudioGenerator } from './AudioGenerator'

// Make it available globally for debugging
;(window as unknown as { testSound: (soundType: string) => Promise<void> }).testSound = async (
  soundType: string
) => {
  console.log('Testing sound:', soundType)
  const generator = getAudioGenerator()
  try {
    const result = await generator.generateSound(soundType)
    if (result) {
      console.log('Sound generated successfully!')
    } else {
      console.log('Sound generation returned null')
    }
  } catch (error) {
    console.error('Sound generation failed:', error)
  }
}

// Test all sound types
;(window as unknown as { testAllSounds: () => Promise<void> }).testAllSounds = async () => {
  const soundTypes = [
    'rain',
    'stream',
    'ocean',
    'forest',
    'whitenoise',
    'brownnoise',
    'pinknoise',
    'beep',
    'bell',
    'chime',
    'binaural-alpha',
    'binaural-theta',
  ]

  for (const soundType of soundTypes) {
    console.log('Testing:', soundType)
    await new Promise(resolve => setTimeout(resolve, 1000)) // Wait 1 second between tests
    try {
      const generator = getAudioGenerator()
      const result = await generator.generateSound(soundType)
      console.log(soundType, result ? '✅' : '❌')
      generator.stop() // Stop after testing
    } catch (error) {
      console.log(soundType, '❌', error.message)
    }
  }
}

console.log('Sound debug utilities loaded!')
console.log('Use testSound("rain") to test a specific sound')
console.log('Use testAllSounds() to test all sounds')
