/**
 * High-precision timer with drift correction for pomodoro sessions
 * Ensures accuracy within <1s drift as per NFR01
 */
export class PrecisionTimer {
  private startTime = 0
  private pausedTime = 0
  private totalPausedDuration = 0
  private intervalId: number | null = null
  private isRunning = false
  private isPaused = false

  constructor(
    private duration: number, // duration in milliseconds
    private onTick: (remainingMs: number) => void,
    private onComplete: () => void,
    private tickInterval = 100 // Update every 100ms for smooth UI
  ) {}

  start(): void {
    if (this.isRunning && !this.isPaused) return

    if (this.isPaused) {
      // Resuming from pause
      this.totalPausedDuration += performance.now() - this.pausedTime
      this.isPaused = false
    } else {
      // Starting fresh
      this.startTime = performance.now()
      this.totalPausedDuration = 0
    }

    this.isRunning = true
    this.intervalId = window.setInterval(() => this.tick(), this.tickInterval)
  }

  pause(): void {
    if (!this.isRunning || this.isPaused) return

    this.isPaused = true
    this.pausedTime = performance.now()

    if (this.intervalId) {
      clearInterval(this.intervalId)
      this.intervalId = null
    }
  }

  stop(): void {
    this.isRunning = false
    this.isPaused = false

    if (this.intervalId) {
      clearInterval(this.intervalId)
      this.intervalId = null
    }
  }

  reset(newDuration?: number): void {
    this.stop()

    if (newDuration !== undefined) {
      this.duration = newDuration
    }

    this.startTime = 0
    this.pausedTime = 0
    this.totalPausedDuration = 0

    // Call onTick with the full duration to update UI
    this.onTick(this.duration)
  }

  private tick(): void {
    const now = performance.now()
    const elapsed = now - this.startTime - this.totalPausedDuration
    const remaining = Math.max(0, this.duration - elapsed)

    // Update UI with remaining time
    this.onTick(remaining)

    // Check if timer completed
    if (remaining <= 0) {
      this.stop()
      this.onComplete()
    }
  }

  getState() {
    return {
      isRunning: this.isRunning,
      isPaused: this.isPaused,
      startTime: this.startTime,
      totalPausedDuration: this.totalPausedDuration,
    }
  }

  getRemainingTime(): number {
    if (!this.isRunning) return this.duration

    const now = performance.now()
    const elapsed = now - this.startTime - this.totalPausedDuration
    return Math.max(0, this.duration - elapsed)
  }

  getElapsedTime(): number {
    if (!this.isRunning) return 0

    const now = performance.now()
    return now - this.startTime - this.totalPausedDuration
  }
}
