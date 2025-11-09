import React, { useState, useEffect } from 'react'
import { Plus, Check, Trash2, Edit3, Tag, AlertCircle, X } from 'lucide-react'
import { useLocalStorage } from '../hooks/useLocalStorage'
import { usePomodoroTaskIntegration } from '../hooks/usePomodoroTaskIntegration'
import { useTaskStore } from '../stores/taskStore'
import { useAnalyticsStore } from '../stores/analyticsStore'
import { TodoItem } from '../types'

type FilterType =
  | 'all'
  | 'active'
  | 'completed'
  | 'with-pomodoros'
  | 'high-priority'
  | 'medium-priority'
  | 'low-priority'
type PriorityType = 'low' | 'medium' | 'high'

const TodoList: React.FC = () => {
  const [todos, setTodos] = useLocalStorage<TodoItem[]>('ketchew_todos', [])
  const [newTodo, setNewTodo] = useState('')
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editText, setEditText] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [filter, setFilter] = useState<FilterType>('all')
  const [showTaskForm, setShowTaskForm] = useState(false)
  const [newTaskPriority, setNewTaskPriority] = useState<PriorityType>('medium')
  const [newTaskCategory, setNewTaskCategory] = useState('')
  const searchQuery = '' // Static search query - search functionality not implemented

  // Pomodoro integration
  const { activeTaskId, setActiveTask, isStudyPhase, isTimerActive } = usePomodoroTaskIntegration()
  const { getTaskAnalytics } = useTaskStore()

  // Analytics integration
  const { recordTaskCompletion } = useAnalyticsStore()

  // Validation constants
  const MAX_TODO_LENGTH = 50
  const MIN_TODO_LENGTH = 1

  const validateTodoText = (text: string): string | null => {
    const trimmed = text.trim()
    if (trimmed.length < MIN_TODO_LENGTH) {
      return 'Task cannot be empty'
    }
    if (trimmed.length > MAX_TODO_LENGTH) {
      return `Task cannot exceed ${MAX_TODO_LENGTH} characters`
    }
    return null
  }

  const clearError = () => {
    if (error) setError(null)
  }

  const deselectTask = () => {
    setActiveTask(null)
  }

  // Filtering logic
  const getFilteredTodos = () => {
    let filtered = todos

    // Apply text search filter first
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(
        todo =>
          todo.text.toLowerCase().includes(query) ||
          (todo.category && todo.category.toLowerCase().includes(query))
      )
    }

    // Apply status/priority filters
    switch (filter) {
      case 'active':
        filtered = filtered.filter(todo => !todo.completed)
        break
      case 'completed':
        filtered = filtered.filter(todo => todo.completed)
        break
      case 'with-pomodoros':
        filtered = filtered.filter(todo => {
          const analytics = getTaskAnalytics(todo.id)
          return analytics.totalSessions > 0
        })
        break
      case 'high-priority':
        filtered = filtered.filter(todo => todo.priority === 'high')
        break
      case 'medium-priority':
        filtered = filtered.filter(todo => todo.priority === 'medium')
        break
      case 'low-priority':
        filtered = filtered.filter(todo => todo.priority === 'low')
        break
      default:
        // No additional filtering needed
        break
    }

    return filtered.sort((a, b) => {
      // Sort by priority first (high -> medium -> low), then by creation date
      const priorityOrder = { high: 3, medium: 2, low: 1 }
      const aPriority = priorityOrder[a.priority || 'medium']
      const bPriority = priorityOrder[b.priority || 'medium']

      if (aPriority !== bPriority) {
        return bPriority - aPriority
      }

      return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    })
  }

  // Get unique categories for filtering
  const getCategories = () => {
    const categories = new Set<string>()
    todos.forEach(todo => {
      if (todo.category) categories.add(todo.category)
    })
    return Array.from(categories).sort()
  }

  // Helper functions for priority
  const getPriorityColor = (priority: PriorityType) => {
    switch (priority) {
      case 'high':
        return 'text-red-600 bg-red-50'
      case 'medium':
        return 'text-yellow-600 bg-yellow-50'
      case 'low':
        return 'text-green-600 bg-green-50'
      default:
        return 'text-gray-600 bg-gray-50'
    }
  }

  const getPriorityIcon = (priority: PriorityType) => {
    switch (priority) {
      case 'high':
        return <AlertCircle size={12} />
      case 'medium':
        return <div className="w-3 h-3 bg-yellow-500 rounded-full" />
      case 'low':
        return <div className="w-3 h-3 bg-green-500 rounded-full" />
      default:
        return null
    }
  }

  // Bulk operations

  const addTodo = () => {
    const validationError = validateTodoText(newTodo)
    if (validationError) {
      setError(validationError)
      return
    }

    try {
      const newItem: TodoItem = {
        id: crypto.randomUUID ? crypto.randomUUID() : Date.now().toString(),
        text: newTodo.trim(),
        completed: false,
        createdAt: new Date().toISOString(),
        pomodorosSessions: 0,
        priority: newTaskPriority,
        category: newTaskCategory.trim() || undefined,
      }
      setTodos([...todos, newItem])
      setNewTodo('')
      setNewTaskCategory('')
      setNewTaskPriority('medium')
      setShowTaskForm(false)
      clearError()
    } catch (err) {
      setError('Failed to add task. Please try again.')
      console.error('Error adding todo:', err)
    }
  }

  const toggleTodo = (id: string) => {
    setTodos(
      todos.map(todo => {
        if (todo.id === id) {
          const isNowCompleted = !todo.completed
          const analytics = getTaskAnalytics(id)

          // Record task completion in analytics if completing task
          if (isNowCompleted) {
            recordTaskCompletion(new Date().toISOString().split('T')[0])
          }

          return {
            ...todo,
            completed: isNowCompleted,
            completedAt: isNowCompleted ? new Date().toISOString() : undefined,
            pomodorosSessions: analytics.completedSessions,
          }
        }
        return todo
      })
    )
  }

  const deleteTodo = (id: string) => {
    setTodos(todos.filter(todo => todo.id !== id))
  }

  const startEditing = (todo: TodoItem) => {
    setEditingId(todo.id)
    setEditText(todo.text)
  }

  const saveEdit = () => {
    if (!editingId) return

    const validationError = validateTodoText(editText)
    if (validationError) {
      setError(validationError)
      return
    }

    try {
      setTodos(
        todos.map(todo => (todo.id === editingId ? { ...todo, text: editText.trim() } : todo))
      )
      setEditingId(null)
      setEditText('')
      clearError()
    } catch (err) {
      setError('Failed to update task. Please try again.')
      console.error('Error updating todo:', err)
    }
  }

  const cancelEdit = () => {
    setEditingId(null)
    setEditText('')
  }

  const handleKeyPress = (e: React.KeyboardEvent, action: 'add' | 'edit') => {
    if (e.key === 'Enter') {
      if (action === 'add') {
        addTodo()
      } else {
        saveEdit()
      }
    } else if (e.key === 'Escape' && action === 'edit') {
      cancelEdit()
    }
  }

  const completedCount = todos.filter(todo => todo.completed).length

  // Dynamic popup height adjustment based on actual content
  useEffect(() => {
    // Small delay to ensure state updates are complete
    const timer = setTimeout(() => {
      // Base height includes: title (48px) + form area (~80px) + padding (32px) = ~160px
      const baseHeight = 160

      // Calculate height for at least 1 task to maintain consistent size
      const taskCount = Math.max(todos.length, 1) // Treat 0 tasks as 1 task for height calculation

      // Each task item is approximately 60px height (including spacing)
      const taskItemHeight = 60
      const tasksHeight = taskCount * taskItemHeight

      // Add space for "Clear All" actions when there are tasks (~45px for tighter spacing)
      const actionsHeight = 40

      // Small buffer to ensure clear buttons are visible without excess space
      const bufferSpace = 10

      const targetHeight = baseHeight + tasksHeight + actionsHeight + bufferSpace
      updatePopupHeight(Math.min(targetHeight, 500))
    }, 50) // Small delay to ensure DOM updates

    return () => clearTimeout(timer)
  }, [todos]) // Watch the entire todos array instead of just length

  const updatePopupHeight = (height: number) => {
    const popupManager = (
      window as unknown as {
        ketchewPopupManager?: {
          getOpenPopups: () => Array<{ id: string; type: string }>
          updatePopupSize: (id: string, size: { width: number; height: number }) => void
        }
      }
    ).ketchewPopupManager

    if (popupManager) {
      const openPopups = popupManager.getOpenPopups()
      const tasksPopup = openPopups.find(p => p.type === 'tasks')
      if (tasksPopup) {
        popupManager.updatePopupSize(tasksPopup.id, { width: 150, height })
      }
    }
  }

  return (
    <div className="w-full h-full flex flex-col">
      <h2 className="text-xl font-bold mb-4">Todo List</h2>

      {/* Active Task Indicator */}
      {activeTaskId && (
        <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
              <span className="text-sm font-medium text-blue-700">
                Active task: {todos.find(t => t.id === activeTaskId)?.text || 'Unknown'}
              </span>
            </div>
            <button onClick={deselectTask} className="text-blue-600 hover:text-blue-700 text-sm">
              Clear
            </button>
          </div>
          {isTimerActive && isStudyPhase && (
            <div className="text-xs text-blue-600 mt-1">🍅 Pomodoro session in progress</div>
          )}
        </div>
      )}

      {/* Add Todo */}
      <div className="mb-6">
        {error && (
          <div className="mb-3 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
            {error}
          </div>
        )}

        <div className="space-y-3">
          {/* Basic input */}
          <div className="flex gap-2 items-start">
            <div className="flex-1">
              <input
                type="text"
                value={newTodo}
                onChange={e => {
                  setNewTodo(e.target.value)
                  clearError()
                }}
                onKeyPress={e => handleKeyPress(e, 'add')}
                placeholder="Add a new task..."
                maxLength={MAX_TODO_LENGTH}
                className={`w-full px-3 py-2 h-8 text-sm border rounded-lg focus:outline-none focus:ring-2 transition-colors ${
                  error
                    ? 'border-red-300 focus:ring-red-400'
                    : 'border-gray-300 focus:ring-gray-400'
                }`}
              />
              <div className="text-xs text-gray-500 mt-1">
                {newTodo.length}/{MAX_TODO_LENGTH}
              </div>
            </div>
            <button
              onClick={addTodo}
              className="bg-red-500 hover:bg-red-600 text-white flex items-center gap-2 px-4 h-8 text-sm rounded-lg"
            >
              <Plus size={16} />
              Add
            </button>
          </div>

          {/* Advanced options */}
          {showTaskForm && (
            <div className="p-3 bg-gray-50 rounded-lg space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
                  <select
                    value={newTaskPriority}
                    onChange={e => setNewTaskPriority(e.target.value as PriorityType)}
                    className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                  >
                    <option value="low">Low Priority</option>
                    <option value="medium">Medium Priority</option>
                    <option value="high">High Priority</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                  <input
                    type="text"
                    value={newTaskCategory}
                    onChange={e => setNewTaskCategory(e.target.value)}
                    placeholder="e.g., Work, Personal"
                    maxLength={20}
                    className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                  />
                </div>
              </div>

              {getCategories().length > 0 && (
                <div>
                  <div className="text-xs text-gray-600 mb-1">Existing categories:</div>
                  <div className="flex flex-wrap gap-1">
                    {getCategories().map(category => (
                      <button
                        key={category}
                        onClick={() => setNewTaskCategory(category)}
                        className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
                      >
                        {category}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Todo Items and Actions */}
      <div className="flex-1 space-y-2 overflow-y-auto min-h-0">
        {(() => {
          const filteredTodos = getFilteredTodos()

          if (filteredTodos.length === 0) {
            if (filter === 'all') {
              return (
                <div className="text-center py-8 text-gray-500">No tasks yet. Add one above!</div>
              )
            } else {
              return (
                <div className="text-center py-8 text-gray-500">
                  No tasks match the current filter.
                  <button
                    onClick={() => setFilter('all')}
                    className="block mx-auto mt-2 text-blue-600 hover:text-blue-700"
                  >
                    Show all tasks
                  </button>
                </div>
              )
            }
          }

          return (
            <>
              {filteredTodos.map(todo => (
                <div
                  key={todo.id}
                  className={`p-3 bg-white rounded-lg border transition-all border-gray-200 ${todo.completed ? 'opacity-60' : ''}`}
                >
                  {editingId === todo.id ? (
                    <div className="space-y-2">
                      <input
                        type="text"
                        value={editText}
                        onChange={e => setEditText(e.target.value)}
                        onKeyPress={e => handleKeyPress(e, 'edit')}
                        className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                        autoFocus
                        maxLength={MAX_TODO_LENGTH}
                      />
                      <div className="flex items-center justify-between">
                        <div className="flex gap-2">
                          <button
                            onClick={saveEdit}
                            className="text-green-600 hover:text-green-700"
                          >
                            <Check size={16} />
                          </button>
                          <button
                            onClick={cancelEdit}
                            className="text-gray-500 hover:text-gray-600"
                          >
                            <X size={16} />
                          </button>
                        </div>
                        <div className="text-xs text-gray-500">
                          {editText.length}/{MAX_TODO_LENGTH}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => toggleTodo(todo.id)}
                        className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
                          todo.completed
                            ? 'bg-green-500 border-green-500 text-white'
                            : 'border-gray-300 hover:border-gray-400'
                        }`}
                      >
                        {todo.completed && <Check size={12} />}
                      </button>

                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span
                            className={`text-sm transition-all ${
                              todo.completed ? 'text-gray-500 line-through' : 'text-gray-900'
                            }`}
                          >
                            {todo.text}
                          </span>

                          {/* Priority indicator */}
                          {todo.priority && todo.priority !== 'medium' && (
                            <span
                              className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(todo.priority)}`}
                            >
                              {getPriorityIcon(todo.priority)}
                              {todo.priority}
                            </span>
                          )}

                          {/* Category tag */}
                          {todo.category && (
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-700">
                              <Tag size={10} className="mr-1" />
                              {todo.category}
                            </span>
                          )}
                        </div>

                        {/* Pomodoro info */}
                        {(() => {
                          const analytics = getTaskAnalytics(todo.id)
                          if (analytics.totalSessions > 0) {
                            return (
                              <div className="text-xs text-gray-500 mt-1">
                                🍅 {analytics.totalSessions} session
                                {analytics.totalSessions !== 1 ? 's' : ''} ({analytics.totalTime}
                                min)
                              </div>
                            )
                          }
                          return null
                        })()}
                      </div>

                      <div className="flex gap-1">
                        <button
                          onClick={() => startEditing(todo)}
                          className="text-gray-400 hover:text-gray-600"
                        >
                          <Edit3 size={14} />
                        </button>
                        <button
                          onClick={() => deleteTodo(todo.id)}
                          className="text-gray-400 hover:text-red-600"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}

              {/* Quick Actions - Now inside scrollable area */}
              {todos.length > 0 && (
                <div className="mt-4 pt-1">
                  <div className="flex gap-2 text-sm">
                    <button
                      onClick={() => setTodos(todos.filter(todo => !todo.completed))}
                      className="text-red-600 hover:text-red-700"
                      disabled={completedCount === 0}
                    >
                      Clear Completed ({completedCount})
                    </button>
                    <span className="text-gray-300">|</span>
                    <button
                      onClick={() => setTodos([])}
                      className="text-red-600 hover:text-red-700"
                    >
                      Clear All
                    </button>
                  </div>
                </div>
              )}
            </>
          )
        })()}
      </div>
    </div>
  )
}

export default TodoList
