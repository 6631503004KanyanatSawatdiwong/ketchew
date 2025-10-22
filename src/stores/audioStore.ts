import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { Howl, Howler } from 'howler'
import { useEffect } from 'react'

interface AudioState {
  // Current audio state
  currentBackgroundSound: Howl | null
  currentNotificationSound: Howl | null
  isBackgroundPlaying: boolean

  // Audio settings
  backgroundVolume: number
  notificationVolume: number
  isMuted: boolean
  selectedBackgroundSound: string | null
  selectedNotificationSounds: {
    studyEnd: string
    breakEnd: string
    roundComplete: string
  }

  // Audio preferences
  enableNotifications: boolean
  enableBackgroundSounds: boolean
  fadeInDuration: number
  fadeOutDuration: number

  // Actions
  setBackgroundVolume: (volume: number) => void
  setNotificationVolume: (volume: number) => void
  toggleMute: () => void
  playBackgroundSound: (soundId: string) => void
  stopBackgroundSound: () => void
  playNotificationSound: (type: 'studyEnd' | 'breakEnd' | 'roundComplete') => void
  setNotificationSound: (type: 'studyEnd' | 'breakEnd' | 'roundComplete', soundId: string) => void
  setBackgroundSoundEnabled: (enabled: boolean) => void
  setNotificationsEnabled: (enabled: boolean) => void
  setFadeSettings: (fadeIn: number, fadeOut: number) => void

  // Internal functions
  createHowl: (url: string, options?: Partial<HowlOptions>) => Howl
  cleanup: () => void
}

interface HowlOptions {
  loop: boolean
  volume: number
  autoplay: boolean
  onload: () => void
  onplay: () => void
  onstop: () => void
  onend: () => void
  onfade: () => void
}

export const useAudioStore = create<AudioState>()(
  persist(
    (set, get) => ({
      // Initial state
      currentBackgroundSound: null,
      currentNotificationSound: null,
      isBackgroundPlaying: false,
      backgroundVolume: 0.5,
      notificationVolume: 0.7,
      isMuted: false,
      selectedBackgroundSound: null,
      selectedNotificationSounds: {
        studyEnd: 'bell',
        breakEnd: 'chime',
        roundComplete: 'success',
      },
      enableNotifications: true,
      enableBackgroundSounds: true,
      fadeInDuration: 1000,
      fadeOutDuration: 1000,

      // Volume controls
      setBackgroundVolume: (volume: number) => {
        const state = get()
        set({ backgroundVolume: volume })

        if (state.currentBackgroundSound && !state.isMuted) {
          state.currentBackgroundSound.volume(volume)
        }

        // Update global Howler volume for background sounds
        Howler.volume(volume)
      },

      setNotificationVolume: (volume: number) => {
        set({ notificationVolume: volume })
      },

      toggleMute: () => {
        const state = get()
        const newMutedState = !state.isMuted

        set({ isMuted: newMutedState })

        if (state.currentBackgroundSound) {
          if (newMutedState) {
            state.currentBackgroundSound.mute(true)
          } else {
            state.currentBackgroundSound.mute(false)
            state.currentBackgroundSound.volume(state.backgroundVolume)
          }
        }

        // Mute/unmute all Howler sounds
        Howler.mute(newMutedState)
      },

      // Background sound management
      playBackgroundSound: (soundId: string) => {
        const state = get()

        if (!state.enableBackgroundSounds) return

        // Stop current background sound
        if (state.currentBackgroundSound) {
          state.currentBackgroundSound.fade(state.backgroundVolume, 0, state.fadeOutDuration)
          setTimeout(() => {
            state.currentBackgroundSound?.stop()
          }, state.fadeOutDuration)
        }

        // Find sound URL (this would come from sound library)
        const soundUrl = getSoundUrl(soundId)
        if (!soundUrl) return

        const newSound = state.createHowl(soundUrl, {
          loop: true,
          volume: 0,
          autoplay: true,
          onplay: () => {
            set({ isBackgroundPlaying: true })
            // Fade in
            newSound.fade(0, state.isMuted ? 0 : state.backgroundVolume, state.fadeInDuration)
          },
          onstop: () => {
            set({ isBackgroundPlaying: false })
          },
        })

        set({
          currentBackgroundSound: newSound,
          selectedBackgroundSound: soundId,
        })
      },

      stopBackgroundSound: () => {
        const state = get()

        if (state.currentBackgroundSound) {
          state.currentBackgroundSound.fade(state.backgroundVolume, 0, state.fadeOutDuration)

          setTimeout(() => {
            state.currentBackgroundSound?.stop()
            set({
              currentBackgroundSound: null,
              selectedBackgroundSound: null,
              isBackgroundPlaying: false,
            })
          }, state.fadeOutDuration)
        }
      },

      // Notification sounds
      playNotificationSound: (type: 'studyEnd' | 'breakEnd' | 'roundComplete') => {
        const state = get()

        if (!state.enableNotifications) return

        const soundId = state.selectedNotificationSounds[type]
        const soundUrl = getSoundUrl(soundId)

        if (!soundUrl) return

        // Stop any current notification sound
        if (state.currentNotificationSound) {
          state.currentNotificationSound.stop()
        }

        const notificationSound = state.createHowl(soundUrl, {
          loop: false,
          volume: state.isMuted ? 0 : state.notificationVolume,
          autoplay: true,
          onend: () => {
            set({ currentNotificationSound: null })
          },
        })

        set({ currentNotificationSound: notificationSound })
      },

      setNotificationSound: (type: 'studyEnd' | 'breakEnd' | 'roundComplete', soundId: string) => {
        const state = get()
        set({
          selectedNotificationSounds: {
            ...state.selectedNotificationSounds,
            [type]: soundId,
          },
        })
      },

      // Settings
      setBackgroundSoundEnabled: (enabled: boolean) => {
        const state = get()
        set({ enableBackgroundSounds: enabled })

        if (!enabled && state.currentBackgroundSound) {
          state.stopBackgroundSound()
        }
      },

      setNotificationsEnabled: (enabled: boolean) => {
        set({ enableNotifications: enabled })
      },

      setFadeSettings: (fadeIn: number, fadeOut: number) => {
        set({
          fadeInDuration: fadeIn,
          fadeOutDuration: fadeOut,
        })
      },

      // Utility functions
      createHowl: (url: string, options: Partial<HowlOptions> = {}) => {
        return new Howl({
          src: [url],
          format: ['mp3', 'wav', 'ogg'],
          html5: true,
          preload: true,
          ...options,
        })
      },

      cleanup: () => {
        const state = get()

        if (state.currentBackgroundSound) {
          state.currentBackgroundSound.stop()
          state.currentBackgroundSound.unload()
        }

        if (state.currentNotificationSound) {
          state.currentNotificationSound.stop()
          state.currentNotificationSound.unload()
        }

        set({
          currentBackgroundSound: null,
          currentNotificationSound: null,
          isBackgroundPlaying: false,
        })
      },
    }),
    {
      name: 'ketchew-audio-store',
      // Only persist settings, not audio instances
      partialize: state => ({
        backgroundVolume: state.backgroundVolume,
        notificationVolume: state.notificationVolume,
        isMuted: state.isMuted,
        selectedBackgroundSound: state.selectedBackgroundSound,
        selectedNotificationSounds: state.selectedNotificationSounds,
        enableNotifications: state.enableNotifications,
        enableBackgroundSounds: state.enableBackgroundSounds,
        fadeInDuration: state.fadeInDuration,
        fadeOutDuration: state.fadeOutDuration,
      }),
    }
  )
)

// Helper function to get sound URLs (would be replaced with actual sound library)
const getSoundUrl = (soundId: string): string | null => {
  const soundMap: Record<string, string> = {
    // Background sounds
    rain: '/sounds/rain.mp3',
    forest: '/sounds/forest.mp3',
    waves: '/sounds/waves.mp3',
    whitenoise: '/sounds/whitenoise.mp3',
    cafe: '/sounds/cafe.mp3',
    binaural: '/sounds/binaural.mp3',
    fireplace: '/sounds/fireplace.mp3',
    thunder: '/sounds/thunder.mp3',
    wind: '/sounds/wind.mp3',
    stream: '/sounds/stream.mp3',

    // Notification sounds
    bell: '/sounds/bell.mp3',
    chime: '/sounds/chime.mp3',
    ding: '/sounds/ding.mp3',
    success: '/sounds/success.mp3',
    'soft-bell': '/sounds/soft-bell.mp3',
    zen: '/sounds/zen.mp3',
    ping: '/sounds/ping.mp3',
    gentle: '/sounds/gentle.mp3',
  }

  return soundMap[soundId] || null
}

// Hook for cleanup on component unmount
export const useAudioCleanup = () => {
  const cleanup = useAudioStore(state => state.cleanup)

  useEffect(() => {
    return () => {
      cleanup()
    }
  }, [cleanup])
}
