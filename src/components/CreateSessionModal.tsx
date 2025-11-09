import React, { useState } from 'react'
import { X } from 'lucide-react'
import { useCollaborationStore } from '../stores/collaborationStore'

interface CreateSessionModalProps {
  isOpen: boolean
  onClose: () => void
}

export const CreateSessionModal: React.FC<CreateSessionModalProps> = ({ isOpen, onClose }) => {
  const [nickname, setNickname] = useState('')
  const [selectedAvatar, setSelectedAvatar] = useState('red')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const { createSession, isConnected, userAvatar, setInviteLinkModalOpen } = useCollaborationStore()

  // Tomato avatar options
  const tomatoAvatars = [
    { id: 'red', name: 'Red Tomato', src: '/images/avatars/tomatoRed.png' },
    { id: 'blue', name: 'Blue Tomato', src: '/images/avatars/tomatoBlue.png' },
    { id: 'purple', name: 'Purple Tomato', src: '/images/avatars/tomatoPurple.png' },
    { id: 'yellow', name: 'Yellow Tomato', src: '/images/avatars/tomatoYellow.png' },
  ]

  // Use current user avatar as default
  React.useEffect(() => {
    if (userAvatar) {
      setSelectedAvatar(userAvatar)
    }
  }, [userAvatar])

  const handleCreateSession = async () => {
    if (!nickname.trim()) {
      setError('Please enter a nickname')
      return
    }

    if (!isConnected) {
      setError('Not connected to collaboration server')
      return
    }

    setIsLoading(true)
    setError('')

    try {
      const result = await createSession(nickname.trim(), selectedAvatar)
      if (result.success && result.sessionId) {
        // Store the host's name in localStorage for room naming
        localStorage.setItem('hostName', nickname.trim())
        // Auto-show invite link modal and close this modal after a short delay
        setTimeout(() => {
          handleClose()
          setInviteLinkModalOpen(true)
        }, 500)
      } else {
        setError(result.error || 'Failed to create session')
      }
    } catch {
      setError('Failed to create session')
    } finally {
      setIsLoading(false)
    }
  }

  const resetModal = () => {
    setNickname('')
    setError('')
    setIsLoading(false)
  }

  const handleClose = () => {
    resetModal()
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999]">
      <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 w-full max-w-md mx-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Start Collaboration
          </h2>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Your Nickname
          </label>
          <input
            type="text"
            value={nickname}
            onChange={e => setNickname(e.target.value)}
            placeholder="Enter your nickname"
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
            maxLength={20}
            disabled={isLoading}
          />
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Choose Avatar
          </label>
          <div className="grid grid-cols-4 gap-3">
            {tomatoAvatars.map(avatar => (
              <button
                key={avatar.id}
                onClick={() => setSelectedAvatar(avatar.id)}
                className={`w-12 h-12 rounded-full overflow-hidden border-2 transition-colors ${
                  selectedAvatar === avatar.id
                    ? 'border-blue-500'
                    : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
                }`}
                disabled={isLoading}
                title={avatar.name}
              >
                <img src={avatar.src} alt={avatar.name} className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 dark:bg-red-900 border border-red-200 dark:border-red-700 rounded-md">
            <p className="text-sm text-red-600 dark:text-red-300">{error}</p>
          </div>
        )}

        {!isConnected && (
          <div className="mb-4 p-3 bg-yellow-50 dark:bg-yellow-900 border border-yellow-200 dark:border-yellow-700 rounded-md">
            <p className="text-sm text-yellow-600 dark:text-yellow-300">
              Connecting to collaboration server...
            </p>
          </div>
        )}

        <div className="flex gap-3">
          <button
            onClick={handleClose}
            className="flex-1 px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
            disabled={isLoading}
          >
            Cancel
          </button>
          <button
            onClick={handleCreateSession}
            disabled={isLoading || !isConnected || !nickname.trim()}
            className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Creating...
              </>
            ) : (
              <>Create Session</>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
