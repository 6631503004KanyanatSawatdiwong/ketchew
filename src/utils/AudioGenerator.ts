/**
 * AudioGenerator - Simplified audio player using Howler.js
 * Provides high-quality audio playback with excellent browser compatibility
 */

import { Howl } from 'howler'

export class AudioGenerator {
  private currentHowl: Howl | null = null

  constructor() {
    // Howler.js handles all initialization automatically
  }

  async playSound(url: string): Promise<boolean> {
    try {
      // Stop any existing sounds
      this.stop()

      console.log('🎵 AudioGenerator: Loading sound with Howler.js:', url.substring(0, 100) + '...')

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

  setVolume(volume: number) {
    const normalizedVolume = Math.max(0, Math.min(1, volume))

    if (this.currentHowl) {
      this.currentHowl.volume(normalizedVolume)
    }
  }

  stop() {
    if (this.currentHowl) {
      this.currentHowl.stop()
      this.currentHowl.unload()
      this.currentHowl = null
    }
  }

  pause() {
    if (this.currentHowl) {
      this.currentHowl.pause()
    }
  }

  resume() {
    if (this.currentHowl) {
      this.currentHowl.play()
    }
  }

  isPlaying(): boolean {
    return this.currentHowl ? this.currentHowl.playing() : false
  }

  getDuration(): number {
    return this.currentHowl ? this.currentHowl.duration() : 0
  }

  destroy() {
    this.stop()
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
