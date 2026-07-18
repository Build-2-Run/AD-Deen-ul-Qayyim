import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export const ReaderNavigation: React.FC<{ currentSurah: number }> = ({ currentSurah }) => {
  const navigate = useNavigate();

  const handlePrev = () => {
    if (currentSurah > 1) navigate(`/quran/surah/${currentSurah - 1}`);
  };

  const handleNext = () => {
    if (currentSurah < 114) navigate(`/quran/surah/${currentSurah + 1}`);
  };

  return (
    <div className="flex items-center gap-2">
      <button 
        onClick={handlePrev} 
        disabled={currentSurah <= 1}
        className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-30"
        title="Previous Surah"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>
      <span className="text-sm font-medium w-16 text-center">
        {currentSurah} / 114
      </span>
      <button 
        onClick={handleNext} 
        disabled={currentSurah >= 114}
        className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-30"
        title="Next Surah"
      >
        <ChevronRight className="w-5 h-5" />
      </button>
    </div>
  );
};
