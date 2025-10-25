import React, { useState } from 'react';
import { X, LogIn } from 'lucide-react';
import { useCollaborationStore } from '../stores/collaborationStore';

interface JoinSessionModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialSessionId?: string;
}

export const JoinSessionModal: React.FC<JoinSessionModalProps> = ({ 
  isOpen, 
  onClose, 
  initialSessionId = '' 
}) => {
  const [sessionId, setSessionId] = useState(initialSessionId);
  const [nickname, setNickname] = useState('');
  const [selectedAvatar, setSelectedAvatar] = useState('🐶');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const { joinSession, isConnected } = useCollaborationStore();

  const avatars = [
    '🐱', '🐶', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼',
    '🐨', '🐯', '🦁', '🐸', '🐵', '🐧', '🐦', '🦉'
  ];

  const handleJoinSession = async () => {
    if (!sessionId.trim()) {
      setError('Please enter a session ID');
      return;
    }

    if (!nickname.trim()) {
      setError('Please enter a nickname');
      return;
    }

    if (!isConnected) {
      setError('Not connected to collaboration server');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const result = await joinSession(sessionId.trim(), nickname.trim(), selectedAvatar);
      if (result.success) {
        onClose();
        resetModal();
      } else {
        setError(result.error || 'Failed to join session');
      }
    } catch {
      setError('Failed to join session');
    } finally {
      setIsLoading(false);
    }
  };

  const resetModal = () => {
    if (!initialSessionId) {
      setSessionId('');
    }
    setNickname('');
    setError('');
    setIsLoading(false);
  };

  const handleClose = () => {
    resetModal();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md mx-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Join Session
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
            Session ID
          </label>
          <input
            type="text"
            value={sessionId}
            onChange={(e) => setSessionId(e.target.value)}
            placeholder="Enter session ID"
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
            disabled={isLoading || !!initialSessionId}
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Your Nickname
          </label>
          <input
            type="text"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
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
          <div className="grid grid-cols-8 gap-2">
            {avatars.map((avatar) => (
              <button
                key={avatar}
                onClick={() => setSelectedAvatar(avatar)}
                className={`w-8 h-8 text-lg rounded border-2 transition-colors ${
                  selectedAvatar === avatar
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900'
                    : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
                }`}
                disabled={isLoading}
              >
                {avatar}
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
            className="flex-1 px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
            disabled={isLoading}
          >
            Cancel
          </button>
          <button
            onClick={handleJoinSession}
            disabled={isLoading || !isConnected || !sessionId.trim() || !nickname.trim()}
            className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Joining...
              </>
            ) : (
              <>
                <LogIn className="w-4 h-4" />
                Join Session
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};