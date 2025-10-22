import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface TaskState {
  // Current active task during pomodoro session
  activeTaskId: string | null

  // Task analytics data
  taskSessions: {
    taskId: string
    sessionDate: string
    duration: number // in minutes
    completed: boolean
  }[]

  // Actions
  setActiveTask: (taskId: string | null) => void
  recordTaskSession: (taskId: string, duration: number, completed: boolean) => void
  incrementTaskPomodoros: (taskId: string) => void
  getTaskAnalytics: (taskId: string) => {
    totalSessions: number
    totalTime: number
    completedSessions: number
    averageSessionLength: number
  }
  getOverallAnalytics: () => {
    totalTasks: number
    completedTasks: number
    totalSessions: number
    totalTime: number
    averageTaskCompletionTime: number
  }
}

export const useTaskStore = create<TaskState>()(
  persist(
    (set, get) => ({
      activeTaskId: null,
      taskSessions: [],

      setActiveTask: (taskId: string | null) => {
        set({ activeTaskId: taskId })
      },

      recordTaskSession: (taskId: string, duration: number, completed: boolean) => {
        const newSession = {
          taskId,
          sessionDate: new Date().toISOString(),
          duration,
          completed,
        }

        set(state => ({
          taskSessions: [...state.taskSessions, newSession],
        }))
      },

      incrementTaskPomodoros: () => {
        // This will be called from TodoList component when updating the task
        // The actual increment happens in the TodoList component
      },

      getTaskAnalytics: (taskId: string) => {
        const state = get()
        const taskSessions = state.taskSessions.filter(session => session.taskId === taskId)

        const totalSessions = taskSessions.length
        const completedSessions = taskSessions.filter(session => session.completed).length
        const totalTime = taskSessions.reduce((sum, session) => sum + session.duration, 0)
        const averageSessionLength = totalSessions > 0 ? totalTime / totalSessions : 0

        return {
          totalSessions,
          totalTime,
          completedSessions,
          averageSessionLength,
        }
      },

      getOverallAnalytics: () => {
        const state = get()
        const totalSessions = state.taskSessions.length
        const totalTime = state.taskSessions.reduce((sum, session) => sum + session.duration, 0)

        // Get unique task IDs from sessions
        const uniqueTasks = new Set(state.taskSessions.map(session => session.taskId))
        const totalTasks = uniqueTasks.size

        // Calculate completed tasks (tasks with at least one completed session)
        const completedTasks = new Set(
          state.taskSessions.filter(session => session.completed).map(session => session.taskId)
        ).size

        const averageTaskCompletionTime = totalTasks > 0 ? totalTime / totalTasks : 0

        return {
          totalTasks,
          completedTasks,
          totalSessions,
          totalTime,
          averageTaskCompletionTime,
        }
      },
    }),
    {
      name: 'ketchew-task-store',
    }
  )
)
