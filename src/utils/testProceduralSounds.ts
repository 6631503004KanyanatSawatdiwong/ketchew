/**
 * Test script for procedural sound generation
 * Run this in the browser console to test the sounds
 */

import { getProceduralSoundGenerator } from './ProceduralSoundGenerator'

// Test function for browser console
export const testProceduralSounds = async () => {
  console.log('🧪 Testing Procedural Sound Generation')

  const generator = getProceduralSoundGenerator()

  console.log('Testing Enhanced Multi-Layer Rain Sound...')
  try {
    await generator.generateRainSound()
    console.log('✅ Multi-layered rain sound started successfully')

    // Wait 5 seconds then test stream
    setTimeout(async () => {
      console.log('Testing Stream Sound...')
      try {
        await generator.generateStreamSound()
        console.log('✅ Stream sound started successfully')

        // Stop after 5 seconds
        setTimeout(() => {
          generator.stopAll()
          console.log('✅ All sounds stopped')
        }, 5000)
      } catch (error) {
        console.error('❌ Stream sound test failed:', error)
      }
    }, 5000)
  } catch (error) {
    console.error('❌ Test failed:', error)
  }
}

// Make it available globally for console testing
if (typeof window !== 'undefined') {
  ;(
    window as unknown as { testProceduralSounds: typeof testProceduralSounds }
  ).testProceduralSounds = testProceduralSounds
}
