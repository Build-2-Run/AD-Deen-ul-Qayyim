import React from 'react';

export const HadithSidebar: React.FC<{ hadithNode: any }> = ({ hadithNode }) => {
  return (
    <div className="p-4">
      <h3 className="font-bold mb-4">Hadith Info</h3>
      <div className="mb-4">
        <span className="text-sm text-gray-500 block">Grade</span>
        <span className={`inline-block px-2 py-1 rounded text-sm ${
          hadithNode.grade === 'Sahih' ? 'bg-green-100 text-green-800' : 'bg-gray-100'
        }`}>
          {hadithNode.grade}
        </span>
      </div>
      {hadithNode.topics && hadithNode.topics.length > 0 && (
        <div className="mb-4">
          <span className="text-sm text-gray-500 block mb-1">Topics</span>
          <div className="flex flex-wrap gap-2">
            {hadithNode.topics.map((t: string) => (
              <span key={t} className="px-2 py-1 bg-blue-50 text-blue-700 rounded text-xs">{t}</span>
            ))}
          </div>
        </div>
      )}
      {hadithNode.relations && hadithNode.relations.length > 0 && (
        <div className="mb-4">
          <span className="text-sm text-gray-500 block mb-1">Related Quran Ayat</span>
          <ul className="text-sm space-y-1">
            {hadithNode.relations.map((r: string) => (
              <li key={r} className="text-blue-600 hover:underline cursor-pointer">{r}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};
