import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface PomodoroSession {
  id: string;
  date: string;
  startTime: string;
  endTime: string;
  phase: 'study' | 'shortBreak' | 'longBreak';
  duration: number; // in minutes
  completed: boolean;
  collaborationSession?: {
    sessionId: string;
    participants: number;
  };
}

export interface DailyStats {
  date: string;
  completedPomodoros: number;
  totalStudyTime: number; // in minutes
  totalBreakTime: number; // in minutes
  completedTasks: number;
  streak: number;
  sessions: PomodoroSession[];
}

export interface WeeklyStats {
  week: string; // ISO week (YYYY-WXX)
  completedPomodoros: number;
  totalStudyTime: number;
  totalBreakTime: number;
  completedTasks: number;
  averageDaily: number;
  bestDay: string;
  days: DailyStats[];
}

export interface MonthlyStats {
  month: string; // YYYY-MM format
  completedPomodoros: number;
  totalStudyTime: number;
  totalBreakTime: number;
  completedTasks: number;
  averageDaily: number;
  bestWeek: string;
  weeks: WeeklyStats[];
}

export interface ProductivityStreak {
  current: number;
  longest: number;
  lastActiveDate: string | null;
}

interface AnalyticsStore {
  // Session data
  sessions: PomodoroSession[];
  dailyStats: Record<string, DailyStats>;
  weeklyStats: Record<string, WeeklyStats>;
  monthlyStats: Record<string, MonthlyStats>;
  
  // Streaks and achievements
  streak: ProductivityStreak;
  
  // Analytics methods
  recordSession: (session: Omit<PomodoroSession, 'id'>) => void;
  recordTaskCompletion: (date: string) => void;
  calculateDailyStats: (date: string) => DailyStats;
  calculateWeeklyStats: (week: string) => WeeklyStats;
  calculateMonthlyStats: (month: string) => MonthlyStats;
  updateStreak: (date: string) => void;
  
  // Data queries
  getSessionsForDate: (date: string) => PomodoroSession[];
  getSessionsForWeek: (week: string) => PomodoroSession[];
  getSessionsForMonth: (month: string) => PomodoroSession[];
  getRecentSessions: (days: number) => PomodoroSession[];
  
  // Export functionality
  exportData: (format: 'csv' | 'json', timeRange?: 'week' | 'month' | 'all') => string;
  importData: (data: string, format: 'csv' | 'json') => boolean;
  
  // Insights
  getProductivityInsights: () => {
    mostProductiveHour: number;
    averageSessionLength: number;
    completionRate: number;
    weekdayProductivity: Record<string, number>;
    monthlyTrend: Array<{ month: string; pomodoros: number }>;
  };
}

const formatDate = (date: Date): string => {
  return date.toISOString().split('T')[0];
};

const formatWeek = (date: Date): string => {
  const year = date.getFullYear();
  const week = getWeekNumber(date);
  return `${year}-W${week.toString().padStart(2, '0')}`;
};

const formatMonth = (date: Date): string => {
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  return `${year}-${month}`;
};

const getWeekNumber = (date: Date): number => {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  return Math.ceil((((d.getTime() - yearStart.getTime()) / 86400000) + 1) / 7);
};

export const useAnalyticsStore = create<AnalyticsStore>()(
  persist(
    (set, get) => ({
      // Initial state
      sessions: [],
      dailyStats: {},
      weeklyStats: {},
      monthlyStats: {},
      streak: {
        current: 0,
        longest: 0,
        lastActiveDate: null
      },

      // Record a completed session
      recordSession: (sessionData) => {
        const session: PomodoroSession = {
          ...sessionData,
          id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
        };

        set((state) => ({
          sessions: [...state.sessions, session]
        }));

        // Update aggregated stats
        const date = session.date;
        get().calculateDailyStats(date);
        get().calculateWeeklyStats(formatWeek(new Date(date)));
        get().calculateMonthlyStats(formatMonth(new Date(date)));
        
        // Update streak if it's a study session
        if (session.phase === 'study' && session.completed) {
          get().updateStreak(date);
        }
      },

      // Record task completion
      recordTaskCompletion: (date) => {
        const stats = get().dailyStats[date];
        if (stats) {
          set((state) => ({
            dailyStats: {
              ...state.dailyStats,
              [date]: {
                ...stats,
                completedTasks: stats.completedTasks + 1
              }
            }
          }));
        } else {
          // Create new daily stats if none exist
          get().calculateDailyStats(date);
          const newStats = get().dailyStats[date];
          if (newStats) {
            set((state) => ({
              dailyStats: {
                ...state.dailyStats,
                [date]: {
                  ...newStats,
                  completedTasks: newStats.completedTasks + 1
                }
              }
            }));
          }
        }
      },

      // Calculate daily statistics
      calculateDailyStats: (date) => {
        const sessions = get().getSessionsForDate(date);
        const studySessions = sessions.filter(s => s.phase === 'study');
        const breakSessions = sessions.filter(s => s.phase !== 'study');
        
        const completedPomodoros = studySessions.filter(s => s.completed).length;
        const totalStudyTime = studySessions.reduce((sum, s) => sum + (s.completed ? s.duration : 0), 0);
        const totalBreakTime = breakSessions.reduce((sum, s) => sum + (s.completed ? s.duration : 0), 0);

        // Calculate streak
        const yesterday = new Date(date);
        yesterday.setDate(yesterday.getDate() - 1);
        const yesterdayStats = get().dailyStats[formatDate(yesterday)];
        const hasYesterdayActivity = yesterdayStats && yesterdayStats.completedPomodoros > 0;
        
        let streak = 0;
        if (completedPomodoros > 0) {
          streak = hasYesterdayActivity ? (yesterdayStats.streak + 1) : 1;
        }

        const dailyStats: DailyStats = {
          date,
          completedPomodoros,
          totalStudyTime,
          totalBreakTime,
          completedTasks: get().dailyStats[date]?.completedTasks || 0,
          streak,
          sessions
        };

        set((state) => ({
          dailyStats: {
            ...state.dailyStats,
            [date]: dailyStats
          }
        }));

        return dailyStats;
      },

      // Calculate weekly statistics
      calculateWeeklyStats: (week) => {
        const days: DailyStats[] = [];
        
        // Get all days in the week
        const [year, weekNum] = week.split('-W').map(Number);
        const firstDay = new Date(year, 0, 1 + (weekNum - 1) * 7);
        const dayOfWeek = firstDay.getDay();
        firstDay.setDate(firstDay.getDate() - dayOfWeek);

        for (let i = 0; i < 7; i++) {
          const date = new Date(firstDay);
          date.setDate(firstDay.getDate() + i);
          const dateStr = formatDate(date);
          const dayStats = get().dailyStats[dateStr] || get().calculateDailyStats(dateStr);
          days.push(dayStats);
        }

        const completedPomodoros = days.reduce((sum, day) => sum + day.completedPomodoros, 0);
        const totalStudyTime = days.reduce((sum, day) => sum + day.totalStudyTime, 0);
        const totalBreakTime = days.reduce((sum, day) => sum + day.totalBreakTime, 0);
        const completedTasks = days.reduce((sum, day) => sum + day.completedTasks, 0);
        
        const averageDaily = completedPomodoros / 7;
        const bestDay = days.reduce((best, day) => 
          day.completedPomodoros > best.completedPomodoros ? day : best, days[0]
        ).date;

        const weeklyStats: WeeklyStats = {
          week,
          completedPomodoros,
          totalStudyTime,
          totalBreakTime,
          completedTasks,
          averageDaily,
          bestDay,
          days
        };

        set((state) => ({
          weeklyStats: {
            ...state.weeklyStats,
            [week]: weeklyStats
          }
        }));

        return weeklyStats;
      },

      // Calculate monthly statistics
      calculateMonthlyStats: (month) => {
        const weeks: WeeklyStats[] = [];
        
        // Get all weeks in the month
        const [year, monthNum] = month.split('-').map(Number);
        const firstDay = new Date(year, monthNum - 1, 1);
        const lastDay = new Date(year, monthNum, 0);
        
        const endWeek = formatWeek(lastDay);
        
        const weekDate = new Date(firstDay);
        while (formatWeek(weekDate) <= endWeek) {
          const weekStr = formatWeek(weekDate);
          const weekStats = get().weeklyStats[weekStr] || get().calculateWeeklyStats(weekStr);
          weeks.push(weekStats);
          weekDate.setDate(weekDate.getDate() + 7);
        }

        const completedPomodoros = weeks.reduce((sum, week) => sum + week.completedPomodoros, 0);
        const totalStudyTime = weeks.reduce((sum, week) => sum + week.totalStudyTime, 0);
        const totalBreakTime = weeks.reduce((sum, week) => sum + week.totalBreakTime, 0);
        const completedTasks = weeks.reduce((sum, week) => sum + week.completedTasks, 0);
        
        const daysInMonth = lastDay.getDate();
        const averageDaily = completedPomodoros / daysInMonth;
        const bestWeek = weeks.reduce((best, week) => 
          week.completedPomodoros > best.completedPomodoros ? week : best, weeks[0]
        ).week;

        const monthlyStats: MonthlyStats = {
          month,
          completedPomodoros,
          totalStudyTime,
          totalBreakTime,
          completedTasks,
          averageDaily,
          bestWeek,
          weeks
        };

        set((state) => ({
          monthlyStats: {
            ...state.monthlyStats,
            [month]: monthlyStats
          }
        }));

        return monthlyStats;
      },

      // Update productivity streak
      updateStreak: (date) => {
        const currentStreak = get().streak;
        const yesterday = new Date(date);
        yesterday.setDate(yesterday.getDate() - 1);
        const yesterdayStr = formatDate(yesterday);
        
        let newCurrent = 1;
        
        if (currentStreak.lastActiveDate === yesterdayStr) {
          newCurrent = currentStreak.current + 1;
        } else if (currentStreak.lastActiveDate === date) {
          newCurrent = currentStreak.current; // Same day, don't increment
        }
        
        const newLongest = Math.max(currentStreak.longest, newCurrent);
        
        set({
          streak: {
            current: newCurrent,
            longest: newLongest,
            lastActiveDate: date
          }
        });
      },

      // Data query methods
      getSessionsForDate: (date) => {
        return get().sessions.filter(session => session.date === date);
      },

      getSessionsForWeek: (week) => {
        const [year, weekNum] = week.split('-W').map(Number);
        const firstDay = new Date(year, 0, 1 + (weekNum - 1) * 7);
        const dayOfWeek = firstDay.getDay();
        firstDay.setDate(firstDay.getDate() - dayOfWeek);
        
        const lastDay = new Date(firstDay);
        lastDay.setDate(firstDay.getDate() + 6);
        
        const startDate = formatDate(firstDay);
        const endDate = formatDate(lastDay);
        
        return get().sessions.filter(session => 
          session.date >= startDate && session.date <= endDate
        );
      },

      getSessionsForMonth: (month) => {
        const [year, monthNum] = month.split('-').map(Number);
        const firstDay = new Date(year, monthNum - 1, 1);
        const lastDay = new Date(year, monthNum, 0);
        
        const startDate = formatDate(firstDay);
        const endDate = formatDate(lastDay);
        
        return get().sessions.filter(session => 
          session.date >= startDate && session.date <= endDate
        );
      },

      getRecentSessions: (days) => {
        const endDate = new Date();
        const startDate = new Date();
        startDate.setDate(endDate.getDate() - days);
        
        const startDateStr = formatDate(startDate);
        const endDateStr = formatDate(endDate);
        
        return get().sessions.filter(session => 
          session.date >= startDateStr && session.date <= endDateStr
        );
      },

      // Export data
      exportData: (format, timeRange = 'all') => {
        let sessions = get().sessions;
        
        if (timeRange === 'week') {
          sessions = get().getRecentSessions(7);
        } else if (timeRange === 'month') {
          sessions = get().getRecentSessions(30);
        }
        
        if (format === 'json') {
          return JSON.stringify({
            sessions,
            dailyStats: get().dailyStats,
            weeklyStats: get().weeklyStats,
            monthlyStats: get().monthlyStats,
            streak: get().streak,
            exportDate: new Date().toISOString()
          }, null, 2);
        } else if (format === 'csv') {
          const headers = ['Date', 'Start Time', 'End Time', 'Phase', 'Duration (min)', 'Completed', 'Collaboration Session'];
          const rows = sessions.map(session => [
            session.date,
            session.startTime,
            session.endTime,
            session.phase,
            session.duration.toString(),
            session.completed ? 'Yes' : 'No',
            session.collaborationSession ? `${session.collaborationSession.sessionId} (${session.collaborationSession.participants} participants)` : 'Solo'
          ]);
          
          return [headers, ...rows].map(row => row.join(',')).join('\n');
        }
        
        return '';
      },

      // Import data
      importData: (data, format) => {
        try {
          if (format === 'json') {
            const importedData = JSON.parse(data);
            set({
              sessions: [...get().sessions, ...importedData.sessions],
              dailyStats: { ...get().dailyStats, ...importedData.dailyStats },
              weeklyStats: { ...get().weeklyStats, ...importedData.weeklyStats },
              monthlyStats: { ...get().monthlyStats, ...importedData.monthlyStats }
            });
            return true;
          }
          return false;
        } catch {
          return false;
        }
      },

      // Get productivity insights
      getProductivityInsights: () => {
        const sessions = get().sessions.filter(s => s.phase === 'study' && s.completed);
        
        // Most productive hour
        const hourCounts: Record<number, number> = {};
        sessions.forEach(session => {
          const hour = new Date(session.startTime).getHours();
          hourCounts[hour] = (hourCounts[hour] || 0) + 1;
        });
        const mostProductiveHour = Object.entries(hourCounts)
          .reduce((max, [hour, count]) => 
            count > max.count ? { hour: parseInt(hour), count } : max, 
            { hour: 9, count: 0 }
          ).hour;

        // Average session length
        const averageSessionLength = sessions.length > 0 
          ? sessions.reduce((sum, s) => sum + s.duration, 0) / sessions.length 
          : 0;

        // Completion rate
        const totalSessions = get().sessions.filter(s => s.phase === 'study').length;
        const completionRate = totalSessions > 0 ? (sessions.length / totalSessions) * 100 : 0;

        // Weekday productivity
        const weekdayProductivity: Record<string, number> = {
          'Monday': 0, 'Tuesday': 0, 'Wednesday': 0, 'Thursday': 0,
          'Friday': 0, 'Saturday': 0, 'Sunday': 0
        };
        const weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        
        sessions.forEach(session => {
          const day = weekdays[new Date(session.date).getDay()];
          weekdayProductivity[day]++;
        });

        // Monthly trend (last 12 months)
        const monthlyTrend: Array<{ month: string; pomodoros: number }> = [];
        const now = new Date();
        for (let i = 11; i >= 0; i--) {
          const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
          const monthStr = formatMonth(date);
          const monthStats = get().monthlyStats[monthStr];
          monthlyTrend.push({
            month: monthStr,
            pomodoros: monthStats?.completedPomodoros || 0
          });
        }

        return {
          mostProductiveHour,
          averageSessionLength,
          completionRate,
          weekdayProductivity,
          monthlyTrend
        };
      }
    }),
    {
      name: 'ketchew-analytics-store',
      partialize: (state) => ({
        sessions: state.sessions,
        dailyStats: state.dailyStats,
        weeklyStats: state.weeklyStats,
        monthlyStats: state.monthlyStats,
        streak: state.streak
      })
    }
  )
);