#!/usr/bin/env node

/**
 * Timer Accuracy Test Runner
 * Command-line script to test NFR01 compliance
 *
 * Usage: npm run test:timer-accuracy
 */

import { TimerAccuracyTester } from '../src/utils/TimerAccuracyTester.js'

async function runComprehensiveTests() {
  console.log('🚀 Ketchew Timer Accuracy Testing Suite')
  console.log('=====================================\n')

  const tester = new TimerAccuracyTester()

  try {
    // Run basic accuracy tests
    console.log('📋 Running Basic Timer Accuracy Tests...')
    const basicResults = await tester.runTestSuite()

    // Run PrecisionTimer specific tests
    console.log('\n🔬 Running PrecisionTimer Class Tests...')
    const precisionResults = await tester.testPrecisionTimer()

    // Generate final compliance report
    console.log('\n📊 Final NFR01 Compliance Report')
    console.log('================================')

    const allResults = [...basicResults.results, ...precisionResults]
    const totalTests = allResults.length
    const passedTests = allResults.filter(r => r.isWithinTolerance).length
    const failedTests = totalTests - passedTests
    const maxDrift = Math.max(...allResults.map(r => r.drift))

    console.log(`Total Tests Executed: ${totalTests}`)
    console.log(`Passed: ${passedTests} ✅`)
    console.log(`Failed: ${failedTests} ${failedTests > 0 ? '❌' : '✅'}`)
    console.log(`Overall Pass Rate: ${((passedTests / totalTests) * 100).toFixed(1)}%`)
    console.log(`Maximum Drift: ${maxDrift.toFixed(2)}ms`)

    // NFR01 final verdict
    const nfr01Compliant = maxDrift < 1000 && failedTests === 0
    console.log(`\n🎯 NFR01 COMPLIANCE: ${nfr01Compliant ? '✅ PASSED' : '❌ FAILED'}`)

    if (nfr01Compliant) {
      console.log('✨ Timer accuracy meets the <1s drift requirement!')
    } else {
      console.log('⚠️  Timer accuracy exceeds the 1s drift tolerance.')
      console.log('   Consider optimizing the PrecisionTimer implementation.')
    }

    // Export results
    const exportPath = './timer-accuracy-report.json'
    const fs = await import('fs')
    fs.writeFileSync(exportPath, tester.exportResults())
    console.log(`\n📄 Detailed report saved to: ${exportPath}`)

    // Exit with appropriate code
    process.exit(nfr01Compliant ? 0 : 1)
  } catch (error) {
    console.error('❌ Test execution failed:', error)
    process.exit(1)
  }
}

// Run the tests if script is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  runComprehensiveTests()
}
