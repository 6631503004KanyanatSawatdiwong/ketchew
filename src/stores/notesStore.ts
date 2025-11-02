import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface Note {
  id: string
  title: string
  content: string
  tags: string[]
  category: string
  createdAt: string
  updatedAt: string
  isPinned: boolean
  isArchived: boolean
  color: string
  format: 'plain' | 'markdown'
  wordCount: number
  charCount: number
  pomodoroSessionId?: string // Link to pomodoro session when created
}

export interface NoteCategory {
  id: string
  name: string
  color: string
  icon: string
  description?: string
}

export interface NotesPreferences {
  defaultFormat: 'plain' | 'markdown'
  autoSave: boolean
  autoSaveInterval: number // in milliseconds
  showWordCount: boolean
  enableMarkdownPreview: boolean
  defaultCategory: string
  sortBy: 'updatedAt' | 'createdAt' | 'title' | 'category'
  sortOrder: 'asc' | 'desc'
  viewMode: 'list' | 'grid' | 'compact'
}

interface NotesStore {
  // Data
  notes: Note[]
  categories: NoteCategory[]
  preferences: NotesPreferences

  // UI State
  selectedNoteId: string | null
  searchQuery: string
  selectedTags: string[]
  selectedCategory: string | null
  showArchived: boolean
  isCreating: boolean

  // Actions
  createNote: (noteData: Partial<Note>) => string
  updateNote: (id: string, updates: Partial<Note>) => void
  deleteNote: (id: string) => void
  duplicateNote: (id: string) => string

  // Organization
  addTag: (noteId: string, tag: string) => void
  removeTag: (noteId: string, tag: string) => void
  moveToCategory: (noteId: string, categoryId: string) => void
  togglePin: (noteId: string) => void
  toggleArchive: (noteId: string) => void

  // Categories
  createCategory: (category: Omit<NoteCategory, 'id'>) => string
  updateCategory: (id: string, updates: Partial<NoteCategory>) => void
  deleteCategory: (id: string) => void

  // Search and filter
  setSearchQuery: (query: string) => void
  setSelectedTags: (tags: string[]) => void
  setSelectedCategory: (categoryId: string | null) => void
  toggleShowArchived: () => void

  // UI actions
  selectNote: (noteId: string | null) => void
  setIsCreating: (creating: boolean) => void

  // Preferences
  updatePreferences: (preferences: Partial<NotesPreferences>) => void

  // Data management
  exportNotes: (format: 'json' | 'markdown' | 'txt') => string
  importNotes: (data: string, format: 'json') => boolean
  clearAllNotes: () => void

  // Computed getters
  getFilteredNotes: () => Note[]
  getAllTags: () => string[]
  getNotesByCategory: (categoryId: string) => Note[]
  getPinnedNotes: () => Note[]
  getRecentNotes: (count?: number) => Note[]
}

// Default categories
const defaultCategories: NoteCategory[] = [
  {
    id: 'general',
    name: 'General',
    color: '#6B7280',
    icon: '📝',
    description: 'General notes and thoughts',
  },
  {
    id: 'work',
    name: 'Work',
    color: '#3B82F6',
    icon: '💼',
    description: 'Work-related notes and tasks',
  },
  {
    id: 'study',
    name: 'Study',
    color: '#10B981',
    icon: '📚',
    description: 'Study notes and learning materials',
  },
  {
    id: 'personal',
    name: 'Personal',
    color: '#8B5CF6',
    icon: '🏠',
    description: 'Personal notes and reminders',
  },
  {
    id: 'ideas',
    name: 'Ideas',
    color: '#F59E0B',
    icon: '💡',
    description: 'Creative ideas and inspiration',
  },
]

const defaultPreferences: NotesPreferences = {
  defaultFormat: 'plain',
  autoSave: true,
  autoSaveInterval: 2000,
  showWordCount: true,
  enableMarkdownPreview: true,
  defaultCategory: 'general',
  sortBy: 'updatedAt',
  sortOrder: 'desc',
  viewMode: 'list',
}

// Utility functions
const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2)
}

const calculateWordCount = (text: string): number => {
  return text
    .trim()
    .split(/\s+/)
    .filter(word => word.length > 0).length
}

const extractTags = (content: string): string[] => {
  const tagRegex = /#(\w+)/g
  const matches = content.match(tagRegex)
  return matches ? matches.map(tag => tag.slice(1).toLowerCase()) : []
}

export const useNotesStore = create<NotesStore>()(
  persist(
    (set, get) => ({
      // Initial state
      notes: [],
      categories: defaultCategories,
      preferences: defaultPreferences,
      selectedNoteId: null,
      searchQuery: '',
      selectedTags: [],
      selectedCategory: null,
      showArchived: false,
      isCreating: false,

      // Create new note
      createNote: noteData => {
        const id = generateId()
        const now = new Date().toISOString()
        const content = noteData.content || ''

        const note: Note = {
          id,
          title: noteData.title || 'Untitled Note',
          content,
          tags: noteData.tags || extractTags(content),
          category: noteData.category || get().preferences.defaultCategory,
          createdAt: now,
          updatedAt: now,
          isPinned: noteData.isPinned || false,
          isArchived: false,
          color: noteData.color || '#FFFFFF',
          format: noteData.format || get().preferences.defaultFormat,
          wordCount: calculateWordCount(content),
          charCount: content.length,
          pomodoroSessionId: noteData.pomodoroSessionId,
        }

        set(state => ({
          notes: [note, ...state.notes],
          selectedNoteId: id,
          isCreating: false,
        }))

        return id
      },

      // Update existing note
      updateNote: (id, updates) => {
        set(state => ({
          notes: state.notes.map(note => {
            if (note.id === id) {
              const updatedContent = updates.content !== undefined ? updates.content : note.content
              const updatedNote = {
                ...note,
                ...updates,
                updatedAt: new Date().toISOString(),
                wordCount: updatedContent ? calculateWordCount(updatedContent) : note.wordCount,
                charCount: updatedContent ? updatedContent.length : note.charCount,
                tags: updates.content ? extractTags(updatedContent) : note.tags,
              }
              return updatedNote
            }
            return note
          }),
        }))
      },

      // Delete note
      deleteNote: id => {
        set(state => ({
          notes: state.notes.filter(note => note.id !== id),
          selectedNoteId: state.selectedNoteId === id ? null : state.selectedNoteId,
        }))
      },

      // Duplicate note
      duplicateNote: id => {
        const note = get().notes.find(n => n.id === id)
        if (!note) return ''

        const newId = generateId()
        const now = new Date().toISOString()

        const duplicatedNote: Note = {
          ...note,
          id: newId,
          title: `${note.title} (Copy)`,
          createdAt: now,
          updatedAt: now,
          isPinned: false,
        }

        set(state => ({
          notes: [duplicatedNote, ...state.notes],
        }))

        return newId
      },

      // Tag management
      addTag: (noteId, tag) => {
        const cleanTag = tag.toLowerCase().trim()
        set(state => ({
          notes: state.notes.map(note =>
            note.id === noteId && !note.tags.includes(cleanTag)
              ? { ...note, tags: [...note.tags, cleanTag], updatedAt: new Date().toISOString() }
              : note
          ),
        }))
      },

      removeTag: (noteId, tag) => {
        set(state => ({
          notes: state.notes.map(note =>
            note.id === noteId
              ? {
                  ...note,
                  tags: note.tags.filter(t => t !== tag),
                  updatedAt: new Date().toISOString(),
                }
              : note
          ),
        }))
      },

      moveToCategory: (noteId, categoryId) => {
        set(state => ({
          notes: state.notes.map(note =>
            note.id === noteId
              ? { ...note, category: categoryId, updatedAt: new Date().toISOString() }
              : note
          ),
        }))
      },

      togglePin: noteId => {
        set(state => ({
          notes: state.notes.map(note =>
            note.id === noteId
              ? { ...note, isPinned: !note.isPinned, updatedAt: new Date().toISOString() }
              : note
          ),
        }))
      },

      toggleArchive: noteId => {
        set(state => ({
          notes: state.notes.map(note =>
            note.id === noteId
              ? { ...note, isArchived: !note.isArchived, updatedAt: new Date().toISOString() }
              : note
          ),
        }))
      },

      // Category management
      createCategory: categoryData => {
        const id = generateId()
        const category: NoteCategory = {
          ...categoryData,
          id,
        }

        set(state => ({
          categories: [...state.categories, category],
        }))

        return id
      },

      updateCategory: (id, updates) => {
        set(state => ({
          categories: state.categories.map(cat => (cat.id === id ? { ...cat, ...updates } : cat)),
        }))
      },

      deleteCategory: id => {
        // Move notes to default category before deleting
        const defaultCategory = get().preferences.defaultCategory

        set(state => ({
          categories: state.categories.filter(cat => cat.id !== id),
          notes: state.notes.map(note =>
            note.category === id
              ? { ...note, category: defaultCategory, updatedAt: new Date().toISOString() }
              : note
          ),
        }))
      },

      // Search and filter
      setSearchQuery: query => set({ searchQuery: query }),
      setSelectedTags: tags => set({ selectedTags: tags }),
      setSelectedCategory: categoryId => set({ selectedCategory: categoryId }),
      toggleShowArchived: () => set(state => ({ showArchived: !state.showArchived })),

      // UI actions
      selectNote: noteId => set({ selectedNoteId: noteId }),
      setIsCreating: creating => set({ isCreating: creating }),

      // Preferences
      updatePreferences: newPreferences => {
        set(state => ({
          preferences: { ...state.preferences, ...newPreferences },
        }))
      },

      // Data management
      exportNotes: format => {
        const notes = get().notes.filter(note => !note.isArchived)
        const categories = get().categories

        switch (format) {
          case 'json':
            return JSON.stringify(
              {
                notes,
                categories,
                exportedAt: new Date().toISOString(),
                version: '1.0',
              },
              null,
              2
            )

          case 'markdown':
            return notes
              .map(note => {
                const category = categories.find(c => c.id === note.category)
                return (
                  `# ${note.title}\n\n` +
                  `**Category:** ${category?.name || 'Unknown'}\n` +
                  `**Tags:** ${note.tags.map(t => `#${t}`).join(' ')}\n` +
                  `**Created:** ${new Date(note.createdAt).toLocaleDateString()}\n` +
                  `**Updated:** ${new Date(note.updatedAt).toLocaleDateString()}\n\n` +
                  `${note.content}\n\n---\n\n`
                )
              })
              .join('')

          case 'txt':
            return notes
              .map(note => {
                return `${note.title}\n${'='.repeat(note.title.length)}\n\n${note.content}\n\n`
              })
              .join('\n')

          default:
            return ''
        }
      },

      importNotes: (data, format) => {
        try {
          if (format === 'json') {
            const imported = JSON.parse(data)
            if (imported.notes && Array.isArray(imported.notes)) {
              set(state => ({
                notes: [...imported.notes, ...state.notes],
              }))
              return true
            }
          }
          return false
        } catch {
          return false
        }
      },

      clearAllNotes: () => {
        set({
          notes: [],
          selectedNoteId: null,
          searchQuery: '',
          selectedTags: [],
          selectedCategory: null,
        })
      },

      // Computed getters
      getFilteredNotes: () => {
        const { notes, searchQuery, selectedTags, selectedCategory, showArchived, preferences } =
          get()

        const filtered = notes.filter(note => {
          // Archive filter
          if (!showArchived && note.isArchived) return false

          // Search filter
          if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase()
            if (
              !note.title.toLowerCase().includes(query) &&
              !note.content.toLowerCase().includes(query) &&
              !note.tags.some(tag => tag.includes(query))
            ) {
              return false
            }
          }

          // Tags filter
          if (selectedTags.length > 0) {
            if (!selectedTags.every(tag => note.tags.includes(tag))) {
              return false
            }
          }

          // Category filter
          if (selectedCategory && note.category !== selectedCategory) {
            return false
          }

          return true
        })

        // Sort
        filtered.sort((a, b) => {
          let aValue: string | number
          let bValue: string | number

          switch (preferences.sortBy) {
            case 'title':
              aValue = a.title.toLowerCase()
              bValue = b.title.toLowerCase()
              break
            case 'category':
              aValue = a.category
              bValue = b.category
              break
            case 'createdAt':
              aValue = new Date(a.createdAt).getTime()
              bValue = new Date(b.createdAt).getTime()
              break
            default:
              aValue = new Date(a.updatedAt).getTime()
              bValue = new Date(b.updatedAt).getTime()
          }

          const comparison = aValue < bValue ? -1 : aValue > bValue ? 1 : 0
          return preferences.sortOrder === 'asc' ? comparison : -comparison
        })

        // Pinned notes always come first
        const pinned = filtered.filter(note => note.isPinned)
        const unpinned = filtered.filter(note => !note.isPinned)

        return [...pinned, ...unpinned]
      },

      getAllTags: () => {
        const notes = get().notes.filter(note => !note.isArchived)
        const allTags = notes.flatMap(note => note.tags)
        return [...new Set(allTags)].sort()
      },

      getNotesByCategory: categoryId => {
        return get().notes.filter(note => note.category === categoryId && !note.isArchived)
      },

      getPinnedNotes: () => {
        return get().notes.filter(note => note.isPinned && !note.isArchived)
      },

      getRecentNotes: (count = 5) => {
        return get()
          .notes.filter(note => !note.isArchived)
          .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
          .slice(0, count)
      },
    }),
    {
      name: 'ketchew-notes-store',
      partialize: state => ({
        notes: state.notes,
        categories: state.categories,
        preferences: state.preferences,
      }),
    }
  )
)
