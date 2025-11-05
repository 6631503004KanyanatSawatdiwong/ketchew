import React, { useState } from 'react'
import { X, Share2, Copy, Check } from 'lucide-react'

interface InviteLinkModalProps {
  isOpen: boolean
  onClose: () => void
  sessionId: string
}

export const InviteLinkModal: React.FC<InviteLinkModalProps> = ({ isOpen, onClose, sessionId }) => {
  const [copied, setCopied] = useState(false)

  const copyInviteLink = async () => {
    const inviteLink = `${window.location.origin}?join=${sessionId}`
    try {
      await navigator.clipboard.writeText(inviteLink)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // Fallback for older browsers
      const textArea = document.createElement('textarea')
      textArea.value = inviteLink
      document.body.appendChild(textArea)
      textArea.select()
      document.execCommand('copy')
      document.body.removeChild(textArea)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const handleClose = () => {
    setCopied(false)
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999]">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md mx-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Invite Friends</h2>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="text-center mb-6">
          <p className="text-gray-600 dark:text-gray-300">
            Share this link with others to join your session:
          </p>
        </div>

        <div className="mb-6">
          <div className="flex items-center gap-2 p-3 bg-gray-50 dark:bg-gray-700 rounded-md border">
            <code className="flex-1 text-sm text-gray-800 dark:text-gray-200 break-all">
              {`${window.location.origin}?join=${sessionId}`}
            </code>
            <button
              onClick={copyInviteLink}
              className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
              title="Copy link"
            >
              {copied ? <Check className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>
        </div>

        <div className="flex gap-3">
          <button
            onClick={copyInviteLink}
            className="flex-1 px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors flex items-center justify-center gap-2"
          >
            <Share2 className="w-4 h-4" />
            {copied ? 'Copied!' : 'Copy Link'}
          </button>
          <button
            onClick={handleClose}
            className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  )
}
