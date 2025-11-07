/**
 * AudioGenerator - Utility for generating ambient sounds using Web Audio API
 * This provides a fallback for when external sound URLs fail due to CORS or availability issues
 */

export class AudioGenerator {
  private audioContext: AudioContext | null = null
  private currentSources: AudioNode[] = []
  private gainNode: GainNode | null = null

  constructor() {
    this.initializeAudioContext()
  }

  private initializeAudioContext() {
    try {
      const AudioContextClass =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext

      if (AudioContextClass) {
        this.audioContext = new AudioContextClass()
      }
    } catch (error) {
      console.warn('Web Audio API not supported:', error)
    }
  }

  private async ensureAudioContext() {
    if (!this.audioContext) {
      this.initializeAudioContext()
    }

    if (this.audioContext && this.audioContext.state === 'suspended') {
      try {
        await this.audioContext.resume()
      } catch (error) {
        console.warn('Failed to resume audio context:', error)
      }
    }

    return this.audioContext
  }

  async generateSound(type: string): Promise<AudioNode | null> {
    try {
      const context = await this.ensureAudioContext()
      if (!context) {
        console.warn('No audio context available')
        return null
      }

      // Stop any existing sounds
      this.stop()

      // Create main gain node for volume control
      this.gainNode = context.createGain()
      this.gainNode.gain.setValueAtTime(0.3, context.currentTime)
      this.gainNode.connect(context.destination)

      console.log('Generating sound:', type)

      switch (type.toLowerCase()) {
        case 'rain':
          return this.generateRain(context)
        case 'stream':
          return this.generateStream(context)
        case 'ocean':
          return this.generateOcean(context)
        case 'forest':
          return this.generateForest(context)
        case 'whitenoise':
          return this.generateWhiteNoise(context)
        case 'brownnoise':
          return this.generateBrownNoise(context)
        case 'pinknoise':
          return this.generatePinkNoise(context)
        case 'beep':
          return this.generateBeep(context)
        case 'bell':
          return this.generateBell(context)
        case 'chime':
          return this.generateChime(context)
        case 'binaural-alpha':
          return this.generateBinauralBeats(context, 10) // 10Hz alpha waves
        case 'binaural-theta':
          return this.generateBinauralBeats(context, 6) // 6Hz theta waves
        default:
          console.log('Unknown sound type, generating white noise:', type)
          return this.generateWhiteNoise(context)
      }
    } catch (error) {
      console.error('Error generating sound:', error)
      return null
    }
  }

  private generateRain(context: AudioContext): AudioNode {
    // Create multiple noise sources to simulate rain
    const bufferSize = context.sampleRate * 2 // 2 seconds
    const buffer = context.createBuffer(1, bufferSize, context.sampleRate)
    const channelData = buffer.getChannelData(0)

    // Generate filtered noise that sounds like rain
    for (let i = 0; i < bufferSize; i++) {
      channelData[i] = (Math.random() * 2 - 1) * 0.3
    }

    const source = context.createBufferSource()
    source.buffer = buffer
    source.loop = true

    // Apply filtering to make it sound more like rain
    const filter = context.createBiquadFilter()
    filter.type = 'highpass'
    filter.frequency.setValueAtTime(1000, context.currentTime)
    filter.Q.setValueAtTime(0.5, context.currentTime)

    const filter2 = context.createBiquadFilter()
    filter2.type = 'lowpass'
    filter2.frequency.setValueAtTime(4000, context.currentTime)
    filter2.Q.setValueAtTime(1, context.currentTime)

    source.connect(filter)
    filter.connect(filter2)
    filter2.connect(this.gainNode!)

    source.start()
    this.currentSources.push(source)
    return source
  }

  private generateStream(context: AudioContext): AudioNode {
    // Generate bubbling water sound
    const bufferSize = context.sampleRate * 4
    const buffer = context.createBuffer(1, bufferSize, context.sampleRate)
    const channelData = buffer.getChannelData(0)

    // Create water-like sound with varying amplitude
    for (let i = 0; i < bufferSize; i++) {
      const t = i / context.sampleRate
      const noise = Math.random() * 2 - 1
      const envelope = Math.sin(t * 2 * Math.PI * 0.1) * 0.5 + 0.5
      channelData[i] = noise * envelope * 0.2
    }

    const source = context.createBufferSource()
    source.buffer = buffer
    source.loop = true

    // Filter for water-like sound
    const filter = context.createBiquadFilter()
    filter.type = 'bandpass'
    filter.frequency.setValueAtTime(800, context.currentTime)
    filter.Q.setValueAtTime(2, context.currentTime)

    source.connect(filter)
    filter.connect(this.gainNode!)

    source.start()
    this.currentSources.push(source)
    return source
  }

  private generateOcean(context: AudioContext): AudioNode {
    // Generate ocean wave sounds
    const bufferSize = context.sampleRate * 8
    const buffer = context.createBuffer(1, bufferSize, context.sampleRate)
    const channelData = buffer.getChannelData(0)

    for (let i = 0; i < bufferSize; i++) {
      const t = i / context.sampleRate
      const wave = Math.sin(t * 2 * Math.PI * 0.05) * 0.7 + 0.3
      const noise = (Math.random() * 2 - 1) * 0.4
      channelData[i] = noise * wave
    }

    const source = context.createBufferSource()
    source.buffer = buffer
    source.loop = true

    // Low-pass filter for ocean sound
    const filter = context.createBiquadFilter()
    filter.type = 'lowpass'
    filter.frequency.setValueAtTime(1200, context.currentTime)
    filter.Q.setValueAtTime(0.7, context.currentTime)

    source.connect(filter)
    filter.connect(this.gainNode!)

    source.start()
    this.currentSources.push(source)
    return source
  }

  private generateForest(context: AudioContext): AudioNode {
    // Generate forest ambiance with wind and subtle bird sounds
    const bufferSize = context.sampleRate * 6
    const buffer = context.createBuffer(1, bufferSize, context.sampleRate)
    const channelData = buffer.getChannelData(0)

    for (let i = 0; i < bufferSize; i++) {
      const t = i / context.sampleRate
      const wind = Math.sin(t * 2 * Math.PI * 0.03) * 0.3
      const noise = (Math.random() * 2 - 1) * 0.1
      const birds = Math.random() < 0.001 ? Math.sin(t * 2 * Math.PI * 2000) * 0.1 : 0
      channelData[i] = wind + noise + birds
    }

    const source = context.createBufferSource()
    source.buffer = buffer
    source.loop = true

    // Natural filtering for forest sound
    const filter = context.createBiquadFilter()
    filter.type = 'highpass'
    filter.frequency.setValueAtTime(100, context.currentTime)
    filter.Q.setValueAtTime(0.5, context.currentTime)

    source.connect(filter)
    filter.connect(this.gainNode!)

    source.start()
    this.currentSources.push(source)
    return source
  }

  private generateWhiteNoise(context: AudioContext): AudioNode {
    const bufferSize = context.sampleRate * 2
    const buffer = context.createBuffer(1, bufferSize, context.sampleRate)
    const channelData = buffer.getChannelData(0)

    for (let i = 0; i < bufferSize; i++) {
      channelData[i] = Math.random() * 2 - 1
    }

    const source = context.createBufferSource()
    source.buffer = buffer
    source.loop = true
    source.connect(this.gainNode!)

    source.start()
    this.currentSources.push(source)
    return source
  }

  private generateBrownNoise(context: AudioContext): AudioNode {
    const bufferSize = context.sampleRate * 2
    const buffer = context.createBuffer(1, bufferSize, context.sampleRate)
    const channelData = buffer.getChannelData(0)

    let lastOut = 0
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1
      channelData[i] = lastOut = (lastOut + white * 0.02) * 0.99
    }

    const source = context.createBufferSource()
    source.buffer = buffer
    source.loop = true
    source.connect(this.gainNode!)

    source.start()
    this.currentSources.push(source)
    return source
  }

  private generatePinkNoise(context: AudioContext): AudioNode {
    const bufferSize = context.sampleRate * 2
    const buffer = context.createBuffer(1, bufferSize, context.sampleRate)
    const channelData = buffer.getChannelData(0)

    let b0 = 0,
      b1 = 0,
      b2 = 0,
      b3 = 0,
      b4 = 0,
      b5 = 0,
      b6 = 0
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1
      b0 = 0.99886 * b0 + white * 0.0555179
      b1 = 0.99332 * b1 + white * 0.0750759
      b2 = 0.969 * b2 + white * 0.153852
      b3 = 0.8665 * b3 + white * 0.3104856
      b4 = 0.55 * b4 + white * 0.5329522
      b5 = -0.7616 * b5 - white * 0.016898
      channelData[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.11
      b6 = white * 0.115926
    }

    const source = context.createBufferSource()
    source.buffer = buffer
    source.loop = true
    source.connect(this.gainNode!)

    source.start()
    this.currentSources.push(source)
    return source
  }

  private generateBeep(context: AudioContext): AudioNode {
    const oscillator = context.createOscillator()
    oscillator.type = 'sine'
    oscillator.frequency.setValueAtTime(800, context.currentTime)

    const envelope = context.createGain()
    envelope.gain.setValueAtTime(0, context.currentTime)
    envelope.gain.linearRampToValueAtTime(0.3, context.currentTime + 0.01)
    envelope.gain.exponentialRampToValueAtTime(0.01, context.currentTime + 0.5)

    oscillator.connect(envelope)
    envelope.connect(this.gainNode!)

    oscillator.start()
    oscillator.stop(context.currentTime + 0.5)
    this.currentSources.push(oscillator)
    return oscillator
  }

  private generateBell(context: AudioContext): AudioNode {
    // Create bell-like sound with multiple harmonics
    const fundamental = 440
    const oscillators = [1, 2, 3, 4, 5].map(harmonic => {
      const osc = context.createOscillator()
      osc.type = 'sine'
      osc.frequency.setValueAtTime(fundamental * harmonic, context.currentTime)

      const gain = context.createGain()
      gain.gain.setValueAtTime(0, context.currentTime)
      gain.gain.linearRampToValueAtTime(0.1 / harmonic, context.currentTime + 0.01)
      gain.gain.exponentialRampToValueAtTime(0.001, context.currentTime + 2)

      osc.connect(gain)
      gain.connect(this.gainNode!)

      osc.start()
      osc.stop(context.currentTime + 2)
      this.currentSources.push(osc)
      return osc
    })

    return oscillators[0]
  }

  private generateChime(context: AudioContext): AudioNode {
    // Create chime with higher frequencies
    const frequencies = [659, 784, 988, 1175]
    const oscillators = frequencies.map(freq => {
      const osc = context.createOscillator()
      osc.type = 'sine'
      osc.frequency.setValueAtTime(freq, context.currentTime)

      const gain = context.createGain()
      gain.gain.setValueAtTime(0, context.currentTime)
      gain.gain.linearRampToValueAtTime(0.05, context.currentTime + 0.01)
      gain.gain.exponentialRampToValueAtTime(0.001, context.currentTime + 1.5)

      osc.connect(gain)
      gain.connect(this.gainNode!)

      osc.start()
      osc.stop(context.currentTime + 1.5)
      this.currentSources.push(osc)
      return osc
    })

    return oscillators[0]
  }

  private generateBinauralBeats(context: AudioContext, beatFreq: number): AudioNode {
    const baseFreq = 200

    // Left ear
    const oscLeft = context.createOscillator()
    oscLeft.type = 'sine'
    oscLeft.frequency.setValueAtTime(baseFreq, context.currentTime)

    // Right ear
    const oscRight = context.createOscillator()
    oscRight.type = 'sine'
    oscRight.frequency.setValueAtTime(baseFreq + beatFreq, context.currentTime)

    // Create stereo panner for each ear
    const pannerLeft = context.createStereoPanner()
    pannerLeft.pan.setValueAtTime(-1, context.currentTime)

    const pannerRight = context.createStereoPanner()
    pannerRight.pan.setValueAtTime(1, context.currentTime)

    // Connect
    oscLeft.connect(pannerLeft)
    pannerLeft.connect(this.gainNode!)

    oscRight.connect(pannerRight)
    pannerRight.connect(this.gainNode!)

    oscLeft.start()
    oscRight.start()

    this.currentSources.push(oscLeft, oscRight)
    return oscLeft
  }

  setVolume(volume: number) {
    if (this.gainNode) {
      this.gainNode.gain.setValueAtTime(
        Math.max(0, Math.min(1, volume)),
        this.audioContext!.currentTime
      )
    }
  }

  stop() {
    this.currentSources.forEach(source => {
      try {
        if ('stop' in source) {
          ;(source as AudioScheduledSourceNode).stop()
        }
      } catch {
        // Source might already be stopped
      }
    })
    this.currentSources = []
  }

  destroy() {
    this.stop()
    if (this.audioContext) {
      this.audioContext.close()
      this.audioContext = null
    }
  }
}

// Singleton instance
let audioGenerator: AudioGenerator | null = null

export const getAudioGenerator = (): AudioGenerator => {
  if (!audioGenerator) {
    audioGenerator = new AudioGenerator()
  }
  return audioGenerator
}
