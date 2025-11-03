import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { PrecisionTimer } from '../utils/PrecisionTimer'
import { useCollaborationStore } from './collaborationStore'
import { useAnalyticsStore } from './analyticsStore'

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

  // Session tracking
  currentSessionStart: string | null

  // Actions
  startTimer: () => void
  pauseTimer: () => void
  resumeTimer: () => void
  stopTimer: () => void
  resetSession: () => void
  skipPhase: () => void
  switchPhase: (phase: TimerPhase) => void
  updateSettings: (newSettings: Partial<TimerSettings>) => void

  // UI actions
  dismissNotification: () => void

  // Internal actions
  handleTick: (remainingMs: number) => void
  handlePhaseComplete: () => void
  createTimer: () => void

  // Collaboration actions
  syncToCollaboration: () => void
  updateFromCollaboration: (timerState: Partial<PomodoroState>) => void
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
      currentSessionStart: null,

      // Timer controls
      startTimer: () => {
        const state = get()

        // Check if we can control the timer (not in collaboration or we're the host)
        const collaborationStore = useCollaborationStore.getState()
        if (collaborationStore.isInSession && !collaborationStore.isHost) {
          return // Only host can control timer in collaboration
        }

        // Always create a new timer when starting
        state.createTimer()

        // Start the timer after creation
        setTimeout(() => {
          const updatedState = get()
          if (updatedState.precisionTimer) {
            updatedState.precisionTimer.start()
          }
        }, 10)

        // Record session start
        const sessionStart = new Date().toISOString()
        set({ status: 'running', currentSessionStart: sessionStart })

        // Sync to collaboration if in session
        setTimeout(() => get().syncToCollaboration(), 100)
      },

      pauseTimer: () => {
        const state = get()

        // Check if we can control the timer (not in collaboration or we're the host)
        const collaborationStore = useCollaborationStore.getState()
        if (collaborationStore.isInSession && !collaborationStore.isHost) {
          return // Only host can control timer in collaboration
        }

        state.precisionTimer?.pause()
        set({ status: 'paused' })

        // Sync to collaboration if in session
        setTimeout(() => get().syncToCollaboration(), 100)
      },

      resumeTimer: () => {
        const state = get()

        // Check if we can control the timer (not in collaboration or we're the host)
        const collaborationStore = useCollaborationStore.getState()
        if (collaborationStore.isInSession && !collaborationStore.isHost) {
          return // Only host can control timer in collaboration
        }

        state.precisionTimer?.start()
        set({ status: 'running' })

        // Sync to collaboration if in session
        setTimeout(() => get().syncToCollaboration(), 100)
      },

      stopTimer: () => {
        const state = get()

        // Check if we can control the timer (not in collaboration or we're the host)
        const collaborationStore = useCollaborationStore.getState()
        if (collaborationStore.isInSession && !collaborationStore.isHost) {
          return // Only host can control timer in collaboration
        }

        state.precisionTimer?.stop()

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

        // Sync to collaboration if in session
        setTimeout(() => get().syncToCollaboration(), 100)
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
          currentSessionStart: null,
        })
      },

      skipPhase: () => {
        const state = get()
        state.precisionTimer?.stop()
        state.handlePhaseComplete()
      },

      switchPhase: (phase: TimerPhase) => {
        const state = get()

        // Check if we can control the timer (not in collaboration or we're the host)
        const collaborationStore = useCollaborationStore.getState()
        if (collaborationStore.isInSession && !collaborationStore.isHost) {
          return // Only host can control timer in collaboration
        }

        // Stop any running timer
        state.precisionTimer?.stop()

        // Calculate the duration for the new phase
        const phaseDuration =
          phase === 'study'
            ? state.settings.studyDuration
            : phase === 'shortBreak'
              ? state.settings.shortBreakDuration
              : state.settings.longBreakDuration

        // Update the phase and time
        set({
          currentPhase: phase,
          timeRemainingMs: phaseDuration * 60 * 1000,
          status: 'idle',
          precisionTimer: null,
        })

        // Sync to collaboration if in session
        setTimeout(() => get().syncToCollaboration(), 100)
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

        // Record completed session in analytics
        if (state.currentSessionStart) {
          const now = new Date()
          const startTime = new Date(state.currentSessionStart)
          const duration = Math.round((now.getTime() - startTime.getTime()) / (1000 * 60)) // Duration in minutes

          const collaborationStore = useCollaborationStore.getState()

          const analyticsStore = useAnalyticsStore.getState()
          analyticsStore.recordSession({
            date: now.toISOString().split('T')[0],
            startTime: state.currentSessionStart,
            endTime: now.toISOString(),
            phase: state.currentPhase,
            duration,
            completed: true,
            collaborationSession: collaborationStore.isInSession
              ? {
                  sessionId: collaborationStore.currentSession?.id || '',
                  participants: collaborationStore.currentSession?.participants.length || 1,
                }
              : undefined,
          })
        }

        if (state.currentPhase === 'study') {
          // Study phase completed - move to break but don't mark round as complete yet
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
            showPhaseNotification: true,
            lastCompletedPhase: completedPhase,
            precisionTimer: null,
          })

          // Auto-start break if enabled
          if (state.settings.autoStartBreaks) {
            setTimeout(() => get().createTimer(), 100)
          }
        } else {
          // Break completed - NOW mark the round as complete
          const newCompletedRounds = [...state.completedRounds]
          newCompletedRounds[state.currentRound - 1] = true
          // Break completed
          if (state.currentRound === 4) {
            // All rounds completed - reset session with all tomatoes grey
            set({
              currentRound: 1,
              currentPhase: 'study',
              timeRemainingMs: state.settings.studyDuration * 60 * 1000,
              status: 'completed',
              completedRounds: [false, false, false, false], // Reset all tomatoes to grey for new session
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
              completedRounds: newCompletedRounds, // Include completed rounds
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

        // Stop any existing timer first
        if (state.precisionTimer) {
          state.precisionTimer.stop()
        }

        const timer = new PrecisionTimer(
          state.timeRemainingMs,
          state.handleTick,
          state.handlePhaseComplete,
          100 // Update every 100ms for smooth display
        )

        set({ precisionTimer: timer })
        return timer
      },

      // Collaboration sync functions
      syncToCollaboration: () => {
        const state = get()
        const collaborationStore = useCollaborationStore.getState()

        if (collaborationStore.isInSession && collaborationStore.isHost) {
          const timerState = {
            isRunning: state.status === 'running',
            currentPhase: state.currentPhase,
            timeRemaining: Math.ceil(state.timeRemainingMs / 1000), // Convert to seconds
            roundsCompleted: state.currentRound - 1,
            totalRounds: 4,
          }

          collaborationStore.updateTimerState(timerState, state.status)
        }
      },

      updateFromCollaboration: (collaborationTimerState: {
        isRunning?: boolean
        currentPhase?: TimerPhase
        timeRemaining?: number
        roundsCompleted?: number
      }) => {
        const state = get()

        // Don't update if we're the host (we control the timer)
        const collaborationStore = useCollaborationStore.getState()
        if (collaborationStore.isHost) return

        // Stop current timer
        if (state.precisionTimer) {
          state.precisionTimer.stop()
        }

        // Update state from collaboration
        const newTimeMs = (collaborationTimerState.timeRemaining || 0) * 1000
        const newPhase: TimerPhase = collaborationTimerState.currentPhase || 'study'
        const newStatus: TimerStatus = collaborationTimerState.isRunning ? 'running' : 'idle'
        const newRound = (collaborationTimerState.roundsCompleted || 0) + 1

        // Update completed rounds
        const newCompletedRounds = [false, false, false, false]
        for (let i = 0; i < Math.min(collaborationTimerState.roundsCompleted || 0, 4); i++) {
          newCompletedRounds[i] = true
        }

        set({
          currentRound: newRound,
          currentPhase: newPhase,
          timeRemainingMs: newTimeMs,
          status: newStatus,
          completedRounds: newCompletedRounds,
          precisionTimer: null,
        })

        // If timer should be running, start it
        if (newStatus === 'running') {
          setTimeout(() => {
            const updatedState = get()
            updatedState.createTimer()
            updatedState.precisionTimer?.start()
          }, 100)
        }
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
