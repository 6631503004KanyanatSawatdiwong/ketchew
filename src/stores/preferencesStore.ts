import { create } from 'zustand'
import { useAudioStore } from './audioStore'
import { useThemeStore } from './themeStore'
import { useTimerStore } from './timerStore'

export interface PreferencesExport {
  version: string
  timestamp: string
  theme: {
    currentThemeId: string
  }
  audio: {
    selectedBackgroundSound: string | null
    backgroundVolume: number
    notificationVolume: number
    enableBackgroundSounds: boolean
    enableNotifications: boolean
    selectedNotificationSounds: {
      studyEnd: string
      breakEnd: string
      roundComplete: string
    }
    fadeInDuration: number
    fadeOutDuration: number
  }
  timer: {
    studyDuration: number
    shortBreakDuration: number
    longBreakDuration: number
    autoStartBreaks: boolean
    autoStartStudy: boolean
  }
  visual: {
    selectedBackground: string | null
    favoriteBackgrounds: string[]
  }
}

export interface PreferencesState {
  // Preferences management
  exportPreferences: () => PreferencesExport
  importPreferences: (data: PreferencesExport) => { success: boolean; errors?: string[] }
  resetAllPreferences: () => void
  resetCategory: (category: 'theme' | 'audio' | 'timer' | 'visual') => void

  // Quick presets
  applyPreset: (preset: 'focus' | 'relaxed' | 'productive' | 'minimal') => void

  // Backup and restore
  createBackup: () => string
  restoreFromBackup: (backupString: string) => { success: boolean; error?: string }
}

export const usePreferencesStore = create<PreferencesState>()((set, get) => ({
  exportPreferences: () => {
    const audioStore = useAudioStore.getState()
    const themeStore = useThemeStore.getState()
    const timerStore = useTimerStore.getState()

    // Get visual preferences from localStorage
    const selectedBackground = localStorage.getItem('selectedBackground')
    const favoriteBackgrounds = JSON.parse(localStorage.getItem('favoriteBackgrounds') || '[]')

    return {
      version: '1.0.0',
      timestamp: new Date().toISOString(),
      theme: {
        currentThemeId: themeStore.currentTheme.id,
      },
      audio: {
        selectedBackgroundSound: audioStore.selectedBackgroundSound,
        backgroundVolume: audioStore.backgroundVolume,
        notificationVolume: audioStore.notificationVolume,
        enableBackgroundSounds: audioStore.enableBackgroundSounds,
        enableNotifications: audioStore.enableNotifications,
        selectedNotificationSounds: audioStore.selectedNotificationSounds,
        fadeInDuration: audioStore.fadeInDuration,
        fadeOutDuration: audioStore.fadeOutDuration,
      },
      timer: {
        studyDuration: timerStore.settings.studyDuration,
        shortBreakDuration: timerStore.settings.shortBreakDuration,
        longBreakDuration: timerStore.settings.longBreakDuration,
        autoStartBreaks: timerStore.settings.autoStartBreaks,
        autoStartStudy: timerStore.settings.autoStartStudy,
      },
      visual: {
        selectedBackground: selectedBackground ? JSON.parse(selectedBackground) : null,
        favoriteBackgrounds,
      },
    }
  },

  importPreferences: (data: PreferencesExport) => {
    const errors: string[] = []

    try {
      // Validate version compatibility
      if (data.version !== '1.0.0') {
        errors.push(`Unsupported preferences version: ${data.version}`)
      }

      // Import theme preferences
      if (data.theme?.currentThemeId) {
        try {
          useThemeStore.getState().setTheme(data.theme.currentThemeId)
        } catch (error) {
          errors.push(`Failed to apply theme: ${error}`)
        }
      }

      // Import audio preferences
      if (data.audio) {
        const audioStore = useAudioStore.getState()
        try {
          if (data.audio.selectedBackgroundSound) {
            audioStore.playBackgroundSound(data.audio.selectedBackgroundSound)
          }
          audioStore.setBackgroundVolume(data.audio.backgroundVolume ?? 0.7)
          audioStore.setNotificationVolume(data.audio.notificationVolume ?? 0.8)
          audioStore.setBackgroundSoundEnabled(data.audio.enableBackgroundSounds ?? true)
          audioStore.setNotificationsEnabled(data.audio.enableNotifications ?? true)
          audioStore.setFadeSettings(
            data.audio.fadeInDuration ?? 1000,
            data.audio.fadeOutDuration ?? 1000
          )

          // Set notification sounds
          if (data.audio.selectedNotificationSounds) {
            Object.entries(data.audio.selectedNotificationSounds).forEach(([key, value]) => {
              audioStore.setNotificationSound(
                key as 'studyEnd' | 'breakEnd' | 'roundComplete',
                value
              )
            })
          }
        } catch (error) {
          errors.push(`Failed to import audio settings: ${error}`)
        }
      }

      // Import timer preferences
      if (data.timer) {
        try {
          const timerStore = useTimerStore.getState()
          timerStore.updateSettings({
            studyDuration: data.timer.studyDuration ?? 25,
            shortBreakDuration: data.timer.shortBreakDuration ?? 5,
            longBreakDuration: data.timer.longBreakDuration ?? 15,
            autoStartBreaks: data.timer.autoStartBreaks ?? false,
            autoStartStudy: data.timer.autoStartStudy ?? false,
          })
        } catch (error) {
          errors.push(`Failed to import timer settings: ${error}`)
        }
      }

      // Import visual preferences
      if (data.visual) {
        try {
          if (data.visual.selectedBackground) {
            localStorage.setItem(
              'selectedBackground',
              JSON.stringify(data.visual.selectedBackground)
            )
          }
          if (data.visual.favoriteBackgrounds) {
            localStorage.setItem(
              'favoriteBackgrounds',
              JSON.stringify(data.visual.favoriteBackgrounds)
            )
          }
        } catch (error) {
          errors.push(`Failed to import visual settings: ${error}`)
        }
      }

      return { success: errors.length === 0, errors: errors.length > 0 ? errors : undefined }
    } catch (error) {
      return { success: false, errors: [`Import failed: ${error}`] }
    }
  },

  resetAllPreferences: () => {
    // Reset all stores to defaults
    useThemeStore.getState().resetToDefault()

    // Reset audio to default values
    const audioStore = useAudioStore.getState()
    audioStore.setBackgroundVolume(0.7)
    audioStore.setNotificationVolume(0.8)
    audioStore.setBackgroundSoundEnabled(true)
    audioStore.setNotificationsEnabled(true)
    audioStore.setFadeSettings(1000, 1000)
    audioStore.stopBackgroundSound()

    useTimerStore.getState().resetSession()

    // Clear visual preferences
    localStorage.removeItem('selectedBackground')
    localStorage.removeItem('favoriteBackgrounds')
  },

  resetCategory: (category: 'theme' | 'audio' | 'timer' | 'visual') => {
    switch (category) {
      case 'theme':
        useThemeStore.getState().resetToDefault()
        break
      case 'audio': {
        // Reset audio to default values
        const audioStore = useAudioStore.getState()
        audioStore.setBackgroundVolume(0.7)
        audioStore.setNotificationVolume(0.8)
        audioStore.setBackgroundSoundEnabled(true)
        audioStore.setNotificationsEnabled(true)
        audioStore.setFadeSettings(1000, 1000)
        audioStore.stopBackgroundSound()
        break
      }
      case 'timer':
        useTimerStore.getState().resetSession()
        break
      case 'visual':
        localStorage.removeItem('selectedBackground')
        localStorage.removeItem('favoriteBackgrounds')
        break
    }
  },

  applyPreset: (preset: 'focus' | 'relaxed' | 'productive' | 'minimal') => {
    const audioStore = useAudioStore.getState()
    const themeStore = useThemeStore.getState()
    const timerStore = useTimerStore.getState()

    switch (preset) {
      case 'focus':
        // Deep focus preset
        themeStore.setTheme('focus')
        audioStore.setBackgroundSoundEnabled(true)
        audioStore.playBackgroundSound('forest-ambience')
        audioStore.setBackgroundVolume(0.3)
        timerStore.updateSettings({
          studyDuration: 50,
          shortBreakDuration: 10,
          longBreakDuration: 30,
          autoStartBreaks: false,
          autoStartStudy: false,
        })
        break

      case 'relaxed':
        // Calm and relaxed preset
        themeStore.setTheme('nature')
        audioStore.setBackgroundSoundEnabled(true)
        audioStore.playBackgroundSound('ocean-waves')
        audioStore.setBackgroundVolume(0.4)
        timerStore.updateSettings({
          studyDuration: 25,
          shortBreakDuration: 8,
          longBreakDuration: 20,
          autoStartBreaks: true,
          autoStartStudy: false,
        })
        break

      case 'productive':
        // High productivity preset
        themeStore.setTheme('light')
        audioStore.setBackgroundSoundEnabled(true)
        audioStore.playBackgroundSound('white-noise')
        audioStore.setBackgroundVolume(0.2)
        timerStore.updateSettings({
          studyDuration: 45,
          shortBreakDuration: 5,
          longBreakDuration: 15,
          autoStartBreaks: true,
          autoStartStudy: true,
        })
        break

      case 'minimal':
        // Distraction-free preset
        themeStore.setTheme('light')
        audioStore.setBackgroundSoundEnabled(false)
        audioStore.stopBackgroundSound()
        timerStore.updateSettings({
          studyDuration: 25,
          shortBreakDuration: 5,
          longBreakDuration: 15,
          autoStartBreaks: false,
          autoStartStudy: false,
        })
        // Clear background
        localStorage.removeItem('selectedBackground')
        document.body.style.backgroundImage = ''
        break
    }
  },

  createBackup: () => {
    const preferences = get().exportPreferences()
    return btoa(JSON.stringify(preferences))
  },

  restoreFromBackup: (backupString: string) => {
    try {
      const preferences = JSON.parse(atob(backupString))
      return get().importPreferences(preferences)
    } catch (error) {
      return { success: false, error: `Invalid backup data: ${error}` }
    }
  },
}))

// Add resetToDefaults method to audio store if it doesn't exist
declare module './audioStore' {
  interface AudioState {
    resetToDefaults?: () => void
  }
}
