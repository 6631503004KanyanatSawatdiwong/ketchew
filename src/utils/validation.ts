// Validation utilities for Ketchew

export function validateTaskText(text: string): { isValid: boolean; error?: string } {
  if (text.trim().length === 0) {
    return { isValid: false, error: 'Task text cannot be empty' }
  }

  if (text.length > 200) {
    return { isValid: false, error: 'Task text must be 200 characters or less' }
  }

  return { isValid: true }
}

export function validateChatMessage(message: string): { isValid: boolean; error?: string } {
  if (message.trim().length === 0) {
    return { isValid: false, error: 'Message cannot be empty' }
  }

  if (message.length > 200) {
    return { isValid: false, error: 'Message must be 200 characters or less' }
  }

  return { isValid: true }
}

export function validateNickname(nickname: string): { isValid: boolean; error?: string } {
  if (nickname.trim().length === 0) {
    return { isValid: false, error: 'Nickname cannot be empty' }
  }

  if (nickname.length > 20) {
    return { isValid: false, error: 'Nickname must be 20 characters or less' }
  }

  if (!/^[a-zA-Z0-9_-]+$/.test(nickname)) {
    return {
      isValid: false,
      error: 'Nickname can only contain letters, numbers, hyphens, and underscores',
    }
  }

  return { isValid: true }
}

export function validateTimerDuration(duration: number): { isValid: boolean; error?: string } {
  if (!Number.isInteger(duration) || duration < 1) {
    return { isValid: false, error: 'Duration must be a positive integer' }
  }

  if (duration > 120) {
    return { isValid: false, error: 'Duration cannot exceed 120 minutes' }
  }

  return { isValid: true }
}

export function validateSessionId(sessionId: string): { isValid: boolean; error?: string } {
  if (sessionId.length !== 8) {
    return { isValid: false, error: 'Session ID must be 8 characters' }
  }

  if (!/^[A-Z0-9]+$/.test(sessionId)) {
    return { isValid: false, error: 'Session ID can only contain uppercase letters and numbers' }
  }

  return { isValid: true }
}

export function sanitizeInput(input: string): string {
  return input
    .replace(/[<>"'&]/g, '') // Remove potential XSS characters
    .trim()
}

export function generateSessionId(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
  let result = ''
  for (let i = 0; i < 8; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return result
}

export function generateId(): string {
  return Date.now().toString() + Math.random().toString(36).substr(2, 9)
}
