import React, { useState, useMemo } from 'react'
import {
  Clock,
  Target,
  TrendingUp,
  Award,
  Download,
  Calendar,
  BarChart3,
  Activity,
  Users,
  Share2,
} from 'lucide-react'
import { useAnalyticsStore } from '../stores/analyticsStore'

export const AnalyticsDashboard: React.FC = () => {
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'year'>('week')
  const [activeTab, setActiveTab] = useState<'overview' | 'insights' | 'export'>('overview')

  const { streak, dailyStats, getRecentSessions, getProductivityInsights, exportData } =
    useAnalyticsStore()

  // Get data for current time range
  const sessions = useMemo(() => {
    const days = timeRange === 'week' ? 7 : timeRange === 'month' ? 30 : 365
    return getRecentSessions(days)
  }, [timeRange, getRecentSessions])

  // Calculate current period stats
  const currentStats = useMemo(() => {
    const studySessions = sessions.filter(s => s.phase === 'study' && s.completed)
    const totalStudyTime = studySessions.reduce((sum, s) => sum + s.duration, 0)
    const totalSessions = sessions.filter(s => s.phase === 'study').length
    const completionRate = totalSessions > 0 ? (studySessions.length / totalSessions) * 100 : 0

    const collaborativeSessions = sessions.filter(s => s.collaborationSession).length
    const soloSessions = studySessions.length - collaborativeSessions

    return {
      completedPomodoros: studySessions.length,
      totalStudyTime,
      completionRate,
      collaborativeSessions,
      soloSessions,
    }
  }, [sessions])

  // Get productivity insights
  const insights = useMemo(() => getProductivityInsights(), [getProductivityInsights])

  // Generate daily breakdown for chart
  const dailyBreakdown = useMemo(() => {
    const days = timeRange === 'week' ? 7 : timeRange === 'month' ? 30 : 90 // Show last 90 days for year view
    const breakdown = []

    for (let i = days - 1; i >= 0; i--) {
      const date = new Date()
      date.setDate(date.getDate() - i)
      const dateStr = date.toISOString().split('T')[0]
      const dayStats = dailyStats[dateStr]

      breakdown.push({
        date: dateStr,
        shortDate: date.toLocaleDateString([], { month: 'short', day: 'numeric' }),
        pomodoros: dayStats?.completedPomodoros || 0,
        studyTime: dayStats?.totalStudyTime || 0,
      })
    }

    return breakdown
  }, [timeRange, dailyStats])

  const maxPomodoros = Math.max(...dailyBreakdown.map(d => d.pomodoros), 1)

  const handleExport = (format: 'csv' | 'json') => {
    const exportTimeRange = timeRange === 'year' ? 'all' : timeRange
    const data = exportData(format, exportTimeRange)
    const blob = new Blob([data], { type: format === 'csv' ? 'text/csv' : 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `ketchew-analytics-${timeRange}.${format}`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const formatTime = (minutes: number) => {
    if (minutes < 60) {
      return `${minutes}m`
    }
    const hours = Math.floor(minutes / 60)
    const remainingMinutes = minutes % 60
    return `${hours}h ${remainingMinutes > 0 ? `${remainingMinutes}m` : ''}`
  }

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Analytics Dashboard</h2>

        <div className="flex items-center gap-2">
          <select
            value={timeRange}
            onChange={e => setTimeRange(e.target.value as 'week' | 'month' | 'year')}
            className="px-3 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          >
            <option value="week">Last 7 days</option>
            <option value="month">Last 30 days</option>
            <option value="year">Last year</option>
          </select>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200 dark:border-gray-700">
        {[
          { id: 'overview', label: 'Overview', icon: BarChart3 },
          { id: 'insights', label: 'Insights', icon: TrendingUp },
          { id: 'export', label: 'Export', icon: Download },
          { id: 'share', label: 'Share', icon: Share2 },
        ].map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setActiveTab(id as typeof activeTab)}
            className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
              activeTab === id
                ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
            }`}
          >
            <Icon className="w-4 h-4" />
            {label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 p-4 overflow-y-auto">
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Key Metrics */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                    <Target className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Completed</p>
                    <p className="text-xl font-bold text-gray-900 dark:text-white">
                      {currentStats.completedPomodoros}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
                    <Clock className="w-5 h-5 text-green-600 dark:text-green-400" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Study Time</p>
                    <p className="text-xl font-bold text-gray-900 dark:text-white">
                      {formatTime(currentStats.totalStudyTime)}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-lg">
                    <Activity className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Success Rate</p>
                    <p className="text-xl font-bold text-gray-900 dark:text-white">
                      {currentStats.completionRate.toFixed(1)}%
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-yellow-100 dark:bg-yellow-900 rounded-lg">
                    <Award className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Streak</p>
                    <p className="text-xl font-bold text-gray-900 dark:text-white">
                      {streak.current} days
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Daily Chart */}
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                  Daily Progress
                </h3>
                <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-blue-500 rounded"></div>
                    Pomodoros
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                {dailyBreakdown.map(day => (
                  <div key={day.date} className="flex items-center gap-3">
                    <div className="w-16 text-xs text-gray-600 dark:text-gray-400">
                      {day.shortDate}
                    </div>
                    <div className="flex-1 bg-gray-100 dark:bg-gray-700 rounded h-6 relative">
                      <div
                        className="bg-blue-500 h-full rounded transition-all duration-300"
                        style={{ width: `${(day.pomodoros / maxPomodoros) * 100}%` }}
                      ></div>
                      <span className="absolute inset-0 flex items-center justify-center text-xs font-medium text-white">
                        {day.pomodoros}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Collaboration vs Solo */}
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                Session Types
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <div className="flex items-center justify-center w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full mx-auto mb-2">
                    <Users className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                  </div>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {currentStats.collaborativeSessions}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Collaborative</p>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full mx-auto mb-2">
                    <Calendar className="w-8 h-8 text-gray-600 dark:text-gray-400" />
                  </div>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {currentStats.soloSessions}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Solo</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'insights' && (
          <div className="space-y-6">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                Productivity Insights
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white mb-2">
                    Most Productive Hour
                  </h4>
                  <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                    {insights.mostProductiveHour}:00
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    Peak performance time
                  </p>
                </div>

                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white mb-2">
                    Average Session Length
                  </h4>
                  <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                    {formatTime(Math.round(insights.averageSessionLength))}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    Typical focus duration
                  </p>
                </div>

                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white mb-2">
                    Completion Rate
                  </h4>
                  <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                    {insights.completionRate.toFixed(1)}%
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    Sessions completed
                  </p>
                </div>

                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white mb-2">Longest Streak</h4>
                  <p className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
                    {streak.longest} days
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Personal best</p>
                </div>
              </div>
            </div>

            {/* Weekly Pattern */}
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                Weekly Pattern
              </h3>

              <div className="space-y-3">
                {Object.entries(insights.weekdayProductivity).map(([day, count]) => (
                  <div key={day} className="flex items-center gap-3">
                    <div className="w-20 text-sm text-gray-600 dark:text-gray-400">{day}</div>
                    <div className="flex-1 bg-gray-100 dark:bg-gray-700 rounded h-4 relative">
                      <div
                        className="bg-gradient-to-r from-blue-500 to-blue-600 h-full rounded transition-all duration-300"
                        style={{
                          width: `${Math.max(
                            (count / Math.max(...Object.values(insights.weekdayProductivity))) *
                              100,
                            count > 0 ? 10 : 0
                          )}%`,
                        }}
                      ></div>
                      <span className="absolute inset-0 flex items-center justify-center text-xs font-medium text-white">
                        {count}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'export' && (
          <div className="space-y-6">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                Export Analytics Data
              </h3>

              <div className="space-y-4">
                <p className="text-gray-600 dark:text-gray-400">
                  Export your productivity data for external analysis or backup purposes. Current
                  selection:{' '}
                  <span className="font-medium">
                    {timeRange === 'week'
                      ? 'Last 7 days'
                      : timeRange === 'month'
                        ? 'Last 30 days'
                        : 'Last year'}
                  </span>
                </p>

                <div className="flex gap-4">
                  <button
                    onClick={() => handleExport('csv')}
                    className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  >
                    <Download className="w-4 h-4" />
                    Export CSV
                  </button>

                  <button
                    onClick={() => handleExport('json')}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <Download className="w-4 h-4" />
                    Export JSON
                  </button>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                Data Summary
              </h3>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-600 dark:text-gray-400">Total Sessions:</span>
                  <span className="font-medium text-gray-900 dark:text-white ml-2">
                    {sessions.length}
                  </span>
                </div>
                <div>
                  <span className="text-gray-600 dark:text-gray-400">Completed Pomodoros:</span>
                  <span className="font-medium text-gray-900 dark:text-white ml-2">
                    {currentStats.completedPomodoros}
                  </span>
                </div>
                <div>
                  <span className="text-gray-600 dark:text-gray-400">Study Time:</span>
                  <span className="font-medium text-gray-900 dark:text-white ml-2">
                    {formatTime(currentStats.totalStudyTime)}
                  </span>
                </div>
                <div>
                  <span className="text-gray-600 dark:text-gray-400">Current Streak:</span>
                  <span className="font-medium text-gray-900 dark:text-white ml-2">
                    {streak.current} days
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
