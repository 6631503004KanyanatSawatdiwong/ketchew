import React, { useState, useRef, useEffect } from 'react'
import { Send, MessageCircle } from 'lucide-react'
import { useCollaborationStore } from '../stores/collaborationStore'

export const CollaborationChat: React.FC = () => {
  const [message, setMessage] = useState('')
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const {
    currentSession,
    isInSession,
    userNickname,
    chatOpen,
    unreadMessageCount,
    setChatOpen,
    sendMessage,
  } = useCollaborationStore()

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const messages = currentSession?.chat || []

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  // Debug: Log when messages change
  useEffect(() => {
    console.log('💬 Chat messages updated:', messages.length, messages)
    console.log('💬 Current session:', currentSession?.id)
    console.log('💬 User nickname:', userNickname)
  }, [messages])

  // Debug: Log component state on render
  console.log('🔄 CollaborationChat render:')
  console.log('  - Messages count:', messages.length)
  console.log('  - Chat open:', chatOpen)
  console.log('  - Unread count:', unreadMessageCount)
  console.log('  - Is in session:', isInSession)
  console.log('  - Session ID:', currentSession?.id)

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault()
    if (message.trim()) {
      sendMessage(message.trim())
      setMessage('')
    }
  }

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  if (!isInSession || !currentSession) return null

  return (
    <div className="fixed bottom-4 right-4 flex flex-col items-end gap-2 z-[9997]">
      {/* Chat Panel */}
      {chatOpen && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 w-80">
          {/* Chat Header */}
          <div className="p-3 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <h3 className="font-medium text-gray-900 dark:text-white">Session Chat</h3>
              <button
                onClick={() => setChatOpen(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                ×
              </button>
            </div>
          </div>

          {/* Messages */}
          <div className="h-64 overflow-y-auto p-2">
            {messages.length === 0 ? (
              <div className="flex items-center justify-center h-full text-gray-500 dark:text-gray-400 text-sm">
                No messages yet. Start the conversation!
              </div>
            ) : (
              <div className="space-y-2">
                {messages.map(msg => (
                  <div
                    key={msg.id}
                    className={`p-2 rounded-lg max-w-[90%] ${
                      msg.sender === userNickname
                        ? 'bg-blue-500 text-white ml-auto'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white'
                    }`}
                  >
                    <div className="flex items-center gap-1 text-xs opacity-75 mb-1">
                      <span>{msg.sender}</span>
                      <span>·</span>
                      <span>{formatTime(msg.timestamp)}</span>
                    </div>
                    <p className="text-sm break-words">{msg.text}</p>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>
            )}
          </div>

          {/* Message Input */}
          <div className="p-3 border-t border-gray-200 dark:border-gray-700">
            <form onSubmit={handleSendMessage} className="flex gap-2">
              <input
                type="text"
                value={message}
                onChange={e => setMessage(e.target.value.substring(0, 200))}
                placeholder="Type a message..."
                className="flex-1 px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                maxLength={200}
              />
              <button
                type="submit"
                disabled={!message.trim()}
                className="px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              {message.length}/200 characters
            </p>
          </div>
        </div>
      )}

      {/* Control Buttons */}
      <div className="flex gap-2">
        <button
          onClick={() => setChatOpen(!chatOpen)}
          className={`p-3 rounded-full shadow-lg transition-colors relative ${
            chatOpen
              ? 'bg-blue-600 text-white'
              : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
          }`}
          title="Chat"
        >
          <MessageCircle className="w-5 h-5" />
          {unreadMessageCount > 0 && !chatOpen && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
              {unreadMessageCount > 9 ? '9+' : unreadMessageCount}
            </span>
          )}
        </button>
      </div>
    </div>
  )
}
