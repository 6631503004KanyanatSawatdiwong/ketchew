import React from 'react';
import { BarChart3 } from 'lucide-react';
import { AnalyticsDashboard } from './AnalyticsDashboard';

export const AnalyticsPopup: React.FC = () => {
  return (
    <div className="w-full h-full bg-white">
      {/* Header */}
      <div className="flex items-center space-x-2 p-4 border-b border-gray-200 bg-gray-50">
        <BarChart3 className="w-5 h-5 text-blue-600" />
        <h2 className="text-lg font-semibold text-gray-900">Progress Analytics</h2>
      </div>

      {/* Content */}
      <div className="p-6 overflow-y-auto" style={{ height: 'calc(100% - 4rem)' }}>
        <AnalyticsDashboard />
      </div>
    </div>
  );
};
