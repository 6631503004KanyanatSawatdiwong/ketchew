import React from 'react'

interface DesktopInterfaceProps {
  background?: string
}

const DesktopInterface: React.FC<DesktopInterfaceProps> = ({ background = 'minimal1' }) => {
  // Apply background styling based on the background prop
  React.useEffect(() => {
    const body = document.body

    // Reset any existing background
    body.style.backgroundImage = 'none'
    body.style.backgroundColor = ''

    // Apply background based on selection
    switch (background) {
      case 'minimal1':
        body.style.backgroundColor = '#f9fafb'
        break
      case 'minimal2':
        body.style.backgroundColor = '#f3f4f6'
        break
      default:
        body.style.backgroundColor = '#f9fafb'
    }
  }, [background])

  return (
    <div className="fixed inset-0 -z-10">
      {/* Desktop grid pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="grid grid-cols-12 gap-4 h-full p-8">
          {Array.from({ length: 48 }).map((_, i) => (
            <div key={i} className="border border-gray-300 rounded" />
          ))}
        </div>
      </div>

      {/* Subtle gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-black/5" />
    </div>
  )
}

export default DesktopInterface
