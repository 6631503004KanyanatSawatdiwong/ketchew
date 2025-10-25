import React, { useState } from 'react';
import { Share2, Twitter, Facebook, Copy, Check, Award, TrendingUp } from 'lucide-react';
import { useAnalyticsStore } from '../stores/analyticsStore';

interface SocialSharingProps {
  onClose?: () => void;
}

export const SocialSharing: React.FC<SocialSharingProps> = ({ onClose }) => {
  const [copied, setCopied] = useState(false);
  const [selectedAchievement, setSelectedAchievement] = useState<string>('streak');
  
  const { streak, getProductivityInsights, getRecentSessions } = useAnalyticsStore();
  
  // Get current stats
  const insights = getProductivityInsights();
  const recentSessions = getRecentSessions(7);
  const weeklyPomodoros = recentSessions.filter(s => s.phase === 'study' && s.completed).length;
  const weeklyStudyTime = recentSessions
    .filter(s => s.phase === 'study' && s.completed)
    .reduce((sum, s) => sum + s.duration, 0);

  const achievements = {
    streak: {
      title: `${streak.current} Day Streak!`,
      description: `I've been consistently productive for ${streak.current} days straight using Ketchew!`,
      emoji: '🔥',
      stats: `Current streak: ${streak.current} days | Longest streak: ${streak.longest} days`
    },
    weekly: {
      title: `${weeklyPomodoros} Pomodoros This Week!`,
      description: `Just completed ${weeklyPomodoros} focused work sessions totaling ${Math.round(weeklyStudyTime / 60)}h ${weeklyStudyTime % 60}m of deep work!`,
      emoji: '🍅',
      stats: `This week: ${weeklyPomodoros} sessions | ${Math.round(weeklyStudyTime / 60)}h ${weeklyStudyTime % 60}m focused time`
    },
    productivity: {
      title: `${insights.completionRate.toFixed(1)}% Success Rate!`,
      description: `My focus game is strong! Achieving ${insights.completionRate.toFixed(1)}% completion rate with an average of ${Math.round(insights.averageSessionLength)} minutes per session.`,
      emoji: '📈',
      stats: `Success rate: ${insights.completionRate.toFixed(1)}% | Avg session: ${Math.round(insights.averageSessionLength)}min`
    },
    milestone: {
      title: 'Productivity Milestone Reached!',
      description: `Just hit a major productivity milestone with Ketchew! ${weeklyPomodoros} sessions completed this week.`,
      emoji: '🎯',
      stats: `Weekly goal achieved: ${weeklyPomodoros} sessions`
    }
  };

  const currentAchievement = achievements[selectedAchievement as keyof typeof achievements];

  const generateShareText = (platform: 'twitter' | 'facebook' | 'generic') => {
    const baseText = currentAchievement.description;
    const hashtags = '#productivity #pomodoro #focustime #ketchew';
    
    switch (platform) {
      case 'twitter':
        return `${currentAchievement.emoji} ${baseText}\n\n${currentAchievement.stats}\n\n${hashtags}`;
      case 'facebook':
        return `${currentAchievement.emoji} ${currentAchievement.title}\n\n${baseText}\n\n${currentAchievement.stats}\n\nTry Ketchew for better focus and productivity!`;
      case 'generic':
        return `${currentAchievement.emoji} ${currentAchievement.title}\n\n${baseText}\n\n${currentAchievement.stats}`;
      default:
        return baseText;
    }
  };

  const shareToTwitter = () => {
    const text = generateShareText('twitter');
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank', 'width=600,height=400');
  };

  const shareToFacebook = () => {
    const text = generateShareText('facebook');
    const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.origin)}&quote=${encodeURIComponent(text)}`;
    window.open(url, '_blank', 'width=600,height=400');
  };

  const copyToClipboard = async () => {
    const text = generateShareText('generic');
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = text;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const formatTime = (minutes: number) => {
    if (minutes < 60) return `${minutes}m`;
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return `${hours}h ${remainingMinutes > 0 ? `${remainingMinutes}m` : ''}`;
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-2">
          <Share2 className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Share Achievement
          </h2>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            ×
          </button>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 p-4 overflow-y-auto space-y-6">
        {/* Achievement Selection */}
        <div>
          <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-3">
            Choose Achievement to Share
          </h3>
          <div className="grid grid-cols-1 gap-3">
            {Object.entries(achievements).map(([key, achievement]) => (
              <button
                key={key}
                onClick={() => setSelectedAchievement(key)}
                className={`p-3 rounded-lg border text-left transition-colors ${
                  selectedAchievement === key
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                    : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                }`}
              >
                <div className="flex items-start gap-3">
                  <span className="text-2xl">{achievement.emoji}</span>
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900 dark:text-white">
                      {achievement.title}
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      {achievement.stats}
                    </p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Preview */}
        <div>
          <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-3">
            Share Preview
          </h3>
          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
            <div className="flex items-start gap-3">
              <span className="text-3xl">{currentAchievement.emoji}</span>
              <div className="flex-1">
                <h4 className="font-bold text-gray-900 dark:text-white text-lg mb-2">
                  {currentAchievement.title}
                </h4>
                <p className="text-gray-700 dark:text-gray-300 mb-3">
                  {currentAchievement.description}
                </p>
                <div className="text-sm text-gray-600 dark:text-gray-400 bg-white dark:bg-gray-700 rounded px-3 py-2">
                  {currentAchievement.stats}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div>
          <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-3">
            Your Stats Summary
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-3 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-2">
                <Award className="w-4 h-4 text-yellow-600 dark:text-yellow-400" />
                <span className="text-sm text-gray-600 dark:text-gray-400">Current Streak</span>
              </div>
              <p className="text-xl font-bold text-gray-900 dark:text-white">
                {streak.current} days
              </p>
            </div>
            
            <div className="bg-white dark:bg-gray-800 rounded-lg p-3 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-green-600 dark:text-green-400" />
                <span className="text-sm text-gray-600 dark:text-gray-400">This Week</span>
              </div>
              <p className="text-xl font-bold text-gray-900 dark:text-white">
                {weeklyPomodoros} sessions
              </p>
            </div>
            
            <div className="bg-white dark:bg-gray-800 rounded-lg p-3 border border-gray-200 dark:border-gray-700 col-span-2">
              <div className="flex items-center gap-2">
                <Share2 className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                <span className="text-sm text-gray-600 dark:text-gray-400">Weekly Study Time</span>
              </div>
              <p className="text-xl font-bold text-gray-900 dark:text-white">
                {formatTime(weeklyStudyTime)}
              </p>
            </div>
          </div>
        </div>

        {/* Share Buttons */}
        <div>
          <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-3">
            Share Your Achievement
          </h3>
          <div className="flex flex-col gap-3">
            <button
              onClick={shareToTwitter}
              className="flex items-center justify-center gap-3 w-full px-4 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
            >
              <Twitter className="w-5 h-5" />
              Share on Twitter
            </button>
            
            <button
              onClick={shareToFacebook}
              className="flex items-center justify-center gap-3 w-full px-4 py-3 bg-blue-700 hover:bg-blue-800 text-white rounded-lg transition-colors"
            >
              <Facebook className="w-5 h-5" />
              Share on Facebook
            </button>
            
            <button
              onClick={copyToClipboard}
              className="flex items-center justify-center gap-3 w-full px-4 py-3 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors"
            >
              {copied ? (
                <>
                  <Check className="w-5 h-5" />
                  Copied!
                </>
              ) : (
                <>
                  <Copy className="w-5 h-5" />
                  Copy Text
                </>
              )}
            </button>
          </div>
        </div>

        {/* Motivation */}
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg p-4 border border-blue-200 dark:border-blue-800">
          <h3 className="font-medium text-gray-900 dark:text-white mb-2">
            Keep Up the Great Work! 🎉
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Sharing your progress helps motivate others and keeps you accountable. 
            Every pomodoro session is a step towards your goals!
          </p>
        </div>
      </div>
    </div>
  );
};