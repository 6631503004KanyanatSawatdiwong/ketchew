export interface BackgroundImage {
  id: string
  name: string
  description: string
  category: 'nature' | 'minimalist' | 'workspace' | 'abstract'
  imageUrl: string
  thumbnailUrl?: string
  tags: string[]
  artist?: string
  source?: string
}

export interface BackgroundCategory {
  id: string
  name: string
  description: string
  count: number
}

// High-quality background images for focus and productivity
export const BACKGROUND_LIBRARY: BackgroundImage[] = [
  // Nature Category
  {
    id: 'forest-morning',
    name: 'Morning Forest',
    description: 'Peaceful forest scene with morning light filtering through trees',
    category: 'nature',
    imageUrl:
      'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2071&q=80',
    tags: ['forest', 'trees', 'morning', 'peaceful', 'green'],
    artist: 'Casey Horner',
    source: 'Unsplash',
  },
  {
    id: 'mountain-lake',
    name: 'Mountain Lake',
    description: 'Serene mountain lake with crystal clear reflections',
    category: 'nature',
    imageUrl:
      'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
    tags: ['mountain', 'lake', 'reflection', 'calm', 'blue'],
    artist: 'Jeremy Bishop',
    source: 'Unsplash',
  },
  {
    id: 'ocean-waves',
    name: 'Ocean Waves',
    description: 'Gentle ocean waves meeting sandy shore',
    category: 'nature',
    imageUrl:
      'https://images.unsplash.com/photo-1505142468610-359e7d316be0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2026&q=80',
    tags: ['ocean', 'waves', 'beach', 'calming', 'blue'],
    artist: 'Matt Hardy',
    source: 'Unsplash',
  },
  {
    id: 'bamboo-forest',
    name: 'Bamboo Grove',
    description: 'Tranquil bamboo forest with filtered sunlight',
    category: 'nature',
    imageUrl:
      'https://images.unsplash.com/photo-1518837695005-2083093ee35b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
    tags: ['bamboo', 'forest', 'zen', 'green', 'peaceful'],
    artist: 'Zach Reiner',
    source: 'Unsplash',
  },
  {
    id: 'cherry-blossoms',
    name: 'Cherry Blossoms',
    description: 'Beautiful cherry blossom trees in full bloom',
    category: 'nature',
    imageUrl:
      'https://images.unsplash.com/photo-1522383225653-ed111181a951?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1976&q=80',
    tags: ['cherry', 'blossoms', 'spring', 'pink', 'peaceful'],
    artist: 'Kazuo Ota',
    source: 'Unsplash',
  },

  // Minimalist Category
  {
    id: 'minimal-white',
    name: 'Pure White',
    description: 'Clean white background for maximum focus',
    category: 'minimalist',
    imageUrl:
      'https://images.unsplash.com/photo-1618005198919-d3d4b5a92ead?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2074&q=80',
    tags: ['white', 'minimal', 'clean', 'simple', 'focus'],
    artist: 'Sigmund',
    source: 'Unsplash',
  },
  {
    id: 'soft-gradient',
    name: 'Soft Gradient',
    description: 'Gentle gradient from light blue to white',
    category: 'minimalist',
    imageUrl:
      'https://images.unsplash.com/photo-1557682250-33bd709cbe85?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2029&q=80',
    tags: ['gradient', 'blue', 'soft', 'minimal', 'calm'],
    artist: 'Gradienta',
    source: 'Unsplash',
  },
  {
    id: 'geometric-lines',
    name: 'Geometric Lines',
    description: 'Subtle geometric patterns on light background',
    category: 'minimalist',
    imageUrl:
      'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
    tags: ['geometric', 'lines', 'pattern', 'minimal', 'structure'],
    artist: 'Joanna Kosinska',
    source: 'Unsplash',
  },
  {
    id: 'paper-texture',
    name: 'Paper Texture',
    description: 'Subtle paper texture for a natural writing feel',
    category: 'minimalist',
    imageUrl:
      'https://images.unsplash.com/photo-1586281010691-fb5b89c4e8a7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
    tags: ['paper', 'texture', 'writing', 'minimal', 'neutral'],
    artist: 'Markus Winkler',
    source: 'Unsplash',
  },

  // Workspace Category
  {
    id: 'modern-desk',
    name: 'Modern Workspace',
    description: 'Clean modern desk setup with plants and natural light',
    category: 'workspace',
    imageUrl:
      'https://images.unsplash.com/photo-1581833971358-2c8b550f87b3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
    tags: ['desk', 'workspace', 'modern', 'plants', 'productivity'],
    artist: 'Bram Naus',
    source: 'Unsplash',
  },
  {
    id: 'library-books',
    name: 'Library Books',
    description: 'Peaceful library with rows of books',
    category: 'workspace',
    imageUrl:
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
    tags: ['library', 'books', 'study', 'knowledge', 'quiet'],
    artist: 'Alfons Morales',
    source: 'Unsplash',
  },
  {
    id: 'coffee-notes',
    name: 'Coffee & Notes',
    description: 'Cozy study setup with coffee and notebooks',
    category: 'workspace',
    imageUrl:
      'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
    tags: ['coffee', 'notes', 'cozy', 'study', 'warm'],
    artist: 'Estée Janssens',
    source: 'Unsplash',
  },
  {
    id: 'window-view',
    name: 'Window View',
    description: 'Inspiring window view with natural light',
    category: 'workspace',
    imageUrl:
      'https://images.unsplash.com/photo-1498050108023-c5249f4df085?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2072&q=80',
    tags: ['window', 'light', 'view', 'inspiration', 'bright'],
    artist: 'Christopher Gower',
    source: 'Unsplash',
  },

  // Abstract Category
  {
    id: 'fluid-colors',
    name: 'Fluid Colors',
    description: 'Smooth flowing colors in calming tones',
    category: 'abstract',
    imageUrl:
      'https://images.unsplash.com/photo-1557672172-298e090bd0f1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
    tags: ['fluid', 'colors', 'abstract', 'flowing', 'calm'],
    artist: 'Milad Fakurian',
    source: 'Unsplash',
  },
  {
    id: 'geometric-shapes',
    name: 'Geometric Shapes',
    description: 'Modern geometric composition in muted colors',
    category: 'abstract',
    imageUrl:
      'https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2069&q=80',
    tags: ['geometric', 'shapes', 'modern', 'composition', 'muted'],
    artist: 'Pawel Czerwinski',
    source: 'Unsplash',
  },
  {
    id: 'watercolor-abstract',
    name: 'Watercolor Abstract',
    description: 'Soft watercolor patterns in peaceful tones',
    category: 'abstract',
    imageUrl:
      'https://images.unsplash.com/photo-1541961017774-22349e4a1262?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2064&q=80',
    tags: ['watercolor', 'abstract', 'soft', 'peaceful', 'artistic'],
    artist: 'Lucas Benjamin',
    source: 'Unsplash',
  },
  {
    id: 'light-rays',
    name: 'Light Rays',
    description: 'Abstract light patterns creating depth and focus',
    category: 'abstract',
    imageUrl:
      'https://images.unsplash.com/photo-1550745165-9bc0b252726f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
    tags: ['light', 'rays', 'depth', 'focus', 'ethereal'],
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
    id: 'all',
    name: 'All Backgrounds',
    description: 'Browse all available backgrounds',
    count: BACKGROUND_LIBRARY.length,
  },
  {
    id: 'nature',
    name: 'Nature',
    description: 'Natural landscapes and peaceful outdoor scenes',
    count: categoryCounts.nature || 0,
  },
  {
    id: 'minimalist',
    name: 'Minimalist',
    description: 'Clean, simple backgrounds for maximum focus',
    count: categoryCounts.minimalist || 0,
  },
  {
    id: 'workspace',
    name: 'Workspace',
    description: 'Productivity-focused environments and study spaces',
    count: categoryCounts.workspace || 0,
  },
  {
    id: 'abstract',
    name: 'Abstract',
    description: 'Artistic patterns and modern compositions',
    count: categoryCounts.abstract || 0,
  },
]

// Utility functions
export const getBackgroundsByCategory = (category: string): BackgroundImage[] => {
  if (category === 'all') return BACKGROUND_LIBRARY
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

export const searchBackgrounds = (query: string): BackgroundImage[] => {
  const lowercaseQuery = query.toLowerCase()
  return BACKGROUND_LIBRARY.filter(
    bg =>
      bg.name.toLowerCase().includes(lowercaseQuery) ||
      bg.description.toLowerCase().includes(lowercaseQuery) ||
      bg.tags.some(tag => tag.toLowerCase().includes(lowercaseQuery))
  )
}
