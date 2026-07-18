import React from 'react';
import { Link } from 'react-router-dom';

export const HadithHome: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto p-8">
      <h1 className="text-4xl font-bold mb-6">Hadith Collections</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Link to="/hadith/bukhari" className="block p-6 bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-50 transition">
          <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900">Sahih al-Bukhari</h5>
          <p className="font-normal text-gray-700">The most authentic book of Hadith in Sunni Islam.</p>
        </Link>
        {/* Placeholders for others */}
        <div className="block p-6 bg-gray-50 border border-gray-200 rounded-lg opacity-60">
          <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900">Sahih Muslim</h5>
          <p className="font-normal text-gray-700">Coming soon.</p>
        </div>
      </div>
    </div>
  );
};
