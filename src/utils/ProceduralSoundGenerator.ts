/**
 * ProceduralSoundGenerator - Generates ambient sounds using Web Audio API
     this.isPlaying = true
    return 'procedural-ocean'
  }

  async generateTestTone(): Promise<string> {
    console.log('🔧 generateTestTone called')
    await this.ensureAudioContext()
    if (!this.audioContext || !this.masterGain) {
      console.error('❌ Audio context not available')
      throw new Error('Audio context not available')
    }

    console.log('✅ Audio context available, stopping all sounds')
    this.stopAll()

    // Create a pleasant notification "bing" sound
    const primaryOsc = this.audioContext.createOscillator()
    const harmonicOsc = this.audioContext.createOscillator()
    const primaryGain = this.audioContext.createGain()
    const harmonicGain = this.audioContext.createGain()
    const notificationFilter = this.audioContext.createBiquadFilter()

    // Primary frequency - pleasant notification tone
    primaryOsc.type = 'sine'
    primaryOsc.frequency.value = 880 // A5 - bright but not harsh

    // Harmonic for richness - perfect fifth
    harmonicOsc.type = 'sine'
    harmonicOsc.frequency.value = 1320 // E6 - creates pleasant harmony

    // Soft low-pass filter for warmth
    notificationFilter.type = 'lowpass'
    notificationFilter.frequency.value = 3000
    notificationFilter.Q.value = 0.7

    // Quick "bing" envelope - fast attack, gentle decay
    const now = this.audioContext.currentTime
    const duration = 0.3 // Short notification sound

    primaryGain.gain.value = 0
    primaryGain.gain.setValueAtTime(0, now)
    primaryGain.gain.linearRampToValueAtTime(0.2, now + 0.02) // Quick attack
    primaryGain.gain.exponentialRampToValueAtTime(0.001, now + duration) // Natural decay

    harmonicGain.gain.value = 0
    harmonicGain.gain.setValueAtTime(0, now)
    harmonicGain.gain.linearRampToValueAtTime(0.1, now + 0.02) // Softer harmonic
    harmonicGain.gain.exponentialRampToValueAtTime(0.001, now + duration)

    // Connect the notification sound
    primaryOsc.connect(primaryGain)
    harmonicOsc.connect(harmonicGain)
    primaryGain.connect(notificationFilter)
    harmonicGain.connect(notificationFilter)
    notificationFilter.connect(this.masterGain)

    console.log('🎵 Starting test tone oscillators')
    primaryOsc.start(now)
    harmonicOsc.start(now)
    primaryOsc.stop(now + duration)
    harmonicOsc.stop(now + duration)

    // Don't add to activeNodes since it's a short notification
    this.isPlaying = false // Reset immediately since it's just a test

    console.log('✅ Test tone should be playing for', duration, 'seconds')
    return 'procedural-test'
  }

  private async createHeavyRainLayer() {ates rain, forest, and cafe chatter sounds procedurally for better performance
 */

export class ProceduralSoundGenerator {
  private audioContext: AudioContext | null = null
  private masterGain: GainNode | null = null
  private activeNodes: AudioNode[] = []
  private isPlaying = false

  constructor() {
    this.initializeAudioContext()
  }

  private initializeAudioContext() {
    try {
      this.audioContext = new (window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)()
      this.masterGain = this.audioContext.createGain()
      this.masterGain.connect(this.audioContext.destination)
      this.masterGain.gain.value = 0.3
      console.log('🎵 AudioContext initialized, state:', this.audioContext.state)
    } catch (error) {
      console.error('Failed to initialize audio context:', error)
    }
  }

  private async ensureAudioContext() {
    if (!this.audioContext) {
      this.initializeAudioContext()
    }

    if (this.audioContext?.state === 'suspended') {
      try {
        console.log('AudioContext is suspended, attempting to resume...')
        await this.audioContext.resume()
        console.log('AudioContext resumed successfully, state:', this.audioContext.state)
      } catch (error) {
        console.error('Failed to resume audio context:', error)
      }
    } else {
      console.log('AudioContext state:', this.audioContext?.state)
    }
  }

  private createNoiseBuffer(duration: number = 2): AudioBuffer | null {
    if (!this.audioContext) return null

    const sampleRate = this.audioContext.sampleRate
    const frameCount = sampleRate * duration
    const buffer = this.audioContext.createBuffer(2, frameCount, sampleRate)

    for (let channel = 0; channel < buffer.numberOfChannels; channel++) {
      const channelData = buffer.getChannelData(channel)
      for (let i = 0; i < frameCount; i++) {
        channelData[i] = (Math.random() * 2 - 1) * 0.3
      }
    }

    return buffer
  }

  async generateRainSound(): Promise<string> {
    await this.ensureAudioContext()
    if (!this.audioContext || !this.masterGain) {
      throw new Error('Audio context not available')
    }

    this.stopAll()

    // Layer 1: Heavy rain base - continuous rainfall ambience
    await this.createHeavyRainLayer()

    // Layer 2: Individual droplets - sporadic large drops
    this.addRainDroplets()

    // Layer 3: Rain on different surfaces
    this.addRainOnSurfaces()

    // Layer 4: Atmospheric depth with reverb
    await this.createRainAtmosphere()

    // Layer 5: Dynamic weather variations
    this.addWeatherVariations()

    this.isPlaying = true
    return 'procedural-rain'
  }

  private async createHeavyRainLayer() {
    if (!this.audioContext || !this.masterGain) return

    // Create dense rain base with multiple frequency bands
    const heavyRainBuffer = this.createNoiseBuffer(6)
    if (!heavyRainBuffer) return

    const heavyRainSource = this.audioContext.createBufferSource()
    heavyRainSource.buffer = heavyRainBuffer
    heavyRainSource.loop = true

    // Natural filtering for organic rain spectrum
    const lowMidFilter = this.audioContext.createBiquadFilter()
    lowMidFilter.type = 'lowpass'
    lowMidFilter.frequency.value = 800
    lowMidFilter.Q.value = 0.5 // Lower Q for smoother, natural sound

    const midFilter = this.audioContext.createBiquadFilter()
    midFilter.type = 'bandpass'
    midFilter.frequency.value = 1000
    midFilter.Q.value = 0.8 // Gentler filtering

    const highFilter = this.audioContext.createBiquadFilter()
    highFilter.type = 'highpass'
    highFilter.frequency.value = 2000
    highFilter.Q.value = 0.6 // Softer high-frequency roll-off

    // Individual gains for each band
    const lowMidGain = this.audioContext.createGain()
    lowMidGain.gain.value = 0.4

    const midGain = this.audioContext.createGain()
    midGain.gain.value = 0.6

    const highGain = this.audioContext.createGain()
    highGain.gain.value = 0.3

    // Connect low-mid frequency band
    heavyRainSource.connect(lowMidFilter)
    lowMidFilter.connect(lowMidGain)
    lowMidGain.connect(this.masterGain)

    // Connect mid frequency band
    heavyRainSource.connect(midFilter)
    midFilter.connect(midGain)
    midGain.connect(this.masterGain)

    // Connect high frequency band
    heavyRainSource.connect(highFilter)
    highFilter.connect(highGain)
    highGain.connect(this.masterGain)

    heavyRainSource.start()
    this.activeNodes.push(
      heavyRainSource,
      lowMidFilter,
      midFilter,
      highFilter,
      lowMidGain,
      midGain,
      highGain
    )

    // Add subtle band variations for realism
    this.addRainBandVariations(lowMidGain, midGain, highGain)
  }

  private async createRainAtmosphere() {
    if (!this.audioContext || !this.masterGain) return

    // Atmospheric layer with convolver reverb simulation
    const atmosphereBuffer = this.createNoiseBuffer(4)
    if (!atmosphereBuffer) return

    const atmosphereSource = this.audioContext.createBufferSource()
    atmosphereSource.buffer = atmosphereBuffer
    atmosphereSource.loop = true

    // Simple, natural atmospheric layer
    const atmosphereFilter = this.audioContext.createBiquadFilter()
    atmosphereFilter.type = 'lowpass'
    atmosphereFilter.frequency.value = 1500
    atmosphereFilter.Q.value = 0.5

    const atmosphereGain = this.audioContext.createGain()
    atmosphereGain.gain.value = 0.1 // More subtle atmospheric presence

    // Single gentle delay for subtle spatial effect
    const delay = this.audioContext.createDelay(1)
    delay.delayTime.value = 0.05

    const delayGain = this.audioContext.createGain()
    delayGain.gain.value = 0.15

    // Connect simple atmosphere
    atmosphereSource.connect(atmosphereFilter)
    atmosphereFilter.connect(atmosphereGain)
    atmosphereGain.connect(this.masterGain)

    // Add subtle delay
    atmosphereFilter.connect(delay)
    delay.connect(delayGain)
    delayGain.connect(this.masterGain)

    atmosphereSource.start()
    this.activeNodes.push(atmosphereSource, atmosphereFilter, atmosphereGain, delay, delayGain)
  }

  async generateForestSound(): Promise<string> {
    await this.ensureAudioContext()
    if (!this.audioContext || !this.masterGain) {
      throw new Error('Audio context not available')
    }

    this.stopAll()

    // Base forest ambience with filtered noise
    const noiseBuffer = this.createNoiseBuffer(3)
    if (!noiseBuffer) throw new Error('Failed to create noise buffer')

    const ambienceSource = this.audioContext.createBufferSource()
    ambienceSource.buffer = noiseBuffer
    ambienceSource.loop = true

    const forestFilter = this.audioContext.createBiquadFilter()
    forestFilter.type = 'lowpass'
    forestFilter.frequency.value = 800
    forestFilter.Q.value = 0.8

    const ambienceGain = this.audioContext.createGain()
    ambienceGain.gain.value = 0.4

    ambienceSource.connect(forestFilter)
    forestFilter.connect(ambienceGain)
    ambienceGain.connect(this.masterGain)

    // Add bird chirps using oscillators
    this.addBirdChirps()

    // Add wind rustling
    this.addWindRustling()

    ambienceSource.start()
    this.activeNodes.push(ambienceSource, forestFilter, ambienceGain)
    this.isPlaying = true

    return 'procedural-forest'
  }

  async generateOceanSound(): Promise<string> {
    await this.ensureAudioContext()
    if (!this.audioContext || !this.masterGain) {
      throw new Error('Audio context not available')
    }

    this.stopAll()

    // Create continuous wave wash base sound - optimized for focus sessions
    const waveWashBuffer = this.createNoiseBuffer(8) // Longer buffer for better looping
    if (!waveWashBuffer) throw new Error('Failed to create noise buffer')

    const waveWashSource = this.audioContext.createBufferSource()
    waveWashSource.buffer = waveWashBuffer
    waveWashSource.loop = true

    // Gentle low-pass filter for soft, continuous wave wash
    const waveFilter = this.audioContext.createBiquadFilter()
    waveFilter.type = 'lowpass'
    waveFilter.frequency.value = 600 // Slightly lower for more soothing continuous sound
    waveFilter.Q.value = 1.0

    const waveGain = this.audioContext.createGain()
    waveGain.gain.value = 0.4 // Slightly higher base level for better presence

    waveWashSource.connect(waveFilter)
    waveFilter.connect(waveGain)
    waveGain.connect(this.masterGain)

    // Add rhythmic wave washing sounds (waves meeting shore)
    this.addShoreWaves()

    // Add water retreat sounds (wave pulling back)
    this.addWaterRetreat()

    // Add gentle pebble/sand sounds
    this.addShoreTexture()

    // Add gentle wave rhythm variations
    this.addWaveRhythm(waveGain)

    waveWashSource.start()
    this.activeNodes.push(waveWashSource, waveFilter, waveGain)
    this.isPlaying = true

    return 'procedural-ocean'
  }

  private addRainDroplets() {
    if (!this.audioContext || !this.masterGain) return

    const createDroplet = () => {
      if (!this.isPlaying || !this.audioContext || !this.masterGain) return

      // Create individual raindrop sounds using filtered noise for natural sound
      const dropBuffer = this.createNoiseBuffer(0.08)
      if (!dropBuffer) return

      const dropSource = this.audioContext.createBufferSource()
      dropSource.buffer = dropBuffer

      const dropFilter = this.audioContext.createBiquadFilter()
      dropFilter.type = 'bandpass'
      dropFilter.frequency.value = 1000 + Math.random() * 1500 // 1000-2500 Hz
      dropFilter.Q.value = 3 // Lower Q for more natural sound

      const dropGain = this.audioContext.createGain()
      dropGain.gain.value = 0
      dropGain.gain.setValueAtTime(0, this.audioContext.currentTime)
      dropGain.gain.linearRampToValueAtTime(0.04, this.audioContext.currentTime + 0.008)
      dropGain.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + 0.12)

      dropSource.connect(dropFilter)
      dropFilter.connect(dropGain)
      dropGain.connect(this.masterGain)

      dropSource.start()
      dropSource.stop(this.audioContext.currentTime + 0.12)

      // Less frequent droplets for more subtle, natural effect
      setTimeout(createDroplet, Math.random() * 800 + 300) // 300-1100ms
    }

    setTimeout(createDroplet, 800)
  }

  private addRainOnSurfaces() {
    if (!this.audioContext || !this.masterGain) return

    // Rain on leaves/foliage
    const createLeafDrops = () => {
      if (!this.isPlaying || !this.audioContext || !this.masterGain) return

      const leafBuffer = this.createNoiseBuffer(0.3)
      if (!leafBuffer) return

      const leafSource = this.audioContext.createBufferSource()
      leafSource.buffer = leafBuffer

      const leafFilter = this.audioContext.createBiquadFilter()
      leafFilter.type = 'bandpass'
      leafFilter.frequency.value = 1500 + Math.random() * 1500 // 1500-3000 Hz
      leafFilter.Q.value = 1.2 // Gentler filtering

      const leafGain = this.audioContext.createGain()
      leafGain.gain.value = 0
      leafGain.gain.setValueAtTime(0, this.audioContext.currentTime)
      leafGain.gain.linearRampToValueAtTime(0.05, this.audioContext.currentTime + 0.02)
      leafGain.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + 0.4)

      leafSource.connect(leafFilter)
      leafFilter.connect(leafGain)
      leafGain.connect(this.masterGain)

      leafSource.start()
      leafSource.stop(this.audioContext.currentTime + 0.4)

      setTimeout(createLeafDrops, (1 + Math.random() * 3) * 1000) // 1-4 seconds
    }

    // Rain on hard surfaces (roof/pavement) - using noise for natural sound
    const createHardDrops = () => {
      if (!this.isPlaying || !this.audioContext || !this.masterGain) return

      const hardBuffer = this.createNoiseBuffer(0.12)
      if (!hardBuffer) return

      const hardSource = this.audioContext.createBufferSource()
      hardSource.buffer = hardBuffer

      const hardFilter = this.audioContext.createBiquadFilter()
      hardFilter.type = 'bandpass'
      hardFilter.frequency.value = 1200 + Math.random() * 800 // 1200-2000 Hz
      hardFilter.Q.value = 2.5

      const hardGain = this.audioContext.createGain()
      hardGain.gain.value = 0
      hardGain.gain.setValueAtTime(0, this.audioContext.currentTime)
      hardGain.gain.linearRampToValueAtTime(0.025, this.audioContext.currentTime + 0.015)
      hardGain.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + 0.15)

      hardSource.connect(hardFilter)
      hardFilter.connect(hardGain)
      hardGain.connect(this.masterGain)

      hardSource.start()
      hardSource.stop(this.audioContext.currentTime + 0.15)

      setTimeout(createHardDrops, (3 + Math.random() * 8) * 1000) // 3-11 seconds
    }

    setTimeout(createLeafDrops, 1000)
    setTimeout(createHardDrops, 2000)
  }

  private addWeatherVariations() {
    if (!this.audioContext) return

    const weatherChange = () => {
      if (!this.isPlaying) return

      // Simulate gusts and intensity changes
      const intensity = Math.random()

      // Adjust master gain based on weather intensity
      if (this.masterGain) {
        const targetGain = 0.3 + intensity * 0.4 // 0.3 to 0.7
        const duration = 8 + Math.random() * 15 // 8-23 seconds

        this.masterGain.gain.linearRampToValueAtTime(
          targetGain,
          this.audioContext!.currentTime + duration
        )
      }

      setTimeout(weatherChange, (10 + Math.random() * 20) * 1000) // 10-30 seconds
    }

    setTimeout(weatherChange, 3000)
  }

  private addRainBandVariations(lowMidGain: GainNode, midGain: GainNode, highGain: GainNode) {
    if (!this.audioContext) return

    const bandVariation = () => {
      if (!this.isPlaying) return

      // Vary each frequency band independently for realism
      const lowMidTarget = 0.3 + Math.random() * 0.3 // 0.3-0.6
      const midTarget = 0.4 + Math.random() * 0.4 // 0.4-0.8
      const highTarget = 0.2 + Math.random() * 0.3 // 0.2-0.5

      const duration = 5 + Math.random() * 10 // 5-15 seconds

      lowMidGain.gain.linearRampToValueAtTime(
        lowMidTarget,
        this.audioContext!.currentTime + duration
      )

      midGain.gain.linearRampToValueAtTime(midTarget, this.audioContext!.currentTime + duration)

      highGain.gain.linearRampToValueAtTime(highTarget, this.audioContext!.currentTime + duration)

      setTimeout(bandVariation, (duration + Math.random() * 5) * 1000)
    }

    setTimeout(bandVariation, 2000)
  }

  private addBirdChirps() {
    if (!this.audioContext || !this.masterGain) return

    const createBirdChirp = () => {
      if (!this.isPlaying || !this.audioContext || !this.masterGain) return

      const chirpOsc = this.audioContext.createOscillator()
      const chirpGain = this.audioContext.createGain()
      const chirpFilter = this.audioContext.createBiquadFilter()

      chirpOsc.type = 'sine'
      chirpOsc.frequency.value = 800 + Math.random() * 1200 // 800-2000 Hz

      chirpFilter.type = 'bandpass'
      chirpFilter.frequency.value = chirpOsc.frequency.value
      chirpFilter.Q.value = 5

      chirpGain.gain.value = 0
      chirpGain.gain.setValueAtTime(0, this.audioContext.currentTime)
      chirpGain.gain.linearRampToValueAtTime(0.1, this.audioContext.currentTime + 0.05)
      chirpGain.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + 0.3)

      chirpOsc.connect(chirpFilter)
      chirpFilter.connect(chirpGain)
      chirpGain.connect(this.masterGain)

      chirpOsc.start()
      chirpOsc.stop(this.audioContext.currentTime + 0.3)

      // Schedule next chirp
      setTimeout(createBirdChirp, (5 + Math.random() * 10) * 1000) // 5-15 seconds
    }

    setTimeout(createBirdChirp, 2000)
  }

  private addWindRustling() {
    if (!this.audioContext || !this.masterGain) return

    // Create wind rustling with low-frequency oscillation
    const windOsc = this.audioContext.createOscillator()
    const windGain = this.audioContext.createGain()
    const windFilter = this.audioContext.createBiquadFilter()

    windOsc.type = 'sawtooth'
    windOsc.frequency.value = 40 + Math.random() * 60 // 40-100 Hz

    windFilter.type = 'lowpass'
    windFilter.frequency.value = 300
    windFilter.Q.value = 1

    windGain.gain.value = 0.15

    windOsc.connect(windFilter)
    windFilter.connect(windGain)
    windGain.connect(this.masterGain)

    windOsc.start()
    this.activeNodes.push(windOsc, windGain, windFilter)

    // Add wind intensity variations
    const windVariation = () => {
      if (!this.isPlaying || !windGain.gain) return

      const targetGain = 0.1 + Math.random() * 0.1 // 0.1 to 0.2
      const duration = 3 + Math.random() * 5 // 3 to 8 seconds

      windGain.gain.linearRampToValueAtTime(targetGain, this.audioContext!.currentTime + duration)

      setTimeout(windVariation, (duration + Math.random() * 2) * 1000)
    }

    setTimeout(windVariation, 1000)
  }

  private addRealisticFirePops() {
    if (!this.audioContext || !this.masterGain) return

    const createRealisticFirePop = () => {
      if (!this.isPlaying || !this.audioContext || !this.masterGain) return

      // Create more realistic pop with multiple frequency components
      const popType = Math.random()

      if (popType < 0.4) {
        // Sharp snap (wood cracking)
        this.createSharpSnap()
      } else if (popType < 0.7) {
        // Bubble pop (sap/moisture)
        this.createBubblePop()
      } else {
        // Ember spark
        this.createEmberSpark()
      }

      // More realistic timing - fireplace pops are less frequent but more varied
      const nextDelay = 3 + Math.random() * 12 // 3-15 seconds
      setTimeout(createRealisticFirePop, nextDelay * 1000)
    }

    setTimeout(createRealisticFirePop, 4000) // Start after 4 seconds
  }

  private createSharpSnap() {
    if (!this.audioContext || !this.masterGain) return

    const snapOsc = this.audioContext.createOscillator()
    const snapGain = this.audioContext.createGain()
    const snapFilter = this.audioContext.createBiquadFilter()

    snapOsc.type = 'sawtooth'
    snapOsc.frequency.value = 800 + Math.random() * 1200 // 800-2000 Hz

    snapFilter.type = 'lowpass'
    snapFilter.frequency.value = 2500
    snapFilter.Q.value = 1.5

    snapGain.gain.value = 0
    snapGain.gain.setValueAtTime(0, this.audioContext.currentTime)
    snapGain.gain.linearRampToValueAtTime(0.12, this.audioContext.currentTime + 0.003) // Very quick attack
    snapGain.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + 0.15)

    snapOsc.connect(snapFilter)
    snapFilter.connect(snapGain)
    snapGain.connect(this.masterGain)

    snapOsc.start()
    snapOsc.stop(this.audioContext.currentTime + 0.15)
  }

  private createBubblePop() {
    if (!this.audioContext || !this.masterGain) return

    const bubbleOsc = this.audioContext.createOscillator()
    const bubbleGain = this.audioContext.createGain()
    const bubbleFilter = this.audioContext.createBiquadFilter()

    bubbleOsc.type = 'sine'
    bubbleOsc.frequency.value = 200 + Math.random() * 400 // 200-600 Hz

    bubbleFilter.type = 'lowpass'
    bubbleFilter.frequency.value = 800
    bubbleFilter.Q.value = 2

    bubbleGain.gain.value = 0
    bubbleGain.gain.setValueAtTime(0, this.audioContext.currentTime)
    bubbleGain.gain.linearRampToValueAtTime(0.08, this.audioContext.currentTime + 0.02)
    bubbleGain.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + 0.4)

    bubbleOsc.connect(bubbleFilter)
    bubbleFilter.connect(bubbleGain)
    bubbleGain.connect(this.masterGain)

    bubbleOsc.start()
    bubbleOsc.stop(this.audioContext.currentTime + 0.4)
  }

  private createEmberSpark() {
    if (!this.audioContext || !this.masterGain) return

    const sparkOsc = this.audioContext.createOscillator()
    const sparkGain = this.audioContext.createGain()
    const sparkFilter = this.audioContext.createBiquadFilter()

    sparkOsc.type = 'triangle'
    sparkOsc.frequency.value = 1500 + Math.random() * 2000 // 1500-3500 Hz

    sparkFilter.type = 'highpass'
    sparkFilter.frequency.value = 1000
    sparkFilter.Q.value = 0.8

    sparkGain.gain.value = 0
    sparkGain.gain.setValueAtTime(0, this.audioContext.currentTime)
    sparkGain.gain.linearRampToValueAtTime(0.06, this.audioContext.currentTime + 0.01)
    sparkGain.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + 0.8)

    sparkOsc.connect(sparkFilter)
    sparkFilter.connect(sparkGain)
    sparkGain.connect(this.masterGain)

    sparkOsc.start()
    sparkOsc.stop(this.audioContext.currentTime + 0.8)
  }

  private addFireplaceWarmth() {
    if (!this.audioContext || !this.masterGain) return

    // Create multiple warmth layers for realistic fireplace ambience

    // 1. Deep ember rumble
    const emberOsc = this.audioContext.createOscillator()
    const emberGain = this.audioContext.createGain()
    const emberFilter = this.audioContext.createBiquadFilter()

    emberOsc.type = 'sine'
    emberOsc.frequency.value = 45 // Very deep, felt warmth

    emberFilter.type = 'lowpass'
    emberFilter.frequency.value = 120
    emberFilter.Q.value = 0.8

    emberGain.gain.value = 0.12 // More prominent warmth

    emberOsc.connect(emberFilter)
    emberFilter.connect(emberGain)
    emberGain.connect(this.masterGain)

    emberOsc.start()
    this.activeNodes.push(emberOsc, emberGain, emberFilter)

    // 2. Mid-frequency warmth layer
    const midWarmthOsc = this.audioContext.createOscillator()
    const midWarmthGain = this.audioContext.createGain()
    const midWarmthFilter = this.audioContext.createBiquadFilter()

    midWarmthOsc.type = 'triangle'
    midWarmthOsc.frequency.value = 80

    midWarmthFilter.type = 'lowpass'
    midWarmthFilter.frequency.value = 200
    midWarmthFilter.Q.value = 1.2

    midWarmthGain.gain.value = 0.06

    midWarmthOsc.connect(midWarmthFilter)
    midWarmthFilter.connect(midWarmthGain)
    midWarmthGain.connect(this.masterGain)

    midWarmthOsc.start()
    this.activeNodes.push(midWarmthOsc, midWarmthGain, midWarmthFilter)

    // Add realistic warmth variations (fire intensity changes)
    const varyWarmth = () => {
      if (!this.isPlaying || !emberGain.gain || !midWarmthGain.gain) return

      const emberTarget = 0.08 + Math.random() * 0.08 // 0.08 to 0.16
      const midTarget = 0.04 + Math.random() * 0.04 // 0.04 to 0.08
      const duration = 12 + Math.random() * 18 // 12-30 seconds - slower changes like real fire

      emberGain.gain.linearRampToValueAtTime(emberTarget, this.audioContext!.currentTime + duration)
      midWarmthGain.gain.linearRampToValueAtTime(
        midTarget,
        this.audioContext!.currentTime + duration
      )

      setTimeout(varyWarmth, duration * 1000)
    }

    setTimeout(varyWarmth, 5000)
  }

  private addLogSettling() {
    if (!this.audioContext || !this.masterGain) return

    const createLogSettle = () => {
      if (!this.isPlaying || !this.audioContext || !this.masterGain) return

      const settleType = Math.random()

      if (settleType < 0.6) {
        // Heavy log shift - sounds like a log rolling or settling deeper
        this.createHeavyLogShift()
      } else {
        // Light wood adjustment - smaller pieces settling
        this.createLightWoodAdjustment()
      }

      // Realistic timing - logs settle less frequently in established fires
      const nextDelay = 25 + Math.random() * 35 // 25-60 seconds
      setTimeout(createLogSettle, nextDelay * 1000)
    }

    setTimeout(createLogSettle, 15000) // Start after 15 seconds
  }

  private createHeavyLogShift() {
    if (!this.audioContext || !this.masterGain) return

    const logBuffer = this.createNoiseBuffer(1.2)
    if (!logBuffer) return

    const logSource = this.audioContext.createBufferSource()
    logSource.buffer = logBuffer

    const logFilter = this.audioContext.createBiquadFilter()
    logFilter.type = 'lowpass'
    logFilter.frequency.value = 250 + Math.random() * 150 // 250-400 Hz
    logFilter.Q.value = 2

    const logGain = this.audioContext.createGain()
    logGain.gain.value = 0
    logGain.gain.setValueAtTime(0, this.audioContext.currentTime)
    logGain.gain.linearRampToValueAtTime(0.15, this.audioContext.currentTime + 0.05) // Quick start
    logGain.gain.linearRampToValueAtTime(0.12, this.audioContext.currentTime + 0.3) // Sustained
    logGain.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + 2.2) // Long fade

    logSource.connect(logFilter)
    logFilter.connect(logGain)
    logGain.connect(this.masterGain)

    logSource.start()
    logSource.stop(this.audioContext.currentTime + 2.2)
  }

  private createLightWoodAdjustment() {
    if (!this.audioContext || !this.masterGain) return

    const adjustBuffer = this.createNoiseBuffer(0.8)
    if (!adjustBuffer) return

    const adjustSource = this.audioContext.createBufferSource()
    adjustSource.buffer = adjustBuffer

    const adjustFilter = this.audioContext.createBiquadFilter()
    adjustFilter.type = 'lowpass'
    adjustFilter.frequency.value = 400 + Math.random() * 200 // 400-600 Hz
    adjustFilter.Q.value = 1.8

    const adjustGain = this.audioContext.createGain()
    adjustGain.gain.value = 0
    adjustGain.gain.setValueAtTime(0, this.audioContext.currentTime)
    adjustGain.gain.linearRampToValueAtTime(0.08, this.audioContext.currentTime + 0.08)
    adjustGain.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + 1.3)

    adjustSource.connect(adjustFilter)
    adjustFilter.connect(adjustGain)
    adjustGain.connect(this.masterGain)

    adjustSource.start()
    adjustSource.stop(this.audioContext.currentTime + 1.3)
  }

  private addShoreWaves() {
    if (!this.audioContext || !this.masterGain) return

    const createShoreWave = () => {
      if (!this.isPlaying || !this.audioContext || !this.masterGain) return

      // Create gentle wave washing onto shore - longer duration for focus
      const waveBuffer = this.createNoiseBuffer(3.5)
      if (!waveBuffer) return

      const waveSource = this.audioContext.createBufferSource()
      waveSource.buffer = waveBuffer

      // Filter for gentle wave wash - mid frequencies for water texture
      const waveFilter = this.audioContext.createBiquadFilter()
      waveFilter.type = 'bandpass'
      waveFilter.frequency.value = 300 + Math.random() * 500 // 300-800 Hz
      waveFilter.Q.value = 1.5

      const waveGain = this.audioContext.createGain()
      waveGain.gain.value = 0
      waveGain.gain.setValueAtTime(0, this.audioContext.currentTime)
      // Longer, more gradual approach - wave washing in
      waveGain.gain.linearRampToValueAtTime(0.25, this.audioContext.currentTime + 0.8)
      waveGain.gain.linearRampToValueAtTime(0.2, this.audioContext.currentTime + 2.0)
      // Slower, more gradual retreat for longer presence
      waveGain.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + 4.5)

      waveSource.connect(waveFilter)
      waveFilter.connect(waveGain)
      waveGain.connect(this.masterGain)

      waveSource.start()
      waveSource.stop(this.audioContext.currentTime + 4.5)

      // Longer intervals for better focus continuity - overlapping waves
      setTimeout(createShoreWave, (12 + Math.random() * 18) * 1000) // 12-30 seconds
    }

    setTimeout(createShoreWave, 3000)
  }

  private addWaterRetreat() {
    if (!this.audioContext || !this.masterGain) return

    const createWaterRetreat = () => {
      if (!this.isPlaying || !this.audioContext || !this.masterGain) return

      // Create the sound of water pulling back over sand/pebbles - longer for focus
      const retreatBuffer = this.createNoiseBuffer(2.5)
      if (!retreatBuffer) return

      const retreatSource = this.audioContext.createBufferSource()
      retreatSource.buffer = retreatBuffer

      // Higher frequency for the trickling, bubbling retreat sound
      const retreatFilter = this.audioContext.createBiquadFilter()
      retreatFilter.type = 'highpass'
      retreatFilter.frequency.value = 1000 + Math.random() * 1500 // 1000-2500 Hz

      const retreatGain = this.audioContext.createGain()
      retreatGain.gain.value = 0
      retreatGain.gain.setValueAtTime(0, this.audioContext.currentTime)
      // More gradual buildup for longer presence
      retreatGain.gain.linearRampToValueAtTime(0.12, this.audioContext.currentTime + 1.0)
      retreatGain.gain.linearRampToValueAtTime(0.08, this.audioContext.currentTime + 2.0)
      // Slower fade for extended retreat sound
      retreatGain.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + 3.5)

      retreatSource.connect(retreatFilter)
      retreatFilter.connect(retreatGain)
      retreatGain.connect(this.masterGain)

      retreatSource.start()
      retreatSource.stop(this.audioContext.currentTime + 3.5)

      // Longer intervals to complement the extended shore waves
      setTimeout(createWaterRetreat, (15 + Math.random() * 20) * 1000) // 15-35 seconds
    }

    setTimeout(createWaterRetreat, 6000)
  }

  private addShoreTexture() {
    if (!this.audioContext || !this.masterGain) return

    const createShoreTexture = () => {
      if (!this.isPlaying || !this.audioContext || !this.masterGain) return

      // Create subtle sand/pebble movement sounds - longer for ambience
      const textureBuffer = this.createNoiseBuffer(1.2)
      if (!textureBuffer) return

      const textureSource = this.audioContext.createBufferSource()
      textureSource.buffer = textureBuffer

      // Mid-high frequencies for sand/pebble texture
      const textureFilter = this.audioContext.createBiquadFilter()
      textureFilter.type = 'bandpass'
      textureFilter.frequency.value = 2000 + Math.random() * 2000 // 2000-4000 Hz
      textureFilter.Q.value = 2

      const textureGain = this.audioContext.createGain()
      textureGain.gain.value = 0
      textureGain.gain.setValueAtTime(0, this.audioContext.currentTime)
      // More gradual texture sounds for ambient continuity
      textureGain.gain.linearRampToValueAtTime(0.04, this.audioContext.currentTime + 0.3)
      textureGain.gain.linearRampToValueAtTime(0.02, this.audioContext.currentTime + 0.8)
      textureGain.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + 1.8)

      textureSource.connect(textureFilter)
      textureFilter.connect(textureGain)
      textureGain.connect(this.masterGain)

      textureSource.start()
      textureSource.stop(this.audioContext.currentTime + 1.8)

      // Longer intervals for better focus - less distracting
      setTimeout(createShoreTexture, (20 + Math.random() * 40) * 1000) // 20-60 seconds
    }

    setTimeout(createShoreTexture, 10000)
  }

  private addWaveRhythm(gainNode: GainNode) {
    if (!this.audioContext) return

    const waveRhythm = () => {
      if (!this.isPlaying || !gainNode.gain) return

      // Longer, more gradual rhythmic variations for sustained focus
      const targetGain = 0.25 + Math.random() * 0.15 // 0.25 to 0.4 - softer range
      const duration = 30 + Math.random() * 60 // 30 to 90 seconds - much longer cycles for focus

      gainNode.gain.linearRampToValueAtTime(targetGain, this.audioContext!.currentTime + duration)

      setTimeout(waveRhythm, (duration + Math.random() * 20) * 1000)
    }

    setTimeout(waveRhythm, 5000)
  }

  setVolume(volume: number) {
    if (this.masterGain) {
      const normalizedVolume = Math.max(0, Math.min(1, volume))
      this.masterGain.gain.value = normalizedVolume
    }
  }

  private addFireFlickering(crackleGain: GainNode) {
    if (!this.audioContext || !crackleGain) return

    const createFlickerVariation = () => {
      if (!this.isPlaying || !crackleGain.gain) return

      // Subtle intensity variations like real fire flickering
      const baseIntensity = 0.15
      const intensityVariation = 0.05 + Math.random() * 0.08 // ±0.05 to 0.13
      const targetGain =
        baseIntensity + (Math.random() > 0.5 ? intensityVariation : -intensityVariation)

      // Ensure we stay within reasonable bounds
      const clampedGain = Math.max(0.08, Math.min(0.25, targetGain))

      const duration = 2 + Math.random() * 4 // 2-6 seconds - like gentle flame dancing

      crackleGain.gain.linearRampToValueAtTime(
        clampedGain,
        this.audioContext!.currentTime + duration
      )

      setTimeout(createFlickerVariation, duration * 1000)
    }

    setTimeout(createFlickerVariation, 3000) // Start after 3 seconds
  }

  stopAll() {
    this.isPlaying = false

    this.activeNodes.forEach(node => {
      try {
        if ('stop' in node && typeof node.stop === 'function') {
          ;(node as AudioScheduledSourceNode).stop()
        }
        if ('disconnect' in node && typeof node.disconnect === 'function') {
          node.disconnect()
        }
      } catch {
        // Ignore errors when stopping nodes
      }
    })

    this.activeNodes = []
  }

  pause() {
    // For procedural sounds, we stop them since Web Audio API doesn't have pause
    this.stopAll()
  }

  resume() {
    // Would need to track current sound type to resume properly
    // For now, user needs to restart the sound
  }

  isCurrentlyPlaying(): boolean {
    return this.isPlaying
  }

  destroy() {
    this.stopAll()
    if (this.audioContext && this.audioContext.state !== 'closed') {
      this.audioContext.close()
    }
  }
}

// Singleton instance
let proceduralSoundGenerator: ProceduralSoundGenerator | null = null

export const getProceduralSoundGenerator = (): ProceduralSoundGenerator => {
  if (!proceduralSoundGenerator) {
    proceduralSoundGenerator = new ProceduralSoundGenerator()
  }
  return proceduralSoundGenerator
}
