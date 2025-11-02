import React, { useState, useMemo } from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  Calendar, 
  Clock, 
  Target,
  Award,
  Activity,
  Download,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { useAnalyticsStore } from '../../stores/analyticsStore';
import { DataExportTools } from './DataExportTools';

// Simple Chart Components (since we're not using external charting libraries)
interface BarChartProps {
  data: Array<{ label: string; value: number; color?: string }>;
  maxHeight?: number;
  showValues?: boolean;
}

const SimpleBarChart: React.FC<BarChartProps> = ({ 
  data, 
  maxHeight = 200, 
  showValues = true 
}) => {
  const maxValue = Math.max(...data.map(d => d.value));
  
  return (
    <div className="flex items-end justify-between h-48 p-4 bg-gray-50 rounded-lg">
      {data.map((item, index) => (
        <div key={index} className="flex flex-col items-center space-y-2 flex-1">
          <div className="relative">
            <div
              className={`w-8 ${item.color || 'bg-blue-500'} rounded-t transition-all duration-300`}
              style={{
                height: `${(item.value / maxValue) * maxHeight}px`,
                minHeight: item.value > 0 ? '4px' : '0px'
              }}
            />
            {showValues && item.value > 0 && (
              <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 text-xs font-medium text-gray-600">
                {item.value}
              </div>
            )}
          </div>
          <div className="text-xs text-gray-600 text-center">
            {item.label}
          </div>
        </div>
      ))}
    </div>
  );
};

interface LineChartProps {
  data: Array<{ label: string; value: number }>;
  color?: string;
}

const SimpleLineChart: React.FC<LineChartProps> = ({ data, color = '#3B82F6' }) => {
  const maxValue = Math.max(...data.map(d => d.value));
  const minValue = Math.min(...data.map(d => d.value));
  const range = maxValue - minValue || 1;
  
  const points = data.map((item, index) => {
    const x = (index / (data.length - 1)) * 100;
    const y = 100 - ((item.value - minValue) / range) * 100;
    return `${x},${y}`;
  }).join(' ');
  
  return (
    <div className="relative h-32 p-4 bg-gray-50 rounded-lg">
      <svg
        viewBox="0 0 100 100"
        className="w-full h-full"
        preserveAspectRatio="none"
      >
        <polyline
          fill="none"
          stroke={color}
          strokeWidth="2"
          points={points}
        />
        {data.map((item, index) => {
          const x = (index / (data.length - 1)) * 100;
          const y = 100 - ((item.value - minValue) / range) * 100;
          return (
            <circle
              key={index}
              cx={x}
              cy={y}
              r="2"
              fill={color}
            />
          );
        })}
      </svg>
      <div className="absolute bottom-0 left-0 right-0 flex justify-between text-xs text-gray-600 px-4">
        {data.map((item, index) => (
          <span key={index}>{item.label}</span>
        ))}
      </div>
    </div>
  );
};

// Statistics Card Component
interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: React.ReactNode;
  trend?: 'up' | 'down' | 'stable';
  trendValue?: string;
  color?: 'blue' | 'green' | 'purple' | 'orange';
}

const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  subtitle,
  icon,
  trend,
  trendValue,
  color = 'blue'
}) => {
  const colorClasses = {
    blue: 'bg-blue-500 text-blue-600 border-blue-200',
    green: 'bg-green-500 text-green-600 border-green-200',
    purple: 'bg-purple-500 text-purple-600 border-purple-200',
    orange: 'bg-orange-500 text-orange-600 border-orange-200'
  };

  const trendColors = {
    up: 'text-green-600',
    down: 'text-red-600',
    stable: 'text-gray-600'
  };

  return (
    <div className={`p-6 border rounded-lg bg-white ${colorClasses[color].split(' ')[2]}`}>
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <div className="flex items-center space-x-2 mb-2">
            <div className={`p-2 rounded-lg ${colorClasses[color].split(' ')[0]} bg-opacity-10`}>
              <div className={colorClasses[color].split(' ')[1]}>
                {icon}
              </div>
            </div>
            <h3 className="text-sm font-medium text-gray-700">{title}</h3>
          </div>
          <div className="space-y-1">
            <div className="text-2xl font-bold text-gray-900">{value}</div>
            {subtitle && (
              <div className="text-sm text-gray-600">{subtitle}</div>
            )}
            {trend && trendValue && (
              <div className={`text-sm ${trendColors[trend]} flex items-center space-x-1`}>
                <TrendingUp className="w-3 h-3" />
                <span>{trendValue}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Main Analytics Dashboard Component
export const AnalyticsDashboard: React.FC = () => {
  const [timeRange, setTimeRange] = useState<'day' | 'week' | 'month' | 'year'>('week');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [showExportMenu, setShowExportMenu] = useState(false);
  
  const {
    dailyStats,
    weeklyStats,
    monthlyStats,
    streak,
    getRecentSessions,
    getProductivityInsights,
    exportData
  } = useAnalyticsStore();

  // Calculate data based on selected time range
  const analyticsData = useMemo(() => {
    const insights = getProductivityInsights();
    const recentSessions = getRecentSessions(30);
    
    switch (timeRange) {
      case 'day': {
        const dayStats = dailyStats[selectedDate];
        return {
          title: 'Today',
          completedPomodoros: dayStats?.completedPomodoros || 0,
          totalStudyTime: dayStats?.totalStudyTime || 0,
          totalBreakTime: dayStats?.totalBreakTime || 0,
          completionRate: dayStats ? (dayStats.completedPomodoros / (dayStats.sessions.length || 1)) * 100 : 0,
          sessions: dayStats?.sessions || [],
          chartData: dayStats?.sessions.map((session, index) => ({
            label: `S${index + 1}`,
            value: session.duration,
            color: session.phase === 'study' ? 'bg-blue-500' : 'bg-green-500'
          })) || []
        };
      }
      
      case 'week': {
        const weekStart = getWeekStart(new Date(selectedDate));
        const weekKey = formatWeek(new Date(weekStart));
        const weekStats = weeklyStats[weekKey];
        
        const weekData = weekStats?.days || [];
        
        return {
          title: 'This Week',
          completedPomodoros: weekStats?.completedPomodoros || 0,
          totalStudyTime: weekStats?.totalStudyTime || 0,
          totalBreakTime: weekStats?.totalBreakTime || 0,
          completionRate: weekStats ? (weekStats.completedPomodoros / (weekStats.completedPomodoros + (weekData.reduce((sum, day) => sum + day.sessions.length, 0) - weekStats.completedPomodoros))) * 100 : 0,
          sessions: weekData.flatMap(day => day.sessions),
          chartData: weekData.map(day => ({
            label: new Date(day.date).toLocaleDateString('en', { weekday: 'short' }),
            value: day.completedPomodoros,
            color: 'bg-blue-500'
          }))
        };
      }
      
      case 'month': {
        const monthKey = selectedDate.slice(0, 7); // YYYY-MM
        const monthStatsData = monthlyStats[monthKey];
        
        return {
          title: 'This Month',
          completedPomodoros: monthStatsData?.completedPomodoros || 0,
          totalStudyTime: monthStatsData?.totalStudyTime || 0,
          totalBreakTime: monthStatsData?.totalBreakTime || 0,
          completionRate: monthStatsData ? (monthStatsData.completedPomodoros / Math.max(monthStatsData.weeks.reduce((sum, week) => sum + week.days.reduce((daySum, day) => daySum + day.sessions.length, 0), 0), 1)) * 100 : 0,
          sessions: [],
          chartData: monthStatsData?.weeks.map((week, index) => ({
            label: `W${index + 1}`,
            value: week.completedPomodoros,
            color: 'bg-blue-500'
          })) || []
        };
      }
      
      default:
        return {
          title: 'Overview',
          completedPomodoros: insights.monthlyTrend.reduce((sum, month) => sum + month.pomodoros, 0),
          totalStudyTime: recentSessions.reduce((sum, session) => sum + (session.completed ? session.duration : 0), 0),
          totalBreakTime: 0,
          completionRate: insights.completionRate,
          sessions: recentSessions,
          chartData: insights.monthlyTrend.map(month => ({
            label: month.month.slice(5), // Show MM part
            value: month.pomodoros,
            color: 'bg-blue-500'
          }))
        };
    }
  }, [timeRange, selectedDate, dailyStats, weeklyStats, monthlyStats, getProductivityInsights, getRecentSessions]);

  const insights = getProductivityInsights();

  // Format time helper
  const formatTime = (minutes: number): string => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return `${hours}h ${mins}m`;
    }
    return `${mins}m`;
  };

  // Helper functions
  const getWeekStart = (date: Date): Date => {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1); // Adjust for Monday start
    return new Date(d.setDate(diff));
  };

  const formatWeek = (date: Date): string => {
    const year = date.getFullYear();
    const week = getWeekNumber(date);
    return `${year}-W${week.toString().padStart(2, '0')}`;
  };

  const getWeekNumber = (date: Date): number => {
    const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
    const dayNum = d.getUTCDay() || 7;
    d.setUTCDate(d.getUTCDate() + 4 - dayNum);
    const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
    return Math.ceil((((d.getTime() - yearStart.getTime()) / 86400000) + 1) / 7);
  };

  // Export handlers
  const handleExport = (format: 'csv' | 'json') => {
    const data = exportData(format, timeRange === 'year' ? 'all' : timeRange === 'day' ? 'week' : timeRange);
    const blob = new Blob([data], { 
      type: format === 'csv' ? 'text/csv' : 'application/json' 
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ketchew-analytics-${timeRange}-${selectedDate}.${format}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    setShowExportMenu(false);
  };

  return (
    <div className="space-y-6">
      {/* Header with controls */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Analytics Dashboard</h2>
          <p className="text-gray-600">Track your productivity and pomodoro sessions</p>
        </div>
        
        <div className="flex items-center space-x-3">
          {/* Time Range Selector */}
          <div className="flex bg-gray-100 rounded-lg p-1">
            {['day', 'week', 'month', 'year'].map((range) => (
              <button
                key={range}
                onClick={() => setTimeRange(range as 'day' | 'week' | 'month' | 'year')}
                className={`px-3 py-1 text-sm font-medium rounded-md transition-colors ${
                  timeRange === range
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {range.charAt(0).toUpperCase() + range.slice(1)}
              </button>
            ))}
          </div>
          
          {/* Date Picker */}
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
          
          {/* Export Menu */}
          <div className="relative">
            <button
              onClick={() => setShowExportMenu(!showExportMenu)}
              className="flex items-center space-x-2 px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-medium transition-colors"
            >
              <Download className="w-4 h-4" />
              <span>Export</span>
              {showExportMenu ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
            
            {showExportMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                <div className="p-2">
                  <button
                    onClick={() => handleExport('csv')}
                    className="w-full text-left px-3 py-2 text-sm hover:bg-gray-100 rounded"
                  >
                    Export as CSV
                  </button>
                  <button
                    onClick={() => handleExport('json')}
                    className="w-full text-left px-3 py-2 text-sm hover:bg-gray-100 rounded"
                  >
                    Export as JSON
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Key Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Completed Pomodoros"
          value={analyticsData.completedPomodoros}
          subtitle={analyticsData.title}
          icon={<Target className="w-5 h-5" />}
          color="blue"
        />
        
        <StatCard
          title="Study Time"
          value={formatTime(analyticsData.totalStudyTime)}
          subtitle={analyticsData.title}
          icon={<Clock className="w-5 h-5" />}
          color="green"
        />
        
        <StatCard
          title="Current Streak"
          value={streak.current}
          subtitle={`Best: ${streak.longest}`}
          icon={<Award className="w-5 h-5" />}
          color="purple"
        />
        
        <StatCard
          title="Completion Rate"
          value={`${Math.round(analyticsData.completionRate)}%`}
          subtitle="Sessions completed"
          icon={<Activity className="w-5 h-5" />}
          color="orange"
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sessions Chart */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <BarChart3 className="w-5 h-5 mr-2" />
            {analyticsData.title} Sessions
          </h3>
          <SimpleBarChart 
            data={analyticsData.chartData}
            showValues={true}
          />
        </div>

        {/* Productivity Trend */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <TrendingUp className="w-5 h-5 mr-2" />
            Productivity Trend
          </h3>
          <SimpleLineChart 
            data={insights.monthlyTrend.slice(-7).map(month => ({
              label: month.month.slice(5),
              value: month.pomodoros
            }))}
            color="#10B981"
          />
        </div>
      </div>

      {/* Insights Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Productivity Insights */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Productivity Insights</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Most productive hour</span>
              <span className="font-medium">{insights.mostProductiveHour}:00</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Average session length</span>
              <span className="font-medium">{Math.round(insights.averageSessionLength)} min</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Overall completion rate</span>
              <span className="font-medium">{Math.round(insights.completionRate)}%</span>
            </div>
          </div>
        </div>

        {/* Weekly Distribution */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Weekly Distribution</h3>
          <div className="space-y-3">
            {Object.entries(insights.weekdayProductivity).map(([day, count]) => (
              <div key={day} className="flex items-center">
                <div className="w-16 text-sm text-gray-600">{day.slice(0, 3)}</div>
                <div className="flex-1 bg-gray-200 rounded-full h-2 mx-3">
                  <div
                    className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                    style={{
                      width: `${Math.max(count / Math.max(...Object.values(insights.weekdayProductivity)) * 100, 4)}%`
                    }}
                  />
                </div>
                <div className="w-8 text-sm text-gray-900 font-medium">{count}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Sessions */}
      {analyticsData.sessions.length > 0 && (
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <Calendar className="w-5 h-5 mr-2" />
            Recent Sessions
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-2 font-medium text-gray-700">Date</th>
                  <th className="text-left py-2 font-medium text-gray-700">Time</th>
                  <th className="text-left py-2 font-medium text-gray-700">Phase</th>
                  <th className="text-left py-2 font-medium text-gray-700">Duration</th>
                  <th className="text-left py-2 font-medium text-gray-700">Status</th>
                </tr>
              </thead>
              <tbody>
                {analyticsData.sessions.slice(-10).reverse().map((session) => (
                  <tr key={session.id} className="border-b border-gray-100">
                    <td className="py-2 text-gray-900">
                      {new Date(session.date).toLocaleDateString()}
                    </td>
                    <td className="py-2 text-gray-600">
                      {new Date(session.startTime).toLocaleTimeString([], { 
                        hour: '2-digit', 
                        minute: '2-digit' 
                      })}
                    </td>
                    <td className="py-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        session.phase === 'study' 
                          ? 'bg-blue-100 text-blue-800'
                          : session.phase === 'shortBreak'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-purple-100 text-purple-800'
                      }`}>
                        {session.phase === 'study' ? 'Study' : 
                         session.phase === 'shortBreak' ? 'Short Break' : 'Long Break'}
                      </span>
                    </td>
                    <td className="py-2 text-gray-600">
                      {session.duration} min
                    </td>
                    <td className="py-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        session.completed 
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {session.completed ? 'Completed' : 'Interrupted'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Data Export & Sharing Tools */}
      <DataExportTools />
    </div>
  );
};
