import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { ReaderLayout } from '../../../platform/reader/ReaderLayout';
import { DatasetRegistry } from '../../../platform/registry/DatasetRegistry';
import { HadithSidebar } from '../components/HadithSidebar';

export const HadithPage: React.FC = () => {
  const { collection, book, number } = useParams();
  const [node, setNode] = useState<any>(null);

  useEffect(() => {
    const nodeId = `hadith:${collection}:${book}:${number}`;
    DatasetRegistry.loadNode(nodeId).then(n => setNode(n));
  }, [collection, book, number]);

  if (!node) return <div className="p-8 text-center">Loading Hadith...</div>;

  return (
    <ReaderLayout 
      header={<h1 className="text-xl font-bold">Hadith {node.number}</h1>}
      rightSidebar={<HadithSidebar hadithNode={node} />}
    >
      <div className="max-w-3xl mx-auto p-8 space-y-8">
        {node.chapter && (
          <div className="text-center border-b pb-4 mb-8">
            <h2 className="text-xl font-bold font-arabic mb-1">{node.chapter.arabic}</h2>
            <h3 className="text-sm text-gray-500">{node.chapter.english}</h3>
          </div>
        )}
        <div className="text-3xl text-right leading-loose font-arabic" dir="rtl">
          {node.arabic}
        </div>
        <div className="text-lg text-gray-800 leading-relaxed">
          {node.translations?.en}
        </div>
      </div>
    </ReaderLayout>
  );
};
