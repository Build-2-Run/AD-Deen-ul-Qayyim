import React from 'react';

export const Retry: React.FC<{ onRetry: () => void }> = ({ onRetry }) => (
  <button
    onClick={onRetry}
    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-lg transition-colors focus:ring-2 focus:ring-emerald-500 focus:outline-none"
    aria-label="Retry loading"
  >
    Retry
  </button>
);
