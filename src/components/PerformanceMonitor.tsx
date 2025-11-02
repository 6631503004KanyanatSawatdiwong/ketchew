import React, { useState, useEffect } from 'react'
import { Activity, Clock, MemoryStick, Cpu, Zap } from 'lucide-react'

interface PerformanceWithMemory extends Performance {
  memory?: {
    usedJSHeapSize: number;
    totalJSHeapSize: number;
    jsHeapSizeLimit: number;
  };
}

interface PerformanceMetrics {
  renderTime: number
  memoryUsage: number
  componentCount: number
  storeUpdates: number
  lastUpdate: number
}

const PerformanceMonitor: React.FC = () => {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    renderTime: 0,
    memoryUsage: 0,
    componentCount: 0,
    storeUpdates: 0,
    lastUpdate: Date.now()
  })
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    let updateCount = 0
    const startTime = performance.now()

    const updateMetrics = () => {
      updateCount++
      const currentTime = performance.now()
      
      setMetrics({
        renderTime: Number((currentTime - startTime).toFixed(2)),
        memoryUsage: (performance as PerformanceWithMemory).memory ? 
          Math.round((performance as PerformanceWithMemory).memory!.usedJSHeapSize / 1024 / 1024 * 100) / 100 : 0,
        componentCount: document.querySelectorAll('[data-component]').length || 0,
        storeUpdates: updateCount,
        lastUpdate: currentTime
      })
    }

    // Update metrics every 2 seconds
    const interval = setInterval(updateMetrics, 2000)
    updateMetrics() // Initial update

    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === 'p' && e.ctrlKey && e.shiftKey) {
        e.preventDefault()
        setIsVisible(!isVisible)
      }
    }

    document.addEventListener('keydown', handleKeyPress)
    return () => document.removeEventListener('keydown', handleKeyPress)
  }, [isVisible])

  if (!isVisible) {
    return (
      <div className="fixed bottom-4 left-4 text-xs text-gray-400 bg-white/90 px-2 py-1 rounded shadow">
        Ctrl+Shift+P for performance
      </div>
    )
  }

  const getPerformanceColor = (value: number, thresholds: [number, number]) => {
    if (value < thresholds[0]) return 'text-green-600'
    if (value < thresholds[1]) return 'text-yellow-600'
    return 'text-red-600'
  }

  return (
    <div className="fixed bottom-4 left-4 bg-white border border-gray-200 rounded-lg shadow-lg p-4 max-w-sm z-40">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2">
          <Activity className="w-4 h-4 text-blue-600" />
          <h3 className="text-sm font-semibold text-gray-900">Performance</h3>
        </div>
        <button
          onClick={() => setIsVisible(false)}
          className="text-gray-400 hover:text-gray-600 text-xs"
        >
          ×
        </button>
      </div>

      <div className="space-y-2 text-xs">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-1">
            <Clock className="w-3 h-3 text-gray-500" />
            <span className="text-gray-600">Render Time</span>
          </div>
          <span className={getPerformanceColor(metrics.renderTime, [16, 32])}>
            {metrics.renderTime}ms
          </span>
        </div>

        {metrics.memoryUsage > 0 && (
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-1">
              <MemoryStick className="w-3 h-3 text-gray-500" />
              <span className="text-gray-600">Memory</span>
            </div>
            <span className={getPerformanceColor(metrics.memoryUsage, [50, 100])}>
              {metrics.memoryUsage}MB
            </span>
          </div>
        )}

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-1">
            <Cpu className="w-3 h-3 text-gray-500" />
            <span className="text-gray-600">Components</span>
          </div>
          <span className="text-gray-900">{metrics.componentCount}</span>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-1">
            <Zap className="w-3 h-3 text-gray-500" />
            <span className="text-gray-600">Store Updates</span>
          </div>
          <span className="text-gray-900">{metrics.storeUpdates}</span>
        </div>
      </div>

      <div className="mt-3 pt-2 border-t border-gray-100">
        <div className="flex justify-between text-xs text-gray-500">
          <span>Last Update</span>
          <span>{new Date(metrics.lastUpdate).toLocaleTimeString()}</span>
        </div>
      </div>

      <div className="mt-2 text-xs text-gray-400">
        <p>Press Ctrl+Shift+P to toggle</p>
      </div>
    </div>
  )
}

export default PerformanceMonitor
