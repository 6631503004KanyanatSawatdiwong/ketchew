import React, { useState, useEffect, useRef } from 'react';
import {
  Plus,
  Search,
  Filter,
  Archive,
  Pin,
  Edit3,
  Save,
  Copy,
  Trash2,
  MoreHorizontal,
  Grid,
  List,
  Eye,
  EyeOff
} from 'lucide-react';
import { useNotesStore } from '../../stores/notesStore';

// Note Card Component
interface NoteCardProps {
  note: {
    id: string;
    title: string;
    content: string;
    tags: string[];
    category: string;
    createdAt: string;
    updatedAt: string;
    isPinned: boolean;
    isArchived: boolean;
    color: string;
    wordCount: number;
    charCount: number;
  };
  isSelected: boolean;
  onClick: () => void;
  onPin: () => void;
  onArchive: () => void;
  onDelete: () => void;
  onDuplicate: () => void;
  category?: { name: string; icon: string; color: string };
}

const NoteCard: React.FC<NoteCardProps> = ({
  note,
  isSelected,
  onClick,
  onPin,
  onArchive,
  onDelete,
  onDuplicate,
  category
}) => {
  const [showActions, setShowActions] = useState(false);
  
  const preview = note.content.length > 100 
    ? note.content.substring(0, 100) + '...' 
    : note.content;

  return (
    <div
      className={`p-4 border rounded-lg cursor-pointer transition-all hover:shadow-md ${
        isSelected 
          ? 'border-blue-500 bg-blue-50 shadow-md' 
          : 'border-gray-200 bg-white hover:border-gray-300'
      }`}
      onClick={onClick}
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center space-x-2 flex-1">
          {note.isPinned && <Pin className="w-4 h-4 text-orange-500" />}
          {category && (
            <span className="text-lg" title={category.name}>
              {category.icon}
            </span>
          )}
          <h3 className="font-medium text-gray-900 truncate flex-1">
            {note.title}
          </h3>
        </div>
        
        {showActions && (
          <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={(e) => { e.stopPropagation(); onPin(); }}
              className={`p-1 rounded hover:bg-gray-100 ${
                note.isPinned ? 'text-orange-500' : 'text-gray-400'
              }`}
              title={note.isPinned ? 'Unpin' : 'Pin'}
            >
              <Pin className="w-4 h-4" />
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); onArchive(); }}
              className="p-1 rounded hover:bg-gray-100 text-gray-400"
              title={note.isArchived ? 'Unarchive' : 'Archive'}
            >
              <Archive className="w-4 h-4" />
            </button>
            <div className="relative group">
              <button className="p-1 rounded hover:bg-gray-100 text-gray-400">
                <MoreHorizontal className="w-4 h-4" />
              </button>
              <div className="absolute right-0 top-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg py-1 hidden group-hover:block z-10">
                <button
                  onClick={(e) => { e.stopPropagation(); onDuplicate(); }}
                  className="w-full px-3 py-1 text-left text-sm hover:bg-gray-100 flex items-center space-x-2"
                >
                  <Copy className="w-3 h-3" />
                  <span>Duplicate</span>
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); onDelete(); }}
                  className="w-full px-3 py-1 text-left text-sm hover:bg-gray-100 text-red-600 flex items-center space-x-2"
                >
                  <Trash2 className="w-3 h-3" />
                  <span>Delete</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Content Preview */}
      {preview && (
        <p className="text-gray-600 text-sm mb-3 line-clamp-3">
          {preview}
        </p>
      )}

      {/* Tags */}
      {note.tags.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-2">
          {note.tags.slice(0, 3).map(tag => (
            <span
              key={tag}
              className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full"
            >
              #{tag}
            </span>
          ))}
          {note.tags.length > 3 && (
            <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
              +{note.tags.length - 3}
            </span>
          )}
        </div>
      )}

      {/* Footer */}
      <div className="flex justify-between items-center text-xs text-gray-500">
        <span>{note.wordCount} words</span>
        <span>{new Date(note.updatedAt).toLocaleDateString()}</span>
      </div>
    </div>
  );
};

// Note Editor Component
interface NoteEditorProps {
  note: {
    id: string;
    title: string;
    content: string;
    tags: string[];
    category: string;
    format: 'plain' | 'markdown';
    color: string;
  } | null;
  onSave: (updates: Partial<{
    title: string;
    content: string;
    tags: string[];
    category: string;
    format: 'plain' | 'markdown';
    color: string;
  }>) => void;
  onClose: () => void;
  categories: Array<{ id: string; name: string; icon: string; color: string }>;
}

const NoteEditor: React.FC<NoteEditorProps> = ({ note, onSave, onClose, categories }) => {
  const [title, setTitle] = useState(note?.title || '');
  const [content, setContent] = useState(note?.content || '');
  const [category, setCategory] = useState(note?.category || 'general');
  const [format, setFormat] = useState<'plain' | 'markdown'>(note?.format || 'plain');
  const [showPreview, setShowPreview] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  
  const contentRef = useRef<HTMLTextAreaElement>(null);
  const autoSaveTimeoutRef = useRef<number>();

  useEffect(() => {
    if (note) {
      setTitle(note.title);
      setContent(note.content);
      setCategory(note.category);
      setFormat(note.format);
    }
  }, [note]);

  useEffect(() => {
    setHasUnsavedChanges(true);
    
    // Auto-save with debounce
    if (autoSaveTimeoutRef.current) {
      clearTimeout(autoSaveTimeoutRef.current);
    }
    
    autoSaveTimeoutRef.current = setTimeout(() => {
      if (note && (title !== note.title || content !== note.content)) {
        handleSave();
      }
    }, 2000);

    return () => {
      if (autoSaveTimeoutRef.current) {
        clearTimeout(autoSaveTimeoutRef.current);
      }
    };
  }, [title, content]);

  const handleSave = () => {
    if (!note) return;
    
    onSave({
      title: title || 'Untitled Note',
      content,
      category,
      format
    });
    setHasUnsavedChanges(false);
  };

  const insertText = (text: string) => {
    if (!contentRef.current) return;
    
    const start = contentRef.current.selectionStart;
    const end = contentRef.current.selectionEnd;
    const newContent = content.substring(0, start) + text + content.substring(end);
    
    setContent(newContent);
    
    // Restore cursor position
    setTimeout(() => {
      if (contentRef.current) {
        contentRef.current.selectionStart = start + text.length;
        contentRef.current.selectionEnd = start + text.length;
        contentRef.current.focus();
      }
    }, 0);
  };

  const formatMarkdown = (type: string) => {
    if (!contentRef.current) return;
    
    const start = contentRef.current.selectionStart;
    const end = contentRef.current.selectionEnd;
    const selectedText = content.substring(start, end);
    
    let formattedText = '';
    switch (type) {
      case 'bold':
        formattedText = `**${selectedText || 'bold text'}**`;
        break;
      case 'italic':
        formattedText = `*${selectedText || 'italic text'}*`;
        break;
      case 'code':
        formattedText = `\`${selectedText || 'code'}\``;
        break;
      case 'heading':
        formattedText = `## ${selectedText || 'Heading'}`;
        break;
      case 'list':
        formattedText = `- ${selectedText || 'List item'}`;
        break;
    }
    
    insertText(formattedText);
  };

  const renderMarkdownPreview = (text: string) => {
    // Simple markdown rendering
    return text
      .replace(/^## (.*$)/gm, '<h2 class="text-xl font-bold mb-2">$1</h2>')
      .replace(/^# (.*$)/gm, '<h1 class="text-2xl font-bold mb-3">$1</h1>')
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/`(.*?)`/g, '<code class="bg-gray-100 px-1 rounded">$1</code>')
      .replace(/^- (.*$)/gm, '<li>$1</li>')
      .replace(/\n/g, '<br>');
  };

  const wordCount = content.trim().split(/\s+/).filter(word => word.length > 0).length;
  const charCount = content.length;

  if (!note) {
    return (
      <div className="flex items-center justify-center h-full text-gray-500">
        <div className="text-center">
          <Edit3 className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <p>Select a note to edit or create a new one</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="px-2 py-1 border border-gray-300 rounded text-sm"
          >
            {categories.map(cat => (
              <option key={cat.id} value={cat.id}>
                {cat.icon} {cat.name}
              </option>
            ))}
          </select>
          
          <select
            value={format}
            onChange={(e) => setFormat(e.target.value as 'plain' | 'markdown')}
            className="px-2 py-1 border border-gray-300 rounded text-sm"
          >
            <option value="plain">Plain Text</option>
            <option value="markdown">Markdown</option>
          </select>
        </div>
        
        <div className="flex items-center space-x-2">
          {format === 'markdown' && (
            <button
              onClick={() => setShowPreview(!showPreview)}
              className={`p-2 rounded ${showPreview ? 'bg-blue-100 text-blue-600' : 'hover:bg-gray-100'}`}
              title={showPreview ? 'Hide Preview' : 'Show Preview'}
            >
              {showPreview ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          )}
          
          <button
            onClick={handleSave}
            disabled={!hasUnsavedChanges}
            className="flex items-center space-x-2 px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span>Save</span>
          </button>
          
          <button
            onClick={onClose}
            className="px-3 py-2 border border-gray-300 rounded hover:bg-gray-50"
          >
            Close
          </button>
        </div>
      </div>

      {/* Title Input */}
      <div className="p-4 border-b border-gray-200">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Note title..."
          className="w-full text-2xl font-bold border-none outline-none placeholder-gray-400"
        />
      </div>

      {/* Markdown Toolbar */}
      {format === 'markdown' && (
        <div className="flex items-center space-x-2 p-2 border-b border-gray-200 bg-gray-50">
          <button
            onClick={() => formatMarkdown('heading')}
            className="p-2 hover:bg-gray-200 rounded"
            title="Heading"
          >
            <strong>H</strong>
          </button>
          <button
            onClick={() => formatMarkdown('bold')}
            className="p-2 hover:bg-gray-200 rounded"
            title="Bold"
          >
            <strong>B</strong>
          </button>
          <button
            onClick={() => formatMarkdown('italic')}
            className="p-2 hover:bg-gray-200 rounded"
            title="Italic"
          >
            <em>I</em>
          </button>
          <button
            onClick={() => formatMarkdown('code')}
            className="p-2 hover:bg-gray-200 rounded font-mono"
            title="Code"
          >
            {'<>'}
          </button>
          <button
            onClick={() => formatMarkdown('list')}
            className="p-2 hover:bg-gray-200 rounded"
            title="List"
          >
            •
          </button>
        </div>
      )}

      {/* Content Area */}
      <div className="flex-1 flex">
        {/* Editor */}
        <div className={`${showPreview ? 'w-1/2' : 'w-full'} flex flex-col`}>
          <textarea
            ref={contentRef}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Start writing..."
            className="flex-1 p-4 border-none outline-none resize-none font-mono text-sm"
          />
        </div>

        {/* Preview */}
        {showPreview && format === 'markdown' && (
          <div className="w-1/2 border-l border-gray-200">
            <div className="p-4 h-full overflow-y-auto prose prose-sm max-w-none">
              <div 
                dangerouslySetInnerHTML={{ 
                  __html: renderMarkdownPreview(content) 
                }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="flex justify-between items-center p-4 border-t border-gray-200 bg-gray-50 text-sm text-gray-600">
        <div>
          {wordCount} words, {charCount} characters
        </div>
        <div className="flex items-center space-x-4">
          {hasUnsavedChanges && (
            <span className="text-orange-600">Unsaved changes</span>
          )}
          <span>Last saved: {new Date().toLocaleTimeString()}</span>
        </div>
      </div>
    </div>
  );
};

// Main Enhanced Notes Editor Component
export const EnhancedNotesEditor: React.FC = () => {
  const {
    notes,
    categories,
    preferences,
    selectedNoteId,
    searchQuery,
    selectedCategory,
    showArchived,
    createNote,
    updateNote,
    deleteNote,
    duplicateNote,
    togglePin,
    toggleArchive,
    setSearchQuery,
    setSelectedCategory,
    toggleShowArchived,
    selectNote,
    setIsCreating,
    exportNotes,
    getFilteredNotes
  } = useNotesStore();

  const [viewMode, setViewMode] = useState<'list' | 'grid'>(
    preferences.viewMode === 'compact' ? 'list' : preferences.viewMode
  );
  const [showFilters, setShowFilters] = useState(false);

  const filteredNotes = getFilteredNotes();
  const selectedNote = notes.find(note => note.id === selectedNoteId);

  const handleCreateNote = () => {
    createNote({
      title: 'Untitled Note',
      content: '',
      category: preferences.defaultCategory
    });
    setIsCreating(false);
  };

  const handleExport = (format: 'json' | 'markdown' | 'txt') => {
    const data = exportNotes(format);
    const blob = new Blob([data], { 
      type: format === 'json' ? 'application/json' : 'text/plain' 
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ketchew-notes-${new Date().toISOString().split('T')[0]}.${format}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex h-full bg-gray-50">
      {/* Sidebar */}
      <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Notes</h2>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setViewMode(viewMode === 'list' ? 'grid' : 'list')}
                className="p-2 hover:bg-gray-100 rounded"
                title="Toggle View"
              >
                {viewMode === 'list' ? <Grid className="w-4 h-4" /> : <List className="w-4 h-4" />}
              </button>
              <button
                onClick={handleCreateNote}
                className="p-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                title="New Note"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Search */}
          <div className="relative mb-3">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search notes..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Filters */}
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center space-x-2 px-3 py-2 border border-gray-300 rounded hover:bg-gray-50"
            >
              <Filter className="w-4 h-4" />
              <span>Filters</span>
            </button>
            <button
              onClick={toggleShowArchived}
              className={`px-3 py-2 border rounded ${
                showArchived 
                  ? 'border-blue-500 bg-blue-50 text-blue-600' 
                  : 'border-gray-300 hover:bg-gray-50'
              }`}
            >
              <Archive className="w-4 h-4" />
            </button>
          </div>

          {/* Filter Panel */}
          {showFilters && (
            <div className="mt-3 p-3 border border-gray-200 rounded-lg bg-gray-50">
              {/* Category Filter */}
              <div className="mb-3">
                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                <select
                  value={selectedCategory || ''}
                  onChange={(e) => setSelectedCategory(e.target.value || null)}
                  className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                >
                  <option value="">All Categories</option>
                  {categories.map(cat => (
                    <option key={cat.id} value={cat.id}>
                      {cat.icon} {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Export */}
              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700">Export</label>
                <div className="flex space-x-1">
                  <button
                    onClick={() => handleExport('json')}
                    className="px-2 py-1 text-xs bg-gray-200 hover:bg-gray-300 rounded"
                  >
                    JSON
                  </button>
                  <button
                    onClick={() => handleExport('markdown')}
                    className="px-2 py-1 text-xs bg-gray-200 hover:bg-gray-300 rounded"
                  >
                    MD
                  </button>
                  <button
                    onClick={() => handleExport('txt')}
                    className="px-2 py-1 text-xs bg-gray-200 hover:bg-gray-300 rounded"
                  >
                    TXT
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Notes List */}
        <div className="flex-1 overflow-y-auto p-4">
          {filteredNotes.length === 0 ? (
            <div className="text-center text-gray-500 mt-8">
              <Edit3 className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>No notes found</p>
              <button
                onClick={handleCreateNote}
                className="mt-2 text-blue-600 hover:text-blue-700"
              >
                Create your first note
              </button>
            </div>
          ) : (
            <div className={viewMode === 'grid' ? 'grid grid-cols-1 gap-3' : 'space-y-3'}>
              {filteredNotes.map(note => (
                <NoteCard
                  key={note.id}
                  note={note}
                  isSelected={note.id === selectedNoteId}
                  onClick={() => selectNote(note.id)}
                  onPin={() => togglePin(note.id)}
                  onArchive={() => toggleArchive(note.id)}
                  onDelete={() => {
                    if (confirm('Are you sure you want to delete this note?')) {
                      deleteNote(note.id);
                    }
                  }}
                  onDuplicate={() => duplicateNote(note.id)}
                  category={categories.find(c => c.id === note.category)}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Editor */}
      <div className="flex-1">
        <NoteEditor
          note={selectedNote || null}
          onSave={(updates) => {
            if (selectedNote) {
              updateNote(selectedNote.id, updates);
            }
          }}
          onClose={() => selectNote(null)}
          categories={categories}
        />
      </div>
    </div>
  );
};

export default EnhancedNotesEditor;
