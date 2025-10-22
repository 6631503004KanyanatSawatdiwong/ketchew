import { useEffect } from 'react'
import { useTimerStore } from '../stores/timerStore'
import { useTaskStore } from '../stores/taskStore'

/**
 * Hook to integrate task tracking with pomodoro timer
 * Automatically records task sessions when study periods complete
 */
export const usePomodoroTaskIntegration = () => {
  const { status, currentPhase, lastCompletedPhase, settings } = useTimerStore()
  const { activeTaskId, recordTaskSession, setActiveTask } = useTaskStore()

  useEffect(() => {
    // When a study phase completes, record the session for the active task
    if (lastCompletedPhase?.phase === 'study' && activeTaskId) {
      const sessionDuration = settings.studyDuration
      recordTaskSession(activeTaskId, sessionDuration, true)
    }
  }, [lastCompletedPhase, activeTaskId, recordTaskSession, settings.studyDuration])

  useEffect(() => {
    // Clear active task when timer is reset or completed
    if (status === 'completed' || status === 'idle') {
      // Don't automatically clear - let user decide when to switch tasks
    }
  }, [status])

  return {
    activeTaskId,
    setActiveTask,
    isStudyPhase: currentPhase === 'study',
    isTimerActive: status === 'running',
  }
}
