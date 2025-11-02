import React, { useState } from 'react';
import { 
  Download, 
  Share2, 
  Copy, 
  FileDown, 
  BarChart3,
  Clock,
  Target,
  TrendingUp
} from 'lucide-react';
import { useAnalyticsStore } from '../../stores/analyticsStore';

interface SocialShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  shareData: {
    completedPomodoros: number;
    totalStudyTime: number;
    currentStreak: number;
    completionRate: number;
    timeRange: string;
  };
}

const SocialShareModal: React.FC<SocialShareModalProps> = ({ 
  isOpen, 
  onClose, 
  shareData 
}) => {
  const [copySuccess, setCopySuccess] = useState(false);

  if (!isOpen) return null;

  const formatTime = (minutes: number): string => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return `${hours}h ${mins}m`;
    }
    return `${mins}m`;
  };

  const generateShareText = (): string => {
    return `🍅 My Ketchew Productivity Stats (${shareData.timeRange}):\\n\\n` +
           `✅ ${shareData.completedPomodoros} Pomodoros Completed\\n` +
           `⏰ ${formatTime(shareData.totalStudyTime)} Study Time\\n` +
           `🔥 ${shareData.currentStreak} Day Streak\\n` +
           `📊 ${Math.round(shareData.completionRate)}% Completion Rate\\n\\n` +
           `#Productivity #PomodoroTechnique #FocusTime #Ketchew`;
  };

  const shareToTwitter = () => {
    const text = encodeURIComponent(generateShareText().replace(/\\n/g, '\\n'));
    const url = `https://twitter.com/intent/tweet?text=${text}`;
    window.open(url, '_blank');
  };

  const shareToLinkedIn = () => {
    const text = encodeURIComponent(generateShareText().replace(/\\n/g, ' '));
    const url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.origin)}&text=${text}`;
    window.open(url, '_blank');
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(generateShareText().replace(/\\n/g, '\\n'));
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center">
            <Share2 className="w-5 h-5 mr-2" />
            Share Your Progress
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            ✕
          </button>
        </div>

        {/* Preview */}
        <div className="bg-gray-50 rounded-lg p-4 mb-4">
          <div className="text-sm text-gray-800 whitespace-pre-line">
            {generateShareText().replace(/\\n/g, '\\n')}
          </div>
        </div>

        {/* Share buttons */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <button
            onClick={shareToTwitter}
            className="flex items-center justify-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            <span className="mr-2">🐦</span>
            Twitter
          </button>
          <button
            onClick={shareToLinkedIn}
            className="flex items-center justify-center px-4 py-2 bg-blue-700 text-white rounded-lg hover:bg-blue-800 transition-colors"
          >
            <span className="mr-2">💼</span>
            LinkedIn
          </button>
        </div>

        {/* Copy button */}
        <button
          onClick={copyToClipboard}
          className={`w-full flex items-center justify-center px-4 py-2 rounded-lg transition-colors ${
            copySuccess 
              ? 'bg-green-500 text-white' 
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          <Copy className="w-4 h-4 mr-2" />
          {copySuccess ? 'Copied!' : 'Copy to Clipboard'}
        </button>
      </div>
    </div>
  );
};

interface DataExportToolsProps {
  className?: string;
}

export const DataExportTools: React.FC<DataExportToolsProps> = ({ className = '' }) => {
  const [showShareModal, setShowShareModal] = useState(false);
  const [selectedTimeRange, setSelectedTimeRange] = useState<'week' | 'month' | 'all'>('week');
  
  const {
    streak,
    exportData,
    getRecentSessions,
    getProductivityInsights
  } = useAnalyticsStore();

  // Calculate share data based on recent sessions
  const shareData = React.useMemo(() => {
    const recentSessions = getRecentSessions(selectedTimeRange === 'week' ? 7 : selectedTimeRange === 'month' ? 30 : 365);
    const insights = getProductivityInsights();
    
    const completedPomodoros = recentSessions.filter(s => s.completed && s.phase === 'study').length;
    const totalStudyTime = recentSessions
      .filter(s => s.completed && s.phase === 'study')
      .reduce((sum, s) => sum + s.duration, 0);
    
    return {
      completedPomodoros,
      totalStudyTime,
      currentStreak: streak.current,
      completionRate: insights.completionRate,
      timeRange: selectedTimeRange === 'week' ? 'This Week' : selectedTimeRange === 'month' ? 'This Month' : 'All Time'
    };
  }, [getRecentSessions, getProductivityInsights, streak.current, selectedTimeRange]);

  const handleExport = (format: 'csv' | 'json') => {
    const data = exportData(format, selectedTimeRange);
    const blob = new Blob([data], { 
      type: format === 'csv' ? 'text/csv' : 'application/json' 
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ketchew-analytics-${selectedTimeRange}-${new Date().toISOString().split('T')[0]}.${format}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const generateProductivityReport = () => {
    const insights = getProductivityInsights();
    const recentSessions = getRecentSessions(30);
    
    const report = `
# Ketchew Productivity Report
Generated: ${new Date().toLocaleDateString()}

## Overview
- Total Sessions: ${recentSessions.length}
- Completed Pomodoros: ${recentSessions.filter(s => s.completed && s.phase === 'study').length}
- Total Study Time: ${Math.round(recentSessions.filter(s => s.completed && s.phase === 'study').reduce((sum, s) => sum + s.duration, 0) / 60 * 10) / 10} hours
- Current Streak: ${streak.current} days
- Longest Streak: ${streak.longest} days
- Completion Rate: ${Math.round(insights.completionRate)}%

## Productivity Insights
- Most Productive Hour: ${insights.mostProductiveHour}:00
- Average Session Length: ${Math.round(insights.averageSessionLength)} minutes
- Weekly Distribution:
${Object.entries(insights.weekdayProductivity)
  .map(([day, count]) => `  - ${day}: ${count} sessions`)
  .join('\\n')}

## Monthly Trend
${insights.monthlyTrend.slice(-6).map(month => 
  `- ${month.month}: ${month.pomodoros} pomodoros`
).join('\\n')}

---
Generated by Ketchew - Pomodoro Timer with Analytics
    `.trim();

    const blob = new Blob([report], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ketchew-productivity-report-${new Date().toISOString().split('T')[0]}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <>
      <div className={`space-y-4 ${className}`}>
        {/* Export Controls */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <Download className="w-5 h-5 mr-2" />
            Export Data
          </h3>
          
          {/* Time Range Selector */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Time Range
            </label>
            <select
              value={selectedTimeRange}
              onChange={(e) => setSelectedTimeRange(e.target.value as 'week' | 'month' | 'all')}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="week">Last 7 Days</option>
              <option value="month">Last 30 Days</option>
              <option value="all">All Time</option>
            </select>
          </div>

          {/* Export Buttons */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <button
              onClick={() => handleExport('csv')}
              className="flex items-center justify-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              <FileDown className="w-4 h-4 mr-2" />
              CSV
            </button>
            <button
              onClick={() => handleExport('json')}
              className="flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <FileDown className="w-4 h-4 mr-2" />
              JSON
            </button>
            <button
              onClick={generateProductivityReport}
              className="flex items-center justify-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              <BarChart3 className="w-4 h-4 mr-2" />
              Report
            </button>
          </div>
        </div>

        {/* Social Sharing */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <Share2 className="w-5 h-5 mr-2" />
            Share Your Progress
          </h3>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Share Time Range
            </label>
            <select
              value={selectedTimeRange}
              onChange={(e) => setSelectedTimeRange(e.target.value as 'week' | 'month' | 'all')}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="week">This Week</option>
              <option value="month">This Month</option>
              <option value="all">All Time</option>
            </select>
          </div>

          {/* Preview Stats */}
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="text-center p-3 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600 flex items-center justify-center">
                <Target className="w-5 h-5 mr-1" />
                {shareData.completedPomodoros}
              </div>
              <div className="text-sm text-blue-700">Pomodoros</div>
            </div>
            <div className="text-center p-3 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600 flex items-center justify-center">
                <Clock className="w-5 h-5 mr-1" />
                {Math.round(shareData.totalStudyTime / 60 * 10) / 10}h
              </div>
              <div className="text-sm text-green-700">Study Time</div>
            </div>
            <div className="text-center p-3 bg-orange-50 rounded-lg">
              <div className="text-2xl font-bold text-orange-600 flex items-center justify-center">
                <TrendingUp className="w-5 h-5 mr-1" />
                {shareData.currentStreak}
              </div>
              <div className="text-sm text-orange-700">Day Streak</div>
            </div>
            <div className="text-center p-3 bg-purple-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600 flex items-center justify-center">
                <BarChart3 className="w-5 h-5 mr-1" />
                {Math.round(shareData.completionRate)}%
              </div>
              <div className="text-sm text-purple-700">Completion</div>
            </div>
          </div>

          <button
            onClick={() => setShowShareModal(true)}
            className="w-full flex items-center justify-center px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all"
          >
            <Share2 className="w-4 h-4 mr-2" />
            Share on Social Media
          </button>
        </div>
      </div>

      {/* Social Share Modal */}
      <SocialShareModal
        isOpen={showShareModal}
        onClose={() => setShowShareModal(false)}
        shareData={shareData}
      />
    </>
  );
};
