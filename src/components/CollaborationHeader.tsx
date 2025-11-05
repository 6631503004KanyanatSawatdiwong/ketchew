import React from 'react'
import { useCollaborationStore } from '../stores/collaborationStore'

// Avatar options from src/images/avatars (now in public folder)
const AVATAR_OPTIONS = [
  { id: 'red', name: 'Red Tomato', src: '/images/avatars/tomatoRed.png' },
  { id: 'blue', name: 'Blue Tomato', src: '/images/avatars/tomatoBlue.png' },
  { id: 'purple', name: 'Purple Tomato', src: '/images/avatars/tomatoPurple.png' },
  { id: 'yellow', name: 'Yellow Tomato', src: '/images/avatars/tomatoYellow.png' },
]

export const CollaborationHeader: React.FC = () => {
  const {
    isInSession,
    currentSession,
    userNickname,
    userAvatar,
    setInviteModalOpen,
    setInviteLinkModalOpen,
    setAvatarSelectorOpen,
    leaveSession,
  } = useCollaborationStore()

  const handleAvatarClick = () => {
    setAvatarSelectorOpen(true)
  }

  const participants = currentSession?.participants || []
  const isHost = participants.find(p => p.nickname === userNickname)?.isHost || false
  const otherParticipants = participants.filter(p => p.nickname !== userNickname)
  const hostParticipant = participants.find(p => p.isHost)
  // Use the actual host participant's nickname from the session data
  const hostName = hostParticipant?.nickname || 'Someone'

  // Debug logging
  console.log('👤 CollaborationHeader render:')
  console.log('  - Is in session:', isInSession)
  console.log('  - Total participants:', participants.length)
  console.log('  - All participants:', participants)
  console.log('  - Other participants:', otherParticipants)
  console.log('  - User nickname:', userNickname)
  console.log('  - Is host:', isHost)

  if (!isInSession) {
    // Show "Tomato Room" and invite button when no session
    return (
      <div className="fixed top-[50px] right-4 z-50">
        <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200 px-4 py-3 flex items-center gap-3">
          {/* Avatar selector */}
          <button
            onClick={handleAvatarClick}
            className="w-8 h-9 overflow-hidden transition-colors"
            title="Select Avatar"
          >
            <img
              src={AVATAR_OPTIONS.find(a => a.id === userAvatar)?.src || AVATAR_OPTIONS[0].src}
              alt="Your avatar"
              className="w-full h-full object-cover"
            />
          </button>

          {/* Room name */}
          <span className="text-gray-800 font-medium">Tomato Room</span>

          {/* Invite button */}
          <button
            onClick={() => setInviteModalOpen(true)}
            className="bg-white text-gray-700 px-5 py-1 rounded-full border border-gray-300 hover:bg-gray-50 transition-colors text-sm font-medium"
          >
            invite
          </button>
        </div>
      </div>
    )
  }

  // Show collaborator bubbles when in session
  return (
    <div className="fixed top-[50px] right-4 z-50 flex flex-col items-end gap-2">
      {/* Main session header - always shows HOST's info */}
      <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200 px-4 py-3 flex items-center gap-3">
        {/* Host's avatar */}
        <div className="w-8 h-9 rounded-full overflow-hidden">
          <img
            src={
              AVATAR_OPTIONS.find(a => a.id === hostParticipant?.avatar)?.src ||
              AVATAR_OPTIONS[0].src
            }
            alt="Host avatar"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Room name with host's name */}
        <span className="text-gray-800 font-medium">{hostName}&apos;s Room</span>

        {/* Invite/Leave button */}
        {isHost ? (
          <button
            onClick={() => setInviteLinkModalOpen(true)}
            className="bg-white text-gray-700 px-5 py-1 rounded-full border border-gray-300 hover:bg-gray-50 transition-colors text-sm font-medium"
          >
            invite
          </button>
        ) : (
          <button
            onClick={() => leaveSession()}
            className="bg-red-50 text-red-700 px-5 py-1 rounded-full border border-red-300 hover:bg-red-100 transition-colors text-sm font-medium"
          >
            Leave
          </button>
        )}
      </div>

      {/* Current user's bubble with avatar selector */}
      <div className="relative group">
        <div className="bg-white/95 backdrop-blur-sm rounded-full shadow-lg border border-gray-200 p-2">
          <button
            onClick={handleAvatarClick}
            className="w-8 h-8 p-0 rounded-full overflow-hidden transition-colors block"
            title="Select Avatar"
          >
            <img
              src={AVATAR_OPTIONS.find(a => a.id === userAvatar)?.src || AVATAR_OPTIONS[0].src}
              alt="Your avatar"
              className="w-full h-full object-cover"
            />
          </button>
        </div>
        {/* Hover tooltip */}
        <div className="absolute right-0 top-full mt-1 bg-gray-800 text-white px-2 py-1 rounded text-xs whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity z-50">
          {userNickname}
        </div>
      </div>

      {/* Other collaborators' bubbles (excluding current user) - Avatar only with hover */}
      {otherParticipants.map(participant => (
        <div key={participant.id} className="relative group">
          <div className="bg-white/95 backdrop-blur-sm rounded-full shadow-lg border border-gray-200 p-2">
            <div className="w-8 h-8 rounded-full overflow-hidden">
              <img
                src={
                  AVATAR_OPTIONS.find(a => a.id === participant.avatar)?.src ||
                  AVATAR_OPTIONS[0].src
                }
                alt={participant.nickname}
                className="w-full h-full object-cover"
              />
            </div>
          </div>
          {/* Hover tooltip */}
          <div className="absolute right-0 top-full mt-1 bg-gray-800 text-white px-2 py-1 rounded text-xs whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity z-50">
            {participant.nickname}
          </div>
        </div>
      ))}
    </div>
  )
}
