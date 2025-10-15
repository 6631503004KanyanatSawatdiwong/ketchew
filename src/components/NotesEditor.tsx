import React, { useState, useEffect } from 'react'
import { Save, FileText } from 'lucide-react'

const NotesEditor: React.FC = () => {
  const [notes, setNotes] = useState('')
  const [lastSaved, setLastSaved] = useState<string | null>(null)
  const [isAutoSaving, setIsAutoSaving] = useState(false)

  // Load notes from sessionStorage on component mount
  useEffect(() => {
    const savedNotes = sessionStorage.getItem('ketchew_session_notes')
    if (savedNotes) {
      setNotes(savedNotes)
    }
  }, [])

  // Auto-save to sessionStorage with debounce
  useEffect(() => {
    if (notes.length === 0) return

    setIsAutoSaving(true)
    const saveTimeout = setTimeout(() => {
      sessionStorage.setItem('ketchew_session_notes', notes)
      setLastSaved(new Date().toLocaleTimeString())
      setIsAutoSaving(false)
    }, 1000) // 1 second debounce

    return () => clearTimeout(saveTimeout)
  }, [notes])

  const handleNotesChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setNotes(e.target.value)
  }

  const manualSave = () => {
    sessionStorage.setItem('ketchew_session_notes', notes)
    setLastSaved(new Date().toLocaleTimeString())
  }

  const clearNotes = () => {
    if (confirm('Are you sure you want to clear all notes?')) {
      setNotes('')
      sessionStorage.removeItem('ketchew_session_notes')
      setLastSaved(null)
    }
  }

  const downloadNotes = () => {
    if (notes.trim()) {
      const blob = new Blob([notes], { type: 'text/plain' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `ketchew-notes-${new Date().toISOString().split('T')[0]}.txt`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    }
  }

  const wordCount = notes
    .trim()
    .split(/\s+/)
    .filter(word => word.length > 0).length
  const charCount = notes.length

  return (
    <div className="w-96 h-full flex flex-col">
      <h2 className="text-2xl font-bold mb-4">Session Notes</h2>

      {/* Info Bar */}
      <div className="flex justify-between items-center mb-4 text-sm text-gray-600">
        <div className="flex items-center gap-2">
          <FileText size={14} />
          <span>
            {wordCount} words, {charCount} chars
          </span>
        </div>
        <div className="flex items-center gap-2">
          {isAutoSaving ? (
            <span className="text-blue-600">Saving...</span>
          ) : lastSaved ? (
            <span>Saved at {lastSaved}</span>
          ) : (
            <span>Not saved</span>
          )}
        </div>
      </div>

      {/* Text Editor */}
      <div className="flex-1 flex flex-col">
        <textarea
          value={notes}
          onChange={handleNotesChange}
          placeholder="Start writing your notes here...

Tips:
• Notes are automatically saved every second
• Data persists only for this browser session
• Use this for quick thoughts, meeting notes, or task details"
          className="flex-1 w-full p-3 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-gray-400 font-mono text-sm"
          style={{ minHeight: '300px' }}
        />
      </div>

      {/* Action Buttons */}
      <div className="mt-4 flex gap-2">
        <button
          onClick={manualSave}
          className="btn-primary flex items-center gap-2"
          disabled={notes.length === 0}
        >
          <Save size={16} />
          Save Now
        </button>

        <button
          onClick={downloadNotes}
          className="btn-secondary"
          disabled={notes.trim().length === 0}
        >
          Download
        </button>

        <button
          onClick={clearNotes}
          className="btn-secondary text-red-600 hover:bg-red-50"
          disabled={notes.length === 0}
        >
          Clear
        </button>
      </div>

      {/* Storage Info */}
      <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg text-sm">
        <p className="font-medium text-yellow-800 mb-1">Session Storage</p>
        <p className="text-yellow-700">
          Notes are stored temporarily in your browser and will be lost when you close the tab.
          Download important notes to save them permanently.
        </p>
      </div>
    </div>
  )
}

export default NotesEditor
