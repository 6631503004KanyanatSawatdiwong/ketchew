/**
 * AudioGenerator - Enhanced audio player using Howler.js with procedural sound support
 * Provides high-quality audio playback with excellent browser compatibility
 */

import { Howl } from 'howler'
import { getProceduralSoundGenerator, ProceduralSoundGenerator } from './ProceduralSoundGenerator'

export class AudioGenerator {
  private currentHowl: Howl | null = null
  private proceduralGenerator: ProceduralSoundGenerator
  private currentSoundType: 'url' | 'procedural' | null = null

  constructor() {
    // Howler.js handles all initialization automatically
    this.proceduralGenerator = getProceduralSoundGenerator()
  }

  async playSound(url: string): Promise<boolean> {
    try {
      // Stop any existing sounds
      this.stop()

      // Check if this is a procedural sound
      if (url.startsWith('procedural-')) {
        return await this.playProceduralSound(url)
      }

      console.log('🎵 AudioGenerator: Loading sound with Howler.js:', url.substring(0, 100) + '...')
      this.currentSoundType = 'url'

      return new Promise(resolve => {
        // Set a timeout for loading
        const loadTimeout = setTimeout(() => {
          console.error('❌ AudioGenerator: Load timeout after 10 seconds')
          if (this.currentHowl) {
            this.currentHowl.unload()
            this.currentHowl = null
          }
          resolve(false)
        }, 10000) // 10 second timeout

        this.currentHowl = new Howl({
          src: [url],
          loop: true,
          volume: 0.3,
          autoplay: false,
          html5: true, // Try HTML5 audio first for faster loading
          preload: true,
          onload: () => {
            clearTimeout(loadTimeout)
            console.log('✅ AudioGenerator: Sound loaded successfully')
            if (this.currentHowl) {
              this.currentHowl.play()
              resolve(true)
            } else {
              console.error('❌ AudioGenerator: Howl instance lost after load')
              resolve(false)
            }
          },
          onloaderror: (id, error) => {
            clearTimeout(loadTimeout)
            console.error('❌ AudioGenerator: Failed to load audio:', error)
            resolve(false)
          },
          onplayerror: (id, error) => {
            clearTimeout(loadTimeout)
            console.error('❌ AudioGenerator: Failed to play audio:', error)
            // Try to unlock audio context and play again
            if (this.currentHowl) {
              console.log('🔄 AudioGenerator: Attempting to unlock audio context...')
              this.currentHowl.once('unlock', () => {
                console.log('🔓 AudioGenerator: Audio context unlocked, retrying play...')
                if (this.currentHowl) {
                  this.currentHowl.play()
                }
              })
            }
            resolve(false)
          },
        })
      })
    } catch (error) {
      console.error('❌ AudioGenerator: Exception in playSound:', error)
      return false
    }
  }

  private async playProceduralSound(soundId: string): Promise<boolean> {
    try {
      console.log('🎵 AudioGenerator: Playing procedural sound:', soundId)
      this.currentSoundType = 'procedural'

      let result: string
      switch (soundId) {
        case 'procedural-rain':
          result = await this.proceduralGenerator.generateRainSound()
          break
        case 'procedural-forest':
          result = await this.proceduralGenerator.generateForestSound()
          break
        case 'procedural-ocean':
          result = await this.proceduralGenerator.generateOceanSound()
          break

        default:
          console.error('❌ AudioGenerator: Unknown procedural sound:', soundId)
          return false
      }

      console.log('✅ AudioGenerator: Procedural sound started:', result)
      return true
    } catch (error) {
      console.error('❌ AudioGenerator: Failed to play procedural sound:', error)
      return false
    }
  }

  setVolume(volume: number) {
    const normalizedVolume = Math.max(0, Math.min(1, volume))

    if (this.currentSoundType === 'url' && this.currentHowl) {
      this.currentHowl.volume(normalizedVolume)
    } else if (this.currentSoundType === 'procedural') {
      this.proceduralGenerator.setVolume(normalizedVolume)
    }
  }

  stop() {
    if (this.currentSoundType === 'url' && this.currentHowl) {
      this.currentHowl.stop()
      this.currentHowl.unload()
      this.currentHowl = null
    } else if (this.currentSoundType === 'procedural') {
      this.proceduralGenerator.stopAll()
    }
    this.currentSoundType = null
  }

  pause() {
    if (this.currentSoundType === 'url' && this.currentHowl) {
      this.currentHowl.pause()
    } else if (this.currentSoundType === 'procedural') {
      this.proceduralGenerator.pause()
    }
  }

  resume() {
    if (this.currentSoundType === 'url' && this.currentHowl) {
      this.currentHowl.play()
    } else if (this.currentSoundType === 'procedural') {
      this.proceduralGenerator.resume()
    }
  }

  isPlaying(): boolean {
    if (this.currentSoundType === 'url') {
      return this.currentHowl ? this.currentHowl.playing() : false
    } else if (this.currentSoundType === 'procedural') {
      return this.proceduralGenerator.isCurrentlyPlaying()
    }
    return false
  }

  getDuration(): number {
    return this.currentHowl ? this.currentHowl.duration() : 0
  }

  destroy() {
    this.stop()
    this.proceduralGenerator.destroy()
  }
}

// Singleton instance
let audioGenerator: AudioGenerator | null = null

export const getAudioGenerator = (): AudioGenerator => {
  if (!audioGenerator) {
    audioGenerator = new AudioGenerator()
  }
  return audioGenerator
}
