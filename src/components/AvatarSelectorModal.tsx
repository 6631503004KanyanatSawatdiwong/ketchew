import React from 'react'
import { X } from 'lucide-react'
import { useCollaborationStore } from '../stores/collaborationStore'

const AVATAR_OPTIONS = [
  { id: 'red', name: 'Red Tomato', src: '/images/avatars/tomatoRed.png' },
  { id: 'blue', name: 'Blue Tomato', src: '/images/avatars/tomatoBlue.png' },
  { id: 'purple', name: 'Purple Tomato', src: '/images/avatars/tomatoPurple.png' },
  { id: 'yellow', name: 'Yellow Tomato', src: '/images/avatars/tomatoYellow.png' },
]

interface AvatarSelectorModalProps {
  isOpen: boolean
  onClose: () => void
}

export const AvatarSelectorModal: React.FC<AvatarSelectorModalProps> = ({ isOpen, onClose }) => {
  const { userAvatar, setUserAvatar } = useCollaborationStore()

  const handleAvatarSelect = (avatar: string) => {
    setUserAvatar(avatar)
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9998]">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-sm mx-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Select your Tomato!
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="grid grid-cols-2 gap-4 place-items-center">
          {AVATAR_OPTIONS.map(avatar => (
            <button
              key={avatar.id}
              onClick={() => handleAvatarSelect(avatar.id)}
              className={`w-20 h-20 rounded-full overflow-hidden border-4 transition-all hover:scale-105 flex items-center justify-center ${
                userAvatar === avatar.id
                  ? 'border-blue-500 ring-2 ring-blue-200'
                  : 'border-gray-200 dark:border-gray-600 hover:border-blue-300'
              }`}
              title={avatar.name}
            >
              <img
                src={avatar.src}
                alt={avatar.name}
                className="w-full h-full object-cover object-center"
              />
            </button>
          ))}
        </div>

        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  )
}
