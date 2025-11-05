import React, { useState, useRef, useEffect, useMemo } from 'react'
import { Send } from 'lucide-react'
import { useCollaborationStore } from '../stores/collaborationStore'
import chatIcon from '../images/icons/chatIcon.png'

// Avatar options to match the ones in the image
const AVATAR_OPTIONS = [
  { id: 'red', name: 'Red Tomato', src: '/images/avatars/tomatoRed.png' },
  { id: 'blue', name: 'Blue Tomato', src: '/images/avatars/tomatoBlue.png' },
  { id: 'purple', name: 'Purple Tomato', src: '/images/avatars/tomatoPurple.png' },
  { id: 'yellow', name: 'Yellow Tomato', src: '/images/avatars/tomatoYellow.png' },
]

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

  const messages = useMemo(() => currentSession?.chat || [], [currentSession?.chat])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  // Debug: Log when messages change
  useEffect(() => {
    console.log('💬 Chat messages updated:', messages.length, messages)
    console.log('💬 Current session:', currentSession?.id)
    console.log('💬 User nickname:', userNickname)
  }, [messages, currentSession?.id, userNickname])

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
    <div className="fixed bottom-8 left-4 right-4 flex flex-col items-end gap-2 z-[9997] ">
      {/* Chat Panel */}
      {chatOpen && (
        <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-lg border border-gray-200 dark:border-gray-700 w-80 min-w-0 ml-auto">
          {/* Chat Header */}
          <div className="p-2.5 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <h3 className="font-medium text-gray-900 dark:text-white text-sm">Chat</h3>
              <button
                onClick={() => setChatOpen(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                ×
              </button>
            </div>
          </div>

          {/* Messages */}
          <div className="h-56 overflow-y-auto p-3">
            {messages.length === 0 ? (
              <div className="flex items-center justify-center h-full text-gray-500 dark:text-gray-400 text-sm">
                No messages yet. Start the conversation!
              </div>
            ) : (
              <div className="space-y-3">
                {messages.map(msg => {
                  const avatarSrc =
                    AVATAR_OPTIONS.find(a => a.id === msg.avatar)?.src || AVATAR_OPTIONS[0].src
                  return (
                    <div key={msg.id} className="flex gap-2.5">
                      {/* Avatar */}
                      <img
                        src={avatarSrc}
                        alt={msg.sender}
                        className="w-9 h-10 rounded-full flex-shrink-0"
                      />
                      {/* Message Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-baseline gap-2 mb-0.5">
                          <span className="font-medium text-gray-900 dark:text-white text-sm">
                            {msg.sender}
                          </span>
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            {formatTime(msg.timestamp)}
                          </span>
                        </div>
                        <p className="text-sm text-gray-700 dark:text-gray-300 break-words">
                          {msg.text}
                        </p>
                      </div>
                    </div>
                  )
                })}
                <div ref={messagesEndRef} />
              </div>
            )}
          </div>

          {/* Message Input */}
          <div className="p-2">
            <form onSubmit={handleSendMessage} className="flex gap-2.5 items-center">
              <input
                type="text"
                value={message}
                onChange={e => setMessage(e.target.value.substring(0, 200))}
                placeholder="Say Something"
                className="flex-1 px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-full bg-gray-50 dark:bg-gray-700 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 focus:bg-white dark:focus:bg-gray-600 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                maxLength={200}
              />
              <button
                type="submit"
                disabled={!message.trim()}
                className="p-2.5 bg-blue-600 text-white rounded-full hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex-shrink-0"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Control Buttons */}
      <div className="flex gap-2">
        <button onClick={() => setChatOpen(!chatOpen)} title="Chat">
          <img src={chatIcon} alt="Chat Icon" className="w-14 h-14 object-contain" />
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
