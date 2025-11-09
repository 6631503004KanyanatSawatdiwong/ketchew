# Procedural Sound Generation Documentation

## Overview

The Ketchew pomodoro timer now includes procedurally generated ambient sounds using the Web Audio API. These sounds are created in real-time without requiring external audio files, providing high-quality, realistic ambient environments for focus and relaxation.

## Available Sounds

### Rain

- **Description**: Natural rain ambience designed for relaxation and focus
- **Features**:
  - Gentle multi-band filtering for smooth, organic rainfall base
  - Subtle individual droplets using filtered noise (1000-2500Hz)
  - Natural rain on surfaces (leaves, gentle hard surface impacts)
  - Simple atmospheric depth with minimal processing
  - Gentle weather intensity variations for natural flow
  - Organic timing patterns without robotic repetition

### 🌲 Forest

- **Description**: Immersive forest environment
- **Features**:
  - Base forest ambience using filtered noise
  - Procedural bird chirps at random intervals (5-15 seconds)
  - Wind rustling through leaves with intensity variations
  - Natural frequency filtering for authentic outdoor sound
  - Multiple layered audio sources for depth

### Cafe

- **Description**: Cozy cafe atmosphere for productivity
- **Features**:
  - Mid-frequency emphasized background chatter
  - Coffee machine steam sounds (every 30-90 seconds)
  - Random dish clinks and footstep sounds
  - Dynamic chatter volume variations
  - Realistic ambient noise patterns

### Ocean Shore

- **Description**: Intimate waves meeting shore - optimized for Pomodoro focus sessions
- **Features**:
  - Continuous wave wash base sound with gentle filtering (8-second loops)
  - Extended shore waves with longer presence (12-30 second intervals)
  - Gradual water retreat sounds for sustained ambience (15-35 second intervals)
  - Subtle sand and pebble texture sounds (20-60 second intervals)
  - Long-term wave rhythm variations (30-90 seconds) for deep focus

## Technical Implementation

### AudioGenerator Enhancement

The existing `AudioGenerator` class has been enhanced to support both:

- **URL-based sounds**: Using Howler.js for external audio files
- **Procedural sounds**: Using our custom `ProceduralSoundGenerator`

```typescript
// Usage example
const generator = getAudioGenerator()

// Play procedural rain sound
await generator.playSound('procedural-rain')

// Play URL-based sound
await generator.playSound('https://example.com/sound.mp3')
```

### ProceduralSoundGenerator Class

A new utility class that creates ambient sounds using Web Audio API:

```typescript
import { getProceduralSoundGenerator } from './utils/ProceduralSoundGenerator'

const generator = getProceduralSoundGenerator()

// Generate specific sounds
await generator.generateRainSound()
await generator.generateForestSound()
await generator.generateCafeSound()

// Control playback
generator.setVolume(0.5)
generator.stopAll()
```

## Sound Design Principles

### Rain Sound

1. **Natural Rain Base**: Gentle low-pass, bandpass, and high-pass filtering (800Hz, 1000Hz, 2000Hz) with smooth Q values
2. **Organic Droplets**: Filtered noise bursts (1000-2500Hz) with natural decay envelopes (300-1100ms intervals)
3. **Surface Interactions**: Bandpass filtered noise for leaves (1500-3000Hz), gentle noise for hard surfaces
4. **Simple Atmosphere**: Single delay (50ms) with low-pass filtering for subtle spatial effect
5. **Natural Dynamics**: Gentle intensity variations (8-23 seconds) for organic weather flow

### Forest Sound

1. **Ambience**: Low-pass filtered noise (800Hz cutoff) for base forest atmosphere
2. **Bird Sounds**: Sine wave oscillators (800-2000Hz) with bandpass filtering and natural envelope
3. **Wind**: Low-frequency sawtooth waves (40-100Hz) with gentle amplitude modulation
4. **Timing**: Random bird chirps every 5-15 seconds for natural unpredictability

### Cafe Sound

1. **Chatter**: Mid-frequency peaked noise simulation (1500Hz boost, Q=2)
2. **Machine Sounds**: High-pass filtered noise bursts for steam effects
3. **Ambient Details**: Random triangle and square wave pulses for dishes and footsteps
4. **Social Dynamics**: Volume variations simulate conversation flow

### Ocean Shore Sound

1. **Wave Wash Base**: Continuous low-pass filtered noise (600Hz cutoff) with 8-second seamless loops
2. **Shore Waves**: Extended bandpass filtered sounds (300-800Hz) with 4.5-second duration, 12-30 second intervals
3. **Water Retreat**: Longer high-pass filtered trickling (1000-2500Hz) with 3.5-second duration, 15-35 second intervals
4. **Shore Texture**: Extended mid-high frequency ambience (2000-4000Hz) with 1.8-second duration, 20-60 second intervals
5. **Wave Rhythm**: Long-term focus-optimized variations (30-90 seconds) for sustained concentration

## Browser Compatibility

- **Modern Browsers**: Full support in Chrome, Firefox, Safari, Edge
- **Audio Context**: Automatically handles suspended state and user interaction requirements
- **Fallback**: Graceful degradation with error logging for unsupported environments

## Performance Considerations

- **Memory Efficient**: Sounds generated on-demand, not stored
- **CPU Usage**: Optimized for continuous playback without performance impact
- **Resource Management**: Automatic cleanup of audio nodes when stopping
- **Singleton Pattern**: Single generator instance prevents resource conflicts

## Usage in Components

The sounds integrate seamlessly with the existing `SoundSelector` component:

```tsx
// In SoundSelector.tsx
import { SOUND_LIBRARY } from '../data/soundLibrary'

// The sound library now contains:
{
  id: 'rain',
  name: '🌧️ Rain',
  url: 'procedural-rain', // Triggers procedural generation
  description: 'Realistic procedurally generated rain...'
}
```

## Testing

To test procedural sounds in the browser console:

```javascript
// Import and test in browser dev tools
import('./src/utils/testProceduralSounds.js').then(module => {
  window.testProceduralSounds = module.testProceduralSounds
  testProceduralSounds()
})
```

## Future Enhancements

- **Additional Sounds**: Thunder, ocean waves, fireplace, library ambience
- **Customization**: User-adjustable parameters (rain intensity, bird frequency, etc.)
- **Presets**: Different variations of each sound type
- **Mixing**: Ability to layer multiple procedural sounds
- **Visual Feedback**: Real-time audio visualization components

## Benefits

- **No External Dependencies**: No audio file downloads or CORS issues
- **Infinite Variation**: Never-repeating patterns due to randomization
- **Lightweight**: Minimal bandwidth usage
- **Customizable**: Parameters can be adjusted programmatically
- **High Quality**: CD-quality audio generation (44.1kHz sample rate)
