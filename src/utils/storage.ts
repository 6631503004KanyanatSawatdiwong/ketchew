// LocalStorage utility functions for Ketchew

export const STORAGE_KEYS = {
  TIMER_STATE: 'ketchew_timer_state',
  TODOS: 'ketchew_todos',
  PREFERENCES: 'ketchew_preferences',
  PROGRESS_DATA: 'ketchew_progress',
} as const

// Generic localStorage helper
export function getStorageItem<T>(key: string, defaultValue: T): T {
  try {
    const item = localStorage.getItem(key)
    if (item === null) return defaultValue
    return JSON.parse(item)
  } catch (error) {
    console.warn(`Error reading localStorage key "${key}":`, error)
    return defaultValue
  }
}

export function setStorageItem<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch (error) {
    console.error(`Error writing to localStorage key "${key}":`, error)
  }
}

export function removeStorageItem(key: string): void {
  try {
    localStorage.removeItem(key)
  } catch (error) {
    console.warn(`Error removing localStorage key "${key}":`, error)
  }
}

// SessionStorage utilities for temporary data
export function getSessionItem<T>(key: string, defaultValue: T): T {
  try {
    const item = sessionStorage.getItem(key)
    if (item === null) return defaultValue
    return JSON.parse(item)
  } catch (error) {
    console.warn(`Error reading sessionStorage key "${key}":`, error)
    return defaultValue
  }
}

export function setSessionItem<T>(key: string, value: T): void {
  try {
    sessionStorage.setItem(key, JSON.stringify(value))
  } catch (error) {
    console.error(`Error writing to sessionStorage key "${key}":`, error)
  }
}

// Storage size monitoring
export function getStorageSize(): { localStorage: number; sessionStorage: number } {
  const getSize = (storage: Storage) => {
    let total = 0
    for (const key in storage) {
      if (Object.prototype.hasOwnProperty.call(storage, key)) {
        total += storage[key].length + key.length
      }
    }
    return total
  }

  return {
    localStorage: getSize(localStorage),
    sessionStorage: getSize(sessionStorage),
  }
}

// Storage cleanup utilities
export function clearKetchewData(): void {
  Object.values(STORAGE_KEYS).forEach(key => {
    removeStorageItem(key)
  })
}

export function exportKetchewData(): string {
  const data: Record<string, unknown> = {}
  Object.values(STORAGE_KEYS).forEach(key => {
    const value = localStorage.getItem(key)
    if (value) {
      try {
        data[key] = JSON.parse(value)
      } catch {
        data[key] = value
      }
    }
  })
  return JSON.stringify(data, null, 2)
}

export function importKetchewData(jsonData: string): boolean {
  try {
    const data = JSON.parse(jsonData)
    const validKeys = Object.values(STORAGE_KEYS)
    Object.entries(data).forEach(([key, value]) => {
      if (validKeys.includes(key as (typeof validKeys)[number])) {
        setStorageItem(key, value)
      }
    })
    return true
  } catch (error) {
    console.error('Error importing data:', error)
    return false
  }
}
