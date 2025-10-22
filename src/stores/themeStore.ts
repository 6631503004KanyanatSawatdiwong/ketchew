import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface Theme {
  id: string
  name: string
  description: string
  category: 'light' | 'dark' | 'nature' | 'focus'
  colors: {
    // Primary colors
    primary: string
    primaryHover: string
    primaryText: string

    // Background colors
    background: string
    backgroundSecondary: string
    surface: string
    surfaceHover: string

    // Text colors
    text: string
    textSecondary: string
    textMuted: string

    // Border colors
    border: string
    borderHover: string

    // Status colors
    success: string
    warning: string
    error: string
    info: string

    // Timer-specific colors
    timerBackground: string
    timerText: string
    timerProgress: string
    timerProgressBackground: string

    // Button colors
    button: string
    buttonHover: string
    buttonText: string
    buttonSecondary: string
    buttonSecondaryHover: string
    buttonSecondaryText: string
  }
  fonts: {
    primary: string
    secondary: string
    mono: string
  }
  spacing: {
    scale: number // Multiplier for spacing values
  }
  borderRadius: {
    sm: string
    md: string
    lg: string
    xl: string
  }
}

// Default themes
export const THEMES: Theme[] = [
  // Light theme
  {
    id: 'light',
    name: 'Light',
    description: 'Clean and bright interface for daytime focus',
    category: 'light',
    colors: {
      primary: '#3b82f6',
      primaryHover: '#2563eb',
      primaryText: '#ffffff',
      background: '#ffffff',
      backgroundSecondary: '#f9fafb',
      surface: '#ffffff',
      surfaceHover: '#f3f4f6',
      text: '#111827',
      textSecondary: '#6b7280',
      textMuted: '#9ca3af',
      border: '#e5e7eb',
      borderHover: '#d1d5db',
      success: '#10b981',
      warning: '#f59e0b',
      error: '#ef4444',
      info: '#3b82f6',
      timerBackground: '#f9fafb',
      timerText: '#111827',
      timerProgress: '#3b82f6',
      timerProgressBackground: '#e5e7eb',
      button: '#3b82f6',
      buttonHover: '#2563eb',
      buttonText: '#ffffff',
      buttonSecondary: '#f3f4f6',
      buttonSecondaryHover: '#e5e7eb',
      buttonSecondaryText: '#374151',
    },
    fonts: {
      primary: 'Inter, system-ui, sans-serif',
      secondary: 'Inter, system-ui, sans-serif',
      mono: 'JetBrains Mono, Consolas, monospace',
    },
    spacing: {
      scale: 1,
    },
    borderRadius: {
      sm: '0.375rem',
      md: '0.5rem',
      lg: '0.75rem',
      xl: '1rem',
    },
  },

  // Dark theme
  {
    id: 'dark',
    name: 'Dark',
    description: 'Easy on the eyes for evening and night sessions',
    category: 'dark',
    colors: {
      primary: '#3b82f6',
      primaryHover: '#2563eb',
      primaryText: '#ffffff',
      background: '#0f172a',
      backgroundSecondary: '#1e293b',
      surface: '#1e293b',
      surfaceHover: '#334155',
      text: '#f1f5f9',
      textSecondary: '#cbd5e1',
      textMuted: '#94a3b8',
      border: '#334155',
      borderHover: '#475569',
      success: '#10b981',
      warning: '#f59e0b',
      error: '#ef4444',
      info: '#3b82f6',
      timerBackground: '#1e293b',
      timerText: '#f1f5f9',
      timerProgress: '#3b82f6',
      timerProgressBackground: '#334155',
      button: '#3b82f6',
      buttonHover: '#2563eb',
      buttonText: '#ffffff',
      buttonSecondary: '#334155',
      buttonSecondaryHover: '#475569',
      buttonSecondaryText: '#f1f5f9',
    },
    fonts: {
      primary: 'Inter, system-ui, sans-serif',
      secondary: 'Inter, system-ui, sans-serif',
      mono: 'JetBrains Mono, Consolas, monospace',
    },
    spacing: {
      scale: 1,
    },
    borderRadius: {
      sm: '0.375rem',
      md: '0.5rem',
      lg: '0.75rem',
      xl: '1rem',
    },
  },

  // Nature theme
  {
    id: 'nature',
    name: 'Nature',
    description: 'Earthy tones inspired by natural environments',
    category: 'nature',
    colors: {
      primary: '#059669',
      primaryHover: '#047857',
      primaryText: '#ffffff',
      background: '#f0fdf4',
      backgroundSecondary: '#ecfdf5',
      surface: '#ffffff',
      surfaceHover: '#f7fee7',
      text: '#14532d',
      textSecondary: '#15803d',
      textMuted: '#65a30d',
      border: '#d1fae5',
      borderHover: '#bbf7d0',
      success: '#22c55e',
      warning: '#eab308',
      error: '#dc2626',
      info: '#0ea5e9',
      timerBackground: '#ecfdf5',
      timerText: '#14532d',
      timerProgress: '#059669',
      timerProgressBackground: '#bbf7d0',
      button: '#059669',
      buttonHover: '#047857',
      buttonText: '#ffffff',
      buttonSecondary: '#f7fee7',
      buttonSecondaryHover: '#ecfdf5',
      buttonSecondaryText: '#14532d',
    },
    fonts: {
      primary: 'Inter, system-ui, sans-serif',
      secondary: 'Inter, system-ui, sans-serif',
      mono: 'JetBrains Mono, Consolas, monospace',
    },
    spacing: {
      scale: 1,
    },
    borderRadius: {
      sm: '0.375rem',
      md: '0.5rem',
      lg: '0.75rem',
      xl: '1rem',
    },
  },

  // Focus theme
  {
    id: 'focus',
    name: 'Focus',
    description: 'Minimal distractions with high contrast for deep work',
    category: 'focus',
    colors: {
      primary: '#7c3aed',
      primaryHover: '#6d28d9',
      primaryText: '#ffffff',
      background: '#fefbff',
      backgroundSecondary: '#f8fafc',
      surface: '#ffffff',
      surfaceHover: '#f1f5f9',
      text: '#1e1b4b',
      textSecondary: '#3730a3',
      textMuted: '#6366f1',
      border: '#e2e8f0',
      borderHover: '#cbd5e1',
      success: '#059669',
      warning: '#d97706',
      error: '#dc2626',
      info: '#0284c7',
      timerBackground: '#f8fafc',
      timerText: '#1e1b4b',
      timerProgress: '#7c3aed',
      timerProgressBackground: '#e2e8f0',
      button: '#7c3aed',
      buttonHover: '#6d28d9',
      buttonText: '#ffffff',
      buttonSecondary: '#f1f5f9',
      buttonSecondaryHover: '#e2e8f0',
      buttonSecondaryText: '#1e1b4b',
    },
    fonts: {
      primary: 'Inter, system-ui, sans-serif',
      secondary: 'Inter, system-ui, sans-serif',
      mono: 'JetBrains Mono, Consolas, monospace',
    },
    spacing: {
      scale: 1,
    },
    borderRadius: {
      sm: '0.375rem',
      md: '0.5rem',
      lg: '0.75rem',
      xl: '1rem',
    },
  },
]

export interface ThemeState {
  currentTheme: Theme
  availableThemes: Theme[]
  previewTheme: Theme | null

  // Actions
  setTheme: (themeId: string) => void
  setPreviewTheme: (themeId: string) => void
  clearPreview: () => void
  addCustomTheme: (theme: Theme) => void
  removeCustomTheme: (themeId: string) => void
  resetToDefault: () => void
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set, get) => ({
      currentTheme: THEMES[0], // Default to light theme
      availableThemes: THEMES,
      previewTheme: null,

      setTheme: (themeId: string) => {
        const theme = get().availableThemes.find(t => t.id === themeId)
        if (theme) {
          set({ currentTheme: theme, previewTheme: null })
          applyThemeToDOM(theme)
        }
      },

      setPreviewTheme: (themeId: string) => {
        const theme = get().availableThemes.find(t => t.id === themeId)
        if (theme) {
          set({ previewTheme: theme })
          applyThemeToDOM(theme)
        }
      },

      clearPreview: () => {
        const { currentTheme } = get()
        set({ previewTheme: null })
        applyThemeToDOM(currentTheme)
      },

      addCustomTheme: (theme: Theme) => {
        set(state => ({
          availableThemes: [...state.availableThemes, theme],
        }))
      },

      removeCustomTheme: (themeId: string) => {
        set(state => ({
          availableThemes: state.availableThemes.filter(t => t.id !== themeId),
          ...(state.currentTheme.id === themeId ? { currentTheme: THEMES[0] } : {}),
        }))
      },

      resetToDefault: () => {
        set({
          currentTheme: THEMES[0],
          availableThemes: THEMES,
          previewTheme: null,
        })
        applyThemeToDOM(THEMES[0])
      },
    }),
    {
      name: 'ketchew-theme-store',
      partialize: state => ({
        currentTheme: state.currentTheme,
        availableThemes: state.availableThemes.filter(
          t => !THEMES.find(defaultTheme => defaultTheme.id === t.id)
        ),
      }),
    }
  )
)

// Apply theme to DOM
function applyThemeToDOM(theme: Theme) {
  const root = document.documentElement

  // Apply CSS custom properties
  Object.entries(theme.colors).forEach(([key, value]) => {
    root.style.setProperty(`--color-${key}`, value)
  })

  // Apply fonts
  root.style.setProperty('--font-primary', theme.fonts.primary)
  root.style.setProperty('--font-secondary', theme.fonts.secondary)
  root.style.setProperty('--font-mono', theme.fonts.mono)

  // Apply border radius
  Object.entries(theme.borderRadius).forEach(([key, value]) => {
    root.style.setProperty(`--radius-${key}`, value)
  })

  // Apply spacing scale
  root.style.setProperty('--spacing-scale', theme.spacing.scale.toString())

  // Apply theme class to body for specific styling
  document.body.className = document.body.className.replace(/theme-\w+/g, '')
  document.body.classList.add(`theme-${theme.id}`)
}
