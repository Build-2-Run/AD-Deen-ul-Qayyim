import React from 'react';
import { Settings, X } from 'lucide-react';
import { useReader, ReaderPreferences } from '../ReaderLayout';

export const ReaderSettingsPanel: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const { preferences, updatePreferences } = useReader();

  const handleSizeChange = (key: keyof ReaderPreferences, change: number) => {
    updatePreferences({ [key]: (preferences[key] as number) + change });
  };

  return (
    <div className="absolute top-14 right-4 w-72 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg shadow-xl z-50 p-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
          <Settings className="w-4 h-4" /> Reader Settings
        </h3>
        <button onClick={onClose} className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300">
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="space-y-4">
        {/* Arabic Size */}
        <div>
          <label className="text-xs text-gray-500 uppercase font-semibold mb-2 block">Arabic Size</label>
          <div className="flex items-center justify-between">
            <button onClick={() => handleSizeChange('arabicSize', -2)} className="px-3 py-1 bg-gray-100 dark:bg-gray-800 rounded hover:bg-gray-200">-</button>
            <span className="text-sm font-medium">{preferences.arabicSize}px</span>
            <button onClick={() => handleSizeChange('arabicSize', 2)} className="px-3 py-1 bg-gray-100 dark:bg-gray-800 rounded hover:bg-gray-200">+</button>
          </div>
        </div>

        {/* Translation Size */}
        <div>
          <label className="text-xs text-gray-500 uppercase font-semibold mb-2 block">Translation Size</label>
          <div className="flex items-center justify-between">
            <button onClick={() => handleSizeChange('translationSize', -2)} className="px-3 py-1 bg-gray-100 dark:bg-gray-800 rounded hover:bg-gray-200">-</button>
            <span className="text-sm font-medium">{preferences.translationSize}px</span>
            <button onClick={() => handleSizeChange('translationSize', 2)} className="px-3 py-1 bg-gray-100 dark:bg-gray-800 rounded hover:bg-gray-200">+</button>
          </div>
        </div>

        {/* Translation Toggle */}
        <div>
          <label className="text-xs text-gray-500 uppercase font-semibold mb-2 block">Translations</label>
          <select 
            className="w-full bg-gray-50 dark:bg-gray-800 border-none rounded text-sm p-2"
            value={preferences.translationLanguage}
            onChange={(e) => updatePreferences({ translationLanguage: e.target.value })}
          >
            <option value="none">None (Arabic Only)</option>
            <option value="en-sahih">English (Sahih International)</option>
            <option value="ur-jalandhry">Urdu (Jalandhry)</option>
          </select>
        </div>

        {/* Theme */}
        <div>
          <label className="text-xs text-gray-500 uppercase font-semibold mb-2 block">Theme</label>
          <select 
            className="w-full bg-gray-50 dark:bg-gray-800 border-none rounded text-sm p-2"
            value={preferences.theme}
            onChange={(e) => updatePreferences({ theme: e.target.value as any })}
          >
            <option value="light">Light</option>
            <option value="dark">Dark</option>
          </select>
        </div>
      </div>
    </div>
  );
};
