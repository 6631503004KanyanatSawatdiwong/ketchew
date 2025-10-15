import React, { useState, useEffect } from 'react'
import { Plus, Check, Trash2, Edit3 } from 'lucide-react'
import { useLocalStorage } from '../hooks/useLocalStorage'

interface TodoItem {
  id: string
  text: string
  completed: boolean
  createdAt: string
}

const TodoList: React.FC = () => {
  const [todos, setTodos] = useLocalStorage<TodoItem[]>('ketchew_todos', [])
  const [newTodo, setNewTodo] = useState('')
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editText, setEditText] = useState('')

  const addTodo = () => {
    if (newTodo.trim()) {
      const newItem: TodoItem = {
        id: Date.now().toString(),
        text: newTodo.trim(),
        completed: false,
        createdAt: new Date().toISOString()
      }
      setTodos([...todos, newItem])
      setNewTodo('')
    }
  }

  const toggleTodo = (id: string) => {
    setTodos(todos.map(todo =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ))
  }

  const deleteTodo = (id: string) => {
    setTodos(todos.filter(todo => todo.id !== id))
  }

  const startEditing = (todo: TodoItem) => {
    setEditingId(todo.id)
    setEditText(todo.text)
  }

  const saveEdit = () => {
    if (editText.trim() && editingId) {
      setTodos(todos.map(todo =>
        todo.id === editingId ? { ...todo, text: editText.trim() } : todo
      ))
      setEditingId(null)
      setEditText('')
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
  const totalCount = todos.length

  return (
    <div className="w-96">
      <h2 className="text-2xl font-bold mb-6">Todo List</h2>
      
      {/* Stats */}
      <div className="mb-6 p-4 bg-gray-50 rounded-lg">
        <div className="text-sm text-gray-600">
          {completedCount} of {totalCount} tasks completed
        </div>
        {totalCount > 0 && (
          <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-gray-900 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(completedCount / totalCount) * 100}%` }}
            />
          </div>
        )}
      </div>

      {/* Add Todo */}
      <div className="mb-6">
        <div className="flex gap-2">
          <input
            type="text"
            value={newTodo}
            onChange={(e) => setNewTodo(e.target.value)}
            onKeyPress={(e) => handleKeyPress(e, 'add')}
            placeholder="Add a new task..."
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400"
          />
          <button
            onClick={addTodo}
            className="btn-primary flex items-center gap-2 px-4"
          >
            <Plus size={16} />
            Add
          </button>
        </div>
      </div>

      {/* Todo Items */}
      <div className="space-y-2 max-h-96 overflow-y-auto">
        {todos.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No tasks yet. Add one above!
          </div>
        ) : (
          todos.map((todo) => (
            <div
              key={todo.id}
              className={`p-3 border rounded-lg transition-all ${
                todo.completed
                  ? 'bg-green-50 border-green-200'
                  : 'bg-white border-gray-200 hover:border-gray-300'
              }`}
            >
              {editingId === todo.id ? (
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={editText}
                    onChange={(e) => setEditText(e.target.value)}
                    onKeyPress={(e) => handleKeyPress(e, 'edit')}
                    className="flex-1 px-2 py-1 border border-gray-300 rounded"
                    autoFocus
                  />
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
                    ×
                  </button>
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
                  
                  <span
                    className={`flex-1 transition-all ${
                      todo.completed
                        ? 'text-gray-500 line-through'
                        : 'text-gray-900'
                    }`}
                  >
                    {todo.text}
                  </span>
                  
                  <div className="flex gap-1">
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
        )}
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
            <button
              onClick={() => setTodos([])}
              className="text-red-600 hover:text-red-700"
            >
              Clear All
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default TodoList
