import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { PrecisionTimer } from '../utils/PrecisionTimer'
import { useAudioStore } from './audioStore'

export type TimerPhase = 'study' | 'shortBreak' | 'longBreak'
export type TimerStatus = 'idle' | 'running' | 'paused' | 'completed'

export interface TimerSettings {
  studyDuration: number // minutes
  shortBreakDuration: number // minutes
  longBreakDuration: number // minutes
  autoStartBreaks: boolean
  autoStartStudy: boolean
}

export interface PomodoroState {
  // Current session state
  currentRound: number // 1-4
  currentPhase: TimerPhase
  timeRemainingMs: number
  status: TimerStatus

  // Round completion tracking
  completedRounds: boolean[] // [round1, round2, round3, round4]

  // Settings
  settings: TimerSettings

  // UI state
  showPhaseNotification: boolean
  lastCompletedPhase: { phase: TimerPhase; round: number } | null

  // Internal timer reference
  precisionTimer: PrecisionTimer | null

  // Actions
  startTimer: () => void
  pauseTimer: () => void
  resumeTimer: () => void
  stopTimer: () => void
  resetSession: () => void
  skipPhase: () => void
  updateSettings: (newSettings: Partial<TimerSettings>) => void

  // UI actions
  dismissNotification: () => void

  // Internal actions
  handleTick: (remainingMs: number) => void
  handlePhaseComplete: () => void
  createTimer: () => void
}

const DEFAULT_SETTINGS: TimerSettings = {
  studyDuration: 25,
  shortBreakDuration: 5,
  longBreakDuration: 15,
  autoStartBreaks: false,
  autoStartStudy: false,
}

export const useTimerStore = create<PomodoroState>()(
  persist(
    (set, get) => ({
      // Initial state
      currentRound: 1,
      currentPhase: 'study',
      timeRemainingMs: DEFAULT_SETTINGS.studyDuration * 60 * 1000,
      status: 'idle',
      completedRounds: [false, false, false, false],
      settings: DEFAULT_SETTINGS,
      showPhaseNotification: false,
      lastCompletedPhase: null,
      precisionTimer: null,

      // Timer controls
      startTimer: () => {
        const state = get()
        if (!state.precisionTimer) {
          state.createTimer()
        }
        state.precisionTimer?.start()
        set({ status: 'running' })

        // Start background sound if it's a study phase and background sounds are enabled
        const audioStore = useAudioStore.getState()
        if (
          state.currentPhase === 'study' &&
          audioStore.enableBackgroundSounds &&
          audioStore.selectedBackgroundSound
        ) {
          audioStore.playBackgroundSound(audioStore.selectedBackgroundSound)
        }
      },

      pauseTimer: () => {
        const state = get()
        state.precisionTimer?.pause()
        set({ status: 'paused' })

        // Stop background sound when pausing during study
        const audioStore = useAudioStore.getState()
        if (state.currentPhase === 'study' && audioStore.isBackgroundPlaying) {
          audioStore.stopBackgroundSound()
        }
      },

      resumeTimer: () => {
        const state = get()
        state.precisionTimer?.start()
        set({ status: 'running' })

        // Resume background sound if it's a study phase and background sounds are enabled
        const audioStore = useAudioStore.getState()
        if (
          state.currentPhase === 'study' &&
          audioStore.enableBackgroundSounds &&
          audioStore.selectedBackgroundSound
        ) {
          audioStore.playBackgroundSound(audioStore.selectedBackgroundSound)
        }
      },

      stopTimer: () => {
        const state = get()
        state.precisionTimer?.stop()

        // Stop background sound when stopping timer
        const audioStore = useAudioStore.getState()
        if (audioStore.isBackgroundPlaying) {
          audioStore.stopBackgroundSound()
        }

        // Reset time to current phase duration
        const phaseDuration =
          state.currentPhase === 'study'
            ? state.settings.studyDuration
            : state.currentPhase === 'shortBreak'
              ? state.settings.shortBreakDuration
              : state.settings.longBreakDuration

        set({
          status: 'idle',
          timeRemainingMs: phaseDuration * 60 * 1000,
        })
      },

      resetSession: () => {
        const state = get()
        state.precisionTimer?.stop()

        set({
          currentRound: 1,
          currentPhase: 'study',
          timeRemainingMs: state.settings.studyDuration * 60 * 1000,
          status: 'idle',
          completedRounds: [false, false, false, false],
          precisionTimer: null,
        })
      },

      skipPhase: () => {
        const state = get()
        state.precisionTimer?.stop()
        state.handlePhaseComplete()
      },

      updateSettings: (newSettings: Partial<TimerSettings>) => {
        const state = get()
        const updatedSettings = { ...state.settings, ...newSettings }

        // If currently in idle state, update the time remaining for current phase
        let timeRemainingMs = state.timeRemainingMs
        if (state.status === 'idle') {
          const phaseDuration =
            state.currentPhase === 'study'
              ? updatedSettings.studyDuration
              : state.currentPhase === 'shortBreak'
                ? updatedSettings.shortBreakDuration
                : updatedSettings.longBreakDuration

          timeRemainingMs = phaseDuration * 60 * 1000
        }

        set({
          settings: updatedSettings,
          timeRemainingMs,
        })
      },

      // UI actions
      dismissNotification: () => {
        set({ showPhaseNotification: false, lastCompletedPhase: null })
      },

      // Internal handlers
      handleTick: (remainingMs: number) => {
        set({ timeRemainingMs: remainingMs })
      },

      handlePhaseComplete: () => {
        const state = get()

        // Store the completed phase for notification
        const completedPhase = { phase: state.currentPhase, round: state.currentRound }

        // Play completion notification sound
        const audioStore = useAudioStore.getState()
        if (state.currentPhase === 'study') {
          audioStore.playNotificationSound('studyEnd')
        } else {
          audioStore.playNotificationSound('breakEnd')
        }

        if (state.currentPhase === 'study') {
          // Study phase completed - mark round as done
          const newCompletedRounds = [...state.completedRounds]
          newCompletedRounds[state.currentRound - 1] = true

          // Determine next phase
          const isLastRound = state.currentRound === 4
          const nextPhase: TimerPhase = isLastRound ? 'longBreak' : 'shortBreak'
          const nextDuration =
            nextPhase === 'longBreak'
              ? state.settings.longBreakDuration
              : state.settings.shortBreakDuration

          set({
            currentPhase: nextPhase,
            timeRemainingMs: nextDuration * 60 * 1000,
            status: state.settings.autoStartBreaks ? 'running' : 'idle',
            completedRounds: newCompletedRounds,
            showPhaseNotification: true,
            lastCompletedPhase: completedPhase,
            precisionTimer: null,
          })

          // Auto-start break if enabled
          if (state.settings.autoStartBreaks) {
            setTimeout(() => get().createTimer(), 100)
          }
        } else {
          // Break completed
          if (state.currentRound === 4) {
            // All rounds completed - play completion sound
            const audioStore = useAudioStore.getState()
            audioStore.playNotificationSound('roundComplete')

            // All rounds completed - reset session
            set({
              currentRound: 1,
              currentPhase: 'study',
              timeRemainingMs: state.settings.studyDuration * 60 * 1000,
              status: 'completed',
              completedRounds: [false, false, false, false],
              showPhaseNotification: true,
              lastCompletedPhase: completedPhase,
              precisionTimer: null,
            })
          } else {
            // Move to next round
            set({
              currentRound: state.currentRound + 1,
              currentPhase: 'study',
              timeRemainingMs: state.settings.studyDuration * 60 * 1000,
              status: state.settings.autoStartStudy ? 'running' : 'idle',
              showPhaseNotification: true,
              lastCompletedPhase: completedPhase,
              precisionTimer: null,
            })

            // Auto-start next study session if enabled
            if (state.settings.autoStartStudy) {
              setTimeout(() => get().createTimer(), 100)
            }
          }
        }
      },

      createTimer: () => {
        const state = get()
        const timer = new PrecisionTimer(
          state.timeRemainingMs,
          state.handleTick,
          state.handlePhaseComplete,
          100 // Update every 100ms for smooth display
        )

        set({ precisionTimer: timer })
        return timer
      },
    }),
    {
      name: 'ketchew-timer-store',
      // Only persist certain fields, not the timer instance or UI state
      partialize: state => ({
        currentRound: state.currentRound,
        currentPhase: state.currentPhase,
        timeRemainingMs: state.timeRemainingMs,
        status: state.status === 'running' ? 'idle' : state.status, // Don't persist running state
        completedRounds: state.completedRounds,
        settings: state.settings,
        // Don't persist UI state (showPhaseNotification, lastCompletedPhase)
      }),
    }
  )
)
