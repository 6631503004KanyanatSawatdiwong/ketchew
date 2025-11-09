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

    // Layer 1: Light drizzle base - gentle continuous rain
    await this.createLightDrizzleLayer()

    // Layer 2: Occasional light droplets - sparse gentle drops
    this.addLightDroplets()

    // Layer 3: Subtle atmospheric depth
    await this.createDrizzleAtmosphere()

    this.isPlaying = true
    return 'procedural-rain'
  }

  private async createLightDrizzleLayer() {
    if (!this.audioContext || !this.masterGain) return

    // Create gentle drizzle base - much softer than heavy rain
    const drizzleBuffer = this.createNoiseBuffer(4)
    if (!drizzleBuffer) return

    const drizzleSource = this.audioContext.createBufferSource()
    drizzleSource.buffer = drizzleBuffer
    drizzleSource.loop = true

    // Single gentle filter for soft drizzle
    const drizzleFilter = this.audioContext.createBiquadFilter()
    drizzleFilter.type = 'lowpass'
    drizzleFilter.frequency.value = 1200 // Higher cutoff for lighter sound
    drizzleFilter.Q.value = 0.3 // Very gentle filtering

    // Much lower gain for light drizzle
    const drizzleGain = this.audioContext.createGain()
    drizzleGain.gain.value = 0.15 // Much quieter than heavy rain

    // Simple connection for gentle drizzle
    drizzleSource.connect(drizzleFilter)
    drizzleFilter.connect(drizzleGain)
    drizzleGain.connect(this.masterGain)

    drizzleSource.start()
    this.activeNodes.push(drizzleSource, drizzleFilter, drizzleGain)

    // Add gentle variations for light drizzle realism
    this.addDrizzleVariations(drizzleGain)
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

  private async createDrizzleAtmosphere() {
    if (!this.audioContext || !this.masterGain) return

    // Very subtle atmospheric layer for light drizzle
    const atmosphereBuffer = this.createNoiseBuffer(3) // Shorter buffer for lighter atmosphere
    if (!atmosphereBuffer) return

    const atmosphereSource = this.audioContext.createBufferSource()
    atmosphereSource.buffer = atmosphereBuffer
    atmosphereSource.loop = true

    // Gentle atmospheric filtering for drizzle
    const atmosphereFilter = this.audioContext.createBiquadFilter()
    atmosphereFilter.type = 'lowpass'
    atmosphereFilter.frequency.value = 1000 // Lower frequency for softer atmosphere
    atmosphereFilter.Q.value = 0.3 // Very gentle filtering

    const atmosphereGain = this.audioContext.createGain()
    atmosphereGain.gain.value = 0.05 // Much quieter than rain atmosphere

    // Very subtle delay for minimal spatial effect
    const delay = this.audioContext.createDelay(1)
    delay.delayTime.value = 0.08 // Slightly longer delay

    const delayGain = this.audioContext.createGain()
    delayGain.gain.value = 0.08 // Much lower delay gain

    // Connect gentle drizzle atmosphere
    atmosphereSource.connect(atmosphereFilter)
    atmosphereFilter.connect(atmosphereGain)
    atmosphereGain.connect(this.masterGain)

    // Add very subtle delay
    atmosphereFilter.connect(delay)
    delay.connect(delayGain)
    delayGain.connect(this.masterGain)

    atmosphereSource.start()
    this.activeNodes.push(atmosphereSource, atmosphereFilter, atmosphereGain, delay, delayGain)
  }

  async generateCafeSound(): Promise<string> {
    await this.ensureAudioContext()
    if (!this.audioContext || !this.masterGain) {
      throw new Error('Audio context not available')
    }

    this.stopAll()

    // Base café ambience - gentle background noise
    const ambienceBuffer = this.createNoiseBuffer(5)
    if (!ambienceBuffer) throw new Error('Failed to create noise buffer')

    const ambienceSource = this.audioContext.createBufferSource()
    ambienceSource.buffer = ambienceBuffer
    ambienceSource.loop = true

    const cafeFilter = this.audioContext.createBiquadFilter()
    cafeFilter.type = 'lowpass'
    cafeFilter.frequency.value = 800 // Warmer than library for cozy café feel
    cafeFilter.Q.value = 0.6

    const ambienceGain = this.audioContext.createGain()
    ambienceGain.gain.value = 0.06 // Slightly louder than library for café atmosphere

    ambienceSource.connect(cafeFilter)
    cafeFilter.connect(ambienceGain)
    ambienceGain.connect(this.masterGain)

    // Add low chatter sounds
    this.addCafeChatter()

    // Add coffee machine sounds
    this.addCoffeeMachineSounds()

    // Add quiet walking sounds
    this.addWalkingSounds()

    ambienceSource.start()
    this.activeNodes.push(ambienceSource, cafeFilter, ambienceGain)
    this.isPlaying = true

    return 'procedural-cafe'
  }

  async generateNightSound(): Promise<string> {
    await this.ensureAudioContext()
    if (!this.audioContext || !this.masterGain) {
      throw new Error('Audio context not available')
    }

    this.stopAll()

    // Base night ambience - very quiet night air
    const ambienceBuffer = this.createNoiseBuffer(6)
    if (!ambienceBuffer) throw new Error('Failed to create noise buffer')

    const ambienceSource = this.audioContext.createBufferSource()
    ambienceSource.buffer = ambienceBuffer
    ambienceSource.loop = true

    const nightFilter = this.audioContext.createBiquadFilter()
    nightFilter.type = 'lowpass'
    nightFilter.frequency.value = 400 // Very low for quiet night air
    nightFilter.Q.value = 0.4

    const ambienceGain = this.audioContext.createGain()
    ambienceGain.gain.value = 0.02 // Very quiet base night ambience

    ambienceSource.connect(nightFilter)
    nightFilter.connect(ambienceGain)
    ambienceGain.connect(this.masterGain)

    ambienceSource.start()
    this.activeNodes.push(ambienceSource, nightFilter, ambienceGain)
    this.isPlaying = true

    return 'procedural-night'
  }

  async generateStreamSound(): Promise<string> {
    await this.ensureAudioContext()
    if (!this.audioContext || !this.masterGain) {
      throw new Error('Audio context not available')
    }

    this.stopAll()

    // Create base water flow sound - continuous gentle stream
    const streamFlowBuffer = this.createStreamFlowBuffer(6)
    if (!streamFlowBuffer) throw new Error('Failed to create stream flow buffer')

    const streamSource = this.audioContext.createBufferSource()
    streamSource.buffer = streamFlowBuffer
    streamSource.loop = true

    // Stream characteristics - gentle water flow
    const streamLowPass = this.audioContext.createBiquadFilter()
    streamLowPass.type = 'lowpass'
    streamLowPass.frequency.value = 2000
    streamLowPass.Q.value = 0.8

    const streamHighPass = this.audioContext.createBiquadFilter()
    streamHighPass.type = 'highpass'
    streamHighPass.frequency.value = 100
    streamHighPass.Q.value = 0.5

    const streamGain = this.audioContext.createGain()
    streamGain.gain.value = 0.3

    // Connect stream flow chain
    streamSource.connect(streamHighPass)
    streamHighPass.connect(streamLowPass)
    streamLowPass.connect(streamGain)
    streamGain.connect(this.masterGain)

    // Add gentle water flow variations (no bubbling)
    this.addStreamFlowVariations(streamGain)

    streamSource.start()
    this.activeNodes.push(streamSource, streamHighPass, streamLowPass, streamGain)
    this.isPlaying = true

    return 'procedural-stream'
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

  private addLightDroplets() {
    if (!this.audioContext || !this.masterGain) return

    const createLightDroplet = () => {
      if (!this.isPlaying || !this.audioContext || !this.masterGain) return

      // Create very gentle droplet sounds for light drizzle
      const dropBuffer = this.createNoiseBuffer(0.05) // Shorter buffer for lighter drops
      if (!dropBuffer) return

      const dropSource = this.audioContext.createBufferSource()
      dropSource.buffer = dropBuffer

      const dropFilter = this.audioContext.createBiquadFilter()
      dropFilter.type = 'lowpass' // Softer filter for gentle drizzle
      dropFilter.frequency.value = 800 + Math.random() * 600 // 800-1400 Hz (lower than heavy rain)
      dropFilter.Q.value = 1 // Gentle filtering

      const dropGain = this.audioContext.createGain()
      dropGain.gain.value = 0
      dropGain.gain.setValueAtTime(0, this.audioContext.currentTime)
      dropGain.gain.linearRampToValueAtTime(0.015, this.audioContext.currentTime + 0.005) // Much quieter
      dropGain.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + 0.08)

      dropSource.connect(dropFilter)
      dropFilter.connect(dropGain)
      dropGain.connect(this.masterGain)

      dropSource.start()
      dropSource.stop(this.audioContext.currentTime + 0.08)

      // Very sparse droplets for light drizzle
      setTimeout(createLightDroplet, Math.random() * 2000 + 1500) // 1500-3500ms (much less frequent)
    }

    setTimeout(createLightDroplet, 2000)
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

  private addDrizzleVariations(drizzleGain: GainNode) {
    if (!this.audioContext) return

    const drizzleVariation = () => {
      if (!this.isPlaying) return

      // Gentle variation for light drizzle - much subtler than heavy rain
      const drizzleTarget = 0.08 + Math.random() * 0.14 // 0.08-0.22 (very gentle range)

      const duration = 8 + Math.random() * 12 // 8-20 seconds (slower changes)

      drizzleGain.gain.linearRampToValueAtTime(
        drizzleTarget,
        this.audioContext!.currentTime + duration
      )

      setTimeout(drizzleVariation, (duration + Math.random() * 8) * 1000)
    }

    setTimeout(drizzleVariation, 3000)
  }

  private addCafeChatter() {
    if (!this.audioContext || !this.masterGain) return

    const createChatter = () => {
      if (!this.isPlaying || !this.audioContext || !this.masterGain) return

      // Different conversation types for variety
      const chatterTypes = [
        {
          freq: 180 + Math.random() * 250,
          duration: 2 + Math.random() * 4,
          volume: 0.03,
          type: 'distant',
        }, // Distant conversations
        {
          freq: 250 + Math.random() * 300,
          duration: 1.5 + Math.random() * 2.5,
          volume: 0.05,
          type: 'nearby',
        }, // Nearby conversations
        {
          freq: 150 + Math.random() * 200,
          duration: 3 + Math.random() * 5,
          volume: 0.025,
          type: 'murmur',
        }, // Low murmur
      ]

      const chatterType = chatterTypes[Math.floor(Math.random() * chatterTypes.length)]

      // Create low conversation murmur using filtered noise
      const chatterBuffer = this.createNoiseBuffer(1)
      if (!chatterBuffer) return

      const chatterSource = this.audioContext.createBufferSource()
      chatterSource.buffer = chatterBuffer
      chatterSource.loop = true

      // Bandpass filter for human voice frequencies
      const chatterFilter = this.audioContext.createBiquadFilter()
      chatterFilter.type = 'bandpass'
      chatterFilter.frequency.value = chatterType.freq
      chatterFilter.Q.value = 2 + Math.random() * 1 // 2-3 for more realistic voice filtering

      const chatterGain = this.audioContext.createGain()
      chatterGain.gain.value = 0

      const currentTime = this.audioContext.currentTime
      const chatterDuration = chatterType.duration

      // More realistic conversation envelope with fluctuations
      chatterGain.gain.setValueAtTime(0, currentTime)
      chatterGain.gain.linearRampToValueAtTime(chatterType.volume * 0.6, currentTime + 0.3)
      chatterGain.gain.linearRampToValueAtTime(
        chatterType.volume,
        currentTime + chatterDuration * 0.2
      )

      // Add mid-conversation volume fluctuations
      chatterGain.gain.linearRampToValueAtTime(
        chatterType.volume * 0.7,
        currentTime + chatterDuration * 0.5
      )
      chatterGain.gain.linearRampToValueAtTime(
        chatterType.volume * 0.9,
        currentTime + chatterDuration * 0.7
      )
      chatterGain.gain.exponentialRampToValueAtTime(0.001, currentTime + chatterDuration)

      chatterSource.connect(chatterFilter)
      chatterFilter.connect(chatterGain)
      chatterGain.connect(this.masterGain)

      chatterSource.start()
      chatterSource.stop(currentTime + chatterDuration)

      // More frequent chatter for lively café atmosphere
      const nextChatterDelay = (5 + Math.random() * 15) * 1000 // 5-20 seconds between conversations
      setTimeout(createChatter, nextChatterDelay)
    }

    // Start multiple conversation layers
    setTimeout(createChatter, 3000)
    setTimeout(createChatter, 8000)
  }

  private addCoffeeMachineSounds() {
    if (!this.audioContext || !this.masterGain) return

    const createCoffeeMachineSound = () => {
      if (!this.isPlaying || !this.audioContext || !this.masterGain) return

      const machineTypes = [
        { type: 'steam', freq: 2000, duration: 3, volume: 0.08 }, // Steam wand
        { type: 'grind', freq: 1200, duration: 8, volume: 0.05 }, // Coffee grinder
        { type: 'brew', freq: 400, duration: 15, volume: 0.03 }, // Brewing/dripping
      ]

      const machineType = machineTypes[Math.floor(Math.random() * machineTypes.length)]

      // Create coffee machine sound using filtered noise
      const machineBuffer = this.createNoiseBuffer(0.5)
      if (!machineBuffer) return

      const machineSource = this.audioContext.createBufferSource()
      machineSource.buffer = machineBuffer
      machineSource.loop = true

      const machineFilter = this.audioContext.createBiquadFilter()
      machineFilter.type = 'bandpass'
      machineFilter.frequency.value = machineType.freq + Math.random() * 200
      machineFilter.Q.value = 2

      const machineGain = this.audioContext.createGain()
      machineGain.gain.value = 0

      const currentTime = this.audioContext.currentTime
      const duration = machineType.duration + Math.random() * 5

      // Machine operation envelope
      machineGain.gain.setValueAtTime(0, currentTime)
      machineGain.gain.linearRampToValueAtTime(machineType.volume, currentTime + 1)
      machineGain.gain.linearRampToValueAtTime(machineType.volume * 0.8, currentTime + duration - 1)
      machineGain.gain.exponentialRampToValueAtTime(0.001, currentTime + duration)

      machineSource.connect(machineFilter)
      machineFilter.connect(machineGain)
      machineGain.connect(this.masterGain)

      machineSource.start()
      machineSource.stop(currentTime + duration)

      // Schedule next coffee machine sound - realistic café timing
      const nextMachineDelay = (20 + Math.random() * 60) * 1000 // 20-80 seconds between machine operations
      setTimeout(createCoffeeMachineSound, nextMachineDelay)
    }

    setTimeout(createCoffeeMachineSound, 12000) // Start after 12 seconds
  }

  private addWalkingSounds() {
    if (!this.audioContext || !this.masterGain) return

    const createFootstep = () => {
      if (!this.isPlaying || !this.audioContext || !this.masterGain) return

      // Different walking patterns
      const walkingTypes = [
        {
          steps: 3 + Math.random() * 4,
          freq: 100 + Math.random() * 200,
          volume: 0.02,
          type: 'distant',
        }, // 3-7 steps, distant
        {
          steps: 2 + Math.random() * 3,
          freq: 150 + Math.random() * 150,
          volume: 0.035,
          type: 'passing',
        }, // 2-5 steps, passing by
        {
          steps: 1 + Math.random() * 2,
          freq: 80 + Math.random() * 120,
          volume: 0.015,
          type: 'soft',
        }, // 1-3 steps, very soft
      ]

      const walkingType = walkingTypes[Math.floor(Math.random() * walkingTypes.length)]
      let stepCount = 0

      const createStep = () => {
        if (
          !this.isPlaying ||
          !this.audioContext ||
          !this.masterGain ||
          stepCount >= walkingType.steps
        )
          return

        // Create footstep using short filtered noise burst
        const stepBuffer = this.createNoiseBuffer(0.1)
        if (!stepBuffer) return

        const stepSource = this.audioContext.createBufferSource()
        stepSource.buffer = stepBuffer

        // Low-pass filter for muffled footstep sound
        const stepFilter = this.audioContext.createBiquadFilter()
        stepFilter.type = 'lowpass'
        stepFilter.frequency.value = walkingType.freq + Math.random() * 50
        stepFilter.Q.value = 1.5

        const stepGain = this.audioContext.createGain()
        stepGain.gain.value = 0

        const currentTime = this.audioContext.currentTime
        const stepDuration = 0.08 + Math.random() * 0.04 // 0.08-0.12 seconds per step

        // Quick footstep envelope
        stepGain.gain.setValueAtTime(0, currentTime)
        stepGain.gain.linearRampToValueAtTime(walkingType.volume, currentTime + 0.01)
        stepGain.gain.exponentialRampToValueAtTime(0.001, currentTime + stepDuration)

        stepSource.connect(stepFilter)
        stepFilter.connect(stepGain)
        stepGain.connect(this.masterGain)

        stepSource.start()
        stepSource.stop(currentTime + stepDuration)

        stepCount++

        // Schedule next step in walking sequence
        if (stepCount < walkingType.steps) {
          setTimeout(createStep, 400 + Math.random() * 300) // 400-700ms between steps (walking pace)
        }
      }

      createStep()

      // Schedule next walking sequence
      const nextWalkingDelay = (15 + Math.random() * 45) * 1000 // 15-60 seconds between walking sequences
      setTimeout(createFootstep, nextWalkingDelay)
    }

    setTimeout(createFootstep, 20000) // Start after 20 seconds
  }

  private addLivelyCafeChatter() {
    if (!this.audioContext || !this.masterGain) return

    const createLivelyChatter = () => {
      if (!this.isPlaying || !this.audioContext || !this.masterGain) return

      // More active conversation types for bustling café
      const chatterTypes = [
        {
          freq: 200 + Math.random() * 400,
          duration: 1.5 + Math.random() * 3,
          volume: 0.08,
          type: 'animated',
        }, // Animated conversations
        {
          freq: 300 + Math.random() * 500,
          duration: 2 + Math.random() * 4,
          volume: 0.06,
          type: 'group',
        }, // Group discussions
        {
          freq: 150 + Math.random() * 300,
          duration: 1 + Math.random() * 2,
          volume: 0.04,
          type: 'quiet',
        }, // Quieter conversations
        {
          freq: 400 + Math.random() * 600,
          duration: 0.5 + Math.random() * 1.5,
          volume: 0.09,
          type: 'laughter',
        }, // Laughter bursts
      ]

      const chatterType = chatterTypes[Math.floor(Math.random() * chatterTypes.length)]

      const chatterBuffer = this.createNoiseBuffer(0.8)
      if (!chatterBuffer) return

      const chatterSource = this.audioContext.createBufferSource()
      chatterSource.buffer = chatterBuffer
      chatterSource.loop = true

      const chatterFilter = this.audioContext.createBiquadFilter()
      chatterFilter.type = 'bandpass'
      chatterFilter.frequency.value = chatterType.freq
      chatterFilter.Q.value = 1.8 + Math.random() * 0.8 // 1.8-2.6 for varied voice clarity

      const chatterGain = this.audioContext.createGain()
      chatterGain.gain.value = 0

      const currentTime = this.audioContext.currentTime
      const chatterDuration = chatterType.duration

      // More dynamic conversation envelope for lively café
      chatterGain.gain.setValueAtTime(0, currentTime)
      chatterGain.gain.linearRampToValueAtTime(chatterType.volume * 0.3, currentTime + 0.1)
      chatterGain.gain.linearRampToValueAtTime(
        chatterType.volume,
        currentTime + chatterDuration * 0.15
      )

      // Add multiple volume peaks for animated conversations
      if (chatterType.type === 'animated' || chatterType.type === 'laughter') {
        chatterGain.gain.linearRampToValueAtTime(
          chatterType.volume * 0.6,
          currentTime + chatterDuration * 0.4
        )
        chatterGain.gain.linearRampToValueAtTime(
          chatterType.volume * 1.1,
          currentTime + chatterDuration * 0.6
        )
        chatterGain.gain.linearRampToValueAtTime(
          chatterType.volume * 0.8,
          currentTime + chatterDuration * 0.8
        )
      }

      chatterGain.gain.exponentialRampToValueAtTime(0.001, currentTime + chatterDuration)

      chatterSource.connect(chatterFilter)
      chatterFilter.connect(chatterGain)
      chatterGain.connect(this.masterGain)

      chatterSource.start()
      chatterSource.stop(currentTime + chatterDuration)

      // More frequent conversations for bustling atmosphere
      const nextChatterDelay = (2 + Math.random() * 8) * 1000 // 2-10 seconds between conversations
      setTimeout(createLivelyChatter, nextChatterDelay)
    }

    // Start multiple overlapping conversation layers for busy café
    setTimeout(createLivelyChatter, 1000)
    setTimeout(createLivelyChatter, 4000)
    setTimeout(createLivelyChatter, 7000)
  }

  private addCafeSounds() {
    if (!this.audioContext || !this.masterGain) return

    const createCafeSound = () => {
      if (!this.isPlaying || !this.audioContext || !this.masterGain) return

      // Different café activity sounds
      const cafeActivityTypes = [
        { freq: 400 + Math.random() * 600, duration: 0.3, volume: 0.03, type: 'chair' }, // Chair movement
        { freq: 800 + Math.random() * 1200, duration: 0.2, volume: 0.025, type: 'dishes' }, // Dishes/cutlery
        { freq: 200 + Math.random() * 400, duration: 0.5, volume: 0.02, type: 'door' }, // Door sounds
        { freq: 600 + Math.random() * 800, duration: 0.15, volume: 0.04, type: 'cash_register' }, // Cash register beeps
      ]

      const activityType = cafeActivityTypes[Math.floor(Math.random() * cafeActivityTypes.length)]

      const activityBuffer = this.createNoiseBuffer(0.1)
      if (!activityBuffer) return

      const activitySource = this.audioContext.createBufferSource()
      activitySource.buffer = activityBuffer

      const activityFilter = this.audioContext.createBiquadFilter()
      activityFilter.type = 'bandpass'
      activityFilter.frequency.value = activityType.freq
      activityFilter.Q.value = 3

      const activityGain = this.audioContext.createGain()
      activityGain.gain.value = 0

      const currentTime = this.audioContext.currentTime
      const activityDuration = activityType.duration

      // Quick activity sound envelope
      activityGain.gain.setValueAtTime(0, currentTime)
      activityGain.gain.linearRampToValueAtTime(activityType.volume, currentTime + 0.02)
      activityGain.gain.exponentialRampToValueAtTime(0.001, currentTime + activityDuration)

      activitySource.connect(activityFilter)
      activityFilter.connect(activityGain)
      activityGain.connect(this.masterGain)

      activitySource.start()
      activitySource.stop(currentTime + activityDuration)

      // Schedule next café activity sound
      const nextActivityDelay = (10 + Math.random() * 30) * 1000 // 10-40 seconds between activity sounds
      setTimeout(createCafeSound, nextActivityDelay)
    }

    setTimeout(createCafeSound, 15000) // Start after 15 seconds
  }

  private addLibraryFootsteps() {
    if (!this.audioContext || !this.masterGain) return

    const createLibraryFootstep = () => {
      if (!this.isPlaying || !this.audioContext || !this.masterGain) return

      // Library footsteps - 5 steps at a time with much louder volume
      const footstepTypes = [
        { steps: 5, freq: 80 + Math.random() * 120, volume: 0.12, type: 'soft' }, // Soft steps
        { steps: 5, freq: 60 + Math.random() * 100, volume: 0.1, type: 'distant' }, // Distant
        { steps: 5, freq: 100 + Math.random() * 80, volume: 0.15, type: 'careful' }, // Careful walking
      ]

      const footstepType = footstepTypes[Math.floor(Math.random() * footstepTypes.length)]
      let stepCount = 0

      const createStep = () => {
        if (
          !this.isPlaying ||
          !this.audioContext ||
          !this.masterGain ||
          stepCount >= footstepType.steps
        )
          return

        const stepBuffer = this.createNoiseBuffer(0.08)
        if (!stepBuffer) return

        const stepSource = this.audioContext.createBufferSource()
        stepSource.buffer = stepBuffer

        const stepFilter = this.audioContext.createBiquadFilter()
        stepFilter.type = 'lowpass'
        stepFilter.frequency.value = footstepType.freq
        stepFilter.Q.value = 2

        const stepGain = this.audioContext.createGain()
        stepGain.gain.value = 0

        const currentTime = this.audioContext.currentTime
        const stepDuration = 0.1 + Math.random() * 0.05

        // Very quiet footstep envelope
        stepGain.gain.setValueAtTime(0, currentTime)
        stepGain.gain.linearRampToValueAtTime(footstepType.volume, currentTime + 0.02)
        stepGain.gain.exponentialRampToValueAtTime(0.001, currentTime + stepDuration)

        stepSource.connect(stepFilter)
        stepFilter.connect(stepGain)
        stepGain.connect(this.masterGain)

        stepSource.start()
        stepSource.stop(currentTime + stepDuration)

        stepCount++

        if (stepCount < footstepType.steps) {
          setTimeout(createStep, 500 + Math.random() * 400) // 500-900ms between steps (slow library pace)
        }
      }

      createStep()

      // Schedule next footstep sequence - infrequent for quiet library
      const nextFootstepDelay = (15 + Math.random() * 30) * 1000 // 15-45 seconds between sequences
      setTimeout(createLibraryFootstep, nextFootstepDelay)
    }

    setTimeout(createLibraryFootstep, 1000) // Start after 1 second
  }

  private addImmediateLibraryTest() {
    if (!this.audioContext || !this.masterGain) return

    // Create an immediate footstep sound so user knows library is working
    const testBuffer = this.createNoiseBuffer(0.1)
    if (!testBuffer) return

    const testSource = this.audioContext.createBufferSource()
    testSource.buffer = testBuffer

    const testFilter = this.audioContext.createBiquadFilter()
    testFilter.type = 'lowpass'
    testFilter.frequency.value = 150
    testFilter.Q.value = 2

    const testGain = this.audioContext.createGain()
    testGain.gain.value = 0

    const currentTime = this.audioContext.currentTime

    // Immediate test sound envelope
    testGain.gain.setValueAtTime(0, currentTime)
    testGain.gain.linearRampToValueAtTime(0.08, currentTime + 0.02)
    testGain.gain.exponentialRampToValueAtTime(0.001, currentTime + 0.15)

    testSource.connect(testFilter)
    testFilter.connect(testGain)
    testGain.connect(this.masterGain)

    testSource.start()
    testSource.stop(currentTime + 0.15)
  }

  private addDistantWhispers() {
    if (!this.audioContext || !this.masterGain) return

    const createWhisper = () => {
      if (!this.isPlaying || !this.audioContext || !this.masterGain) return

      // Much louder whisper sounds
      const whisperTypes = [
        {
          freq: 150 + Math.random() * 200,
          duration: 1 + Math.random() * 2,
          volume: 0.12,
          type: 'question',
        }, // Quiet question
        {
          freq: 200 + Math.random() * 150,
          duration: 0.5 + Math.random() * 1,
          volume: 0.1,
          type: 'shush',
        }, // Shushing
        {
          freq: 100 + Math.random() * 250,
          duration: 2 + Math.random() * 3,
          volume: 0.11,
          type: 'conversation',
        }, // Whispered conversation
      ]

      const whisperType = whisperTypes[Math.floor(Math.random() * whisperTypes.length)]

      const whisperBuffer = this.createNoiseBuffer(0.5)
      if (!whisperBuffer) return

      const whisperSource = this.audioContext.createBufferSource()
      whisperSource.buffer = whisperBuffer
      whisperSource.loop = true

      const whisperFilter = this.audioContext.createBiquadFilter()
      whisperFilter.type = 'bandpass'
      whisperFilter.frequency.value = whisperType.freq
      whisperFilter.Q.value = 3 // Higher Q for whisper-like filtering

      const whisperGain = this.audioContext.createGain()
      whisperGain.gain.value = 0

      const currentTime = this.audioContext.currentTime
      const whisperDuration = whisperType.duration

      // Very gentle whisper envelope
      whisperGain.gain.setValueAtTime(0, currentTime)
      whisperGain.gain.linearRampToValueAtTime(whisperType.volume, currentTime + 0.3)
      whisperGain.gain.linearRampToValueAtTime(
        whisperType.volume * 0.8,
        currentTime + whisperDuration * 0.7
      )
      whisperGain.gain.exponentialRampToValueAtTime(0.001, currentTime + whisperDuration)

      whisperSource.connect(whisperFilter)
      whisperFilter.connect(whisperGain)
      whisperGain.connect(this.masterGain)

      whisperSource.start()
      whisperSource.stop(currentTime + whisperDuration)

      // Schedule next whisper - very infrequent for library atmosphere
      const nextWhisperDelay = (20 + Math.random() * 40) * 1000 // 20-60 seconds between whispers
      setTimeout(createWhisper, nextWhisperDelay)
    }

    setTimeout(createWhisper, 2000) // Start after 2 seconds
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

  private createStreamFlowBuffer(lengthInSeconds: number): AudioBuffer | null {
    if (!this.audioContext) return null

    const sampleRate = this.audioContext.sampleRate
    const length = sampleRate * lengthInSeconds
    const buffer = this.audioContext.createBuffer(1, length, sampleRate)
    const data = buffer.getChannelData(0)

    // Generate continuous water flow sound
    for (let i = 0; i < length; i++) {
      const time = i / sampleRate

      // Multiple layers for realistic water flow
      const baseFlow = (Math.random() - 0.5) * 2 * 0.4 // Base noise
      const waterTurbulence = Math.sin(time * 8 + Math.random() * 0.2) * 0.3 // Gentle turbulence
      const flowVariation = Math.sin(time * 0.5) * 0.2 // Slow flow variation

      data[i] = (baseFlow + waterTurbulence + flowVariation) * 0.8
    }

    return buffer
  }

  private addStreamFlowVariations(streamGain: GainNode): void {
    if (!this.audioContext || !this.masterGain) return

    // Add gentle flow intensity variations
    const flowOsc = this.audioContext.createOscillator()
    flowOsc.type = 'sine'
    flowOsc.frequency.value = 0.1 // Very slow variation - 10 second cycles

    const flowModGain = this.audioContext.createGain()
    flowModGain.gain.value = 0.05 // Subtle variation

    flowOsc.connect(flowModGain)
    flowModGain.connect(streamGain.gain)

    flowOsc.start()
    this.activeNodes.push(flowOsc, flowModGain)

    // Add occasional water surges
    const scheduleSurge = () => {
      const delay = Math.random() * 15 + 10 // 10-25 seconds between surges

      setTimeout(() => {
        if (this.audioContext && streamGain.gain) {
          const currentGain = 0.3
          const surgeTime = this.audioContext.currentTime

          // Gentle water surge
          streamGain.gain.setValueAtTime(currentGain, surgeTime)
          streamGain.gain.linearRampToValueAtTime(currentGain * 1.3, surgeTime + 2) // Gentle increase
          streamGain.gain.exponentialRampToValueAtTime(currentGain, surgeTime + 8) // Slow return
        }

        if (this.activeNodes.length > 0) {
          scheduleSurge()
        }
      }, delay * 1000)
    }

    scheduleSurge()
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
