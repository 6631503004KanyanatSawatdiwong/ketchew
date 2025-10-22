/**
 * Timer Accuracy Testing Utility
 * Tests timer precision against NFR01 requirement (<1s drift)
 */

interface AccuracyTestResult {
  testDuration: number // in seconds
  expectedDuration: number // in seconds
  actualDuration: number // in seconds
  drift: number // in milliseconds
  driftPercent: number
  isWithinTolerance: boolean
  timestamp: string
}

interface AccuracyTestSuite {
  totalTests: number
  passedTests: number
  failedTests: number
  averageDrift: number
  maxDrift: number
  minDrift: number
  results: AccuracyTestResult[]
}

export class TimerAccuracyTester {
  private testResults: AccuracyTestResult[] = []
  private readonly DRIFT_TOLERANCE_MS = 1000 // NFR01: <1s drift

  /**
   * Test timer accuracy for a specific duration
   */
  async testTimerAccuracy(durationSeconds: number): Promise<AccuracyTestResult> {
    const startTime = performance.now()

    return new Promise(resolve => {
      const timer = setTimeout(() => {
        const actualEndTime = performance.now()
        const actualDuration = actualEndTime - startTime
        const expectedDuration = durationSeconds * 1000
        const drift = Math.abs(actualDuration - expectedDuration)
        const driftPercent = (drift / expectedDuration) * 100

        const result: AccuracyTestResult = {
          testDuration: durationSeconds,
          expectedDuration: expectedDuration,
          actualDuration: actualDuration,
          drift: drift,
          driftPercent: driftPercent,
          isWithinTolerance: drift < this.DRIFT_TOLERANCE_MS,
          timestamp: new Date().toISOString(),
        }

        this.testResults.push(result)
        resolve(result)
      }, durationSeconds * 1000)

      // Clean up on test completion
      return () => clearTimeout(timer)
    })
  }

  /**
   * Run a comprehensive test suite
   */
  async runTestSuite(): Promise<AccuracyTestSuite> {
    console.log('🧪 Starting Timer Accuracy Test Suite...')

    // Test various durations (in seconds)
    const testDurations = [1, 5, 10, 30, 60, 120, 300] // 1s to 5min

    // Clear previous results
    this.testResults = []

    // Run tests sequentially
    for (const duration of testDurations) {
      console.log(`⏱️  Testing ${duration}s timer...`)
      await this.testTimerAccuracy(duration)
    }

    // Calculate statistics
    const totalTests = this.testResults.length
    const passedTests = this.testResults.filter(r => r.isWithinTolerance).length
    const failedTests = totalTests - passedTests

    const drifts = this.testResults.map(r => r.drift)
    const averageDrift = drifts.reduce((sum, drift) => sum + drift, 0) / drifts.length
    const maxDrift = Math.max(...drifts)
    const minDrift = Math.min(...drifts)

    const testSuite: AccuracyTestSuite = {
      totalTests,
      passedTests,
      failedTests,
      averageDrift,
      maxDrift,
      minDrift,
      results: [...this.testResults],
    }

    this.logTestResults(testSuite)
    return testSuite
  }

  /**
   * Test PrecisionTimer class specifically
   */
  async testPrecisionTimer(): Promise<AccuracyTestResult[]> {
    const { PrecisionTimer } = await import('./PrecisionTimer')
    const results: AccuracyTestResult[] = []

    const testDurations = [5000, 10000, 25000] // 5s, 10s, 25s in milliseconds

    for (const durationMs of testDurations) {
      const startTime = performance.now()
      let actualEndTime = 0

      const timer = new PrecisionTimer(
        durationMs,
        () => {}, // onTick
        () => {
          actualEndTime = performance.now()
        }, // onComplete
        100 // tickInterval
      )

      timer.start()

      // Wait for completion
      await new Promise(resolve => {
        const checkCompletion = () => {
          if (actualEndTime > 0) {
            resolve(void 0)
          } else {
            setTimeout(checkCompletion, 50)
          }
        }
        checkCompletion()
      })

      const actualDuration = actualEndTime - startTime
      const drift = Math.abs(actualDuration - durationMs)

      results.push({
        testDuration: durationMs / 1000,
        expectedDuration: durationMs,
        actualDuration: actualDuration,
        drift: drift,
        driftPercent: (drift / durationMs) * 100,
        isWithinTolerance: drift < this.DRIFT_TOLERANCE_MS,
        timestamp: new Date().toISOString(),
      })
    }

    return results
  }

  /**
   * Generate a detailed test report
   */
  private logTestResults(testSuite: AccuracyTestSuite): void {
    console.log('\n📊 Timer Accuracy Test Results')
    console.log('================================')
    console.log(`Total Tests: ${testSuite.totalTests}`)
    console.log(`Passed: ${testSuite.passedTests} ✅`)
    console.log(`Failed: ${testSuite.failedTests} ❌`)
    console.log(`Pass Rate: ${((testSuite.passedTests / testSuite.totalTests) * 100).toFixed(1)}%`)
    console.log(`Average Drift: ${testSuite.averageDrift.toFixed(2)}ms`)
    console.log(`Max Drift: ${testSuite.maxDrift.toFixed(2)}ms`)
    console.log(`Min Drift: ${testSuite.minDrift.toFixed(2)}ms`)

    console.log('\n📋 Individual Test Results:')
    testSuite.results.forEach((result, index) => {
      const status = result.isWithinTolerance ? '✅' : '❌'
      console.log(
        `${index + 1}. ${result.testDuration}s - Drift: ${result.drift.toFixed(2)}ms (${result.driftPercent.toFixed(3)}%) ${status}`
      )
    })

    // NFR01 Compliance Check
    const nfr01Compliant = testSuite.maxDrift < this.DRIFT_TOLERANCE_MS
    console.log(`\n🎯 NFR01 Compliance: ${nfr01Compliant ? '✅ PASSED' : '❌ FAILED'}`)
    console.log(`   Requirement: <1000ms drift`)
    console.log(`   Actual Max Drift: ${testSuite.maxDrift.toFixed(2)}ms`)
  }

  /**
   * Export test results as JSON
   */
  exportResults(): string {
    return JSON.stringify(
      {
        testSuite: {
          timestamp: new Date().toISOString(),
          nfr01Compliant: this.testResults.every(r => r.isWithinTolerance),
          results: this.testResults,
        },
      },
      null,
      2
    )
  }
}

// Global testing functions for console use
export const runTimerAccuracyTest = async () => {
  const tester = new TimerAccuracyTester()
  return await tester.runTestSuite()
}

export const testPrecisionTimer = async () => {
  const tester = new TimerAccuracyTester()
  return await tester.testPrecisionTimer()
}

// Add to window for browser console testing
if (typeof window !== 'undefined') {
  interface WindowWithTestFunctions extends Window {
    runTimerAccuracyTest?: () => Promise<AccuracyTestSuite>
  }
  ;(window as unknown as WindowWithTestFunctions).runTimerAccuracyTest = runTimerAccuracyTest
}
