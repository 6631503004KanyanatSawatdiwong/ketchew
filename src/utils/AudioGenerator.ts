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

      console.log('Loading sound with Howler.js:', url)

      return new Promise(resolve => {
        this.currentHowl = new Howl({
          src: [url],
          loop: true,
          volume: 0.3,
          autoplay: false,
          html5: false, // Use Web Audio API when possible for better performance
          preload: true,
          onload: () => {
            console.log('Sound loaded successfully:', url)
            if (this.currentHowl) {
              this.currentHowl.play()
              resolve(true)
            } else {
              resolve(false)
            }
          },
          onloaderror: (id, error) => {
            console.error('Howler.js failed to load:', url, error)
            resolve(false)
          },
          onplayerror: (id, error) => {
            console.error('Howler.js failed to play:', url, error)
            // Try to unlock audio context and play again
            if (this.currentHowl) {
              this.currentHowl.once('unlock', () => {
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
      console.error('Error playing sound:', error)
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
