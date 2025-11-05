export interface BackgroundImage {
  id: string
  name: string
  category: 'room' | 'nature' | 'cafe' | 'abstract'
  imageUrl: string
  thumbnailUrl?: string
  artist?: string
  source?: string
}

export interface BackgroundCategory {
  id: string
  name: string
  count: number
}

// High-quality background images for focus and productivity
export const BACKGROUND_LIBRARY: BackgroundImage[] = [
  // Ketchew Default - Tomato Background
  {
    id: 'tomato-default',
    name: 'Ketchew Tomato',
    category: 'room',
    imageUrl: '/src/images/backgrounds/Background-tomato.png',
    artist: 'Ketchew Team',
    source: 'Built-in',
  },

  // Nature Category
  {
    id: 'forest-morning',
    name: 'Morning Forest',
    category: 'nature',
    imageUrl:
      'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2071&q=80',
    artist: 'Casey Horner',
    source: 'Unsplash',
  },
  {
    id: 'ocean-waves',
    name: 'Ocean Waves',
    category: 'nature',
    imageUrl:
      'https://images.unsplash.com/photo-1505142468610-359e7d316be0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2026&q=80',
    artist: 'Matt Hardy',
    source: 'Unsplash',
  },
  {
    id: 'bamboo-forest',
    name: 'Bamboo Grove',
    category: 'nature',
    imageUrl:
      'https://images.unsplash.com/photo-1518837695005-2083093ee35b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
    artist: 'Zach Reiner',
    source: 'Unsplash',
  },
  {
    id: 'cherry-blossoms',
    name: 'Cherry Blossoms',
    category: 'nature',
    imageUrl:
      'https://images.unsplash.com/photo-1522383225653-ed111181a951?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1976&q=80',
    artist: 'Kazuo Ota',
    source: 'Unsplash',
  },
  {
    id: 'rice-farms',
    name: 'Rice Farms',
    category: 'nature',
    imageUrl: '/src/images/backgrounds/Farm.jpg',
    artist: 'Unknown',
    source: 'pexels.com',
  },
  {
    id: 'navagio-beach',
    name: 'Navagio Beach',
    category: 'nature',
    imageUrl: '/src/images/backgrounds/Greece.jpg',
  },

  // Room/Minimalist Category (clean spaces)
  {
    id: 'bedroom-window',
    name: 'Bedroom Window',
    category: 'room',
    imageUrl: '/src/images/backgrounds/BedroomWindow.jpg',
    artist: 'Unknown',
    source: 'pexels.com',
  },
  {
    id: 'desktop',
    name: 'Desktop',
    category: 'room',
    imageUrl: '/src/images/backgrounds/Desktop.jpg',
    artist: 'Unknown',
    source: 'pexels.com',
  },

  // Cafe Category
  {
    id: 'cozy-cafe',
    name: 'Cozy Cafe',
    category: 'cafe',
    imageUrl: '/src/images/backgrounds/CozyCafe.jpg',
    artist: 'Unknown',
    source: 'pexels.com',
  },
  {
    id: 'warm-cafe',
    name: 'Warm Cafe',
    category: 'cafe',
    imageUrl: '/src/images/backgrounds/Cafe2.jpg',
    artist: 'Unknown',
    source: 'pexels.com',
  },
  {
    id: 'coffee-notes',
    name: 'Coffee & Notes',
    category: 'cafe',
    imageUrl:
      'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
    artist: 'Estée Janssens',
    source: 'Unsplash',
  },

  // Abstract/Creative Category -> Room
  {
    id: 'fluid-colors',
    name: 'Fluid Colors',
    category: 'abstract',
    imageUrl:
      'https://images.unsplash.com/photo-1557672172-298e090bd0f1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
    artist: 'Milad Fakurian',
    source: 'Unsplash',
  },
  {
    id: 'geometric-shapes',
    name: 'Geometric Shapes',
    category: 'abstract',
    imageUrl:
      'https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2069&q=80',
    artist: 'Pawel Czerwinski',
    source: 'Unsplash',
  },
  {
    id: 'watercolor-abstract',
    name: 'Watercolor Abstract',
    category: 'abstract',
    imageUrl:
      'https://images.unsplash.com/photo-1541961017774-22349e4a1262?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2064&q=80',
    artist: 'Lucas Benjamin',
    source: 'Unsplash',
  },
  {
    id: 'light-rays',
    name: 'Light Rays',
    category: 'abstract',
    imageUrl:
      'https://images.unsplash.com/photo-1550745165-9bc0b252726f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
    artist: 'Fakurian Design',
    source: 'Unsplash',
  },
]

// Calculate counts for each category
const categoryCounts = BACKGROUND_LIBRARY.reduce(
  (acc, bg) => {
    acc[bg.category] = (acc[bg.category] || 0) + 1
    return acc
  },
  {} as Record<string, number>
)

export const BACKGROUND_CATEGORIES: BackgroundCategory[] = [
  {
    id: 'room',
    name: 'Room',
    count: categoryCounts.room || 0,
  },
  {
    id: 'nature',
    name: 'Nature',
    count: categoryCounts.nature || 0,
  },
  {
    id: 'cafe',
    name: 'Cafe',
    count: categoryCounts.cafe || 0,
  },
  { id: 'abstract', name: 'Abstract', count: categoryCounts.abstract || 0 },
]

// Utility functions
export const getBackgroundsByCategory = (category: string): BackgroundImage[] => {
  return BACKGROUND_LIBRARY.filter(bg => bg.category === category)
}

export const getBackgroundById = (id: string): BackgroundImage | undefined => {
  return BACKGROUND_LIBRARY.find(bg => bg.id === id)
}

export const getRandomBackground = (category?: string): BackgroundImage => {
  const backgrounds = category ? getBackgroundsByCategory(category) : BACKGROUND_LIBRARY
  const randomIndex = Math.floor(Math.random() * backgrounds.length)
  return backgrounds[randomIndex]
}
