import { TodoItem } from '../types'

export interface TaskAnalytics {
  totalTasks: number
  completedTasks: number
  completionRate: number
  avgCompletionTime: number // days
  totalPomodoroSessions: number
  totalStudyTime: number // minutes
  productivityScore: number // 0-100
  streak: {
    current: number
    longest: number
  }
  trends: {
    tasksCompletedThisWeek: number
    tasksCompletedLastWeek: number
    pomodorosThisWeek: number
    pomodorosLastWeek: number
  }
}

export interface DayStats {
  date: string
  tasksCompleted: number
  pomodoroSessions: number
  studyTime: number
}

/**
 * Calculate comprehensive task analytics
 */
export const calculateTaskAnalytics = (
  todos: TodoItem[],
  taskSessions: Array<{
    taskId: string
    sessionDate: string
    duration: number
    completed: boolean
  }>
): TaskAnalytics => {
  const now = new Date()
  const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
  const twoWeeksAgo = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000)

  // Basic task metrics
  const totalTasks = todos.length
  const completedTasks = todos.filter(todo => todo.completed).length
  const completionRate = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0

  // Calculate average completion time
  const completedTasksWithDates = todos.filter(todo => todo.completed && todo.completedAt)
  const avgCompletionTime =
    completedTasksWithDates.length > 0
      ? completedTasksWithDates.reduce((sum, todo) => {
          const created = new Date(todo.createdAt)
          const completed = new Date(todo.completedAt!)
          return sum + (completed.getTime() - created.getTime())
        }, 0) /
        completedTasksWithDates.length /
        (1000 * 60 * 60 * 24) // Convert to days
      : 0

  // Pomodoro metrics
  const completedSessions = taskSessions.filter(session => session.completed)
  const totalPomodoroSessions = completedSessions.length
  const totalStudyTime = completedSessions.reduce((sum, session) => sum + session.duration, 0)

  // Weekly trends
  const thisWeekSessions = completedSessions.filter(
    session => new Date(session.sessionDate) >= oneWeekAgo
  )
  const lastWeekSessions = completedSessions.filter(session => {
    const date = new Date(session.sessionDate)
    return date >= twoWeeksAgo && date < oneWeekAgo
  })

  const tasksCompletedThisWeek = todos.filter(
    todo => todo.completed && todo.completedAt && new Date(todo.completedAt) >= oneWeekAgo
  ).length

  const tasksCompletedLastWeek = todos.filter(todo => {
    if (!todo.completed || !todo.completedAt) return false
    const date = new Date(todo.completedAt)
    return date >= twoWeeksAgo && date < oneWeekAgo
  }).length

  // Calculate streak
  const streak = calculateStreak(todos, taskSessions)

  // Calculate productivity score (0-100)
  const productivityScore = calculateProductivityScore({
    completionRate,
    avgCompletionTime,
    recentActivity: thisWeekSessions.length,
    streak: streak.current,
  })

  return {
    totalTasks,
    completedTasks,
    completionRate,
    avgCompletionTime,
    totalPomodoroSessions,
    totalStudyTime,
    productivityScore,
    streak,
    trends: {
      tasksCompletedThisWeek,
      tasksCompletedLastWeek,
      pomodorosThisWeek: thisWeekSessions.length,
      pomodorosLastWeek: lastWeekSessions.length,
    },
  }
}

/**
 * Calculate current and longest streak
 */
const calculateStreak = (
  todos: TodoItem[],
  taskSessions: Array<{
    taskId: string
    sessionDate: string
    duration: number
    completed: boolean
  }>
): { current: number; longest: number } => {
  // Get all activity dates (completed tasks and pomodoro sessions)
  const activityDates = new Set<string>()

  todos.forEach(todo => {
    if (todo.completed && todo.completedAt) {
      activityDates.add(new Date(todo.completedAt).toDateString())
    }
  })

  taskSessions.forEach(session => {
    if (session.completed) {
      activityDates.add(new Date(session.sessionDate).toDateString())
    }
  })

  const sortedDates = Array.from(activityDates).sort()

  let currentStreak = 0
  let longestStreak = 0
  let tempStreak = 0

  const today = new Date().toDateString()
  const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toDateString()

  // Calculate streaks
  for (let i = 0; i < sortedDates.length; i++) {
    if (i === 0) {
      tempStreak = 1
    } else {
      const prevDate = new Date(sortedDates[i - 1])
      const currDate = new Date(sortedDates[i])
      const diffDays = (currDate.getTime() - prevDate.getTime()) / (1000 * 60 * 60 * 24)

      if (diffDays <= 1) {
        tempStreak++
      } else {
        longestStreak = Math.max(longestStreak, tempStreak)
        tempStreak = 1
      }
    }
  }

  longestStreak = Math.max(longestStreak, tempStreak)

  // Calculate current streak (must include today or yesterday)
  if (sortedDates.includes(today) || sortedDates.includes(yesterday)) {
    let i = sortedDates.length - 1
    currentStreak = 1

    while (i > 0) {
      const prevDate = new Date(sortedDates[i - 1])
      const currDate = new Date(sortedDates[i])
      const diffDays = (currDate.getTime() - prevDate.getTime()) / (1000 * 60 * 60 * 24)

      if (diffDays <= 1) {
        currentStreak++
        i--
      } else {
        break
      }
    }
  }

  return { current: currentStreak, longest: longestStreak }
}

/**
 * Calculate productivity score based on various metrics
 */
const calculateProductivityScore = ({
  completionRate,
  avgCompletionTime,
  recentActivity,
  streak,
}: {
  completionRate: number
  avgCompletionTime: number
  recentActivity: number
  streak: number
}): number => {
  // Weighted scoring
  const completionWeight = 0.4
  const speedWeight = 0.2
  const activityWeight = 0.2
  const consistencyWeight = 0.2

  // Completion rate score (0-100)
  const completionScore = completionRate

  // Speed score (faster completion = higher score)
  const speedScore = avgCompletionTime > 0 ? Math.max(0, 100 - avgCompletionTime * 10) : 50

  // Activity score (more recent sessions = higher score)
  const activityScore = Math.min(100, recentActivity * 20)

  // Consistency score (longer streak = higher score)
  const consistencyScore = Math.min(100, streak * 10)

  const totalScore =
    completionScore * completionWeight +
    speedScore * speedWeight +
    activityScore * activityWeight +
    consistencyScore * consistencyWeight

  return Math.round(Math.max(0, Math.min(100, totalScore)))
}

/**
 * Get daily statistics for charts
 */
export const getDailyStats = (
  todos: TodoItem[],
  taskSessions: Array<{
    taskId: string
    sessionDate: string
    duration: number
    completed: boolean
  }>,
  days: number = 30
): DayStats[] => {
  const stats: DayStats[] = []
  const now = new Date()

  for (let i = 0; i < days; i++) {
    const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000)
    const dateString = date.toDateString()

    const tasksCompleted = todos.filter(
      todo =>
        todo.completed &&
        todo.completedAt &&
        new Date(todo.completedAt).toDateString() === dateString
    ).length

    const daySessions = taskSessions.filter(
      session => session.completed && new Date(session.sessionDate).toDateString() === dateString
    )

    const pomodoroSessions = daySessions.length
    const studyTime = daySessions.reduce((sum, session) => sum + session.duration, 0)

    stats.unshift({
      date: date.toISOString().split('T')[0],
      tasksCompleted,
      pomodoroSessions,
      studyTime,
    })
  }

  return stats
}
