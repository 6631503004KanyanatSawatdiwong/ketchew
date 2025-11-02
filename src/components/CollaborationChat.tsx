import React, { useState, useRef, useEffect } from 'react'
import { Send, MessageCircle, Users, LogOut, Crown } from 'lucide-react'
import { useCollaborationStore } from '../stores/collaborationStore'

export const CollaborationChat: React.FC = () => {
  const [message, setMessage] = useState('')
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const {
    currentSession,
    isInSession,
    userNickname,
    chatOpen,
    participantsOpen,
    setChatOpen,
    setParticipantsOpen,
    sendMessage,
    leaveSession,
  } = useCollaborationStore()

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [currentSession?.chat])

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

  const participants = currentSession.participants || []
  const messages = currentSession.chat || []
  const hostParticipant = participants.find(p => p.isHost)

  return (
    <div className="fixed bottom-4 right-4 flex flex-col items-end gap-2 z-40">
      {/* Participants Panel */}
      {participantsOpen && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 w-64">
          <div className="p-3 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <h3 className="font-medium text-gray-900 dark:text-white">
                Participants ({participants.length})
              </h3>
              <button
                onClick={() => setParticipantsOpen(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                ×
              </button>
            </div>
          </div>
          <div className="p-2 max-h-48 overflow-y-auto">
            {participants.map(participant => (
              <div
                key={participant.id}
                className="flex items-center gap-2 p-2 rounded hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                <span className="text-lg">{participant.avatar}</span>
                <span className="flex-1 text-sm text-gray-700 dark:text-gray-300">
                  {participant.nickname}
                  {participant.nickname === userNickname && ' (You)'}
                </span>
                {participant.isHost && (
                  <div title="Host">
                    <Crown className="w-3 h-3 text-yellow-500" />
                  </div>
                )}
              </div>
            ))}
          </div>
          <div className="p-2 border-t border-gray-200 dark:border-gray-700">
            <button
              onClick={leaveSession}
              className="w-full flex items-center justify-center gap-2 px-3 py-2 text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 rounded-md hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              Leave Session
            </button>
          </div>
        </div>
      )}

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
            {hostParticipant && (
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Host: {hostParticipant.avatar} {hostParticipant.nickname}
              </p>
            )}
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
                      <span>{msg.avatar}</span>
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
          onClick={() => setParticipantsOpen(!participantsOpen)}
          className={`p-3 rounded-full shadow-lg transition-colors ${
            participantsOpen
              ? 'bg-blue-600 text-white'
              : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
          }`}
          title="Participants"
        >
          <Users className="w-5 h-5" />
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
            {participants.length}
          </span>
        </button>

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
          {messages.length > 0 && !chatOpen && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
              {messages.length > 9 ? '9+' : messages.length}
            </span>
          )}
        </button>
      </div>
    </div>
  )
}
