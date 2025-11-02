import React, { useState } from 'react'
import {
  Plus,
  Check,
  Trash2,
  Edit3,
  Play,
  Pause,
  BarChart3,
  Filter,
  Tag,
  AlertCircle,
} from 'lucide-react'
import { useLocalStorage } from '../hooks/useLocalStorage'
import { usePomodoroTaskIntegration } from '../hooks/usePomodoroTaskIntegration'
import { useTaskStore } from '../stores/taskStore'
import { calculateTaskAnalytics } from '../utils/taskAnalytics'
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
  const [showAnalytics, setShowAnalytics] = useState(false)
  const [filter, setFilter] = useState<FilterType>('all')
  const [selectedTasks, setSelectedTasks] = useState<Set<string>>(new Set())
  const [showTaskForm, setShowTaskForm] = useState(false)
  const [newTaskPriority, setNewTaskPriority] = useState<PriorityType>('medium')
  const [newTaskCategory, setNewTaskCategory] = useState('')
  const [searchQuery, setSearchQuery] = useState('')

  // Pomodoro integration
  const { activeTaskId, setActiveTask, isStudyPhase, isTimerActive } = usePomodoroTaskIntegration()
  const { getTaskAnalytics, taskSessions } = useTaskStore()

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

  const selectTaskForPomodoro = (taskId: string) => {
    setActiveTask(taskId)
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
  const toggleTaskSelection = (taskId: string) => {
    const newSelected = new Set(selectedTasks)
    if (newSelected.has(taskId)) {
      newSelected.delete(taskId)
    } else {
      newSelected.add(taskId)
    }
    setSelectedTasks(newSelected)
  }

  const selectAllVisible = () => {
    const visibleTodos = getFilteredTodos()
    setSelectedTasks(new Set(visibleTodos.map(todo => todo.id)))
  }

  const deselectAll = () => {
    setSelectedTasks(new Set())
  }

  const markSelectedComplete = () => {
    setTodos(
      todos.map(todo => {
        if (selectedTasks.has(todo.id) && !todo.completed) {
          const analytics = getTaskAnalytics(todo.id)
          return {
            ...todo,
            completed: true,
            completedAt: new Date().toISOString(),
            pomodorosSessions: analytics.completedSessions,
          }
        }
        return todo
      })
    )
    setSelectedTasks(new Set())
  }

  const markSelectedIncomplete = () => {
    setTodos(
      todos.map(todo => {
        if (selectedTasks.has(todo.id) && todo.completed) {
          return {
            ...todo,
            completed: false,
            completedAt: undefined,
          }
        }
        return todo
      })
    )
    setSelectedTasks(new Set())
  }

  const deleteSelected = () => {
    if (selectedTasks.size > 0 && confirm(`Delete ${selectedTasks.size} selected tasks?`)) {
      setTodos(todos.filter(todo => !selectedTasks.has(todo.id)))
      setSelectedTasks(new Set())
    }
  }

  const clearSearch = () => {
    setSearchQuery('')
  }

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

  // Calculate analytics
  const analytics = calculateTaskAnalytics(todos, taskSessions)

  const completedCount = todos.filter(todo => todo.completed).length
  const totalCount = todos.length

  return (
    <div className="w-96">
      <h2 className="text-2xl font-bold mb-6">Todo List</h2>

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

      {/* Stats */}
      <div className="mb-6 p-4 bg-gray-50 rounded-lg">
        <div className="flex items-center justify-between mb-2">
          <div className="text-sm text-gray-600">
            {completedCount} of {totalCount} tasks completed
          </div>
          <button
            onClick={() => setShowAnalytics(!showAnalytics)}
            className="text-gray-500 hover:text-gray-700"
            title="Toggle analytics"
          >
            <BarChart3 size={16} />
          </button>
        </div>

        {totalCount > 0 && (
          <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-gray-900 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(completedCount / totalCount) * 100}%` }}
            />
          </div>
        )}

        {/* Analytics */}
        {showAnalytics && analytics.totalPomodoroSessions > 0 && (
          <div className="mt-4 pt-4 border-t border-gray-200 space-y-2 text-sm">
            <div className="grid grid-cols-2 gap-2">
              <div>
                <span className="text-gray-500">Productivity Score:</span>
                <div className="font-semibold text-lg">{analytics.productivityScore}/100</div>
              </div>
              <div>
                <span className="text-gray-500">Study Time:</span>
                <div className="font-semibold">
                  {Math.round(analytics.totalStudyTime / 60)}h {analytics.totalStudyTime % 60}m
                </div>
              </div>
              <div>
                <span className="text-gray-500">Pomodoros:</span>
                <div className="font-semibold">{analytics.totalPomodoroSessions}</div>
              </div>
              <div>
                <span className="text-gray-500">Streak:</span>
                <div className="font-semibold">{analytics.streak.current} days</div>
              </div>
            </div>

            {analytics.trends.tasksCompletedThisWeek > 0 && (
              <div className="text-xs text-gray-500 mt-2">
                This week: {analytics.trends.tasksCompletedThisWeek} tasks,{' '}
                {analytics.trends.pomodorosThisWeek} pomodoros
              </div>
            )}
          </div>
        )}
      </div>

      {/* Filter and Search */}
      <div className="mb-4 space-y-3">
        {/* Search Input */}
        <div className="relative">
          <input
            type="text"
            placeholder="Search tasks..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-3 pr-8 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
          {searchQuery && (
            <button
              onClick={clearSearch}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              title="Clear search"
            >
              ×
            </button>
          )}
        </div>

        {/* Filter */}
        <div className="flex items-center gap-2">
          <Filter size={16} className="text-gray-500" />
          <select
            value={filter}
            onChange={e => setFilter(e.target.value as FilterType)}
            className="text-sm border border-gray-300 rounded px-2 py-1"
          >
            <option value="all">All Tasks ({todos.length})</option>
            <option value="active">Active ({todos.filter(t => !t.completed).length})</option>
            <option value="completed">Completed ({todos.filter(t => t.completed).length})</option>
            <option value="with-pomodoros">
              With Pomodoros ({todos.filter(t => getTaskAnalytics(t.id).totalSessions > 0).length})
            </option>
            <option value="high-priority">
              High Priority ({todos.filter(t => t.priority === 'high').length})
            </option>
            <option value="medium-priority">
              Medium Priority ({todos.filter(t => t.priority === 'medium').length})
            </option>
            <option value="low-priority">
              Low Priority ({todos.filter(t => t.priority === 'low').length})
            </option>
          </select>
        </div>

        {/* Bulk Operations */}
        {selectedTasks.size > 0 && (
          <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-center justify-between text-sm">
              <span className="text-blue-700 font-medium">
                {selectedTasks.size} task{selectedTasks.size !== 1 ? 's' : ''} selected
              </span>
              <div className="flex gap-2">
                <button
                  onClick={markSelectedComplete}
                  className="text-green-600 hover:text-green-700"
                  disabled={
                    !Array.from(selectedTasks).some(id => !todos.find(t => t.id === id)?.completed)
                  }
                >
                  Complete
                </button>
                <button
                  onClick={markSelectedIncomplete}
                  className="text-yellow-600 hover:text-yellow-700"
                  disabled={
                    !Array.from(selectedTasks).some(id => todos.find(t => t.id === id)?.completed)
                  }
                >
                  Incomplete
                </button>
                <button onClick={deleteSelected} className="text-red-600 hover:text-red-700">
                  Delete
                </button>
                <button onClick={deselectAll} className="text-gray-600 hover:text-gray-700">
                  Clear
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Select All */}
        {getFilteredTodos().length > 0 && (
          <div className="flex justify-between text-sm">
            <button onClick={selectAllVisible} className="text-blue-600 hover:text-blue-700">
              Select All Visible
            </button>
            {selectedTasks.size > 0 && (
              <button onClick={deselectAll} className="text-gray-600 hover:text-gray-700">
                Deselect All
              </button>
            )}
          </div>
        )}
      </div>

      {/* Add Todo */}
      <div className="mb-6">
        {error && (
          <div className="mb-3 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
            {error}
          </div>
        )}

        <div className="space-y-3">
          {/* Basic input */}
          <div className="flex gap-2">
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
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 transition-colors ${
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
              onClick={() => setShowTaskForm(!showTaskForm)}
              className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              title="Advanced options"
            >
              <Tag size={16} />
            </button>
            <button
              onClick={addTodo}
              className="btn-primary flex items-center gap-2 px-4"
              disabled={!newTodo.trim()}
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

      {/* Todo Items */}
      <div className="space-y-2 max-h-96 overflow-y-auto">
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

          return filteredTodos.map(todo => (
            <div
              key={todo.id}
              className={`p-3 border rounded-lg transition-all ${
                selectedTasks.has(todo.id)
                  ? 'border-blue-300 bg-blue-50'
                  : todo.completed
                    ? 'bg-green-50 border-green-200'
                    : 'bg-white border-gray-200 hover:border-gray-300'
              }`}
            >
              {editingId === todo.id ? (
                <div className="space-y-2">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={editText}
                      onChange={e => {
                        setEditText(e.target.value)
                        clearError()
                      }}
                      onKeyPress={e => handleKeyPress(e, 'edit')}
                      maxLength={MAX_TODO_LENGTH}
                      className={`flex-1 px-2 py-1 border rounded transition-colors ${
                        error ? 'border-red-300 focus:ring-red-400' : 'border-gray-300'
                      }`}
                      autoFocus
                    />
                    <button onClick={saveEdit} className="text-green-600 hover:text-green-700">
                      <Check size={16} />
                    </button>
                    <button onClick={cancelEdit} className="text-gray-500 hover:text-gray-600">
                      ×
                    </button>
                  </div>
                  <div className="text-xs text-gray-500">
                    {editText.length}/{MAX_TODO_LENGTH}
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  {/* Selection checkbox */}
                  <input
                    type="checkbox"
                    checked={selectedTasks.has(todo.id)}
                    onChange={() => toggleTaskSelection(todo.id)}
                    className="w-4 h-4 text-blue-600 rounded"
                  />

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
                        className={`transition-all ${
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
                      const isActive = activeTaskId === todo.id

                      return analytics.totalSessions > 0 || isActive ? (
                        <div className="flex items-center gap-2 mt-1 text-xs text-gray-500">
                          {isActive && <span className="text-blue-600 font-medium">🍅 Active</span>}
                          {analytics.totalSessions > 0 && (
                            <span>
                              {analytics.completedSessions} pomodoros ({analytics.totalTime}min)
                            </span>
                          )}
                        </div>
                      ) : null
                    })()}
                  </div>

                  <div className="flex gap-1">
                    {/* Pomodoro action button */}
                    {!todo.completed && (
                      <button
                        onClick={() =>
                          activeTaskId === todo.id ? deselectTask() : selectTaskForPomodoro(todo.id)
                        }
                        className={`text-sm px-2 py-1 rounded transition-colors ${
                          activeTaskId === todo.id
                            ? 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                            : 'text-gray-400 hover:text-blue-600 hover:bg-blue-50'
                        }`}
                        title={activeTaskId === todo.id ? 'Deselect task' : 'Select for pomodoro'}
                      >
                        {activeTaskId === todo.id ? <Pause size={14} /> : <Play size={14} />}
                      </button>
                    )}

                    <button
                      onClick={() => startEditing(todo)}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <Edit3 size={14} />
                    </button>
                    <button
                      onClick={() => deleteTodo(todo.id)}
                      className="text-gray-400 hover:text-red-500"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))
        })()}
      </div>

      {/* Quick Actions */}
      {todos.length > 0 && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="flex gap-2 text-sm">
            <button
              onClick={() => setTodos(todos.filter(todo => !todo.completed))}
              className="text-red-600 hover:text-red-700"
              disabled={completedCount === 0}
            >
              Clear Completed ({completedCount})
            </button>
            <span className="text-gray-300">|</span>
            <button onClick={() => setTodos([])} className="text-red-600 hover:text-red-700">
              Clear All
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default TodoList
