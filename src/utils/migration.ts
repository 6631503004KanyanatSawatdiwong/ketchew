import { TodoItem } from '../types'

export interface MigrationResult {
  success: boolean
  migratedFrom?: string
  migratedTo: string
  itemsUpdated: number
  errors: string[]
}

/**
 * Current data version
 */
const CURRENT_VERSION = '1.1.0'

/**
 * Migrate todo data to the latest format
 */
export const migrateTodoData = (): MigrationResult => {
  const result: MigrationResult = {
    success: false,
    migratedTo: CURRENT_VERSION,
    itemsUpdated: 0,
    errors: [],
  }

  try {
    // Check current version
    const currentVersion = localStorage.getItem('ketchew_data_version')
    result.migratedFrom = currentVersion || '1.0.0'

    // If already on current version, no migration needed
    if (currentVersion === CURRENT_VERSION) {
      result.success = true
      return result
    }

    // Get existing todos
    const todosData = localStorage.getItem('ketchew_todos')
    if (!todosData) {
      // No existing data, set version and return
      localStorage.setItem('ketchew_data_version', CURRENT_VERSION)
      result.success = true
      return result
    }

    let todos: unknown[]
    try {
      todos = JSON.parse(todosData)
    } catch {
      result.errors.push('Failed to parse existing todo data')
      return result
    }

    // Migrate from 1.0.0 to 1.1.0
    if (!currentVersion || currentVersion === '1.0.0') {
      todos = migrateTo_1_1_0(todos)
      result.itemsUpdated = todos.length
    }

    // Save migrated data
    localStorage.setItem('ketchew_todos', JSON.stringify(todos))
    localStorage.setItem('ketchew_data_version', CURRENT_VERSION)

    result.success = true
    return result
  } catch (err) {
    result.errors.push(`Migration failed: ${err instanceof Error ? err.message : 'Unknown error'}`)
    return result
  }
}

/**
 * Migrate from version 1.0.0 to 1.1.0
 * Adds completedAt and pomodorosSessions fields
 */
const migrateTo_1_1_0 = (todos: unknown[]): TodoItem[] => {
  return todos.map((todo: unknown) => {
    const todoItem = todo as Record<string, unknown>
    const migratedTodo: TodoItem = {
      id: String(todoItem.id) || Date.now().toString(),
      text: String(todoItem.text) || '',
      completed: Boolean(todoItem.completed),
      createdAt: String(todoItem.createdAt) || new Date().toISOString(),
      // Add new fields with defaults
      completedAt:
        todoItem.completed && !todoItem.completedAt
          ? new Date().toISOString()
          : String(todoItem.completedAt || ''),
      pomodorosSessions: Number(todoItem.pomodorosSessions) || 0,
    }

    return migratedTodo
  })
}

/**
 * Validate todo data structure
 */
export const validateTodoData = (todos: unknown[]): { isValid: boolean; errors: string[] } => {
  const errors: string[] = []

  if (!Array.isArray(todos)) {
    errors.push('Todo data must be an array')
    return { isValid: false, errors }
  }

  todos.forEach((todo, index) => {
    const todoItem = todo as Record<string, unknown>
    if (!todoItem.id) {
      errors.push(`Todo at index ${index} missing required field: id`)
    }
    if (!todoItem.text || typeof todoItem.text !== 'string') {
      errors.push(`Todo at index ${index} missing or invalid field: text`)
    }
    if (typeof todoItem.completed !== 'boolean') {
      errors.push(`Todo at index ${index} missing or invalid field: completed`)
    }
    if (!todoItem.createdAt || !isValidDateString(String(todoItem.createdAt))) {
      errors.push(`Todo at index ${index} missing or invalid field: createdAt`)
    }
    if (todoItem.completedAt && !isValidDateString(String(todoItem.completedAt))) {
      errors.push(`Todo at index ${index} invalid field: completedAt`)
    }
    if (
      todoItem.pomodorosSessions !== undefined &&
      typeof todoItem.pomodorosSessions !== 'number'
    ) {
      errors.push(`Todo at index ${index} invalid field: pomodorosSessions`)
    }
  })

  return { isValid: errors.length === 0, errors }
}

/**
 * Backup current data before migration
 */
export const backupData = (): { success: boolean; backupKey?: string; error?: string } => {
  try {
    const timestamp = new Date().toISOString()
    const backupKey = `ketchew_backup_${timestamp}`

    const data = {
      version: localStorage.getItem('ketchew_data_version') || '1.0.0',
      todos: localStorage.getItem('ketchew_todos'),
      timerStore: localStorage.getItem('ketchew-timer-store'),
      taskStore: localStorage.getItem('ketchew-task-store'),
      timestamp,
    }

    localStorage.setItem(backupKey, JSON.stringify(data))

    // Keep only the last 5 backups
    cleanupOldBackups()

    return { success: true, backupKey }
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : 'Unknown backup error',
    }
  }
}

/**
 * Restore data from backup
 */
export const restoreFromBackup = (backupKey: string): { success: boolean; error?: string } => {
  try {
    const backupData = localStorage.getItem(backupKey)
    if (!backupData) {
      return { success: false, error: 'Backup not found' }
    }

    const data = JSON.parse(backupData)

    // Restore each piece of data
    if (data.version) localStorage.setItem('ketchew_data_version', data.version)
    if (data.todos) localStorage.setItem('ketchew_todos', data.todos)
    if (data.timerStore) localStorage.setItem('ketchew-timer-store', data.timerStore)
    if (data.taskStore) localStorage.setItem('ketchew-task-store', data.taskStore)

    return { success: true }
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : 'Unknown restore error',
    }
  }
}

/**
 * Get list of available backups
 */
export const getAvailableBackups = (): Array<{
  key: string
  timestamp: string
  version: string
}> => {
  const backups: Array<{ key: string; timestamp: string; version: string }> = []

  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i)
    if (key && key.startsWith('ketchew_backup_')) {
      try {
        const data = JSON.parse(localStorage.getItem(key) || '{}')
        backups.push({
          key,
          timestamp: data.timestamp || 'Unknown',
          version: data.version || 'Unknown',
        })
      } catch {
        // Skip invalid backup entries
      }
    }
  }

  return backups.sort((a, b) => b.timestamp.localeCompare(a.timestamp))
}

/**
 * Clean up old backups, keeping only the latest 5
 */
const cleanupOldBackups = () => {
  const backups = getAvailableBackups()
  if (backups.length > 5) {
    const toDelete = backups.slice(5)
    toDelete.forEach(backup => localStorage.removeItem(backup.key))
  }
}

/**
 * Get current data version
 */
export const getCurrentDataVersion = (): string => {
  return localStorage.getItem('ketchew_data_version') || '1.0.0'
}

/**
 * Check if migration is needed
 */
export const isMigrationNeeded = (): boolean => {
  const currentVersion = getCurrentDataVersion()
  return currentVersion !== CURRENT_VERSION
}

/**
 * Helper to validate date strings
 */
const isValidDateString = (dateStr: string): boolean => {
  const date = new Date(dateStr)
  return !isNaN(date.getTime()) && date.toISOString() === dateStr
}

/**
 * Export data for external backup
 */
export const exportData = (): { success: boolean; data?: string; error?: string } => {
  try {
    const exportData = {
      version: getCurrentDataVersion(),
      exportDate: new Date().toISOString(),
      todos: localStorage.getItem('ketchew_todos'),
      timerStore: localStorage.getItem('ketchew-timer-store'),
      taskStore: localStorage.getItem('ketchew-task-store'),
    }

    return {
      success: true,
      data: JSON.stringify(exportData, null, 2),
    }
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : 'Export failed',
    }
  }
}

/**
 * Import data from external source
 */
export const importData = (jsonData: string): { success: boolean; error?: string } => {
  try {
    const data = JSON.parse(jsonData)

    // Validate structure
    if (!data.version || !data.exportDate) {
      return { success: false, error: 'Invalid export format' }
    }

    // Backup current data before import
    const backup = backupData()
    if (!backup.success) {
      return { success: false, error: 'Failed to backup current data' }
    }

    // Import data
    if (data.todos) localStorage.setItem('ketchew_todos', data.todos)
    if (data.timerStore) localStorage.setItem('ketchew-timer-store', data.timerStore)
    if (data.taskStore) localStorage.setItem('ketchew-task-store', data.taskStore)

    // Set version (will trigger migration if needed on next load)
    localStorage.setItem('ketchew_data_version', data.version)

    return { success: true }
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : 'Import failed',
    }
  }
}
