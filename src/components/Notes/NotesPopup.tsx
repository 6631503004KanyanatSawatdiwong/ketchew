import React from 'react';
import { FileText } from 'lucide-react';
import { EnhancedNotesEditor } from './EnhancedNotesEditor';

export const NotesPopup: React.FC = () => {
  return (
    <div className="w-full h-full bg-white">
      {/* Header */}
      <div className="flex items-center space-x-2 p-4 border-b border-gray-200 bg-gray-50">
        <FileText className="w-5 h-5 text-blue-600" />
        <h2 className="text-lg font-semibold text-gray-900">Enhanced Notes</h2>
      </div>

      {/* Content */}
      <div style={{ height: 'calc(100% - 4rem)' }}>
        <EnhancedNotesEditor />
      </div>
    </div>
  );
};
